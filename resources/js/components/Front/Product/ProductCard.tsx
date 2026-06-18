import { Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import toastr from 'toastr';

export default function ProductCard({ product }) {
    const [selectedOptions, setSelectedOptions] = useState({});

    const variants = product.variants || [];

    const attributeKeys = useMemo(() => {
        const keys = new Set();

        variants.forEach((variant) => {
            Object.keys(variant.attributes || {}).forEach((key) => {
                keys.add(key);
            });
        });

        return [...keys];
    }, [variants]);

    const getValuesForAttribute = (attribute) => {
        return [...new Set(variants.map((v) => v.attributes?.[attribute]).filter(Boolean))];
    };

    const matchedVariant = variants.find((variant) => {
        return Object.entries(selectedOptions).every(([key, value]) => variant.attributes?.[key] === value);
    });

    const activeVariant = matchedVariant || null;

    const selectedColor = selectedOptions.Color;
    const selectedSize = selectedOptions.Size;

    const previewVariant =
        activeVariant ||
        (selectedColor ? variants.find((variant) => variant.attributes?.Color === selectedColor) : null) ||
        (selectedSize ? variants.find((variant) => variant.attributes?.Size === selectedSize) : null) ||
        null;

    const isVariantProduct = variants.length > 0;

    const isSelectionComplete = !isVariantProduct || attributeKeys.every((key) => !!selectedOptions[key]);

    const currentPrice = activeVariant?.price ?? product.price;

    const currentStock = activeVariant?.stock ?? product.stock;

    // Get display image: use selected variant image first, otherwise fallback to base or first variant image
    const firstVariant = variants.length > 0 ? variants[0] : null;
    const hasSelection = Boolean(selectedColor || selectedSize);
    const displayImage = hasSelection && previewVariant?.image
        ? `/storage/${previewVariant.image}`
        : product.image
        ? `/storage/${product.image}`
        : firstVariant?.image
        ? `/storage/${firstVariant.image}`
        : '/placeholder.png';

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isVariantProduct && !isSelectionComplete) {
            toastr.error('Please select all options');
            return;
        }

        if (currentStock <= 0) {
            toastr.error('Out of stock');
            return;
        }

        router.post(
            `/cart/add/${product.id}`,
            {
                variant_id: activeVariant?.id ?? null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toastr.success('Added to cart 🛒');

                    router.reload({
                        only: ['cartCount'],
                    });
                },
                onError: () => {
                    toastr.error('Failed to add product');
                },
            },
        );
    };

    return (
        <div className="flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white p-3 transition hover:shadow-md">
            <Link href={route('products.show', product.slug)}>
                <img
                    src={displayImage}
                    alt={product.name}
                    className="h-48 w-full object-contain rounded-md"
                />
            </Link>

            <h2 className="mt-2 line-clamp-2 text-sm text-gray-900">{product.name}</h2>

            <p className="mt-1 text-xs text-gray-500">{product.store?.name}</p>

            <div className="mt-1 text-xs text-yellow-500">
                ★★★★★ <span className="text-gray-500">(123)</span>
            </div>
            <div className="mt-2 text-xs">
                {currentStock <= 0 ? <span className="text-red-600">Out of stock</span> : <span className="text-green-600">In stock</span>}
            </div>

            <p className="mt-2 text-lg font-bold text-orange-500">${currentPrice}</p>
            <div className="mt-3 h-32 rounded-md bg-gray-50 p-2">
                {attributeKeys.length > 0 ? (
                    <div className="h-full overflow-y-auto pr-1">
                        {attributeKeys.map((attribute) => (
                            <div key={attribute} className="mb-3">
                                <div className="mb-1 text-[11px] font-semibold text-gray-500 uppercase">{attribute}</div>

                                <div className="flex flex-wrap gap-1">
                                    {getValuesForAttribute(attribute).map((value) => (
                                        <button
                                            key={`${attribute}-${value}`}
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();

                                                setSelectedOptions((prev) => ({
                                                    ...prev,
                                                    [attribute]: value,
                                                }));
                                            }}
                                            className={`rounded-md border px-2 py-1 text-[10px] transition ${
                                                selectedOptions[attribute] === value
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-300 bg-white hover:bg-gray-100'
                                            }`}
                                        >
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">No variants</div>
                )}
            </div>

            <button
                disabled={currentStock <= 0 || !isSelectionComplete}
                onClick={handleAddToCart}
                className={`mt-3 rounded-md px-3 py-2 text-xs font-semibold ${
                    currentStock <= 0 || !isSelectionComplete
                        ? 'cursor-not-allowed bg-gray-400 text-white'
                        : 'cursor-pointer bg-[#ffd814] text-black hover:bg-[#f7ca00]'
                }`}
            >
                {currentStock <= 0 ? 'Out of Stock' : isVariantProduct && !isSelectionComplete ? 'Select Variant' : 'Add to Cart'}
            </button>
        </div>
    );
}
