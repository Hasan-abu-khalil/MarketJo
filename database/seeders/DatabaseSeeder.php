<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Permission;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use App\Models\VendorRequest;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        // Customers
        $customers = User::factory(20)->create([
            'role' => 'customer',
        ]);

        // Vendors
        $vendors = User::factory(10)->create([
            'role' => 'vendor',
        ]);
        $permissions = [

            'users.view',
            'users.create',
            'users.update',
            'users.delete',

            'stores.view',
            'stores.create',
            'stores.update',
            'stores.delete',
            'stores.toggle',


            'categories.view',
            'categories.create',
            'categories.update',
            'categories.delete',

            'products.view',
            'products.create',
            'products.update',
            'products.delete',
            'products.toggle',

            'orders.view',
            'orders.update',

            'vendor_orders.view',
            'vendor_orders.update',

            'vendor_requests.view',
            'vendor_requests.update',
            'vendor_requests.delete',

            'employees.view',
            'employees.create',
            'employees.update',
            'employees.delete',


            'products.import',
            'products.export',
            'products.template',
            'vendor_orders.export',

        ];

        foreach ($permissions as $permission) {

            Permission::firstOrCreate([
                'name' => $permission
            ]);
        }

        // // Vendor Requests (FIXED)
        // foreach ($vendors as $vendor) {
        //     VendorRequest::factory()->create([
        //         'user_id' => $vendor->id,
        //         'store_name' => $vendor->name . ' Store',
        //         'reviewed_by' => $admin->id,
        //         'status' => 'approved',
        //     ]);
        // }

        // // Stores
        // $stores = $vendors->map(function ($vendor) {
        //     return Store::factory()->create([
        //         'user_id' => $vendor->id,
        //         'status' => true,
        //     ]);
        // });

        // // Categories (FIXED TYPO)
        // $categories = Category::factory(10)->create();

        // // Products
        // $products = collect();

        // foreach ($stores as $store) {
        //     $storeProducts = Product::factory(10)->create([
        //         'store_id' => $store->id,
        //         'is_active' => true,
        //     ]);

        //     foreach ($storeProducts as $product) {
        //         if (method_exists($product, 'categories')) {
        //             $product->categories()->attach(
        //                 $categories->random(rand(1, 3))->pluck('id')->toArray()
        //             );
        //         }
        //     }

        //     $products = $products->merge($storeProducts);
        // }

        // // Orders
        // foreach ($customers as $customer) {
        //     $orders = Order::factory(rand(1, 5))->create([
        //         'user_id' => $customer->id,
        //     ]);

        //     foreach ($orders as $order) {

        //         $items = $products->count() > 0
        //             ? $products->random(rand(1, 4))
        //             : collect();

        //         $total = 0;

        //         foreach ($items as $product) {
        //             $qty = rand(1, 3);

        //             OrderItem::create([
        //                 'order_id' => $order->id,
        //                 'product_id' => $product->id,
        //                 'quantity' => $qty,
        //                 'price' => $product->price,
        //             ]);

        //             $total += $product->price * $qty;
        //         }

        //         $order->update([
        //             'total_price' => $total,
        //         ]);
        //     }
        // }
    }
}