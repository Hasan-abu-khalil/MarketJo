<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\OrderStatusService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $this->authorize('viewAny', Order::class);
        $user = auth()->user();

        $search = $request->input('search');
        $status = $request->input('status');

        $orders = Order::query()
            ->with(['user', 'vendorOrders.vendor', 'vendorOrders.store'])
            ->when($request->search, function ($q, $search) {
                $q->whereHas(
                    'user',
                    fn($u) =>
                    $u->where('name', 'like', "%$search%")
                );
            })
            ->when($request->status, function ($q, $status) {
                $q->where('status', $status);
            })

            ->when(!($user->isAdminEmployee() || $user->role === 'admin'), function ($q) use ($user) {

                if ($user->isVendorEmployee()) {
                    $storeIds = $user->employee->stores()->pluck('stores.id');

                    $q->whereHas('vendorOrders', function ($v) use ($storeIds) {
                        $v->whereIn('store_id', $storeIds);
                    });

                } elseif ($user->role === 'vendor') {
                    $q->whereHas('vendorOrders', function ($v) use ($user) {
                        $v->where('vendor_id', $user->id);
                    });
                }
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

        return Inertia::render('Dashboard/Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                "status" => $status,
            ],
            'permissions' => [
                'view' => auth()->user()->can('viewAny', Order::class),
            ],
        ]);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        $order->can = [
            'view' => auth()->user()->can('view', $order),
            'update' => auth()->user()->can('update', $order),
            'delete' => auth()->user()->can('delete', $order),
        ];

        return Inertia::render('Dashboard/Orders/Show', [
            'order' => $order->load([
                'user',
                'vendorOrders.vendor',
                'vendorOrders.store',
                'items.product.store',
                'items.vendorOrder',
            ]),
        ]);
    }

    public function update(Request $request, Order $order, OrderStatusService $service)
    {
        $this->authorize('update', $order);
        $request->validate([
            'status' => 'required|string'
        ]);

        $service->updateOrderStatus(
            $order,
            $request->status,
            auth()->user()
        );

        return back();
    }

    public function destroy(Order $order)
    {
        $this->authorize('delete', $order);

        $order->delete();

        return back()->with('success', 'Order deleted');
    }
}