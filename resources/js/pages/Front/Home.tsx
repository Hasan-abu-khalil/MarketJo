import CategoryCard from '@/components/Front/Category/CategoryCard';
import ProductCard from '@/components/Front/Product/ProductCard';
import StoreCard from '@/components/Front/Store/StoreCard';
import useAutoRefresh from '@/hooks/useAutoRefresh';
import FrontLayout from '@/layouts/FrontLayout';
import { Link, router } from '@inertiajs/react';
import { useEffect } from 'react';
export default function Home({ categories, stores, products, auth, hasActiveRequest, latestRequest }) {
    useAutoRefresh(['products']);
    useAutoRefresh(['stores']);
    useAutoRefresh(['categories']);
    useAutoRefresh(['vendorRequests']);

    useEffect(() => {
        router.reload({ only: ['cartCount'] });
    }, []);
    return (
        <FrontLayout>
            <div className="min-h-screen bg-gray-200 text-gray-900">
                {/* TOP HERO BAR (Amazon-style utility header section) */}
                <section className="bg-[#131921] text-white">
                    <div className="mx-auto max-w-7xl px-4 py-10">
                        <h1 className="text-3xl font-bold">Hello, welcome to your marketplace</h1>
                        <p className="mt-2 text-sm text-gray-300">Find the best deals across multiple stores</p>

                        {/* Vendor CTA (logic unchanged) */}
                        <div className="mt-5">
                            {!auth?.user ? (
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-md bg-[#ffd814] px-4 py-2 text-sm font-semibold text-black hover:bg-[#f7ca00]"
                                >
                                    Login to become a vendor
                                </Link>
                            ) : hasActiveRequest ? (
                                latestRequest?.status === 'pending' ? (
                                    <span className="inline-block rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-black">
                                        Vendor request pending
                                    </span>
                                ) : latestRequest?.status === 'approved' ? (
                                    <span className="inline-block rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white">
                                        You are already a vendor
                                    </span>
                                ) : (
                                    <Link
                                        href={route('vendor-requests.index')}
                                        className="inline-block rounded-md bg-white px-4 py-2 text-sm font-semibold text-black"
                                    >
                                        Apply again
                                    </Link>
                                )
                            ) : (
                                <Link
                                    href={route('vendor-requests.index')}
                                    className="inline-block rounded-md bg-[#ffd814] px-4 py-2 text-sm font-semibold text-black"
                                >
                                    Become a vendor
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
                    {/* LEFT SIDEBAR (Categories like Amazon) */}
                    <aside className="hidden w-64 flex-shrink-0 lg:block">
                        <div className="rounded-md bg-white p-4 shadow-sm">
                            <h2 className="mb-3 text-sm font-bold">Shop by Category</h2>

                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <CategoryCard key={category.id} category={category} variant="sidebar" />
                                ))}
                            </div>
                        </div>

                        {/* STORES MINI LIST */}
                        <div className="mt-4 rounded-md bg-white p-4 shadow-sm">
                            <h2 className="mb-3 text-sm font-bold">Top Stores</h2>

                            <div className="space-y-3">
                                {stores.map((store) => (
                                    <StoreCard key={store.id} store={store} variant="sidebar" />
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className="flex-1">
                        {/* PRODUCTS GRID HEADER */}
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold">Latest Products</h2>

                            <Link href={route('products.index')} className="text-sm text-blue-600 hover:underline">
                                See all deals
                            </Link>
                        </div>

                        {/* PRODUCTS card*/}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </main>
                </div>

                {/* STORES SECTION (Amazon-style horizontal cards) */}
                <section className="mx-auto max-w-7xl px-4 py-10">
                    <h2 className="mb-4 text-lg font-bold">Featured Stores</h2>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {stores.map((store) => (
                            <StoreCard key={store.id} store={store} variant="featured" />
                        ))}
                    </div>
                </section>
            </div>
        </FrontLayout>
    );
}
