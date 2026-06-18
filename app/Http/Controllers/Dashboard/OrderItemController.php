<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderItemController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request)
    {

        $this->authorize('viewAny', OrderItem::class);
        $user = auth()->user();
        $ownerId = $user->ownerId();


        $search = $request->input('search');

        $orderItems = OrderItem::query()
            ->with(['order.user', 'product.store', 'variant'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {

                    $q->whereHas('product', function ($p) use ($search) {
                        $p->where('name', 'like', "%{$search}%");
                    })

                        ->orWhereHas('order.user', function ($u) use ($search) {
                            $u->where('name', 'like', "%{$search}%");
                        })

                        ->orWhere('quantity', $search)
                        ->orWhere('quantity', 'like', "%{$search}%");

                });
            })

            ->when(auth()->user()->role !== 'admin', function ($q) {
                $q->whereHas('product.store', function ($store) {
                    $store->where('user_id', auth()->id());
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $orderItems->getCollection()->transform(function ($item) {
            $item->can = [
                'show' => auth()->user()->can('show', $item),
                'delete' => auth()->user()->can('delete', $item),
            ];

            return $item;
        });

        return Inertia::render('Dashboard/OrderItems/Index', [
            'orderItems' => $orderItems,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function show(OrderItem $orderItem)
    {
        $this->authorize('show', $orderItem);
        return Inertia::render('Dashboard/OrderItems/Show', [
            'orderItem' => $orderItem->load('order.user', 'product.store', 'variant'),
        ]);
    }

    public function destroy(OrderItem $orderItem)
    {
        $this->authorize('delete', $orderItem);
        $orderItem->delete();
        return back()->with('success', 'Order item deleted successfully');
    }

}
