<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;

class CategoryPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->allow($user, 'categories.view');
    }

    public function view(User $user, Category $category): bool
    {
        return $this->allow($user, 'categories.view', $category);
    }

    public function create(User $user): bool
    {
        return $this->allow($user, 'categories.create');
    }

    public function update(User $user, Category $category): bool
    {
        return $this->allow($user, 'categories.update', $category);
    }

    public function delete(User $user, Category $category): bool
    {
        return $this->allow($user, 'categories.delete', $category);
    }
}