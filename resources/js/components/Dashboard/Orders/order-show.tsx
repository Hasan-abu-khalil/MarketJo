import BackButton from '../Shared/back-button';
import OrderStatusSelect from './order-status-select';

type Props = {
    order: any;
    backRoute?: string;
    role?: string;
};

export default function Show({ order, backRoute, role }: Props) {
    

    return (
        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order #{order.id}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Order details and tracking</p>
                    {order?.can?.update ? <OrderStatusSelect orderId={order.id} status={order.status} /> : <span>{order.status}</span>}
                </div>

                <div className="flex items-center gap-3">

                    {backRoute && <BackButton routeName={backRoute} />}
                </div>
            </div>

            {/* CUSTOMER */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Customer</h3>
                    <p className="text-gray-800 dark:text-gray-200">{order.user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.user.email}</p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Shipping</h3>
                    <p className="text-gray-800 dark:text-gray-200">{order.shipping_phone}</p>
                    <p className="text-gray-800 dark:text-gray-200">{order.shipping_city}</p>
                    <p className="text-gray-800 dark:text-gray-200">{order.shipping_place}</p>
                </div>
            </div>

            {/* ITEMS */}
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Items</h3>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 text-left dark:border-gray-700">
                            <th className="py-2 text-gray-700 dark:text-gray-300">Product</th>
                            <th className="py-2 text-gray-700 dark:text-gray-300">Store</th>
                            <th className="py-2 text-gray-700 dark:text-gray-300">Variant</th>
                            <th className="py-2 text-gray-700 dark:text-gray-300">Qty</th>
                            <th className="py-2 text-gray-700 dark:text-gray-300">Price</th>
                        </tr>
                    </thead>

                    <tbody>
                        {order.items.map((item: any) => (
                            <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                                <td className="py-3 text-gray-800 dark:text-gray-200">{item.product.name}</td>
                                <td className="py-3 text-gray-800 dark:text-gray-200">{item.product.store.name}</td>
                                <td className="py-3 text-gray-800 dark:text-gray-200">{item.variant_label || 'No variant'}</td>
                                <td className="py-3 text-gray-800 dark:text-gray-200">{item.quantity}</td>
                                <td className="py-3 text-gray-800 dark:text-gray-200">${(item.price * item.quantity).toFixed(2)}</td>
                                <td className="py-3">
                                    <span
                                        className={`rounded-md px-2 py-1 text-xs font-medium capitalize ${
                                            item.vendor_order?.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : item.vendor_order?.status === 'processing'
                                                  ? 'bg-blue-100 text-blue-700'
                                                  : item.vendor_order?.status === 'ready'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        {item.vendor_order?.status ?? 'N/A'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* TOTAL */}
            <div className="flex justify-end">
                <div className="w-full rounded-xl border border-gray-200 p-4 md:w-1/3 dark:border-gray-700">
                    <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Total</span>
                        <span className="font-bold text-green-600 dark:text-green-400">${Number(order.total_price).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
