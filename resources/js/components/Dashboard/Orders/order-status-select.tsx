import { router } from '@inertiajs/react';
import toastr from 'toastr';
import { ORDER_FLOW_ADMIN } from '../Shared/orderStatusFlow';
interface Props {
    orderId: number;
    status: string;
    disabled?: boolean;
}

export default function OrderStatusSelect({ orderId, status, disabled = false }: Props) {
    const allowedStatuses = ORDER_FLOW_ADMIN[status] || [];

    const update = (newStatus: string) => {
        router.put(
            route('dashboard.orders.update', orderId),
            {
                status: newStatus,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    toastr.success(`Order status updated to ${newStatus}`);
                },

                onError: () => {
                    toastr.error('Failed to update order status');
                },
            },
        );
    };

    const statusBadge = 'rounded-md bg-gray-200 px-2 py-1 text-xs font-medium capitalize text-gray-800 dark:bg-gray-700 dark:text-gray-100';

    if (disabled) {
        return <span className={statusBadge}>{status}</span>;
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className={statusBadge}>{status}</span>

            {allowedStatuses.map((s) => (
                <button
                    key={s}
                    onClick={() => update(s)}
                    className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/70"
                >
                    {s}
                </button>
            ))}
        </div>
    );
}
