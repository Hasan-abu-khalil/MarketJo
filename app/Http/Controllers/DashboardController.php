<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $orders = Order::with(['items.product', 'items.variant'])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(3)
            ->withQueryString();

        $orders->getCollection()->transform(function ($order) {

            $order->items = $order->items->map(function ($item) {

                $item->display_name = $item->product->name;

                $attributes = $item->variant?->attributes;

                if (is_string($attributes)) {
                    $attributes = json_decode($attributes, true);
                }

                $item->variant_label = $attributes && is_array($attributes)
                    ? collect($attributes)
                        ->map(fn($v, $k) => ucfirst($k) . ': ' . $v)
                        ->join(' / ')
                    : null;

                $item->unit_price = $item->price;
                $item->line_total = $item->price * $item->quantity;

                return $item;
            });

            return $order;
        });
        // dd($orders->first()->items->first()->variant);
        return Inertia::render('Front/Customer/Dashboard', [
            'user' => $user,
            'orders' => $orders,
            
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $order = Order::where('user_id', Auth::id())->findOrFail($id);

        if (in_array($order->status, ['pending', 'paid'])) {
            $order->update(['status' => 'cancelled']);
        }

        return back(303); // 🔥 important for Inertia
    }

    public function show($id)
    {
        $order = Order::with(['items.product', 'user', 'items.variant'])
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return Inertia::render('Front/Customer/OrderShow', [
            'order' => $order
        ]);
    }
}
