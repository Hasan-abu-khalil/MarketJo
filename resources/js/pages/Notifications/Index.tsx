import Pagination from '@/components/Front/Shared/Pagination';
import FrontLayout from '@/layouts/FrontLayout';
import { router } from '@inertiajs/react';
import { Bell, CheckCircle } from 'lucide-react';

export default function Index({ notifications }) {
    const markAsRead = (id) => {
        router.patch(route('notifications.read', id));
    };

    const markAll = () => {
        router.patch(route('notifications.readAll'));
    };

    console.log(notifications.data);
    

    return (
        <FrontLayout>
            <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-5xl">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3 sm:items-center">
                            <div className="rounded-md bg-orange-100 p-3">
                                <Bell className="h-5 w-5 text-orange-600 sm:h-6 sm:w-6" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Notifications</h1>
                                <p className="text-sm text-slate-500">Stay updated with your latest activity</p>
                            </div>
                        </div>

                        <button
                            onClick={markAll}
                            className="w-full rounded-md bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-400 sm:w-auto"
                        >
                            Mark All Read
                        </button>
                    </div>

                    {/* List */}
                    <div className="space-y-3 sm:space-y-4">
                        {notifications.data.length > 0 ? (
                            notifications.data.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`group rounded-md border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5 ${
                                        !notification.read_at ? 'border-orange-200 ring-1 ring-blue-100' : 'border-slate-200'
                                    }`}
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        {/* Left */}
                                        <div className="flex gap-3 sm:gap-4">
                                            <div
                                                className={`mt-1 h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3 ${
                                                    notification.read_at ? 'bg-slate-300' : 'bg-orange-500'
                                                }`}
                                            />

                                            <div>
                                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                                    <h3 className="text-sm font-semibold text-slate-800 sm:text-base">{notification.data.title}</h3>

                                                    {!notification.read_at && (
                                                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                                                            New
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="space-y-1 text-xs text-slate-600 sm:text-sm">
                                                    {notification.data.order_id && (
                                                        <p>
                                                            <strong>Order:</strong> #{notification.data.order_id}
                                                        </p>
                                                    )}
                                                    {notification.data.total && (
                                                        <p>
                                                            <strong>Total:</strong> ${notification.data.total}
                                                        </p>
                                                    )}
                                                    {notification.data.status && (
                                                        <p>
                                                            <strong>Status:</strong> {notification.data.status}
                                                        </p>
                                                    )}
                                                    {notification.data.store_name && (
                                                        <p>
                                                            <strong>Store:</strong> {notification.data.store_name}
                                                        </p>
                                                    )}
                                                    {notification.data.quantity && (
                                                        <p>
                                                            <strong>Quantity:</strong> {notification.data.quantity}
                                                        </p>
                                                    )}
                                                    {notification.data.price && (
                                                        <p>
                                                            <strong>Price:</strong> ${notification.data.price}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Button */}
                                        {!notification.read_at && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="flex w-full items-center justify-center gap-2 rounded-md bg-orange-50 px-3 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-100 sm:w-auto"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                Read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12">
                                <Bell className="mx-auto mb-4 h-10 w-10 text-slate-300 sm:h-12 sm:w-12" />

                                <h3 className="mb-2 text-base font-semibold text-slate-700 sm:text-lg">No notifications</h3>

                                <p className="text-sm text-slate-500">You're all caught up 🎉</p>
                            </div>
                        )}
                    </div>
                    {/* PAGINATION  */}
                    <Pagination links={notifications.links} />
                </div>
            </div>
        </FrontLayout>
    );
}
