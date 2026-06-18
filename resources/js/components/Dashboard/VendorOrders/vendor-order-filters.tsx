import { Download } from 'lucide-react';

export default function OrderFilters({ search, setSearch, status, setStatus,permissions  }) {
    const statuses = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];

    return (
        <section className="mt-2 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                {/* SEARCH */}
                <input
                    className="w-60 rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="search"
                />

                {/* STATUS FILTERS */}
                <div className="flex gap-3 ">
                    {/* Export */}
                   {permissions?.export && (
                        <a
                            href={route('dashboard.vendor-orders.export')}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white transition hover:bg-green-700"
                            title="Export Excel"
                        >
                            <Download className="h-4 w-4" />
                        </a>
                    )}
                    <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                        <button
                            onClick={() => setStatus('')}
                            className={`rounded-md px-3 py-1 text-sm transition ${
                                status === '' ? 'bg-white shadow dark:bg-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'
                            }`}
                        >
                            All
                        </button>

                        {statuses.map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatus(s)}
                                className={`rounded-md px-3 py-1 text-sm capitalize transition ${
                                    status === s ? getColor(s) : 'text-gray-600 dark:text-gray-300'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function getColor(status: string) {
    switch (status) {
        case 'pending':
            return 'bg-yellow-500 text-white shadow';
        case 'processing':
            return 'bg-blue-600 text-white shadow';
        case 'shipped':
            return 'bg-purple-600 text-white shadow';
        case 'completed':
            return 'bg-green-600 text-white shadow';
        case 'cancelled':
            return 'bg-red-600 text-white shadow';
        default:
            return 'bg-white';
    }
}
