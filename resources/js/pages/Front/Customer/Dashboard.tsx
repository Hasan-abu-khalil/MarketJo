import Pagination from '@/components/Front/Shared/Pagination';
import FrontLayout from '@/layouts/FrontLayout';
import { Link, router, useForm } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard({ user, orders }) {
    const [localOrders, setLocalOrders] = useState(orders.data);

    const { post, processing } = useForm();

    const cancelOrder = (id) => {
        setLocalOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o)));

        post(route('orders.cancel', id), {
            preserveScroll: true,
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';

            case 'paid':
                return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200';

            case 'shipped':
                return 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200';

            case 'completed':
                return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';

            case 'cancelled':
                return 'bg-red-50 text-red-700 ring-1 ring-red-200';

            default:
                return 'bg-gray-50 text-gray-700 ring-1 ring-gray-200';
        }
    };

    return (
        <FrontLayout>
            <div className="min-h-screen bg-gray-50">
                {/* HEADER */}
                <div className="border-b bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Hello, {user.name}</h1>

                        <p className="mt-1 text-sm text-gray-500">Manage your orders and account information</p>
                    </div>
                </div>

                {/* MAIN LAYOUT */}
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
                    {/* SIDEBAR */}
                    <div className="space-y-6">
                        {/* PROFILE CARD */}
                        <div className="rounded-md bg-white p-6 shadow-sm ring-1 ring-gray-100">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-bold text-white dark:bg-gray-700">
                                {user.name.charAt(0).toUpperCase()}
                            </div>

                            <div className="mt-4">
                                <p className="text-base font-semibold text-gray-900">{user.name}</p>

                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                        </div>

                        {/* MENU */}
                        <div className="rounded-2md bg-white p-4 shadow-sm ring-1 ring-gray-100">
                            <p className="px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">Account</p>

                            <div className="mt-3 space-y-1 text-sm">
                                <Link
                                    href={route('account.orders')}
                                    className="block cursor-pointer rounded-md bg-orange-50 px-3 py-2 font-medium text-orange-500"
                                >
                                    Your Orders
                                </Link>

                                <Link
                                    href={route('account.security')}
                                    className="block cursor-pointer rounded-md px-3 py-2 text-gray-600 hover:bg-gray-50"
                                >
                                    Login & Security
                                </Link>
                                <Link
                                    href={route('vendor-requests.index')}
                                    className="block cursor-pointer rounded-md px-3 py-2 text-gray-600 hover:bg-gray-50"
                                >
                                    Become a Vendor
                                </Link>
                                <Link
                                    href="/logout"
                                    className="group flex items-center justify-center gap-2 rounded-md border bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-600"
                                >
                                    Logout
                                    <LogOut size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ORDERS */}
                    <div className="space-y-6 lg:col-span-3">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Your Orders</h2>

                            <p className="text-sm text-gray-500">A history of all your purchases</p>
                        </div>

                        {/* EMPTY */}
                        {localOrders.length === 0 && (
                            <div className="rounded-md bg-white px-6 py-20 text-center shadow-sm">
                                <div className="text-6xl">📦</div>

                                <h2 className="mt-5 text-2xl font-bold text-gray-700 sm:text-3xl">You have no orders yet.</h2>

                                <p className="mt-3 text-gray-500">Try placing an order to see it here.</p>
                            </div>
                        )}

                        {/* ORDERS LIST */}
                        {localOrders.map((order) => (
                            <div
                                key={order.id}
                                className="overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
                            >
                                {/* HEADER */}
                                <div className="grid grid-cols-1 gap-5 border-b px-4 py-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Order #{order.id}
                                            <p className="my-2">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </p>

                                        <p className="mt-1 text-lg font-semibold text-gray-900">${Number(order.total_price).toFixed(2)}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400">STATUS</p>

                                        <span className={`rounded-md px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400">ORDER #</p>

                                        <p className="mt-1 text-sm font-medium text-gray-900">{order.id}</p>
                                    </div>

                                    {/* SHIPPING */}
                                    <div className="sm:col-span-2 lg:col-span-4">
                                        <p className="text-xs text-gray-400">SHIPPING</p>

                                        <div className="mt-2 grid gap-2 text-sm text-gray-900 sm:grid-cols-3">
                                            <p>
                                                <span className="font-medium">Phone:</span> {order.shipping_phone}
                                            </p>

                                            <p>
                                                <span className="font-medium">City:</span> {order.shipping_city}
                                            </p>

                                            <p>
                                                <span className="font-medium">Place:</span> {order.shipping_place}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ITEMS */}
                                <div className="space-y-5 px-4 py-5 sm:px-6">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-6">
                                            <img
                                                src={
                                                    item.variant?.image
                                                        ? `/storage/${item.variant.image}`
                                                        : item.product?.image
                                                          ? `/storage/${item.product.image}`
                                                          : '/placeholder.png'
                                                }
                                                className="h-16 w-16 rounded-md object-cover"
                                            />

                                            <div className="flex-1">
                                                <p className="font-semibold">{item.display_name}</p>

                                                {item.variant_label && <p className="text-xs text-gray-500">{item.variant_label}</p>}

                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-semibold">${Number(item.line_total).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* ACTIONS */}
                                <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                    <button
                                        onClick={() => router.visit(route('orders.show', order.id))}
                                        className="text-left text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        View details
                                    </button>

                                    {(order.status === 'pending' || order.status === 'paid') && (
                                        <button
                                            disabled={processing}
                                            onClick={() => cancelOrder(order.id)}
                                            className="rounded-md border border-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                                        >
                                            Cancel order
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* PAGINATION */}
                        <Pagination links={orders.links} />
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
