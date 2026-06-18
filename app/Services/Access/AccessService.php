<?php

namespace App\Services\Access;

use App\Models\User;

class AccessService
{
    

    public function can(User $user, string $permission, $model = null): bool
    {
        // 1. full admin bypass
        if ($user->role === 'admin') {
            return true;
        }

        // 2. permission-based access (admin employee / vendor employee)
        if ($user->hasPermission($permission)) {
            return true;
        }

        // 3. ownership fallback
        if ($model) {
            return $this->checkOwnership($user, $model);
        }

        return false;
    }

    private function checkOwnership(User $user, $model): bool
    {
        return match (true) {

            $model instanceof \App\Models\Store =>
            $model->user_id === $user->id,

            $model instanceof \App\Models\Product =>
            $model->store?->user_id === $user->id,

            $model instanceof \App\Models\Category =>
            $model->store?->user_id === $user->id,

            $model instanceof \App\Models\Order =>
            $this->ownsOrder($user, $model),

            default => false,
        };
    }

    private function ownsOrder(User $user, $order): bool
    {
        return $order->vendorOrders()
            ->where('vendor_id', $user->id)
            ->exists();
    }
}