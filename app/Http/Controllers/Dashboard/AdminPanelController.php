<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\VendorRequest;

class AdminPanelController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->role === 'admin') {

            return inertia('Dashboard/AdminPanel/Index', [
                'role' => 'admin',
                'charts' => [

                    'sales' => Order::selectRaw('DATE(created_at) as date, SUM(total_price) as total')
                        ->groupBy('date')
                        ->orderBy('date')
                        ->limit(30)
                        ->get(),

                    'ordersStatus' => Order::selectRaw('status, COUNT(*) as total')
                        ->groupBy('status')
                        ->get(),

                    'productsByStore' => Store::withCount('products')
                        ->get(),
                ],
                'stats' => [
                    'users' => User::count(),
                    'vendors' => User::where('role', 'vendor')->count(),
                    'stores' => Store::count(),
                    'pendingRequests' => VendorRequest::where('status', 'pending')->count(),
                    'products' => Product::count(),
                    'orders' => Order::count(),
                    'salesValue' => Order::sum('total_price'),
                    // 'revenue' => Order::where('status', 'paid')->sum('total_price'),
                ],

                'recentOrders' => Order::with('user:id,name')
                    ->latest()
                    ->take(10)
                    ->get(),

                'latestProducts' => Product::with('store:id,name')
                    ->latest()
                    ->take(10)
                    ->get(),

                'pendingVendorRequests' => VendorRequest::with('user:id,name')
                    ->where('status', 'pending')
                    ->latest()
                    ->take(10)
                    ->get(),
            ]);
        }

        // Vendor dashboard
        $storeIds = $user->stores()->pluck('id');

        return inertia('Dashboard/AdminPanel/Index', [
            'role' => 'vendor',
            'charts' => [

                'sales' => Order::whereHas('items.product', function ($q) use ($storeIds) {
                    $q->whereIn('store_id', $storeIds);
                })
                    ->selectRaw('DATE(created_at) as date, SUM(total_price) as total')
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get(),

                'ordersStatus' => Order::whereHas('items.product', function ($q) use ($storeIds) {
                    $q->whereIn('store_id', $storeIds);
                })
                    ->selectRaw('status, COUNT(*) as total')
                    ->groupBy('status')
                    ->get(),

            ],

            'stats' => [
                'products' => Product::whereIn('store_id', $storeIds)->count(),

                'orders' => Order::whereHas('items.product', function ($q) use ($storeIds) {
                    $q->whereIn('store_id', $storeIds);
                })->count(),

                'lowStockProducts' => Product::whereIn('store_id', $storeIds)
                    ->whereHas('variants', function ($q) {
                        $q->where('stock', '<=', 5);
                    })->count(),

                'pendingOrders' => Order::where('status', 'pending')
                    ->whereHas('items.product', function ($q) use ($storeIds) {
                        $q->whereIn('store_id', $storeIds);
                    })->count(),

                'salesValue' => Order::whereHas('items.product', function ($q) use ($storeIds) {
                    $q->whereIn('store_id', $storeIds);
                })->sum('total_price'),

                // 'revenue' => Order::where('status', 'paid')
                //     ->whereHas('items.product', function ($q) use ($storeIds) {
                //         $q->whereIn('store_id', $storeIds);
                //     })
                //     ->sum('total_price'),

            ],



            'recentOrders' => Order::with('user:id,name')
                ->whereHas('items.product', function ($q) use ($storeIds) {
                    $q->whereIn('store_id', $storeIds);
                })
                ->latest()
                ->take(10)
                ->get(),

            'latestProducts' => Product::whereIn('store_id', $storeIds)
                ->latest()
                ->take(10)
                ->get(),

            'pendingVendorRequests' => [],
        ]);
    }
}