<?php

namespace App\Policies;

use App\Models\User;
use App\Services\Access\AccessService;

class BasePolicy
{
    protected AccessService $access;

    public function __construct(AccessService $access)
    {
        $this->access = $access;
    }

    protected function allow(User $user, string $permission, $model = null): bool
    {
        return $this->access->can($user, $permission, $model);
    }


    protected function allowAdminArea(User $user, string $permission): bool
    {
        // real admin
        if ($user->role === 'admin') {
            return true;
        }

        // only admin employees
        if ($user->isAdminEmployee()) {
            return $user->hasPermission($permission);
        }

        return false;
    }
}