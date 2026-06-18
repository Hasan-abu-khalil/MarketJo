import { Link } from '@inertiajs/react';

export default function UserFilters({ search, setSearch, setRole, role, permissions }) {
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
                    <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                        <button
                            onClick={() => setRole(null)}
                            className={`rounded-md px-3 py-1 text-sm ${role === null ? 'bg-white shadow dark:bg-gray-900' : ''}`}
                        >
                            All
                        </button>

                        <button
                            onClick={() => setRole('vendor')}
                            className={`rounded-md px-3 py-1 text-sm ${role === 'vendor' ? 'bg-blue-600 text-white shadow' : ''}`}
                        >
                            Vendor
                        </button>

                        <button
                            onClick={() => setRole('customer')}
                            className={`rounded-md px-3 py-1 text-sm ${role === 'customer' ? 'bg-green-600 text-white shadow' : ''}`}
                        >
                            Customer
                        </button>
                    </div>
                </div>

                {permissions?.create && (
                    <Link href={route(`dashboard.users.create`)} className="rounded-lg bg-black px-4 py-2 text-white dark:bg-gray-600">
                        + Add User
                    </Link>
                )}
            </div>
        </section>
    );
}
