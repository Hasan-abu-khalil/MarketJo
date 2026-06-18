<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Front/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function show(Category $category)
    {
        $products = $category->products()
            ->where('is_active', true)
            ->with('store')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Front/Categories/Show', [
            'category' => $category,
            'products' => $products,
        ]);
    }
}
