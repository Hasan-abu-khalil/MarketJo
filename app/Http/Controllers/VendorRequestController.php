<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\VendorRequest;
use App\Notifications\VendorRequestStatusNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VendorRequestController extends Controller
{
    /**
     * Show vendor request page
     */
    public function index()
    {
        $latestRequest = VendorRequest::where('user_id', auth()->id())
            ->latest()
            ->first();

        $hasActiveRequest = $latestRequest?->is_active;

        return Inertia::render('Front/BecomeVendor', [
            'latestRequest' => $latestRequest,
            'hasActiveRequest' => $hasActiveRequest,
        ]);
    }

    /**
     * Store new vendor request
     */
    public function store(Request $request)
    {
        $request->validate([
            'store_name' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $userId = auth()->id();

        DB::transaction(function () use ($request, $userId) {

            // 🔴 deactivate previous requests (IMPORTANT)
            VendorRequest::where('user_id', $userId)
                ->update(['is_active' => false]);

            // 🟢 create new request
            $vendorRequest = VendorRequest::create([
                'user_id' => $userId,
                'store_name' => $request->store_name,
                'message' => $request->message,
                'status' => 'pending',
                'is_active' => true,
            ]);

            $admins = User::where('role', 'admin')->get();

            foreach ($admins as $admin) {
                $admin->notify(
                    new VendorRequestStatusNotification($vendorRequest)
                );
            }
        });

        return back()->with('success', 'Request submitted successfully');
    }
}