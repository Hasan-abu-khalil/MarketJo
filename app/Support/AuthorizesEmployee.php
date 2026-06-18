<?php
namespace App\Support;

use App\Models\User;

trait AuthorizesEmployee
{
    protected function hasEmployeePermission(
        User $user,
        string $permission
    ): bool {
        return $user->hasPermission(
            $permission
        );
    }
}