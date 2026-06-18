<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Category;
use App\Models\Store;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CategoryController extends Controller
{
    use AuthorizesRequests;

    // public function index(Request $request)
    // {

    //     $this->authorize('viewAny', Category::class);
    //     $user = auth()->user();
    //     $ownerId = $user->ownerId();

    //     $search = $request->input('search');
    //     $storeId = $request->input('store_id');

    //     $stores = Store::query()
    //         ->select('id', 'name')
    //         ->when(auth()->user()->role !== 'admin', function ($query) {
    //             $query->where('user_id', auth()->id());
    //         })
    //         ->get();

    //     $categories = Category::query()
    //         ->with('store')
    //         ->when($search, function ($query, $search) {
    //             $query->where('name', 'like', "%{$search}%");
    //         })
    //         ->when($storeId, function ($q, $storeId) {
    //             $q->where('store_id', $storeId);
    //         })

    //         ->when($user->role !== 'admin', function ($query) use ($ownerId) {
    //             $query->whereHas('store', function ($q) use ($ownerId) {
    //                 $q->where('user_id', $ownerId);
    //             });
    //         })
    //         ->latest()
    //         ->paginate(10)
    //         ->withQueryString();

    //     $categories->getCollection()->transform(function ($category) {

    //         $category->can = [
    //             'update' => auth()->user()->can('update', $category),
    //             'delete' => auth()->user()->can('delete', $category),
    //         ];

    //         return $category;
    //     });

    //     return Inertia::render('Dashboard/Categories/Index', [
    //         'categories' => $categories,
    //         'stores' => $stores, // ✅ FIX MISSING
    //         'filters' => [
    //             'search' => $search,
    //             'store_id' => $storeId,
    //         ],
    //         'permissions' => [
    //             'create' => auth()->user()->can('create', Category::class),
    //         ]
    //     ]);
    // }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Category::class);

        $user = auth()->user();
        $search = $request->input('search');
        $storeId = $request->input('store_id');

        $categories = Category::query()
            ->with('store')
            ->when(
                $search,
                fn($q) =>
                $q->where('name', 'like', "%{$search}%")
            )
            ->when(
                $storeId,
                fn($q) =>
                $q->where('store_id', $storeId)
            )
            ->whereHas('store', function ($q) use ($user) {
                $q->forUser($user);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $stores = Store::query()
            ->select('id', 'name')
            ->forUser($user)
            ->get();


        $categories->getCollection()->transform(function ($category) {

            $category->can = [
                'update' => auth()->user()->can('update', $category),
                'delete' => auth()->user()->can('delete', $category),
            ];

            return $category;
        });
        return Inertia::render('Dashboard/Categories/Index', [
            'categories' => $categories,
            'stores' => $stores,
            'filters' => compact('search', 'storeId'),
            'permissions' => [
                'create' => $user->can('create', Category::class),
            ],
        ]);
    }

    public function create()
    {
        $this->authorize('create', Category::class);
        $user = auth()->user();

        $stores = Store::query()
            ->select('id', 'name')
            ->forUser($user)
            ->get();

        return Inertia::render('Dashboard/Categories/Create', [
            'stores' => $stores,

        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Category::class);

        $request->validate([

            'store_id' => 'required|exists:stores,id',
            'name' => 'required|string|max:255',
        ]);


        $slug = $this->generateUniqueSlug(
            $request->name,
            $request->store_id
        );

        Category::create([
            'store_id' => $request->store_id,
            'name' => $request->name,
            'slug' => $slug,
        ]);

        return redirect()->route('dashboard.categories.index')
            ->with('success', 'Category saved successfully');
    }

    public function show(Category $category)
    {

        return Inertia::render('Dashboard/Categories/Show', [
            'category' => $category->load('store'),
            'permissions' => [
                'update' => auth()->user()->can('update', $category),
                'delete' => auth()->user()->can('delete', $category),
            ],

        ]);
    }

    public function edit(Category $category)
    {
        $this->authorize('update', $category);
        $user = auth()->user();

        $stores = Store::query()
            ->select('id', 'name')
            ->forUser($user)
            ->get();

        return Inertia::render('Dashboard/Categories/Edit', [
            'category' => $category->load('store'),
            'stores' => $stores,
            'permissions' => [
                'update' => auth()->user()->can('update', $category),
                'delete' => auth()->user()->can('delete', $category),
            ],
        ]);
    }


    public function update(Request $request, Category $category)
    {
        $this->authorize('update', $category);

        $request->validate([
            'name' => 'sometimes|string|max:255',
        ]);

        // ✅ Update slug ONLY if name changes
        if ($request->has('name') && $request->name !== $category->name) {
            $category->slug = $this->generateUniqueSlug($request->name, $category->store_id);
        }

        $category->fill([
            'name' => $request->name,

        ]);

        $category->save();

        return redirect()->route('dashboard.categories.index')
            ->with('success', 'Category updated successfully');
    }

    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);
        $category->delete();

        return back()->with('success', 'Category deleted successfully');
    }

    /**
     * ✅ Helper: Generate unique slug
     */
    private function generateUniqueSlug($name, $storeId)
    {
        $slug = Str::slug($name);

        $originalSlug = $slug;

        $count = 1;

        while (
            Category::where('store_id', $storeId)
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $originalSlug . '-' . $count++;
        }

        return $slug;
    }
}

