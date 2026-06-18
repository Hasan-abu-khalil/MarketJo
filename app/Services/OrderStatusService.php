<?php

namespace App\Services;

use App\Models\Order;
use App\Models\User;
use App\Models\VendorOrder;
use Illuminate\Validation\ValidationException;

class OrderStatusService
{
    /*
    =====================================
    ADMIN UPDATE ORDER STATUS
    =====================================
    */
    public function updateOrderStatus(Order $order, string $newStatus, User $user)
    {
        $allowed = $this->getAdminFlow($order->status);

        if (!in_array($newStatus, $allowed)) {
            throw ValidationException::withMessages([
                'status' => 'Invalid status transition'
            ]);
        }

        if (!($user->role === 'admin' || $user->isAdminEmployee())) {
            throw ValidationException::withMessages([
                'status' => 'Unauthorized'
            ]);
        }

        $order->status = $newStatus;
        $order->save();

        $this->syncVendorOrders($order, $newStatus);

        return $order;
    }

    /*
    =====================================
    VENDOR UPDATE VENDOR ORDER STATUS
    =====================================
    */
    public function updateVendorOrderStatus(VendorOrder $vendorOrder, string $newStatus)
    {
        $allowed = $this->getVendorFlow($vendorOrder->status);

        if (!in_array($newStatus, $allowed)) {
            throw ValidationException::withMessages([
                'status' => 'Invalid status transition'
            ]);
        }

        $vendorOrder->status = $newStatus;
        $vendorOrder->save();

        // 🔥 OPTIONAL: update main order automatically
        $this->recalculateOrderStatus($vendorOrder->order);

        return $vendorOrder;
    }

    /*
    =====================================
    SYNC ALL VENDOR ORDERS
    =====================================
    */
    private function syncVendorOrders(Order $order, string $status)
    {
        VendorOrder::where('order_id', $order->id)
            ->update([
                'status' => $status
            ]);
    }

    /*
    =====================================
    AUTO UPDATE ORDER FROM VENDOR STATUS
    =====================================
    */
    private function recalculateOrderStatus(Order $order)
    {
        $statuses = $order->vendorOrders()->pluck('status')->unique();

        if ($statuses->count() === 1) {
            $order->status = $statuses->first();
            $order->save();
        }
    }

    /*
    =====================================
    FLOWS
    =====================================
    */
    private function getAdminFlow($status)
    {
        return [
            'pending' => ['processing', 'cancelled'],
            'processing' => ['shipped', 'cancelled'],
            'shipped' => ['completed'],
            'completed' => [],
            'cancelled' => [],
        ][$status] ?? [];
    }

    private function getVendorFlow($status)
    {
        return [
            'pending' => ['processing', 'cancelled'],
            'processing' => ['shipped', 'cancelled'],
            'shipped' => ['completed'],
            'completed' => [],
            'cancelled' => [],
        ][$status] ?? [];
    }
}