<?php

namespace Database\Seeders;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
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
            'orders.delete',


            'vendor_orders.view',
            'vendor_orders.update',
            'vendor_orders.delete',


            'vendor_requests.view',
            'vendor_requests.update',
            'vendor_requests.delete',


            'employees.view',
            'employees.create',
            'employees.update',
            'employees.delete',
        ];

        foreach ($permissions as $permission) {

            Permission::firstOrCreate([
                'name' => $permission
            ]);
        }
    }
}