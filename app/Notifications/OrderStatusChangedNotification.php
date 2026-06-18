<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OrderStatusChangedNotification extends Notification
{
    use Queueable;

    public function __construct(public $vendorOrder)
    {
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Order status updated',
            'order_id' => $this->vendorOrder->order_id,
            'vendor_order_id' => $this->vendorOrder->id,
            'status' => $this->vendorOrder->status,
            'message' => "Your order status changed to {$this->vendorOrder->status}",
        ];
    }
}