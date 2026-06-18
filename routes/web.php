<?php

use App\Http\Controllers\NotificationController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;


// home 
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\VendorRequestController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AccountController;


// dashboard
use App\Http\Controllers\Dashboard\ProductController as DashboardProductController;
use App\Http\Controllers\Dashboard\CategoryController as DashboardCategoryController;
use App\Http\Controllers\Dashboard\StoreController as DashboardStoreController;
use App\Http\Controllers\Dashboard\UserController as DashboardUserController;
use App\Http\Controllers\Dashboard\VendorRequestController as DashboardVendorRequestController;
use App\Http\Controllers\Dashboard\OrderController as DashboardOrderController;
use App\Http\Controllers\Dashboard\OrderItemController as DashboardOrderItemController;
use App\Http\Controllers\Dashboard\AdminPanelController;
use App\Http\Controllers\Dashboard\VendorOrderController as DashboardVendorOrderController;
use App\Http\Controllers\Dashboard\NotificationController as DashboardNotificationController;
use App\Http\Controllers\Dashboard\EmployeeController as DashboardEmployeeController;





Route::middleware([
    'auth',
    'role:admin,vendor,employee'
])
    ->prefix('dashboard')
    ->name('dashboard.')
    ->group(function () {

        // adminPanel
        Route::get('adminPanel', [AdminPanelController::class, 'index'])
            ->name('admin-panel');

        // user
        Route::resource('users', DashboardUserController::class);

        // employees
        Route::resource('employees', DashboardEmployeeController::class);

        // vendor requests
        Route::resource('vendor-requests', DashboardVendorRequestController::class);

        // products
        Route::get('products/export', [DashboardProductController::class, 'export'])
            ->name('products.export');

        Route::get('products/template', [DashboardProductController::class, 'template'])
            ->name('products.template');

        Route::post('products/import', [DashboardProductController::class, 'import'])
            ->name('products.import');

        Route::resource('products', DashboardProductController::class);
        Route::put('products/{product}/toggle', [DashboardProductController::class, 'toggle'])
            ->name('products.toggle');
        // categories
        Route::resource('categories', DashboardCategoryController::class);

        // store
        Route::resource('stores', DashboardStoreController::class);
        Route::put('stores/{store}/toggle', [DashboardStoreController::class, 'toggle'])
            ->name('stores.toggle');

        // orders
        Route::resource('/orders', DashboardOrderController::class);
        //vendorOrder
        Route::get('/vendor-orders/export', [DashboardVendorOrderController::class, 'export'])
            ->name('vendor-orders.export');
        Route::resource('/vendor-orders', DashboardVendorOrderController::class);


        // order items
        Route::resource('/order-items', DashboardOrderItemController::class);


        // notifications
        Route::get(
            '/notifications',
            [DashboardNotificationController::class, 'index']
        )->name('notifications.index');

        Route::patch(
            '/notifications/{notification}/read',
            [DashboardNotificationController::class, 'markAsRead']
        )->name('notifications.read');

        Route::patch(
            '/notifications/read-all',
            [DashboardNotificationController::class, 'markAllAsRead']
        )->name('notifications.readAll');


    });

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';


// home
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/products', [ProductController::class, 'index'])->name('products.index');

Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');



Route::get('/stores', [StoreController::class, 'index'])->name('stores.index');
Route::get('/stores-map', [StoreController::class, 'map'])->name('stores.map');
Route::get('/stores/{store:slug}', [StoreController::class, 'show'])->name('stores.show');

Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');

Route::get('/categories/{category:slug}', [CategoryController::class, 'show'])->name('categories.show');


// cart 
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add/{product}', [CartController::class, 'add'])->name('cart.add');
Route::put('/cart/{id}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');

Route::middleware(['auth'])->group(function () {

    Route::get(
        '/notifications',
        [NotificationController::class, 'index']
    )->name('notifications.index');

    Route::patch(
        '/notifications/{notification}/read',
        [NotificationController::class, 'markAsRead']
    )->name('notifications.read');

    Route::patch(
        '/notifications/read-all',
        [NotificationController::class, 'markAllAsRead']
    )->name('notifications.readAll');



    Route::post('/checkout', [OrderController::class, 'store']);

    Route::get('/order/success', function () {
        return Inertia::render('Front/Success');
    })->name('orders.success');


    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard.index');

    Route::post('/orders/{id}/cancel', [DashboardController::class, 'cancel'])
        ->name('orders.cancel');

    Route::get('/orders/{id}', [DashboardController::class, 'show'])
        ->name('orders.show');

    Route::get('/account/orders', [DashboardController::class, 'index'])
        ->name('account.orders');

    Route::get('/account/security', [AccountController::class, 'security'])
        ->name('account.security');

    Route::put('/account/profile', [AccountController::class, 'updateProfile'])
        ->name('account.profile.update');

    Route::put('/account/password', [AccountController::class, 'updatePassword'])
        ->name('account.password.update');

    Route::get('/vendor-request', [VendorRequestController::class, 'index'])->name('vendor-requests.index');
    Route::post('/vendor-request', [VendorRequestController::class, 'store'])->name('vendor-requests.store');


});






