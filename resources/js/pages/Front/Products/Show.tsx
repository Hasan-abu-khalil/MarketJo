import FrontLayout from '@/Layouts/FrontLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import toastr from 'toastr';

export default function Show({ product, auth }) {
    const [selectedOptions, setSelectedOptions] = useState({});

    const isVariantProduct = product.variants?.length > 0;

    // extract options
    const colors = [...new Set(product.variants.map((v) => v.attributes?.Color).filter(Boolean))];
    const sizes = [...new Set(product.variants.map((v) => v.attributes?.Size).filter(Boolean))];

    // find matched variant
    const matchedVariant = product.variants.find((v) => {
        return Object.entries(selectedOptions).every(([key, value]) => {
            return v.attributes?.[key] === value;
        });
    });

    const activeVariant = matchedVariant || null;

    const selectedColor = selectedOptions.Color;
    const selectedSize = selectedOptions.Size;

    const previewVariant =
        activeVariant ||
        (selectedColor ? product.variants.find((variant) => variant.attributes?.Color === selectedColor) : null) ||
        (selectedSize ? product.variants.find((variant) => variant.attributes?.Size === selectedSize) : null) ||
        null;

    const currentPrice = activeVariant?.price ?? product.price;
    const currentStock = activeVariant?.stock ?? product.stock;

    const isSelectionComplete = !isVariantProduct || ((colors.length ? selectedOptions.Color : true) && (sizes.length ? selectedOptions.Size : true));

    // Get the image to display - show base image first, switch to variant image only after selection
    const hasSelection = Boolean(selectedOptions.Color || selectedOptions.Size);
    const displayImage = hasSelection && previewVariant?.image
        ? `/storage/${previewVariant.image}`
        : product.image
        ? `/storage/${product.image}`
        : '/placeholder.png';

    return (
        <FrontLayout>
            <div className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                    {/* PRODUCT IMAGE (AMAZON STYLE) */}
                    <div className="border border-gray-200 bg-white p-4">
                        <img
                            src={displayImage}
                            alt={product.name}
                            className="h-[350px] w-full object-contain sm:h-[500px] lg:h-[600px]"
                        />
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="flex flex-col">
                        {/* STORE */}
                        <label className="text-xs tracking-wide text-gray-500 ">Store Name</label>
                        <p className="mt-1  text-gray-900 ">{product.store?.name}</p>

                        {/* TITLE */}
                        <label className="mt-4 text-xs tracking-wide text-gray-500 ">Product Name</label>
                        <h1 className=" text-2xl font-normal text-gray-900">{product.name}</h1>

                        {/* RATING (Amazon style mock) */}
                        <div className="mt-2 flex items-center gap-2 text-sm">
                            <span className="text-yellow-500">★★★★★</span>
                            <span className="text-blue-600">(123 ratings)</span>
                        </div>

                        {/* PRICE BLOCK */}
                        <div className="mt-4 border-t border-b border-gray-200 py-4">
                            <p className="text-3xl font-bold text-black">${currentPrice}</p>

                            <p className="mt-1 text-sm text-gray-500">Free delivery available</p>
                        </div>

                        {/* STOCK */}
                        <div className="mt-4">
                            {currentStock > 0 ? <p className="text-green-600">In Stock</p> : <p className="text-red-600">Out of Stock</p>}
                        </div>

                        {/* VARIANTS */}
                        {/* SIZE */}
                        {sizes.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold">Size</h4>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() =>
                                                setSelectedOptions((prev) => ({
                                                    ...prev,
                                                    Size: size,
                                                }))
                                            }
                                            className={`rounded border px-3 py-1 text-xs ${
                                                selectedOptions.Size === size ? 'bg-black text-white' : ''
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* COLOR */}
                        {colors.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold">Color</h4>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() =>
                                                setSelectedOptions((prev) => ({
                                                    ...prev,
                                                    Color: color,
                                                }))
                                            }
                                            className={`rounded border px-3 py-1 text-xs ${
                                                selectedOptions.Color === color ? 'bg-black text-white' : ''
                                            }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ACTION BOX  */}
                        <div className="mt-6 border border-gray-200 bg-gray-50 p-4">
                            <p className="mt-1 text-sm text-gray-600">Fast delivery & secure checkout</p>

                            <button
                                disabled={currentStock <= 0 || !isSelectionComplete}
                                onClick={() => {
                                    if (isVariantProduct && !activeVariant) {
                                        toastr.error('Please select size and color');
                                        return;
                                    }

                                    router.post(
                                        `/cart/add/${product.id}`,
                                        {
                                            variant_id: activeVariant?.id ?? null,
                                            
                                        },
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                            onSuccess: () => toastr.success('Added to cart 🛒'),
                                            onError: () => toastr.error('Failed to add product'),
                                        },
                                    );
                                }}
                                className={`mt-4 w-full rounded-full py-2 text-sm font-semibold transition ${
                                    currentStock <= 0 || !isSelectionComplete
                                        ? 'cursor-not-allowed bg-gray-300'
                                        : 'cursor-pointer bg-yellow-400 text-black hover:bg-yellow-500'
                                }`}
                            >
                                {currentStock <= 0 ? 'Out of Stock' : isVariantProduct && !isSelectionComplete ? 'Select Variant' : 'Add to Cart'}
                            </button>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="mt-8">
                            <h3 className="text-sm font-bold text-gray-900">About this item</h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600">{product.description}</p>
                        </div>

                        {/* EXTRA INFO */}
                        <div className="mt-8 border-t pt-4">
                            <p className="text-sm text-gray-600">
                                Availability:
                                <span className="ml-2 font-medium text-gray-900">{currentStock > 0 ? 'In stock' : 'Unavailable'}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
