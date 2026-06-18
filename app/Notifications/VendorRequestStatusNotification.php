<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VendorRequestStatusNotification extends Notification
{
    use Queueable;

    public function __construct(public $request)
    {
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Vendor request updated',
            'status' => $this->request->status,
            'store_name' => $this->request->store_name,
        ];
    }
}