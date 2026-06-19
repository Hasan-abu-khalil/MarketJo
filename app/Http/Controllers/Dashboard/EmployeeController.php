<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Permission;
use App\Models\Store;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class EmployeeController extends Controller
{
    use AuthorizesRequests;

    private function allowedPermissions(User $user)
    {
        // ADMIN → all permissions
        if ($user->role === 'admin') {
            return Permission::query();
        }

        // ADMIN EMPLOYEE (manager) → only his permissions
        if ($user->isAdminEmployee()) {
            return $user->employee->permissions();
        }

        // VENDOR EMPLOYEE → only his permissions
        if ($user->isVendorEmployee()) {
            return $user->employee->permissions();
        }

        // VENDOR OWNER → full vendor permission set
        $vendorPermissions = [
            'stores.view',
            'stores.update',

            'categories.view',
            'categories.create',
            'categories.update',
            'categories.delete',

            'products.view',
            'products.create',
            'products.update',
            'products.delete',
            'products.toggle',
            'products.import',
            'products.export',
            'products.template',



            'orders.view',

            'vendor_orders.view',
            'vendor_orders.update',
            'vendor_orders.export',


            'employees.view',
            'employees.create',
            'employees.update',
            'employees.delete',
        ];

        return Permission::whereIn('name', $vendorPermissions);
    }

    /*
    |--------------------------------------------------------------------------
    | WHAT CAN BE ASSIGNED TO SUB EMPLOYEES
    |--------------------------------------------------------------------------
    */
    private function assignablePermissions(User $user)
    {
        // ADMIN → everything
        if ($user->role === 'admin') {
            return Permission::query();
        }

        // ANY EMPLOYEE → only what they already have
        if ($user->employee) {
            return $user->employee->permissions();
        }

        return Permission::query();
    }


    public function index(Request $request)
    {
        $this->authorize('viewAny', Employee::class);

        $user = auth()->user();

        $search = $request->input('search');

        $employees = Employee::query()
            ->with(['user', 'stores', 'permissions'])

            ->when($user->role !== 'admin', function ($query) use ($user) {
                $query->where('owner_id', $user->ownerId());
            })

            // ✅ SEARCH ADDED
            ->when($search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })

            ->latest()
            ->paginate(10)
            ->withQueryString();

        $employees->getCollection()->transform(function ($employee) use ($user) {
            $employee->can = [
                'update' => $user->can('update', $employee),
                'delete' => $user->can('delete', $employee),
                'managePermissions' => $user->can('managePermissions', $employee),
            ];

            return $employee;
        });

        return Inertia::render('Dashboard/Employees/Index', [
            'employees' => $employees,
            'filters' => [
                'search' => $search,
            ],
            'permissions' => [
                'create' => $user->can('create', Employee::class),
            ],
        ]);
    }


    public function show(Employee $employee)
    {
        $this->authorize('view', $employee);

        $user = auth()->user();

        return Inertia::render('Dashboard/Employees/Show', [
            'employee' => $employee->load(['user', 'stores', 'permissions']),
            'permissions' => [
                'update' => $user->can('update', $employee),
                'delete' => $user->can('delete', $employee),
            ],
        ]);
    }


    public function create()
    {
        $this->authorize('create', Employee::class);

        $user = auth()->user();

        $stores = Store::query()
            ->select('id', 'name')
            ->forUser($user)
            ->get();

        return Inertia::render('Dashboard/Employees/Create', [
            'stores' => $stores,
            'permissions' => $this->allowedPermissions($user)->get(),
            'authUser' => [
                'role' => $user->role,
                'scope' => $user->employee->scope ?? null,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Employee::class);

        $user = auth()->user();

        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'scope' => $user->role === 'admin'
                ? 'required|in:admin,vendor'
                : 'required|in:vendor',
            'store_ids' => $request->scope === 'vendor'
                ? ['required', 'array', 'min:1']
                : ['nullable', 'array'],
            'permissions' => ['required', 'array', 'min:1'],
        ]);

        $allowedIds = $this->assignablePermissions($user)
            ->pluck('id')
            ->map(fn($id) => (int) $id)
            ->toArray();

        $filteredPermissions = collect($request->permissions ?? [])
            ->map(fn($id) => (int) $id)
            ->intersect($allowedIds)
            ->values()
            ->toArray();

        $newUser = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'employee',
        ]);

        $scope = $user->role === 'admin'
            ? $request->scope
            : 'vendor';

        $employee = Employee::create([
            'user_id' => $newUser->id,
            'owner_id' => $user->ownerId(),
            'scope' => $scope,
        ]);

        $employee->permissions()->sync($filteredPermissions);

        if ($scope === 'vendor') {
            $employee->stores()->sync($request->store_ids ?? []);
        }

        return redirect()
            ->route('dashboard.employees.index')
            ->with('success', 'Employee created successfully');
    }

    public function edit(Employee $employee)
    {
        $this->authorize('update', $employee);

        $user = auth()->user();

        $stores = Store::query()
            ->select('id', 'name')
            ->forUser($user)
            ->get();

        return Inertia::render('Dashboard/Employees/Edit', [
            'employee' => $employee->load(['user', 'permissions', 'stores']),
            'stores' => $stores,
            'permissions' => $this->allowedPermissions($user)->get(),
            'authUser' => [
                'role' => $user->role,
                'scope' => $user->employee->scope ?? null,
            ],
        ]);
    }


    public function update(Request $request, Employee $employee)
    {
        $this->authorize('update', $employee);

        $user = auth()->user();

        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'scope' => $user->role === 'admin'
                ? 'required|in:admin,vendor'
                : 'required|in:vendor',
            'permissions.*' => 'integer|exists:permissions,id',
            'store_ids' => $request->scope === 'vendor'
                ? ['required', 'array', 'min:1']
                : ['nullable', 'array'],
            'permissions' => ['required', 'array', 'min:1'],
        ]);

        $allowedIds = $this->assignablePermissions($user)
            ->pluck('id')
            ->map(fn($id) => (int) $id)
            ->toArray();

        $filteredPermissions = collect($request->permissions ?? [])
            ->map(fn($id) => (int) $id)
            ->intersect($allowedIds)
            ->values()
            ->toArray();

        $employee->user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        $scope = $user->role === 'admin'
            ? $request->scope
            : 'vendor';

        $employee->update(['scope' => $scope]);

        $employee->permissions()->sync($filteredPermissions);

        if ($scope === 'vendor') {
            $employee->stores()->sync($request->store_ids ?? []);
        } else {
            $employee->stores()->detach();
        }

        return redirect()
            ->route('dashboard.employees.index')
            ->with('success', 'Employee updated successfully');
    }


    public function destroy(Employee $employee)
    {
        $this->authorize('delete', $employee);

        $employee->user()->delete();
        $employee->delete();

        return back()->with('success', 'Employee deleted');
    }
}