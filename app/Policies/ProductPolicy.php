<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->allow($user, 'products.view');
    }

    public function view(User $user, Product $product): bool
    {
        return $this->allow($user, 'products.view', $product);
    }

    public function create(User $user): bool
    {
        return $this->allow($user, 'products.create');
    }

    public function update(User $user, Product $product): bool
    {
        return $this->allow($user, 'products.update', $product);
    }

    public function delete(User $user, Product $product): bool
    {
        return $this->allow($user, 'products.delete', $product);
    }

    public function toggle(User $user, Product $product): bool
    {
        return $this->allow($user, 'products.toggle', $product);
    }

    public function import(User $user)
    {
        return $this->allow($user, 'products.import');
    }

    public function export(User $user)
    {
        return $this->allow($user, 'products.export');
    }

     public function template(User $user)
    {
        return $this->allow($user, 'products.template');
    }
}