<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
class UserController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);
        $search = $request->input('search');
        $role = $request->input('role');

        $users = User::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('role', 'like', "%{$search}%");
                });
            })
            ->when($role, function ($query) use ($role) {
                $query->where('role', $role);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();
        $users->getCollection()->transform(function ($user) {
            $user->can = [
                'update' => auth()->user()->can('update', $user),
                'delete' => auth()->user()->can('delete', $user),
                'view' => auth()->user()->can('view', $user),
            ];

            return $user;
        });
        return Inertia::render('Dashboard/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $role,
            ],
            'permissions' => [
                'create' => auth()->user()->can('create', User::class),
            ],

        ]);
    }

    public function create()
    {
        $this->authorize('create', User::class);
        return Inertia::render('Dashboard/Users/Create');
    }

    public function store(Request $request)
    {
        $this->authorize('create', User::class);
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:customer,vendor',
            'password' => 'required|string|min:8|confirmed',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        return redirect()
            ->route('dashboard.users.index')
            ->with('success', 'User created successfully');
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);


        $request->validate([
            'role' => 'required|in:customer,vendor',
        ]);

        $user->update([
            'role' => $request->role,
        ]);

        return back()->with('success', 'Role updated successfully.');
    }

    public function show(User $user)
    {
        $this->authorize('view', $user);
        return Inertia::render('Dashboard/Users/Show', [
            'user' => $user,
        ]);
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);


        $user->delete();

        return back()->with('success', 'User deleted successfully');
    }
}