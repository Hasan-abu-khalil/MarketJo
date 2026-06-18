import FrontLayout from '@/layouts/FrontLayout';
import { Link } from '@inertiajs/react';

export default function OrderShow({ order }) {
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

    const subtotal = order.items.reduce((t, i) => t + Number(i.line_total ?? i.price * i.quantity), 0);

    return (
        <FrontLayout>
            <div className="min-h-screen bg-gray-50">
                {/* HEADER */}
                <div className="border-b bg-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Order #{order.id}</h1>

                            <p className="mt-1 text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>

                        <Link
                            href={route('account.orders')}
                            className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                            ← Back
                        </Link>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-6 sm:px-6 lg:grid-cols-3 lg:px-8">
                    {/* LEFT */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* ORDER STATUS */}
                        <div className="rounded-md  bg-white p-6 shadow-sm ring-1 ring-gray-100">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Order Status</p>

                                    <span
                                        className={`mt-2 inline-flex items-center rounded-md l px-3 py-1 text-sm font-medium capitalize ${getStatusColor(
                                            order.status,
                                        )}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-500">{order.items.length} item(s)</div>
                            </div>
                        </div>

                        {/* ITEMS */}
                        <div className="rounded-md  bg-white shadow-sm ring-1 ring-gray-100">
                            <div className="border-b px-6 py-5">
                                <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
                            </div>

                            <div className="divide-y">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex flex-col gap-5 p-6 sm:flex-row">
                                        {/* IMAGE */}
                                        <img
                                            src={
                                                item.variant?.image
                                                    ? `/storage/${item.variant.image}`
                                                    : item.product?.image
                                                      ? `/storage/${item.product.image}`
                                                      : '/placeholder.png'
                                            }
                                            alt={item.product?.name}
                                            className="h-24 w-24 rounded-md bg-gray-100 object-cover ring-1 ring-gray-200"
                                        />

                                        {/* INFO */}
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <h3 className="text-base font-semibold text-gray-900">{item.product?.name}</h3>
                                                {item.variant?.attributes && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {Object.entries(item.variant.attributes)
                                                            .map(([k, v]) => `${k}: ${v}`)
                                                            .join(' / ')}
                                                    </p>
                                                )}

                                                <p className="mt-2 text-sm text-gray-500">Quantity: {item.quantity}</p>

                                                <p className="mt-1 text-sm text-gray-500">Price per item: ${Number(item.price).toFixed(2)}</p>
                                            </div>

                                            <div className="mt-4">
                                                <p className="text-base font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-6">
                        {/* SHIPPING */}
                        <div className="rounded-md  bg-white p-6 shadow-sm ring-1 ring-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Shipping Information</h2>

                            <div className="mt-5 space-y-4 text-sm">
                                <div>
                                    <p className="text-gray-400">Phone</p>

                                    <p className="mt-1 font-medium text-gray-900">{order.shipping_phone}</p>
                                </div>

                                <div>
                                    <p className="text-gray-400">City</p>

                                    <p className="mt-1 font-medium text-gray-900">{order.shipping_city}</p>
                                </div>

                                <div>
                                    <p className="text-gray-400">Place</p>

                                    <p className="mt-1 font-medium text-gray-900">{order.shipping_place}</p>
                                </div>
                            </div>
                        </div>

                        {/* SUMMARY */}
                        <div className="rounded-md  bg-white p-6 shadow-sm ring-1 ring-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

                            <div className="mt-5 space-y-4 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Subtotal</span>

                                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Shipping</span>

                                    {/* <span className="font-medium text-gray-900">${Number(order.shipping_price).toFixed(2)}</span> */}
                                    <span className="font-medium text-gray-900">$000</span>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-semibold text-gray-900">Total</span>

                                        <span className="text-lg font-bold text-gray-900">${Number(order.total_price).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
