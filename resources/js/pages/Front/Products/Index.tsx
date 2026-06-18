import ProductCard from '@/components/Front/product/productCard';
import Pagination from '@/components/Front/Shared/Pagination';
import useAutoRefresh from '@/hooks/useAutoRefresh';
import FrontLayout from '@/Layouts/FrontLayout';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Index({ products, stores, categories, filters, auth }) {
         useAutoRefresh(['products']);
         useAutoRefresh(['stores']);
         useAutoRefresh(['categories']);

    
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStore, setSelectedStore] = useState(filters.store || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    const applyFilters = (override = {}) => {
        router.get(
            route('products.index'),
            {
                search,
                store: selectedStore,
                category: selectedCategory,
                ...override,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleStore = (storeSlug) => {
        setSelectedStore(storeSlug);
        setSelectedCategory('');

        applyFilters({
            store: storeSlug,
            category: '',
        });
    };

    const handleCategory = (catSlug) => {
        setSelectedCategory(catSlug);

        applyFilters({
            category: catSlug,
        });
    };

    const filteredCategories = selectedStore
        ? categories.filter((c) => {
              const store = stores.find((s) => s.slug === selectedStore);
              return store ? c.store_id === store.id : true;
          })
        : [];

    return (
        <FrontLayout>
            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* HEADER */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">All Products</h1>
                    <p className="text-sm text-gray-500">Discover products from all stores</p>
                </div>

                {/* SEARCH + FILTER ROW (CLEAN AMAZON-LIKE TOOLBAR) */}
                <div className="mb-6 flex flex-col gap-3">
                    {/* SEARCH */}
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearch(value);

                            setSelectedStore('');
                            setSelectedCategory('');
                        }}
                        placeholder="Search products..."
                        className="w-full rounded-md border border-gray-400 px-4 py-2 outline-none focus:border-orange-500 lg:w-1/2"
                    />
                    <button
                        onClick={() => {
                            setSearch('');
                            setSelectedStore('');
                            setSelectedCategory('');

                            router.get(
                                route('products.index'),
                                {
                                    search: '',
                                    store: '',
                                    category: '',
                                },
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true,
                                },
                            );
                        }}
                        className="w-fit rounded-md bg-orange-500 px-3 py-2 text-xs text-white transition hover:bg-orange-400"
                    >
                        Reset Filters
                    </button>

                    {/* STORE FILTER */}
                    <h1 className="text-lg font-bold text-gray-800">Stores</h1>
                    <div className="flex gap-2 overflow-x-auto pb-5 md:flex-wrap md:gap-2 md:overflow-visible md:pb-0">
                        <button
                            onClick={() => {
                                setSelectedStore('');
                                setSelectedCategory('');

                                applyFilters({
                                    store: '',
                                    category: '',
                                });
                            }}
                            className={`rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition ${
                                !selectedStore ? 'border-orange-500 bg-orange-500 text-white' : 'bg-white hover:bg-gray-100'
                            }`}
                        >
                            All Stores
                        </button>

                        {stores.map((store) => (
                            <button
                                key={store.id}
                                onClick={() => handleStore(store.slug)}
                                className={`rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition ${
                                    selectedStore === store.slug ? 'border-orange-500 bg-orange-500 text-white' : 'bg-white hover:bg-gray-100'
                                }`}
                            >
                                {store.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CATEGORY FILTER (ONLY SHOW WHEN STORE SELECTED) */}
                <h1 className="my-3 text-lg font-bold text-gray-800">Categories</h1>

                {selectedStore && (
                    <div className="mb-6 flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible">
                        <button
                            onClick={() => {
                                setSelectedCategory('');
                                applyFilters({ category: '' });
                            }}
                            className={`rounded-full border px-3 py-1 text-xs whitespace-nowrap transition ${
                                !selectedCategory ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                            }`}
                        >
                            All Categories
                        </button>

                        {filteredCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategory(category.slug)}
                                className={`rounded-full border px-3 py-1 text-xs whitespace-nowrap transition ${
                                    selectedCategory === category.slug ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* PRODUCTS card */}
                {products.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-gray-500">No products found</div>
                )}

                {/* PAGINATION */}
                <Pagination links={products.links} />
            </div>
        </FrontLayout>
    );
}
