<?php

namespace App\Listeners;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\DB;

class MergeGuestCartOnLogin
{
    public function handle(Login $event): void
    {
        $user = $event->user;

        $sessionCart = session()->get('cart', []);

        if (!$sessionCart || count($sessionCart) === 0) {
            return;
        }

        DB::transaction(function () use ($user, $sessionCart) {

            $cart = Cart::firstOrCreate([
                'user_id' => $user->id,
            ]);

            foreach ($sessionCart as $key => $item) {

                $productId = $item['product_id'];
                $variantId = $item['product_variant_id'] ?? null;
                $quantity = (int) ($item['quantity'] ?? 1);

                $existing = CartItem::where('cart_id', $cart->id)
                    ->where('product_id', $productId)
                    ->where('product_variant_id', $variantId)
                    ->first();

                if ($existing) {
                    $existing->quantity += $quantity;
                    $existing->reserved_until = now()->addMinutes(15);
                    $existing->save();
                } else {
                    CartItem::create([
                        'cart_id' => $cart->id,
                        'product_id' => $productId,
                        'product_variant_id' => $variantId,
                        'quantity' => $quantity,
                        'reserved_until' => now()->addMinutes(15),
                    ]);
                }
            }
        });

        // IMPORTANT: clear AFTER merge
        session()->forget('cart');
    }
}