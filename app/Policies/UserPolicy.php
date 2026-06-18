<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->allowAdminArea($user, 'users.view');
    }

    public function view(User $user, User $model): bool
    {
        return $this->allowAdminArea($user, 'users.view');
    }

    public function create(User $user): bool
    {
        return $this->allowAdminArea($user, 'users.create');
    }

    public function update(User $user, User $model): bool
    {
        if ($model->role === 'admin' && $user->role !== 'admin') {
            return false;
        }

        return $this->allowAdminArea($user, 'users.update');
    }

    public function delete(User $user, User $model): bool
    {
        if ($model->role === 'admin') {
            return false;
        }

        return $this->allowAdminArea($user, 'users.delete');
    }
}