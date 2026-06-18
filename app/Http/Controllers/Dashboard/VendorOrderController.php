<?php

namespace App\Http\Controllers\Dashboard;


use App\Http\Controllers\Controller;
use App\Models\VendorOrder;
use App\Services\OrderStatusService;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use App\Notifications\OrderStatusChangedNotification;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\VendorOrdersExport;
class VendorOrderController extends Controller
{


    use AuthorizesRequests;

    public function index(Request $request)
    {
        $this->authorize('viewAny', VendorOrder::class);

        $user = auth()->user();
        $ownerId = $user->ownerId();

        $search = $request->input('search');
        $status = $request->input('status');


        $orders = VendorOrder::query()
            ->with([
                'order.user',
                'orderItem.product.store',
                'store',
                'vendor'
            ])

            // vendor isolation
            ->when($user->role !== 'admin', function ($q) use ($user) {

                if ($user->isVendorEmployee()) {
                    $storeIds = $user->employee->stores()->pluck('stores.id');

                    $q->whereIn('store_id', $storeIds);
                }

                if ($user->role === 'vendor') {
                    $q->where('vendor_id', $user->id);
                }
            })

            // filter by status
            ->when($request->status, function ($q, $status) {
                $q->where('status', $status);
            })

            // search order info
            ->when($request->search, function ($q, $search) {
                $q->whereHas('order', function ($o) use ($search) {
                    $o->where('id', 'like', "%{$search}%")
                        ->orWhere('shipping_name', 'like', "%{$search}%");
                });
            })

            ->latest()
            ->paginate(10)
            ->withQueryString();

        $orders->getCollection()->transform(function ($order) use ($user) {
            $order->can = [
                'view' => $user->can('view', $order),
                'update' => $user->can('update', $order),
                'delete' => $user->can('delete', $order),
            ];

            return $order;
        });

        return Inertia::render('Dashboard/VendorOrders/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                "status" => $status,
            ],
            'permissions' => [
                'view' => $user->can('viewAny', VendorOrder::class),
                'export' => $user->can('export', VendorOrder::class),
            ],
        ]);
    }

    public function show(VendorOrder $vendorOrder)
    {
        $this->authorize('view', $vendorOrder);

        return Inertia::render('Dashboard/VendorOrders/Show', [
            'vendorOrder' => $vendorOrder->load([
                'order.user',
                'orderItem.product',
                'store',
                'vendor'
            ]),
        ]);
    }


    public function update(Request $request, VendorOrder $vendorOrder, OrderStatusService $service)
    {
        $this->authorize('update', $vendorOrder);
        $request->validate([
            'status' => 'required|string'
        ]);

        $service->updateVendorOrderStatus(
            $vendorOrder,
            $request->status
        );
        $vendorOrder->order->user->notify(
            new OrderStatusChangedNotification($vendorOrder)
        );

        return back();
    }

    public function destroy(VendorOrder $vendorOrder)
    {
        $this->authorize('delete', $vendorOrder);
        $vendorOrder->delete();
        return back()->with('success', 'Order item deleted successfully');
    }


    public function export(Request $request)
    {
        $this->authorize('export', VendorOrder::class);

        return Excel::download(
            new VendorOrdersExport(auth()->user()),
            'vendor-orders.xlsx'
        );
    }
}