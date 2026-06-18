import { Link } from '@inertiajs/react';
import { Download, FileText, Upload } from 'lucide-react';
import { useRef } from 'react';
export default function ProductFilters({
    search,
    setSearch,
    category,
    setCategory,
    categories,

    isActive,
    setIsActive,

    stockStatus,
    setStockStatus,

    role,
    permissions,
    onImport,
}) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
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

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">All Categories</option>

                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                        <button
                            onClick={() => setIsActive(null)}
                            className={`rounded-md px-3 py-1 text-sm ${isActive === null ? 'bg-white shadow dark:bg-gray-900' : ''}`}
                        >
                            All
                        </button>

                        <button
                            onClick={() => setIsActive(1)}
                            className={`rounded-md px-3 py-1 text-sm ${isActive === 1 ? 'bg-green-600 text-white shadow' : ''}`}
                        >
                            Active
                        </button>

                        <button
                            onClick={() => setIsActive(0)}
                            className={`rounded-md px-3 py-1 text-sm ${isActive === 0 ? 'bg-red-600 text-white shadow' : ''}`}
                        >
                            InActive
                        </button>
                    </div>
                </div>

                <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                    <button
                        onClick={() => setStockStatus('')}
                        className={`rounded-md px-3 py-1 text-sm ${stockStatus === '' ? 'bg-white shadow dark:bg-gray-900' : ''}`}
                    >
                        All Stock
                    </button>

                    <button
                        onClick={() => setStockStatus('low')}
                        className={`rounded-md px-3 py-1 text-sm ${stockStatus === 'low' ? 'bg-yellow-500 text-white' : ''}`}
                    >
                        Low
                    </button>

                    <button
                        onClick={() => setStockStatus('almost')}
                        className={`rounded-md px-3 py-1 text-sm ${stockStatus === 'almost' ? 'bg-orange-500 text-white' : ''}`}
                    >
                        Almost Empty
                    </button>

                    <button
                        onClick={() => setStockStatus('available')}
                        className={`rounded-md px-3 py-1 text-sm ${stockStatus === 'available' ? 'bg-green-600 text-white' : ''}`}
                    >
                        In Stock
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {/* Export */}
                    {permissions?.export && (
                        <a
                            href={route('dashboard.products.export')}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-600 text-white"
                        >
                            <Download className="h-3 w-3" />
                        </a>
                    )}

                    {/* Template */}
                    {permissions?.template && (
                        <a
                            href={route('dashboard.products.template')}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700"
                            title="Download Template"
                        >
                            <FileText className="h-3 w-3" />
                        </a>
                    )}
                    {/* Import */}
                    {permissions?.import && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 text-white"
                        >
                            <Upload className="h-3 w-3" />
                        </button>
                    )}

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                                console.log('Selected file:', file);
                                onImport(file);
                            }

                            // ✅ IMPORTANT FIX
                            e.target.value = '';
                        }}
                    />

                    {permissions.create && (
                        <Link href={route('dashboard.products.create')} className="rounded-lg bg-black px-4 py-2 text-white dark:bg-gray-600">
                            + Add Product
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
