import BackButton from '../Shared/back-button';
import VendorOrderStatusSelect from './vendor-order-status-select';

export default function VendorOrderShow({ vendorOrder, backRoute }) {
    

    return (
        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-900">
            {/* HEADER */}
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Vendor Order #{vendorOrder.id}</h2>

                        <div className="mt-2">
                            <VendorOrderStatusSelect vendorOrderId={vendorOrder.id} status={vendorOrder.status} />
                        </div>

                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Created: {new Date(vendorOrder.created_at).toLocaleString()}</p>
                    </div>

                    {backRoute && <BackButton routeName={backRoute} className="w-full sm:w-auto" />}
                </div>
            </div>

            {/* CUSTOMER + SHIPPING */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-2 font-semibold">Customer</h3>

                    <p>Name: {vendorOrder.order.user.name}</p>

                    <p className="text-gray-600 dark:text-gray-400">
                        <span className="text-black dark:text-white">Email:</span> {vendorOrder.order.user.email}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-2 font-semibold">Shipping</h3>

                    <p className="text-gray-600 dark:text-white">Phone: {vendorOrder.order.shipping_phone}</p>

                    <p className="text-gray-600 dark:text-white">City: {vendorOrder.order.shipping_city}</p>

                    <p className="text-gray-600 dark:text-white">Place: {vendorOrder.order.shipping_place}</p>
                </div>
            </div>

            {/* PRODUCT */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 font-semibold">Product</h3>

                <div className="felx felx-col sm:flex sm:justify-between">
                    <div>
                        <p className="font-medium">Store: {vendorOrder.store.name}</p>
                        <p className="font-medium"> Name: {vendorOrder.order_item.product.name}</p>
                        <p>
                            Variant:{' '}
                            {vendorOrder.order_item?.variant_label ? (
                                <span className="text-sm text-gray-600 dark:text-white">{vendorOrder.order_item.variant_label}</span>
                            ) : (
                                <span className="text-sm text-gray-400 dark:text-gray-500">No variant</span>
                            )}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-white">Qty: {vendorOrder.quantity}</p>
                    </div>

                    <div className="">
                        <p>Price</p>{' '}
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">${Number(vendorOrder.price).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* PRODUCT IMAGE */}
            <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <img
                    src={
                        vendorOrder.order_item?.variant?.image
                            ? `/storage/${vendorOrder.order_item.variant.image}`
                            : vendorOrder.order_item?.product?.image
                              ? `/storage/${vendorOrder.order_item.product.image}`
                              : '/placeholder.png'
                    }
                    alt={vendorOrder.order_item.product.name}
                    className="h-40 w-40 rounded-xl border border-gray-200 object-cover shadow dark:border-gray-600"
                />
            </div>
        </div>
    );
}
