import { Button } from '@/components/ui/button';
import { router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toastr from 'toastr';

import BackButton from '../Shared/back-button';

type Props = {
    submitRoute: string;
    method?: 'post' | 'put';
    product?: any;
    stores: any[];
    categories: any[];
    redirectRoute?: string;
    backRoute?: string;
};

export default function FormProduct({ submitRoute, method = 'post', product, stores, categories, redirectRoute, backRoute }: Props) {
    const getInitialAttributes = () => {
        if (!product?.variants?.length) return {};

        const attrs: any = {};

        product.variants.forEach((variant: any) => {
            Object.entries(variant.attributes || {}).forEach(([key, value]) => {
                if (!attrs[key]) attrs[key] = [];
                if (!attrs[key].includes(value)) {
                    attrs[key].push(value);
                }
            });
        });

        return attrs;
    };

    const { data, setData, post, processing, errors } = useForm({
        store_id: product?.store_id || '',
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        stock: product?.stock || '',
        image: null as any,
        categories: product?.categories?.map((c: any) => c.id) || [],
        attributes: getInitialAttributes(),
    });

    const [preview, setPreview] = useState(product?.image ? `/storage/${product.image}` : null);

    const filteredCategories = categories.filter((c: any) => Number(c.store_id) === Number(data.store_id));
    const [variantStocks, setVariantStocks] = useState<any>({});
    const [colorImages, setColorImages] = useState<any>({});
    const [colorImagePaths, setColorImagePaths] = useState<any>({});
    const [colorImagePreviews, setColorImagePreviews] = useState<any>({});

    // =========================
    // ATTRIBUTE HELPERS
    // =========================

    const addAttributeValue = (key: string, value: string) => {
        if (!value) return;

        setData('attributes', {
            ...data.attributes,
            [key]: [...(data.attributes?.[key] || []), value],
        });
    };

    const removeAttributeValue = (key: string, value: string) => {
        setData('attributes', {
            ...data.attributes,
            [key]: data.attributes[key].filter((v: string) => v !== value),
        });
    };

    const generateVariants = () => {
        const sizes = data.attributes?.Size || [];
        const colors = data.attributes?.Color || [];

        const variants: any[] = [];

        if (sizes.length && colors.length) {
            sizes.forEach((size) => {
                colors.forEach((color) => {
                    const key = `${size}-${color}`;

                    variants.push({
                        key,
                        Size: size,
                        Color: color,
                    });
                });
            });
        }

        return variants;
    };

    useEffect(() => {
        if (!product?.variants?.length) return;

        const initial: any = {};
        const imagePaths: any = {};
        const imagePreviews: any = {};
        if (product?.image) {
            setPreview(`/storage/${product.image}`);
        }
        product.variants.forEach((v: any) => {
            const key = `${v.attributes.Size}-${v.attributes.Color}`;
            initial[key] = v.stock;

            const color = v.attributes?.Color || v.attributes?.color;
            if (color && v.image && !imagePaths[color]) {
                imagePaths[color] = v.image;
                imagePreviews[color] = `/storage/${v.image}`;
            }
        });

        setVariantStocks(initial);
        setColorImagePaths(imagePaths);
        setColorImagePreviews(imagePreviews);
    }, [product]);

    const handleColorImageChange = (color: string, file: File | null) => {
        setColorImages({
            ...colorImages,
            [color]: file,
        });

        if (file) {
            setColorImagePreviews({
                ...colorImagePreviews,
                [color]: URL.createObjectURL(file),
            });
        }
    };

    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const hasVariants = (data.attributes?.Size?.length || 0) > 0 && (data.attributes?.Color?.length || 0) > 0;

        const payload: any = {
            ...data,
            attributes: data.attributes,
            variants: JSON.stringify(variantStocks),
            color_image_paths: colorImagePaths,
            color_images: colorImages,
        };

        // ✅ IMPORTANT FIX: only send stock if NO variants
        if (!hasVariants) {
            payload.stock = data.stock;
        }
        if (!data.image) {
            delete payload.image;
        }
        if (method === 'put' && product?.id) {
            router.post(
                route(submitRoute, product.id),
                {
                    ...payload,
                    _method: 'put',
                },
                {
                    forceFormData: true,
                    onSuccess: () => {
                        toastr.success('Updated successfully');
                        if (redirectRoute) router.get(route(redirectRoute));
                    },
                },
            );

            return;
        }

        router.post(route(submitRoute), payload, {
            forceFormData: true,
            onSuccess: () => {
                toastr.success('Created successfully');
            },
        });
    };

    const inputClass =
        'w-full rounded-lg border px-3 py-2 text-sm ' +
        'bg-white text-gray-900 border-gray-300 ' +
        'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 ' +
        'focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-500';

    const errorClass = 'text-sm text-red-500 mt-1';

    return (
        <div className="space-y-6 rounded-xl border bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900">
            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">{product ? 'Edit Product' : 'Create Product'}</h1>
                </div>

                {backRoute && <BackButton routeName={backRoute} className="w-full sm:w-auto" />}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* STORE */}
                <div>
                    <label>Store</label>
                    <select
                        value={data.store_id}
                        onChange={(e) => {
                            setData('store_id', e.target.value);
                            setData('categories', []);
                        }}
                        className={inputClass}
                    >
                        <option value="">Select Store</option>
                        {stores.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                    {errors.store_id && <p className={errorClass}>{errors.store_id}</p>}
                </div>

                {/* NAME */}
                <div>
                    <label>Name</label>
                    <input className={inputClass} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                    {errors.name && <p className={errorClass}>{errors.name}</p>}
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label>Description</label>
                    <textarea className={inputClass} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                    {errors.description && <p className={errorClass}>{errors.description}</p>}
                </div>

                {/* PRICE + STOCK */}
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="number"
                        className={inputClass}
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        placeholder="Price"
                    />
                    {!data.attributes?.Size?.length && !data.attributes?.Color?.length && (
                        <input
                            type="number"
                            className={inputClass}
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            placeholder="Stock"
                        />
                    )}
                </div>
                {errors.stock && <p className={errorClass}>{errors.stock}</p>}

                {errors.price && <p className={errorClass}>{errors.price}</p>}

                {/* CATEGORIES */}

                <div>
                    <label>Categories</label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {filteredCategories.map((c) => (
                            <label key={c.id} className="flex items-center gap-2 rounded border p-2 dark:border-gray-700">
                                <input
                                    type="checkbox"
                                    checked={data.categories.includes(Number(c.id))}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setData('categories', [...data.categories, Number(c.id)]);
                                        } else {
                                            setData(
                                                'categories',
                                                data.categories.filter((id: number) => id !== Number(c.id)),
                                            );
                                        }
                                    }}
                                />
                                {c.name}
                            </label>
                        ))}
                    </div>
                    {errors.categories && <p className={errorClass}>{errors.categories}</p>}
                </div>

                {/* IMAGE */}
                <div>
                    <label>
                        Product Image <span className="text-red-500"> *</span>
                    </label>
                    <input
                        type="file"
                        onChange={(e: any) => {
                            const file = e.target.files[0];
                            setData('image', file);
                            if (file) setPreview(URL.createObjectURL(file));
                        }}
                    />
                    {preview && (
                        <div className="space-y-2">
                            <img src={preview} className="h-24 w-24 rounded object-cover" />

                            <p className="text-sm text-gray-500">Leave empty if you don’t want to change image</p>
                        </div>
                    )}
                </div>
                {errors.image && <p className={errorClass}>{errors.image}</p>}

                {/* VARIANTS */}
                {data.attributes?.Size?.length > 0 && data.attributes?.Color?.length > 0 && (
                    <div className="mt-4 space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold">Variant Images (by color)</h3>
                            {data.attributes?.Color?.map((color: string) => (
                                <div key={color} className="flex items-center gap-3 py-2">
                                    <span className="w-40 text-sm">{color}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e: any) => {
                                            const file = e.target.files[0] ?? null;
                                            handleColorImageChange(color, file);
                                        }}
                                    />
                                    {colorImagePreviews[color] && (
                                        <img src={colorImagePreviews[color]} className="h-20 w-20 rounded object-cover" alt={`${color} preview`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold">Variant Stock</h3>
                            {generateVariants().map((v) => (
                                <div key={v.key} className="flex items-center gap-3">
                                    <span className="w-40 text-sm">
                                        {v.Size} - {v.Color}
                                    </span>
                                    <input
                                        type="number"
                                        className={inputClass}
                                        placeholder="Stock"
                                        value={variantStocks[v.key] || ''}
                                        onChange={(e) =>
                                            setVariantStocks({
                                                ...variantStocks,
                                                [v.key]: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-4 rounded-lg border p-4">
                    <h2 className="text-lg font-semibold dark:text-white">Variants (optional)</h2>
                    {/* SIZE */}
                    <div>
                        <label>Sizes</label>

                        <div className="flex flex-wrap gap-2">
                            {(data.attributes?.Size || []).map((size: string) => (
                                <span key={size} className="my-3 flex gap-2 rounded bg-gray-500 px-2 py-1">
                                    {size}
                                    <button type="button" onClick={() => removeAttributeValue('Size', size)}>
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>

                        <input
                            className={inputClass}
                            placeholder="Add size + Enter"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addAttributeValue('Size', e.currentTarget.value.trim());
                                    e.currentTarget.value = '';
                                }
                            }}
                        />
                    </div>

                    {/* COLOR */}
                    <div>
                        <label>Colors</label>

                        <div className="flex flex-wrap gap-2">
                            {(data.attributes?.Color || []).map((color: string) => (
                                <span key={color} className="my-3 flex gap-2 rounded bg-blue-500 px-2 py-1">
                                    {color}
                                    <button type="button" onClick={() => removeAttributeValue('Color', color)}>
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>

                        <input
                            className={inputClass}
                            placeholder="Add color + Enter"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addAttributeValue('Color', e.currentTarget.value.trim());
                                    e.currentTarget.value = '';
                                }
                            }}
                        />
                    </div>

                    <p className="text-xs text-gray-500">Variants will be auto-generated (Size × Color)</p>
                </div>

                {/* SUBMIT */}
                <Button disabled={processing} className="w-full">
                    {product ? 'Update Product' : 'Create Product'}
                </Button>
            </form>
        </div>
    );
}
