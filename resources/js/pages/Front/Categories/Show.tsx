import ProductItemCard from '@/components/Front/Product/ProductItemCard';
import Pagination from '@/components/Front/Shared/Pagination';
import useAutoRefresh from '@/hooks/useAutoRefresh';
import FrontLayout from '@/layouts/FrontLayout';
import { Link } from '@inertiajs/react';

export default function Show({ category, products }) {
    useAutoRefresh(['categories']);
    useAutoRefresh(['products']);

    return (
        <FrontLayout>
            <div className="mx-auto max-w-7xl px-4 py-10">
                {/* HEADER (AMAZON STYLE SIMPLE) */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>

                        <p className="mt-1 text-sm text-gray-500">Browse products in this category</p>
                    </div>

                    {/* BACK BUTTON */}
                    <Link
                        href={route('categories.index')}
                        className="inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        ← Back
                    </Link>
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

                        <p className="mt-2 text-sm text-gray-500">This category does not contain products yet.</p>
                    </div>
                )}

                {/* PAGINATION (clean amazon style) */}
                <Pagination links={products.links} />
            </div>
        </FrontLayout>
    );
}
