<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VendorOrderCreatedNotification extends Notification
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
            'title' => 'New order received',
            'order_item_id' => $this->vendorOrder->order_item_id,
            'quantity' => $this->vendorOrder->quantity,
            'price' => $this->vendorOrder->price,
            'status' => $this->vendorOrder->status,
        ];
    }
}
