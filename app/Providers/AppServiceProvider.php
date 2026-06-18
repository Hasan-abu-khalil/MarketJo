<?php

namespace App\Providers;

use App\Models\Cart;
use App\Models\Category;
use App\Policies\CategoryPolicy;
use App\Services\Access\AccessService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use App\Models\Employee;
use App\Policies\EmployeePolicy;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        require_once app_path('Support/permissions.php');
        $this->app->singleton(AccessService::class, function () {
            return new AccessService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Category::class, CategoryPolicy::class);
        Gate::policy(
            Employee::class,
            EmployeePolicy::class
        );
        Inertia::share([
            'cartCount' => function () {

                // =========================
                // GUEST CART (SESSION)
                // =========================
                if (!Auth::check()) {
                    $cart = session('cart', []);
                    return array_sum(array_column($cart, 'quantity'));
                }

                // =========================
                // USER CART (DB)
                // =========================
                return Cart::where('user_id', Auth::id())
                    ->with('items')
                    ->first()
                    ?->items
                    ->sum('quantity') ?? 0;
            },
        ]);
    }
}
