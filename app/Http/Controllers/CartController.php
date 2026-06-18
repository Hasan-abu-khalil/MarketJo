<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index()
    {
        /*
        =====================================================
        GUEST CART (SESSION)
        =====================================================
        */
        if (!auth()->check()) {

            $sessionCart = session('cart', []);
            $items = [];

            foreach ($sessionCart as $key => $item) {

                $product = Product::with('store')->find($item['product_id']);

                if (!$product)
                    continue;

                $variant = !empty($item['product_variant_id'])
                    ? ProductVariant::find($item['product_variant_id'])
                    : null;

                $items[] = (object) [
                    'id' => $key,
                    'quantity' => $item['quantity'],
                    'product' => $product,
                    'variant' => $variant,
                    'product_variant_id' => $item['product_variant_id'] ?? null,
                ];
            }

            $total = collect($items)->sum(function ($i) {
                $price = $i->variant?->price ?? $i->product->price;
                return $i->quantity * $price;
            });

            return Inertia::render('Front/Cart', [
                'items' => $items,
                'total' => $total,
                'defaultAddress' => null,
                'addresses' => [],
            ]);
        }

        /*
        =====================================================
        USER CART (DB)
        =====================================================
        */
        $user = auth()->user();

        $cart = Cart::with('items.product.store', 'items.variant')
            ->where('user_id', $user->id)
            ->first();

        $total = $cart?->items->sum(function ($i) {

            $price = $i->variant?->price;

            if (!$price) {
                $price = $i->product->price;
            }

            return $i->quantity * $price;
        }) ?? 0;

        return Inertia::render('Front/Cart', [
            'items' => $cart?->items ?? [],
            'total' => $total,
            'defaultAddress' => $user->addresses()->where('is_default', true)->first(),
            'addresses' => $user->addresses,
        ]);
    }

    /*
    =====================================================
    ADD TO CART
    =====================================================
    */
    public function add(Request $request, $productId)
    {
        $product = Product::with('variants')->findOrFail($productId);

        $variantId = $request->variant_id;

        // ✅ if product has variants → must choose one
        if ($product->variants->count() > 0 && !$variantId) {
            return back()->withErrors([
                'variant' => 'Please select a variant'
            ]);
        }

        $variant = null;

        if ($variantId) {
            $variant = ProductVariant::where('id', $variantId)
                ->where('product_id', $productId)
                ->firstOrFail();
        }

        // ✅ FIX: stock depends on variant OR product
        $stock = $variant ? $variant->stock : $product->stock;

        if (!auth()->check()) {

            $cart = session()->get('cart', []);

            $key = $productId . ':' . ($variantId ?? 'null');

            $currentQty = $cart[$key]['quantity'] ?? 0;

            if ($currentQty + 1 > $stock) {
                return back()->withErrors([
                    'stock' => "Only {$stock} items available"
                ]);
            }

            $cart[$key] = [
                'product_id' => (int) $productId,
                'product_variant_id' => $variantId,
                'quantity' => $currentQty + 1,
            ];

            session()->put('cart', $cart);

            return back();
        }

        $cart = Cart::firstOrCreate([
            'user_id' => auth()->id()
        ]);

        return DB::transaction(function () use ($cart, $productId, $variantId, $stock) {

            $item = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $productId)
                ->where('product_variant_id', $variantId)
                ->lockForUpdate()
                ->first();

            $currentQty = $item?->quantity ?? 0;

            if ($currentQty + 1 > $stock) {
                return back()->withErrors([
                    'stock' => "Only {$stock} items available"
                ]);
            }

            if ($item) {
                $item->increment('quantity');
            } else {
                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $productId,
                    'product_variant_id' => $variantId,
                    'quantity' => 1,
                ]);
            }

            return back();
        });
    }

    /*
    =====================================================
    UPDATE CART
    =====================================================
    */
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        /*
        =====================
        GUEST
        =====================
        */
        if (!auth()->check()) {

            $cart = session('cart', []);

            if (!isset($cart[$id])) {
                return back();
            }

            $item = $cart[$id];

            $product = Product::find($item['product_id']);
            if (!$product)
                return back();

            $variant = !empty($item['variant_id'])
                ? ProductVariant::find($item['variant_id'])
                : null;

            $stock = $variant?->stock ?? $product->stock;

            if ($request->quantity > $stock) {
                return back()->withErrors([
                    'quantity' => "Only {$stock} items available",
                ]);
            }

            $cart[$id]['quantity'] = $request->quantity;

            session()->put('cart', $cart);

            return back();
        }

        /*
        =====================
        USER
        =====================
        */
        $cartItem = CartItem::with('product', 'variant')->findOrFail($id);

        $stock = $cartItem->variant?->stock ?? $cartItem->product->stock;

        $reservedQty = CartItem::where('product_id', $cartItem->product_id)
            ->where('product_variant_id', $cartItem->product_variant_id)
            ->where('reserved_until', '>', now())
            ->where('id', '!=', $cartItem->id)
            ->sum('quantity');

        $availableStock = $stock - $reservedQty;

        if ($request->quantity > $availableStock) {
            return back()->withErrors([
                'quantity' => "Only {$availableStock} items available",
            ]);
        }

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        return back();
    }

    /*
    =====================================================
    DELETE ITEM
    =====================================================
    */
    public function destroy($id)
    {
        if (!auth()->check()) {

            $cart = session('cart', []);

            unset($cart[$id]);

            session()->put('cart', $cart);

            return back();
        }

        CartItem::findOrFail($id)->delete();

        return back();
    }
}