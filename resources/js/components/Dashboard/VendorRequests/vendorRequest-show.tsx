import BackButton from '../Shared/back-button';
import VendorRequestStatusSelect from './vendorRequest-status-select';

type Props = {
    vendorRequest: any;
    backRoute?: string;
    
};

export default function Show({ vendorRequest, backRoute }: Props) {
    return (
        <div className="space-y-6 rounded-xl border bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900">
            {/* Top Bar */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Title */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">Vendor Request Details</h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage and review vendor request information</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {vendorRequest.can.update ? (
                        <VendorRequestStatusSelect
                            vendorRequestId={vendorRequest.id}
                            status={vendorRequest.status}
                            isActive={vendorRequest.is_active}
                        />
                    ) : (
                        <span className="capitalize">{vendorRequest.status}</span>
                    )}

                    {backRoute && <BackButton routeName={backRoute} className="w-full sm:w-auto" />}
                </div>
            </div>

            {/* Main Card */}
            <div className="flex items-center gap-4 border-b pb-6 dark:border-gray-700">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-bold dark:bg-gray-700">
                    {vendorRequest.user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h2 className="text-lg font-semibold">{vendorRequest.user.name}</h2>
                    <p className="text-sm text-gray-500">{vendorRequest.user.email}</p>

                    <span className="mt-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                        {vendorRequest.status}
                    </span>
                </div>
            </div>

            {/* Info section */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-sm text-gray-500">Store Name</p>
                    <p className="font-medium">{vendorRequest.store_name}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">message</p>
                    <p className="font-medium">{vendorRequest.message}</p>
                </div>
            </div>
        </div>
    );
}
