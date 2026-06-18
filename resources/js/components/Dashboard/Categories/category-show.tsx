import BackButton from '../Shared/back-button';

export default function Show({ category, stores, backRoute }) {
    return (
        <div className="space-y-6 rounded-xl border bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900">
            {/* Top Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">{category.name}</h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Category details</p>
                </div>

                {backRoute && <BackButton routeName={backRoute} className="w-full sm:w-auto" />}
            </div>
            {/* Main Layout */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-white">Store</p>
                    <p className="text-lg font-semibold dark:text-white">{category.store ? category.store.name : 'N/A'}</p>
                </div>
                <div className="rounded-xl border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-white">Category Name</p>
                    <p className="text-lg font-semibold dark:text-white">{category.name}</p>
                </div>
            </div>
        </div>
    );
}
