<?php

namespace App\Policies;

use App\Models\OrderItem;
use App\Models\User;

class OrderItemPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function show(User $user, OrderItem $orderItem): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $orderItem->product?->store?->user_id === $user->id;
    }

    public function delete(User $user, OrderItem $orderItem): bool
    {
        return $user->role === 'admin';
    }
}