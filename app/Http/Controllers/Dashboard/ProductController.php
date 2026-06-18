<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\ProductVariant;
use App\Services\VariantGeneratorService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use App\Imports\ProductsImport;
use App\Exports\ProductsExport;
use Maatwebsite\Excel\Facades\Excel;
class ProductController extends Controller
{
    use AuthorizesRequests;


    public function index(Request $request)
    {
        $this->authorize('viewAny', Product::class);

        $user = auth()->user();
        $isActive = $request->input('is_active');
        $stockStatus = $request->input('stock_status');

        $products = Product::query()
            ->with(['store', 'categories', 'variants'])
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%");
            })
            ->when($request->category, function ($q, $categoryId) {
                $q->whereHas(
                    'categories',
                    fn($c) =>
                    $c->where('id', $categoryId)
                );
            })
            ->whereHas('store', function ($q) use ($user) {
                $q->forUser($user);
            })
            ->when($isActive !== null && $isActive !== '', function ($query) use ($isActive) {
                $query->where('is_active', $isActive);
            })
            ->when($stockStatus, function ($query) use ($stockStatus) {
                $query->whereHas('variants', function ($q) use ($stockStatus) {

                    if ($stockStatus === 'low') {
                        $q->whereBetween('stock', [4, 10]);

                    } elseif ($stockStatus === 'almost') {
                        $q->whereBetween('stock', [0, 3]);

                    } elseif ($stockStatus === 'available') {
                        $q->where('stock', '>', 10);
                    }
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();
        $products->getCollection()->transform(function ($product) {

            $product->can = [
                'view' => auth()->user()->can('view', $product),
                'update' => auth()->user()->can('update', $product),
                'delete' => auth()->user()->can('delete', $product),
            ];

            return $product;
        });
        $categories = Category::query()
            ->select('id', 'name')
            ->whereHas('store', fn($q) => $q->forUser($user))
            ->get();

        return Inertia::render('Dashboard/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
            'permissions' => [
                'create' => $user->can('create', Product::class),
                'export' => $user->can('export', Product::class),
                'import' => $user->can('import', Product::class),
                'template' => $user->can('import', Product::class),

            ],
        ]);
    }

    public function create()
    {
        $this->authorize('create', Product::class);

        $user = auth()->user();

        $stores = Store::query()
            ->select('id', 'name')
            ->forUser($user)
            ->get();

        $categories = Category::query()
            ->select('id', 'name', 'store_id')
            ->whereHas('store', fn($q) => $q->forUser($user))
            ->get();

        return Inertia::render('Dashboard/Products/Create', [
            'stores' => $stores,
            'categories' => $categories,
            'permissions' => [
                'create' => $user->can('create', Product::class),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $attributes = $request->input('attributes', []);
        $attributes = is_string($attributes) ? json_decode($attributes, true) : $attributes;
        $attributes = is_array($attributes) ? $attributes : [];
        $hasVariants = !empty($attributes);

        $request->validate([
            'store_id' => 'required|exists:stores,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|max:2048',
            'price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'categories' => 'array',
            'categories.*' => 'exists:categories,id',

        ]);

        $variantStocks = $request->input('variants');
        $colorImagePaths = $request->input('color_image_paths', []);

        if (is_string($variantStocks)) {
            $variantStocks = json_decode($variantStocks, true);
        }

        $variantStocks = is_array($variantStocks) ? $variantStocks : [];
        $colorImagePaths = is_array($colorImagePaths) ? $colorImagePaths : [];
        $hasVariants = !empty($attributes);

        $product = Product::create([
            'store_id' => $request->store_id,
            'name' => $request->name,
            'slug' => $this->generateUniqueSlug($request->name),
            'description' => $request->description,
            'image' => $request->file('image')?->store('images', 'public'),
            'price' => $request->price,
            'stock' => $hasVariants ? 0 : (int) $request->stock,
        ]);

        $product->categories()->sync($request->categories ?? []);


        // Generate Variants
        if ($hasVariants) {

            $generator = new VariantGeneratorService();
            $variants = $generator->generate($attributes);

            foreach ($variants as $variant) {

                $size = $variant['Size'] ?? $variant['size'] ?? '';
                $color = $variant['Color'] ?? $variant['color'] ?? '';

                // $key = $size . '-' . $color;
                $key = collect([$size, $color])
                    ->filter()
                    ->map(fn($v) => strtolower(trim($v)))
                    ->implode('-');

                $variantImage = $request->file('color_images')[$color] ?? null;
                $variantImagePath = null;

                if ($variantImage) {
                    $variantImagePath = $variantImage->store('images', 'public');
                } elseif (!empty($colorImagePaths[$color])) {
                    $variantImagePath = $colorImagePaths[$color];
                }

                ProductVariant::create([
                    'product_id' => $product->id,
                    'price' => $request->price,
                    'stock' => (int) ($variantStocks[$key] ?? 0),
                    'image' => $variantImagePath,
                    'attributes' => $variant,
                    'sku' => $product->id . '-' . $key,
                ]);
            }
        } else {

            ProductVariant::create([
                'product_id' => $product->id,
                'price' => $request->price,
                'stock' => (int) $request->stock,
                'attributes' => [],
                'sku' => $product->id . '-default',
            ]);
        }

        return redirect()->route('dashboard.products.index')
            ->with('success', 'Product updated successfully');
    }

    public function show(Product $product)
    {
        $product->load(['store', 'categories', 'variants']);

        return Inertia::render('Dashboard/Products/Show', [
            'product' => $product,

            'permissions' => [
                'update' => auth()->user()->can('update', $product),
                'delete' => auth()->user()->can('delete', $product),
            ]
        ]);
    }

    public function edit(Product $product)
    {
        $this->authorize('update', $product);
        $user = auth()->user();

        $product->load('variants', 'categories');

        $stores = Store::query()
            ->select('id', 'name')
            ->forUser($user)
            ->get();

        $categories = Category::query()
            ->select('id', 'name', 'store_id')
            ->whereHas('store', fn($q) => $q->forUser($user))
            ->get();


        return Inertia::render('Dashboard/Products/Edit', [
            'product' => $product,
            'stores' => $stores,
            'categories' => $categories,
            'permissions' => [
                'update' => auth()->user()->can('update', $product),
                'delete' => auth()->user()->can('delete', $product),
            ]
        ]);
    }

    public function update(Request $request, Product $product)
    {

        $this->authorize('update', $product);

        $request->validate([
            'store_id' => 'required|exists:stores,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            // 'image' => (empty($request->input('attributes', [])) || is_string($request->input('attributes', []))) ? 'required|image|max:2048' : 'nullable|image|max:2048',
            'image' => 'nullable|image|max:2048',
            'price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'categories' => 'array',
            'categories.*' => 'exists:categories,id',
        ]);

        // ---------------------------
        // NORMALIZE ATTRIBUTES
        // ---------------------------
        $attributes = $request->input('attributes', []);
        if (is_string($attributes)) {
            $attributes = json_decode($attributes, true);
        }
        $attributes = is_array($attributes) ? $attributes : [];

        // ---------------------------
        // NORMALIZE VARIANTS STOCK
        // ---------------------------
        $variantStocks = $request->input('variants');
        $colorImagePaths = $request->input('color_image_paths', []);

        if (is_string($variantStocks)) {
            $variantStocks = json_decode($variantStocks, true);
        }

        $variantStocks = is_array($variantStocks) ? $variantStocks : [];
        $colorImagePaths = is_array($colorImagePaths) ? $colorImagePaths : [];

        $hasVariants = !empty($attributes);

        // ---------------------------
        // UPDATE PRODUCT
        // ---------------------------
        $product->update([
            'store_id' => $request->store_id,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $hasVariants ? 0 : $request->stock,
            'slug' => $request->name !== $product->name
                ? $this->generateUniqueSlug($request->name)
                : $product->slug,
        ]);

        // ---------------------------
        // IMAGE
        // ---------------------------
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');

            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            $product->image = $path;
            $product->save();
        }

        // ---------------------------
        // CATEGORIES
        // ---------------------------
        $product->categories()->sync(
            Category::where('store_id', $request->store_id)
                ->whereIn('id', $request->categories ?? [])
                ->pluck('id')
        );

        // ---------------------------
        // REBUILD VARIANTS
        // ---------------------------
        $product->variants()->delete();

        if ($hasVariants) {

            $generator = new VariantGeneratorService();
            $variants = $generator->generate($attributes);

            foreach ($variants as $variant) {

                $size = trim($variant['Size'] ?? $variant['size'] ?? '');
                $color = trim($variant['Color'] ?? $variant['color'] ?? '');

                $key = $size . '-' . $color;

                $variantImage = $request->file('color_images')[$color] ?? null;
                $variantImagePath = null;

                if ($variantImage) {
                    $variantImagePath = $variantImage->store('images', 'public');
                } elseif (!empty($colorImagePaths[$color])) {
                    $variantImagePath = $colorImagePaths[$color];
                }

                ProductVariant::create([
                    'product_id' => $product->id,
                    'price' => $variant['price'] ?? $request->price,
                    'stock' => (int) ($variantStocks[$key] ?? 0),
                    'image' => $variantImagePath,
                    'attributes' => $variant,
                    'sku' => $product->id . '-' . $key,
                ]);
            }

        } else {

            ProductVariant::create([
                'product_id' => $product->id,
                'price' => $request->price,
                'stock' => $request->stock ?? 0,
                'attributes' => [],
                'sku' => $product->id . '-default',
            ]);
        }

        return redirect()->route('dashboard.products.index')
            ->with('success', 'Product updated successfully');
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return back()->with('success', 'Product deleted successfully');
    }



    public function toggle(Product $product)
    {
        $this->authorize('toggle', $product);

        $product->is_active = !$product->is_active;
        $product->save();

        return back()->with('success', 'Status updated');
    }


    /**
     * ✅ Helper: Generate unique slug
     */
    private function generateUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        while (Product::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        return $slug;
    }


    public function export()
    {
        $this->authorize('export', Product::class);

        return Excel::download(
            new ProductsExport(auth()->user()),
            'products.xlsx'
        );
    }

    public function import(Request $request)
    {
        $this->authorize('import', Product::class);

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        Excel::import(
            new ProductsImport(auth()->user()),
            $request->file('file')
        );

        return back()->with('success', 'Products imported successfully.');
    }

    public function template()
    {
        $this->authorize('export', Product::class);

        $headers = [
            [
                'store_id',
                'store_name',
                'category_ids',
                'category_names',
                'name',
                'description',
                'price',
                'stock',
                'is_active',
                'has_variants',
                'image',
                'image_url',
                'attributes',
                'variants'
            ]
        ];

        return response()->streamDownload(function () use ($headers) {
            $file = fopen('php://output', 'w');

            foreach ($headers as $row) {
                fputcsv($file, $row);
            }

            fclose($file);
        }, 'products-template.csv');
    }



}

