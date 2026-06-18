<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\VendorOrder;
use App\Notifications\OrderPlacedNotification;
use App\Notifications\VendorOrderCreatedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'shipping_phone' => 'required',
            'shipping_city' => 'required',
            'shipping_place' => 'required',
            'save_address' => 'boolean',
        ]);

        $user = auth()->user();

        $cart = Cart::with([
            'items.product.store',
            'items.variant',
        ])
            ->where('user_id', $user->id)
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return back()->withErrors(['checkout' => 'Cart is empty']);
        }

        DB::transaction(function () use ($user, $cart, $request) {

            /*
            =========================
            CREATE ORDER
            =========================
            */
            $order = Order::create([
                'user_id' => $user->id,
                'total_price' => 0,
                'status' => 'pending',
                'shipping_name' => $user->name,
                'shipping_phone' => $request->shipping_phone,
                'shipping_city' => $request->shipping_city,
                'shipping_place' => $request->shipping_place,
            ]);

            $total = 0;

            /*
            =========================
            PROCESS ITEMS
            =========================
            */
            foreach ($cart->items as $item) {

                $product = Product::with('store')
                    ->where('id', $item->product_id)
                    ->lockForUpdate()
                    ->first();

                if (!$product) {
                    throw new \Exception("Product not found");
                }

                $store = $product->store;

                if (!$store || !$store->user_id) {
                    throw new \Exception("Invalid store for product ID {$product->id}");
                }

                /*
                =========================
                VARIANT OR PRODUCT STOCK
                =========================
                */
                $variant = null;
                $stock = $product->stock;

                if ($item->product_variant_id) {
                    $variant = ProductVariant::where('id', $item->product_variant_id)
                        ->where('product_id', $product->id)
                        ->lockForUpdate()
                        ->first();

                    if (!$variant) {
                        throw new \Exception("Variant not found");
                    }

                    $stock = $variant->stock;
                }

                /*
                =========================
                STOCK CHECK
                =========================
                */
                if ($stock < $item->quantity) {
                    throw new \Exception("Not enough stock for {$product->name}");
                }

                /*
                =========================
                PRICE
                =========================
                */
                $price = $variant?->price ?? $product->price;
                $lineTotal = $price * $item->quantity;

                /*
                =========================
                ORDER ITEM CREATE
                =========================
                */
                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_variant_id' => $variant?->id,
                    'quantity' => $item->quantity,
                    'price' => $price,
                ]);

                /*
                =========================
                VENDOR ORDER CREATE
                =========================
                */
                $vendorOrder = VendorOrder::create([
                    'order_id' => $order->id,
                    'order_item_id' => $orderItem->id,

                    'vendor_id' => $store->user_id,
                    'store_id' => $store->id,

                    'quantity' => $item->quantity,
                    'price' => $price,
                    'status' => 'pending',
                ]);

                $store->user->notify(
                    new VendorOrderCreatedNotification($vendorOrder)
                );
                /*
                =========================
                DECREASE STOCK
                =========================
                */
                if ($variant) {
                    $variant->decrement('stock', $item->quantity);
                } else {
                    $product->decrement('stock', $item->quantity);
                }
                $total += $lineTotal;
            }

            /*
            =========================
            FINAL ORDER TOTAL
            =========================
            */
            $order->update([
                'total_price' => $total,
            ]);


            $user->notify(new OrderPlacedNotification($order));
            /*
            =========================
            SAVE ADDRESS
            =========================
            */
            if ($request->save_address) {

                $address = Address::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'phone' => $request->shipping_phone,
                        'city' => $request->shipping_city,
                        'place' => $request->shipping_place,
                    ],
                    [
                        'is_default' => true,
                    ]
                );

                Address::where('user_id', $user->id)
                    ->where('id', '!=', $address->id)
                    ->update(['is_default' => false]);
            }

            /*
            =========================
            CLEAR CART
            =========================
            */
            $cart->items()->delete();
            session()->forget('cart');
        });

        return redirect()
            ->route('orders.success')
            ->with('success', 'Order placed successfully');
    }
}