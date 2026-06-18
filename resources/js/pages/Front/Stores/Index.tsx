import Pagination from '@/components/Front/Shared/Pagination';
import StoreCard from '@/components/Front/Store/StoreCard';
import useAutoRefresh from '@/hooks/useAutoRefresh';
import FrontLayout from '@/Layouts/FrontLayout';

export default function Index({ stores }) {
        useAutoRefresh(['stores']);
    
    return (
        <FrontLayout>
            <div className="mx-auto max-w-7xl px-4 py-10">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Stores</h1>

                    <p className="mt-1 text-sm text-gray-500">Browse all marketplace stores</p>
                </div>

                {/* STORES GRID (AMAZON STYLE) */}
                {stores.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {stores.data.map((store) => (
                            <StoreCard key={store.id} store={store} variant="grid" />
                        ))}
                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="border border-gray-200 bg-white py-20 text-center">
                        <div className="text-5xl">🏪</div>

                        <h2 className="mt-4 text-xl font-semibold text-gray-800">No stores found</h2>

                        <p className="mt-2 text-sm text-gray-500">Try changing filters or search keywords.</p>
                    </div>
                )}

                {/* PAGINATION (unchanged logic, cleaner look) */}
                <Pagination links={stores.links} />
            </div>
        </FrontLayout>
    );
}
