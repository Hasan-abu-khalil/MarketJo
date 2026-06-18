<?php

namespace App\Http\Controllers\Dashboard;


use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StoreController extends Controller
{
    use AuthorizesRequests;
    // public function index(Request $request)
    // {
    //     $this->authorize('viewAny', Store::class);
    //     $user = auth()->user();
    //     $ownerId = $user->ownerId();

    //     $search = $request->input('search');
    //     $status = $request->input('status');
    //     $stores = Store::query()
    //         ->with('user')
    //         ->when($search, function ($query, $search) {
    //             $query->where(function ($q) use ($search) {
    //                 $q->where('name', 'like', "%{$search}%")
    //                     ->orWhereHas('user', function ($q) use ($search) {
    //                         $q->where('name', 'like', "%{$search}%");
    //                     });
    //             });

    //         })
    //         ->when($status !== null && $status !== '', function ($query) use ($status) {
    //             $query->where('status', (int) $status);
    //         })

    //         ->when($user->role !== 'admin', function ($query) use ($ownerId) {
    //             $query->where('user_id', $ownerId);
    //         })
    //         ->latest()
    //         ->paginate(10)
    //         ->withQueryString();

    //     $stores->getCollection()->transform(function ($store) {
    //         $store->can = [
    //             'update' => auth()->user()->can('update', $store),
    //             'delete' => auth()->user()->can('delete', $store),
    //             'toggle' => auth()->user()->can('toggle', $store),
    //         ];

    //         return $store;
    //     });

    //     return Inertia::render('Dashboard/Stores/Index', [
    //         'stores' => $stores,
    //         'filters' => [
    //             'search' => $search,
    //             'status' => $status,
    //         ],
    //         'permissions' => [
    //             'create' => auth()->user()->can('create', Store::class),
    //         ]
    //     ]);
    // }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Store::class);

        $user = auth()->user();
        $search = $request->input('search');
        $status = $request->input('status');

        $stores = Store::query()
            ->with('user')
            ->when($search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%");
            })
            ->when($status !== null && $status !== '', function ($q) use ($status) {
                $q->where('status', (int) $status);
            })
            ->forUser($user)
            ->latest()
            ->paginate(10)
            ->withQueryString();
            $stores->getCollection()->transform(function ($store) {
                $store->can = [
                    'update' => auth()->user()->can('update', $store),
                    'delete' => auth()->user()->can('delete', $store),
                    'toggle' => auth()->user()->can('toggle', $store),
                ];

                return $store;
            });
        return Inertia::render('Dashboard/Stores/Index', [
            'stores' => $stores,
            'filters' => compact('search', 'status'),
            'permissions' => [
                'create' => $user->can('create', Store::class),
            ],
        ]);
    }

    public function create()
    {
        $this->authorize('create', Store::class);
        return Inertia::render('Dashboard/Stores/Create');

    }

    public function store(Request $request)
    {
        $this->authorize('create', Store::class);
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'required|image|max:2048',
            'status' => 'boolean',
            'address' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        // ✅ Generate unique slug
        $slug = $this->generateUniqueSlug($request->name);

        $logoPath = $request->hasFile('logo')
            ? $request->file('logo')->store('logos', 'public')
            : null;

        $user = auth()->user();
        // 🔴 IMPORTANT: enforce vendor ownership logic
        if ($user->role !== 'admin' && $user->role !== 'vendor') {
            abort(403);
        }
        Store::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'slug' => $slug,
            'description' => $request->description,
            'logo' => $logoPath,
            'status' => $request->boolean('status'),

            'address' => $request->address,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return redirect()->route('dashboard.stores.index')
            ->with('success', 'Store saved successfully');
    }

    public function show(Store $store)
    {
        return Inertia::render('Dashboard/Stores/Show', [
            'store' => $store,
            'permissions' => [
                'update' => auth()->user()->can('update', $store),
                'delete' => auth()->user()->can('delete', $store),
            ],
        ]);
    }

    public function edit(Store $store)
    {
        $this->authorize('update', $store);

        return Inertia::render('Dashboard/Stores/Edit', [
            'store' => $store,
            'permissions' => [
                'update' => auth()->user()->can('update', $store),
                'delete' => auth()->user()->can('delete', $store),
            ],
        ]);
    }

    public function update(Request $request, Store $store)
    {
        $this->authorize('update', $store);
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
            'status' => 'boolean',
            'address' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',

        ]);

        // ✅ Update slug ONLY if name changes
        if ($request->has('name') && $request->name !== $store->name) {
            $store->slug = $this->generateUniqueSlug($request->name);
        }

        if ($request->hasFile('logo')) {
            if ($store->logo) {
                Storage::disk('public')->delete($store->logo);
            }

            $store->logo = $request->file('logo')->store('logos', 'public');
        }

        $store->fill($request->only(['name', 'description', 'status', 'address', 'latitude', 'longitude']));
        $store->save();

        return redirect()->route('dashboard.stores.index')
            ->with('success', 'Store updated successfully');
    }

    public function destroy(Store $store)
    {
        $this->authorize('delete', $store);

        if ($store->logo) {
            Storage::disk('public')->delete($store->logo);
        }

        $store->delete();

        return back()->with('success', 'Store deleted successfully');
    }

    public function toggle(Store $store)
    {
        $this->authorize('toggle', $store);
        $store->status = !$store->status;
        $store->save();

        return back()->with('success', 'Status updated');
    }


    private function generateUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        while (Store::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        return $slug;
    }
}