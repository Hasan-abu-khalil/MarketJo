<?php

namespace App\Policies;

use App\Models\User;
use App\Models\VendorRequest;

class VendorRequestPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->allowAdminArea($user, 'vendor_requests.view');
    }

    public function view(User $user, VendorRequest $vendorRequest): bool
    {
        return $this->allowAdminArea($user, 'vendor_requests.view');
    }

    public function update(User $user, VendorRequest $vendorRequest): bool
    {
        return $this->allowAdminArea($user, 'vendor_requests.update');
    }

    public function delete(User $user, VendorRequest $vendorRequest): bool
    {
        return $this->allowAdminArea($user, 'vendor_requests.delete');
    }
}