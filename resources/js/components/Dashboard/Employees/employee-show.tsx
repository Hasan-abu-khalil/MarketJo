import BackButton from '../Shared/back-button';

export default function Show({ employee, backRoute }) {
    return (
        <div className="space-y-6   rounded-xl border bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900 ">
            {/* TOP BAR */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">{employee.user?.name}</h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Employee details</p>
                </div>

                {backRoute && <BackButton routeName={backRoute} className="w-full sm:w-auto" />}
            </div>

            {/* MAIN GRID */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* EMAIL */}
                <div className="rounded-xl border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-white">Email</p>
                    <p className="text-lg font-semibold dark:text-white">{employee.user?.email}</p>
                </div>

                {/* SCOPE */}
                <div className="rounded-xl border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-white">Scope</p>
                    <p className="text-lg font-semibold dark:text-white">{employee.scope}</p>
                </div>

                {/* STORES */}
                <div className="rounded-xl border bg-gray-50 p-4 md:col-span-2 dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-white">Stores</p>
                    <p className="text-lg font-semibold dark:text-white">
                        {employee.stores?.length ? employee.stores.map((s) => s.name).join(', ') : 'N/A'}
                    </p>
                </div>

                {/* PERMISSIONS */}
                <div className="rounded-xl border bg-gray-50 p-4 md:col-span-2 dark:border-gray-700 dark:bg-gray-800">
                    <p className="mb-2 text-sm text-gray-500 dark:text-white">Permissions</p>

                    <div className="flex flex-wrap gap-2 ">
                        {employee.permissions.map((p) => (
                            <span key={p.id} className="rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-500">
                                {p.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
