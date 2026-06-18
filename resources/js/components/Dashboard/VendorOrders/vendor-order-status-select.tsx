import { router } from '@inertiajs/react';
import toastr from 'toastr';
import { ORDER_FLOW_VENDOR } from '../Shared/vendorOrderStatusFlow';
interface Props {
    vendorOrderId: number;
    status: string;
}

export default function VendorOrderStatusSelect({ vendorOrderId, status }: Props) {
    const allowedStatuses = ORDER_FLOW_VENDOR[status] || [];

    const update = (newStatus: string) => {
        router.put(
            route('dashboard.vendor-orders.update', vendorOrderId),
            {
                status: newStatus,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    toastr.success(`Vendor order status updated to ${newStatus}`);
                },

                onError: () => {
                    toastr.error('Failed to update vendor order status');
                },
            },
        );
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Current Status */}
            <span className="rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800 capitalize dark:bg-gray-700 dark:text-gray-100">
                {status}
            </span>

            {/* Available Actions */}
            {allowedStatuses.map((s) => (
                <button
                    key={s}
                    onClick={() => update(s)}
                    className="rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:hover:bg-purple-900/70"
                >
                    {s}
                </button>
            ))}
        </div>
    );
}
