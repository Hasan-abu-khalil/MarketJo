<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->allow($user, 'orders.view');
    }

    public function view(User $user, Order $order): bool
    {
        return $this->allow($user, 'orders.view', $order);
    }

    public function update(User $user, Order $order): bool
    {
        return $this->allow($user, 'orders.update', $order);
    }

    public function delete(User $user, Order $order): bool
    {
        return $user->role === 'admin';
    }
}