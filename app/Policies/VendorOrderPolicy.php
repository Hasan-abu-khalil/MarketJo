<?php

namespace App\Policies;

use App\Models\User;
use App\Models\VendorOrder;

class VendorOrderPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->allow($user, 'vendor_orders.view');
    }

    public function view(User $user, VendorOrder $vendorOrder): bool
    {
        return $this->allow($user, 'vendor_orders.view', $vendorOrder)
            || $vendorOrder->vendor_id === $user->id;
    }

    public function update(User $user, VendorOrder $vendorOrder): bool
    {
        return $this->allow($user, 'vendor_orders.update', $vendorOrder)
            || $vendorOrder->vendor_id === $user->id;
    }

    public function delete(User $user, VendorOrder $vendorOrder): bool
    {
        return $user->role === 'admin';
    }

    public function export(User $user)
    {
        return $this->allow($user, 'vendor_orders.export');
    }
}