<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\VendorRequest;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {

        // BEST STORES
        $stores = Store::withCount([
            'orderItems as sold_count' => function ($query) {
                $query->selectRaw('SUM(quantity)');
            }
        ])
            ->where('status', true)
            ->orderByDesc('sold_count')
            ->take(6)
            ->get();



        // BEST PRODUCTS
        $products = Product::with([
            'store',
            'variants' => function ($query) {
                $query->where('is_active', true);
            }
        ])
            ->withCount([
                'orderItems as sold_count' => function ($query) {
                    $query->selectRaw('SUM(quantity)');
                }
            ])
            ->where('is_active', true)
            ->whereHas('store', function ($q) {
                $q->where('status', true);
            })
            ->orderByDesc('sold_count')
            ->take(10)
            ->get();



        // BEST CATEGORIES
        $categories = Category::select('categories.*')
            ->selectSub(function ($query) {

                $query->from('order_items')
                    ->join(
                        'category_product',
                        'order_items.product_id',
                        '=',
                        'category_product.product_id'
                    )
                    ->whereColumn(
                        'category_product.category_id',
                        'categories.id'
                    )
                    ->selectRaw(
                        'SUM(order_items.quantity)'
                    );

            }, 'sales_count')
            ->orderByDesc('sales_count')
            ->take(6)
            ->get();



        $user = auth()->user();

        $latestRequest = null;
        $hasActiveRequest = false;


        if ($user) {

            $latestRequest = VendorRequest::where('user_id', $user->id)
                ->latest()
                ->first();


            $hasActiveRequest =
                $latestRequest &&
                in_array(
                    $latestRequest->status,
                    ['pending', 'approved']
                );
        }



        return Inertia::render('Front/Home', [

            'categories' => $categories,

            'stores' => $stores,

            'products' => $products,


            'auth' => [
                'user' => $user
            ],


            'latestRequest' => $latestRequest,

            'hasActiveRequest' => $hasActiveRequest,

        ]);
    }
}