<?php
namespace App\Services;

use App\Models\User;
use App\Models\VendorRequest;

class VendorRoleService
{
    public function sync(User $user): void
    {
        // 🟢 ONLY latest approved request matters (safe & stable)
        $latestApproved = VendorRequest::where('user_id', $user->id)
            ->where('status', 'approved')
            ->latest()
            ->first();

        $user->update([
            'role' => $latestApproved ? 'vendor' : 'customer',
        ]);
    }
}