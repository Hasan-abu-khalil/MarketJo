import FrontLayout from '@/layouts/FrontLayout';
import { router } from '@inertiajs/react';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import toastr from 'toastr';

export default function Cart({ items, total, defaultAddress, auth }) {
    const outOfStockItems = items.filter((item) => (item.variant ? item.variant.stock <= 0 : item.product.stock <= 0));

    const invalidItems = items.filter((item) => item.quantity > (item.variant ? item.variant.stock : item.product.stock));

    const hasStockIssue = outOfStockItems.length > 0 || invalidItems.length > 0;

    const [form, setForm] = useState({
        phone: defaultAddress?.phone || '',
        city: defaultAddress?.city || '',
        place: defaultAddress?.place || '',
        save: false,
    });

    const [errors, setErrors] = useState({
        phone: '',
        city: '',
        place: '',
    });

    const validateForm = () => {
        const newErrors = {
            phone: '',
            city: '',
            place: '',
        };

        if (!form.phone.trim()) {
            newErrors.phone = 'Please enter your phone number';
        }

        if (!form.city.trim()) {
            newErrors.city = 'Please select your city';
        }

        if (!form.place.trim()) {
            newErrors.place = 'Please enter your delivery address';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((value) => !value);
    };

    const inertiaOptions = {
        preserveScroll: true,
        preserveState: true,
    };

    const jordanCities = ['Amman', 'Zarqa', 'Irbid', 'Aqaba', 'Madaba', 'Salt', 'Mafraq', 'Jerash', 'Karak', 'Tafilah', "Ma'an", 'Balqa'];

    return (
        <FrontLayout>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
                {/* TITLE */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                    <p className="text-sm text-gray-500">Review your items before checkout</p>
                </div>

                {/* EMPTY STATE */}
                {items.length === 0 && (
                    <div className="rounded-lg bg-white p-10 text-center shadow-sm">
                        <div className="text-6xl">🛒</div>
                        <h2 className="mt-4 text-2xl font-bold text-gray-800">Your cart is empty</h2>
                        <p className="mt-2 text-gray-500">Add some amazing products to get started.</p>
                    </div>
                )}

                {items.length > 0 && (
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* ITEMS */}
                        <div className="max-h-[70vh] space-y-5 overflow-y-auto lg:col-span-2">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-5 rounded-lg bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                                >
                                    {/* PRODUCT INFO */}
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.variant?.image ? `/storage/${item.variant.image}` : item.product.image ? `/storage/${item.product.image}` : '/placeholder.png'}
                                            alt={item.product.name}
                                            className="h-24 w-24 rounded-lg object-cover sm:h-28 sm:w-28"
                                        />

                                        <div>
                                            <h2 className="text-sm font-semibold text-gray-900">{item.product.name}</h2>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {item.variant?.attributes &&
                                                    Object.entries(item.variant.attributes).map(([key, value]) => (
                                                        <span key={key} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                                            {key}: {value}
                                                        </span>
                                                    ))}
                                            </div>
                                            <p className="text-xs text-gray-500">{item.product.store?.name}</p>
                                            <p className="mt-1 text-sm font-bold text-orange-500">${item.variant?.price ?? item.product.price}</p>
                                            {(item.variant ? item.variant.stock : item.product.stock) <= 0 ? (
                                                <span className="text-xs text-red-600">Out of Stock</span>
                                            ) : (
                                                <span className="text-xs text-green-600">In Stock</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* CONTROLS */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex border border-gray-300">
                                            <button
                                                onClick={() => router.put(`/cart/${item.id}`, { quantity: item.quantity - 1 }, inertiaOptions)}
                                                disabled={item.quantity <= 1}
                                                className="h-8 w-8 cursor-pointer bg-gray-100 disabled:opacity-50"
                                            >
                                                -
                                            </button>

                                            <div className="flex h-8 w-10 items-center justify-center text-sm">{item.quantity}</div>

                                            <button
                                                onClick={() => {
                                                    if (item.quantity >= (item.variant ? item.variant.stock : item.product.stock)) {
                                                        toastr.error(`Only ${item.product.stock} items available`);
                                                        return;
                                                    }

                                                    router.put(`/cart/${item.id}`, { quantity: item.quantity + 1 }, inertiaOptions);
                                                }}
                                                disabled={item.quantity >= (item.variant ? item.variant.stock : item.product.stock)}
                                                className="h-8 w-8 cursor-pointer bg-gray-100 disabled:opacity-50"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => router.delete(`/cart/${item.id}`, inertiaOptions)}
                                            className="cursor-pointer rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* SUMMARY */}
                        <div className="h-fit lg:sticky lg:top-24">
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

                                {/* STOCK ISSUES */}
                                {hasStockIssue && (
                                    <div className="mb-5 space-y-3">
                                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                                            Some items are out of stock or exceed available quantity.
                                        </div>

                                        {outOfStockItems.length > 0 && (
                                            <button
                                                onClick={() => {
                                                    items.forEach((item) => {
                                                        if (item.product.stock <= 0) {
                                                            router.delete(`/cart/${item.id}`, inertiaOptions);
                                                        }
                                                    });
                                                }}
                                                className="w-full rounded-lg bg-red-500 py-3 font-medium text-white transition hover:bg-red-600"
                                            >
                                                Remove Out of Stock Items
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* TOTAL */}
                                <div className="flex items-center justify-between border-b border-gray-200 pb-5">
                                    <span className="text-gray-500">Total</span>
                                    <span className="text-sm font-extrabold text-orange-500 sm:text-lg">${Number(total).toFixed(2)}</span>
                                </div>

                                {auth?.user ? (
                                    <>
                                        {/* ADDRESS FORM */}
                                        <div className="mt-4 space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={form.phone}
                                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                    className={`w-full border p-2 text-sm ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                                />
                                                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-700">City</label>
                                                <select
                                                    value={form.city}
                                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                                    className={`w-full border p-2 text-sm ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                                >
                                                    <option value="">Select City</option>
                                                    {jordanCities.map((city) => (
                                                        <option key={city} value={city}>
                                                            {city}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Place</label>
                                                <input
                                                    type="text"
                                                    value={form.place}
                                                    onChange={(e) => setForm({ ...form, place: e.target.value })}
                                                    className={`w-full border p-2 text-sm ${errors.place ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                                />
                                                {errors.place && <p className="text-sm text-red-500">{errors.place}</p>}
                                            </div>

                                            <label className="flex cursor-pointer items-center gap-2 text-xs">
                                                <input
                                                    className="cursor-pointer"
                                                    type="checkbox"
                                                    checked={form.save}
                                                    onChange={(e) => setForm({ ...form, save: e.target.checked })}
                                                />
                                                Save this address
                                            </label>
                                        </div>

                                        {/* CHECKOUT BUTTON */}
                                        <button
                                            disabled={hasStockIssue || items.length === 0}
                                            onClick={() => {
                                                if (validateForm()) {
                                                    router.post('/checkout', {
                                                        shipping_phone: form.phone,
                                                        shipping_city: form.city,
                                                        shipping_place: form.place,
                                                        save_address: form.save,
                                                    });
                                                } else {
                                                    toastr.error('Please fix the address form errors before checkout.');
                                                }
                                            }}
                                            className={`mt-4 w-full cursor-pointer rounded-lg py-2 text-sm font-semibold text-white ${
                                                hasStockIssue || items.length === 0
                                                    ? 'cursor-not-allowed bg-gray-400'
                                                    : 'bg-orange-500 text-white hover:bg-orange-400'
                                            }`}
                                        >
                                            Checkout
                                        </button>
                                    </>
                                ) : (
                                    <div className="mt-4 p-4 text-center">
                                        <p className="text-sm text-gray-600">Please login to continue checkout</p>

                                        <button
                                            onClick={() => router.visit('/login')}
                                            className="mt-2 cursor-pointer rounded bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-400"
                                        >
                                            Login
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </FrontLayout>
    );
}
