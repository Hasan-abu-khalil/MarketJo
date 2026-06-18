<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\VendorRequest;
use App\Notifications\VendorRequestStatusNotification;
use DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\VendorRoleService;

class VendorRequestController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request)
    {
        $this->authorize('viewAny', VendorRequest::class);



        $search = $request->input('search');
        $status = $request->input('status');
        $vendorRequests = VendorRequest::query()
            ->with('user')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                        ->orWhere('store_name', 'like', "%{$search}%");
                });
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })

            ->latest()
            ->paginate(10)
            ->withQueryString();

        $vendorRequests->getCollection()->transform(function ($request) {
            $request->can = [
                'view' => auth()->user()->can('view', $request),
                'update' => auth()->user()->can('update', $request),
                'delete' => auth()->user()->can('delete', $request),
            ];

            return $request;
        });

        return Inertia::render('Dashboard/VendorRequests/Index', [
            'vendorRequests' => $vendorRequests,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'permissions' => [
                'viewAny' => auth()->user()->can('viewAny', VendorRequest::class),
            ]
        ]);
    }

    public function show(VendorRequest $vendorRequest)
    {
        $this->authorize('view', $vendorRequest);
        $vendorRequest->load('user');

        $vendorRequest->can = [
            'view' => auth()->user()->can('view', $vendorRequest),
            'update' => auth()->user()->can('update', $vendorRequest),
            'delete' => auth()->user()->can('delete', $vendorRequest),
        ];
        return Inertia::render('Dashboard/VendorRequests/Show', [
            'vendorRequest' => $vendorRequest->load('user'),
        ]);
    }
    public function update(Request $request, VendorRequest $vendorRequest, VendorRoleService $service)
    {
        $this->authorize('update', $vendorRequest);
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        // 🔴 block old requests
        if (!$vendorRequest->is_active) {
            return back()->withErrors([
                'error' => 'This request is no longer active.'
            ]);
        }

        DB::transaction(function () use ($request, $vendorRequest, $service) {

            $vendorRequest->update([
                'status' => $request->status,
                'is_active' => false,
                'reviewed_at' => now(),
                'reviewed_by' => auth()->id(),
            ]);


            $vendorRequest->user->notify(
                new VendorRequestStatusNotification($vendorRequest)
            );


            if ($request->status === 'approved') {
                $service->sync($vendorRequest->user);
            }
        });

        return back()->with('success', 'Vendor request updated successfully.');
    }
    public function destroy(VendorRequest $vendorRequest, VendorRoleService $service)
    {

        $this->authorize('delete', $vendorRequest);
        DB::transaction(function () use ($vendorRequest, $service) {

            $user = $vendorRequest->user;

            $vendorRequest->delete();
            // $user->notify(
            //     new VendorRequestStatusNotification($vendorRequest)
            // );
            $service->sync($user);
        });

        return back()->with('success', 'Deleted successfully');
    }
}
