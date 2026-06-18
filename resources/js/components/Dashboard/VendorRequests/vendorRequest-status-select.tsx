import { router } from '@inertiajs/react';
import toastr from 'toastr';

interface Props {
    vendorRequestId: number;
    status: string;
    isActive: boolean;
}

export default function VendorRequestStatusActions({ vendorRequestId, status, isActive }: Props) {
    const updateStatus = (newStatus: string) => {
        
        router.put(
            route('dashboard.vendor-requests.update', vendorRequestId),
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toastr.success(`Request marked as ${newStatus}`);
                },
            },
        );
    };

    if (!isActive) {
        return <span className="text-xs text-gray-400">Finalized</span>;
    }

    return (
        <div className="flex gap-2">
            <button onClick={() => updateStatus('approved')} className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700">
                Approve
            </button>

            <button onClick={() => updateStatus('rejected')} className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700">
                Reject
            </button>

            {/* <button onClick={() => updateStatus('pending')} className="rounded bg-gray-600 px-3 py-1 text-xs text-white hover:bg-gray-700">
                Reset
            </button> */}
        </div>
    );
}
