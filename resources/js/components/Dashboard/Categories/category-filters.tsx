import { Link } from '@inertiajs/react';
export default function CategoryFilters({ search, setSearch, storeId, setStoreId, stores, permissions, }) {
    return (
        <section className="mt-2 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-wrap items-center gap-3">
                    {/* SEARCH */}
                    <input
                        className="w-60 rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="search"
                    />

                    {/* STORE FILTER (ADMIN + VENDOR) */}
                    {stores && (
                        <select
                            className="w-60 rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            value={storeId ?? ''}
                            onChange={(e) => setStoreId(e.target.value)}
                        >
                            <option value="">All Stores</option>

                            {stores.map((store) => (
                                <option key={store.id} value={store.id}>
                                    {store.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

               {permissions.create && (
                    <Link href={route('dashboard.categories.create')} className="rounded-lg bg-black px-4 py-2 text-white dark:bg-gray-600">
                        + Add Category
                    </Link>
                )}
            </div>
        </section>
    );
}
