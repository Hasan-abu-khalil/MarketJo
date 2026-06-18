import ProductItemCard from '@/components/Front/Product/ProductItemCard';
import Pagination from '@/components/Front/Shared/Pagination';
import useAutoRefresh from '@/hooks/useAutoRefresh';
import FrontLayout from '@/layouts/FrontLayout';
import { Link } from '@inertiajs/react';

export default function Show({ store, products }) {
    useAutoRefresh(['stores']);
    useAutoRefresh(['products']);

    return (
        <FrontLayout>
            <div className="mx-auto max-w-7xl px-4 py-10">
                {/* STORE HEADER (AMAZON STYLE SIMPLE BANNER) */}
                <div className="border border-gray-200 bg-white">
                    {/* IMAGE */}
                    <div className="border-b border-gray-200">
                        <img
                            src={store.logo ? `/storage/${store.logo}` : '/placeholder.png'}
                            alt={store.name}
                            className="h-56 w-full object-contain sm:h-72 lg:h-96"
                        />
                    </div>

                    {/* INFO */}
                    <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">{store.name}</h1>

                            <p className="mt-2 max-w-2xl text-sm text-gray-600">{store.description}</p>
                        </div>

                        {/* BACK BUTTON */}
                        <Link
                            href={route('stores.index')}
                            className="inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            ← Back to Stores
                        </Link>
                    </div>
                </div>

                {/* PRODUCTS HEADER */}
                <div className="mt-10 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Products</h2>

                    <p className="text-sm text-gray-500">Items available in this store</p>
                </div>

                {/* PRODUCTS */}
                {products.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {products.data.map((product) => (
                            <ProductItemCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="border border-gray-200 bg-white py-20 text-center">
                        <div className="text-5xl">📦</div>

                        <h2 className="mt-4 text-xl font-semibold text-gray-800">No products found</h2>

                        <p className="mt-2 text-sm text-gray-500">This store does not have products yet.</p>
                    </div>
                )}

                {/* PAGINATION */}
                <Pagination links={products.links} />
            </div>
        </FrontLayout>
    );
}
