<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['store', 'categories' ,'variants'])
            ->where('is_active', true)
            ->whereHas('store', function ($q) {
                $q->where('status', true);
            });

        // SEARCH
        $query->when($request->search, function ($q) use ($request) {
            $q->where('name', 'like', '%' . $request->search . '%');
        });

        // STORE FILTER (slug → store_id)
        $query->when($request->store, function ($q) use ($request) {
            $q->whereHas('store', function ($storeQuery) use ($request) {
                $storeQuery->where('slug', $request->store);
            });
        });

        // CATEGORY FILTER (slug → category)
        $query->when($request->category, function ($q) use ($request) {
            $q->whereHas('categories', function ($catQuery) use ($request) {
                $catQuery->where('slug', $request->category);
            });
        });

        $products = $query->latest()
            ->paginate(10)
            ->withQueryString();

        // 🔥 IMPORTANT FIX: dynamic categories based on store
        $storeSlug = $request->store;

        $categoriesQuery = Category::query();

        if ($storeSlug) {
            $store = Store::where('slug', $storeSlug)->first();
            if ($store) {
                $categoriesQuery->where('store_id', $store->id);
            }
        }

        return Inertia::render('Front/Products/Index', [
            'products' => $products,

            'filters' => [
                'search' => $request->search,
                'store' => $request->store,
                'category' => $request->category,
            ],

            'stores' => Store::where('status', true)
                ->select('id', 'name', 'slug')
                ->get(),

            // 🔥 ONLY categories of selected store
            'categories' => $categoriesQuery
                ->select('id', 'name', 'slug', 'store_id')
                ->get(),
        ]);
    }

    public function show(Product $product)
    {
        $product->load('store', 'categories', 'variants');

        return Inertia::render('Front/Products/Show', [
            'product' => $product,
        ]);
    }
}
