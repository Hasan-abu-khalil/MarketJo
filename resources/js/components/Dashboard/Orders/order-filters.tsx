export default function OrderFilters({ search, setSearch, status, setStatus, role }) {
    return (
        <section className="mt-2 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        className="w-60 rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="search"
                    />
                </div>
                <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                    <button
                        onClick={() => setStatus('')}
                        className={`rounded-md px-3 py-1 text-sm transition ${
                            status === '' ? 'bg-white shadow dark:bg-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'
                        }`}
                    >
                        All
                    </button>

                    <button
                        onClick={() => setStatus('pending')}
                        className={`rounded-md px-3 py-1 text-sm transition ${
                            status === 'pending' ? 'bg-yellow-500 text-white shadow' : 'text-gray-600 dark:text-gray-300'
                        }`}
                    >
                        Pending
                    </button>

                    <button
                        onClick={() => setStatus('processing')}
                        className={`rounded-md px-3 py-1 text-sm transition ${
                            status === 'processing' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'
                        }`}
                    >
                        Processing
                    </button>

                    <button
                        onClick={() => setStatus('shipped')}
                        className={`rounded-md px-3 py-1 text-sm transition ${
                            status === 'shipped' ? 'bg-purple-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'
                        }`}
                    >
                        Shipped
                    </button>

                    <button
                        onClick={() => setStatus('completed')}
                        className={`rounded-md px-3 py-1 text-sm transition ${
                            status === 'completed' ? 'bg-green-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'
                        }`}
                    >
                        Completed
                    </button>

                    <button
                        onClick={() => setStatus('cancelled')}
                        className={`rounded-md px-3 py-1 text-sm transition ${
                            status === 'cancelled' ? 'bg-red-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'
                        }`}
                    >
                        Cancelled
                    </button>
                </div>
            </div>
        </section>
    );
}
