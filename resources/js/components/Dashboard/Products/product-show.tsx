import BackButton from '../Shared/back-button';

type Props = {
    product: any;
    backRoute?: string;
};

export default function Show({ product, backRoute }: Props) {
    const totalStock = product.variants?.length > 0 ? product.variants.reduce((sum, v) => sum + Number(v.stock || 0), 0) : Number(product.stock || 0);
    return (
        <div className="space-y-6 rounded-xl border bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900">
            {/* Top Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">{product.name}</h1>

                {backRoute && <BackButton routeName={backRoute} className="w-full sm:w-auto" />}
            </div>

            {/* Main Layout */}
            <div className="grid gap-6 lg:grid-cols-4">
                {/* Image Section */}
                <div className="rounded-2xl bg-white p-0 shadow-lg lg:col-span-2 lg:p-6 dark:bg-gray-900">
                    <img
                        src={product.image ? `/storage/${product.image}` : '/placeholder.png'}
                        alt={product.name}
                        title={product.name}
                        className="h-[300px] w-full rounded-xl object-cover"
                    />

                    {/* Description */}
                    <div className="mt-6">
                        <h2 className="mb-2 text-lg font-semibold text-gray-700 dark:text-white">Description</h2>
                        <p className="leading-relaxed text-gray-600 dark:text-gray-400">{product.description || 'No description available'}</p>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-4 lg:col-span-2">
                    {/* Store Card */}
                    <div className="rounded-xl border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-sm text-gray-500 dark:text-white">Store</p>
                        <p className="text-lg font-semibold dark:text-white">{product.store?.name || 'N/A'}</p>
                    </div>
                    {/* Price Card */}
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-700 dark:bg-green-900/20">
                        <p className="text-sm text-gray-500 dark:text-white">Price</p>
                        <p className="text-2xl font-bold text-green-600">${Number(product.price || 0).toFixed(2)}</p>
                    </div>

                    {/* Stock Card */}
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20">
                        <p className="text-sm text-gray-500 dark:text-white">Stock</p>
                        <p className="text-xl font-semibold dark:text-white">{totalStock}</p>
                    </div>
                    <div className="rounded-xl border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-sm text-gray-500 dark:text-white">Categories</p>

                        <div className="mt-2 flex flex-wrap gap-2">
                            {product.categories?.length > 0 ? (
                                product.categories.map((cat) => (
                                    <span key={cat.id} className="rounded-full bg-gray-200 px-3 py-1 text-sm dark:bg-gray-700 dark:text-white">
                                        {cat.name}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">No categories</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Variants */}
            <div className="rounded-xl border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-white">Variants</p>

                {product.variants?.length > 0 ? (
                    <div className="mt-2 space-y-4">
                        {product.variants.map((v: any, index: number) => (
                            <div key={index} className="rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                                {/* Variant Image */}
                                {v.image && (
                                    <div className="mb-3">
                                        <img
                                            src={`/storage/${v.image}`}
                                            alt={`Variant ${index}`}
                                            className="h-24 w-24 rounded-lg object-cover"
                                        />
                                    </div>
                                )}

                                {/* Attributes */}
                                <div className="flex flex-wrap gap-2">
                                    {v.attributes &&
                                        Object.entries(v.attributes).map(([key, value]: any) => (
                                            <span key={key} className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                                                {key}: {value}
                                            </span>
                                        ))}
                                </div>

                                {/* SKU, Price, Stock */}
                                <div className="mt-2 text-xs text-gray-500">SKU: {v.sku}</div>

                                <div className="text-xs text-gray-500">
                                    Price: ${v.price} | Stock: {v.stock}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">No variants</p>
                )}
            </div>
        </div>
    );
}
