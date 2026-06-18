<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function index()
    {
        $stores = Store::where('status', true)
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Front/Stores/Index', [
            'stores' => $stores,
        ]);
    }

    public function show(Store $store)
    {
        $products = $store->products()
            ->where('is_active', true)
            ->with(['categories'])
            ->latest()
            ->paginate(4)
            ->withQueryString();

        return Inertia::render('Front/Stores/Show', [
            'store' => $store,
            'products' => $products,
        ]);
    }



    public function map()
    {
        $stores = Store::where('status', true)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->latest()
            ->get();

        return Inertia::render('Front/Stores/Map', [
            'stores' => $stores
        ]);
    }
}
