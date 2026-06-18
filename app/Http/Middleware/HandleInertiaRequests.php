<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return array_merge(parent::share($request), [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user()
                    ? [
                        ...$request->user()->toArray(),

                        'permissions' => $request->user()
                            ->role === 'employee'
                            ? $request->user()
                                ->employee
                                ?->permissions
                                ->pluck('name')
                                ->values()
                            : [],
                    ]
                    : null,
            ],
            'notifications' => fn() => auth()->check()
                ? [
                    'count' => auth()->user()->unreadNotifications()->count(),
                    'items' => auth()->user()->notifications()
                        ->latest()
                        ->take(5)
                        ->get()
                ]
                : null,


            'nav' => [
                'dashboard' => true, // always visible

                'users' => $user?->can('viewAny', \App\Models\User::class),
                'vendorRequests' => $user?->can('viewAny', \App\Models\VendorRequest::class),
                'employees' => $user?->can('viewAny', \App\Models\Employee::class),

                'stores' => $user?->can('viewAny', \App\Models\Store::class),
                'categories' => $user?->can('viewAny', \App\Models\Category::class),
                'products' => $user?->can('viewAny', \App\Models\Product::class),

                'orders' => $user?->can('viewAny', \App\Models\Order::class),
                'orderItems' => $user?->can('viewAny', \App\Models\OrderItem::class),
                'vendorOrders' => $user?->can('viewAny', \App\Models\VendorOrder::class),

                'notifications' => true,
            ],
        ]);
    }
}
