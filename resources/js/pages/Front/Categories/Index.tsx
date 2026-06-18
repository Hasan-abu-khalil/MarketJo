import CategoryCard from '@/components/Front/Category/CategoryCard';
import Pagination from '@/components/Front/Shared/Pagination';
import useAutoRefresh from '@/hooks/useAutoRefresh';
import FrontLayout from '@/Layouts/FrontLayout';

export default function Index({ categories }) {
    useAutoRefresh(['categories']);
    useAutoRefresh(['products']);

    return (
        <FrontLayout>
            <div className="mx-auto max-w-7xl px-4 py-10">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>

                    <p className="mt-1 text-sm text-gray-500">Browse all marketplace categories</p>
                </div>

                {/* CATEGORIES GRID (AMAZON STYLE) */}
                {categories.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {categories.data.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="border border-gray-200 bg-white py-20 text-center">
                        <div className="text-5xl">📂</div>

                        <h2 className="mt-4 text-xl font-semibold text-gray-800">No categories found</h2>

                        <p className="mt-2 text-sm text-gray-500">Categories will appear here once available.</p>
                    </div>
                )}

                {/* PAGINATION  */}
                <Pagination links={categories.links} />
            </div>
        </FrontLayout>
    );
}
