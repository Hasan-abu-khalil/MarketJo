<?php

namespace App\Http\Controllers;

use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        return Inertia::render('Notifications/Index', [
            'notifications' => auth()->user()
                ->notifications()
                ->latest()
                ->paginate(10),
        ]);
    }

    public function markAsRead(DatabaseNotification $notification)
    {
        abort_if(
            $notification->notifiable_id !== auth()->id(),
            403
        );

        $notification->markAsRead();

        return back();
    }

    public function markAllAsRead()
    {
        auth()->user()
            ->unreadNotifications
            ->markAsRead();

        return back();
    }
}