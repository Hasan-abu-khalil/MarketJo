<?php

namespace App\Policies;

use App\Models\Store;
use App\Models\User;
use Illuminate\Auth\Access\Response;
class StorePolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->allow($user, 'stores.view');
    }

    public function view(User $user, Store $store): bool
    {
        return $this->allow($user, 'stores.view', $store);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'vendor']);
    }

    public function update(User $user, Store $store): bool
    {
        return $this->allow($user, 'stores.update', $store);
    }

    public function delete(User $user, Store $store): bool
    {
        return $this->allow($user, 'stores.delete', $store);
    }

    public function toggle(User $user, Store $store): bool
    {
        return $user->role === 'admin';
    }
}