import BackButton from '../Shared/back-button';

type Props = {
    orderItem: any;
    backRoute?: string;
};

export default function Show({ orderItem, backRoute }: Props) {
    return (
        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-900">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">Order Item #{orderItem.id}</h1>

                {backRoute && <BackButton routeName={backRoute} className="w-full sm:w-auto" />}
            </div>

            {/* GRID */}
            <div className="grid gap-4 lg:grid-cols-2">
                {/* ORDER INFO */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Order Info</h2>

                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <p>
                            <span className="font-medium">Order ID:</span> #{orderItem.order.id}
                        </p>

                        <p>
                            <span className="font-medium">User:</span> {orderItem.order.user.name}
                        </p>
                    </div>
                </div>

                {/* PRODUCT INFO */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Product Info</h2>

                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <p>
                            <span className="font-medium">Name:</span> {orderItem.product.name}
                        </p>

                        <p>
                            <span className="font-medium">Store:</span> {orderItem.product.store.name}
                        </p>
                    </div>
                </div>
            </div>

            {/* DETAILS + IMAGE */}
            <div className="grid gap-4 lg:grid-cols-2">
                {/* DETAILS */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Product Details</h2>

                        <p>
                            <span className="font-medium">Quantity:</span> {orderItem.quantity}
                        </p>

                        <p>
                            <span className="font-medium">Price:</span> ${orderItem.price}
                        </p>

                        <p>
                            <span className="font-medium">Total:</span> ${(orderItem.price * orderItem.quantity).toFixed(2)}
                        </p>

                        <p>
                            {orderItem.variant_label ? (
                                <span className="text-sm">{orderItem.variant_label}</span>
                            ) : (
                                <span className="text-gray-400">No variant</span>
                            )}
                        </p>
                        <p>
                            <span className="font-medium">Created:</span> {new Date(orderItem.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* IMAGE */}
                <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <img
                        src={
                            orderItem.variant?.image
                                ? `/storage/${orderItem.variant.image}`
                                : orderItem.product?.image
                                  ? `/storage/${orderItem.product.image}`
                                  : '/placeholder.png'
                        }
                        alt={orderItem.product?.name}
                        className="h-40 w-40 rounded-xl border object-cover shadow"
                    />
                </div>
            </div>
        </div>
    );
}
