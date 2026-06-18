import { Button } from '@/components/ui/button';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import toastr from 'toastr';

import BackButton from '../Shared/back-button';
import StoreMapPicker from './StoreMapPicker';
type Props = {
    submitRoute: string;
    method?: 'post' | 'put';
    store?: any;
    redirectRoute?: string;
    backRoute?: string;
    role?: string;
};

export default function FormStore({ submitRoute, method = 'post', store, redirectRoute, backRoute, role }: Props) {
    const { data, setData, post,put, processing, errors } = useForm({
        name: store?.name || '',
        description: store?.description || '',
        logo: null,
        status: store ? Boolean(store.status) : true,
        address: store?.address || '',
        latitude: store?.latitude || 31.9539,
        longitude: store?.longitude || 35.9106,
    });

    const [preview, setPreview] = useState(store?.logo ? `/storage/${store.logo}` : null);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (method === 'put' && store?.id) {
            put(
                route(submitRoute, store.id),
                { ...data, _method: 'put' },
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

        post(route(submitRoute), {
            forceFormData: true,
            onSuccess: () => {
                toastr.success('Created successfully');
                if (redirectRoute) router.get(route(redirectRoute));
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
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">{store ? 'Edit Store' : 'Create Store'}</h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fill in store details below</p>
                </div>

                {backRoute && <BackButton routeName={backRoute} className="w-full sm:w-auto" />}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* NAME */}
                <div>
                    <label className="mb-1 block text-sm font-medium dark:text-gray-200">Store Name</label>

                    <input
                        className={inputClass}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Enter store name"
                    />

                    {errors.name && <p className={errorClass}>{errors.name}</p>}
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label className="mb-1 block text-sm font-medium dark:text-gray-200">Description</label>

                    <textarea
                        className={inputClass}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={4}
                        placeholder="Store description"
                    />

                    {errors.description && <p className={errorClass}>{errors.description}</p>}
                </div>

                {role === 'admin' ? (
                    <div>
                        <label className="mb-1 block text-sm font-medium dark:text-gray-200">Status</label>

                        <input
                            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            type="checkbox"
                            checked={data.status}
                            onChange={(e) => setData('status', e.target.checked)}
                        />
                    </div>
                ) : (
                    <input type="hidden" value={true} />
                )}
                {/* IMAGE */}
                <div>
                    <label className="mb-1 block text-sm font-medium dark:text-gray-200">Logo Store</label>

                    <input
                        type="file"
                        onChange={(e: any) => {
                            const file = e.target.files[0];
                            setData('logo', file);
                            if (file) setPreview(URL.createObjectURL(file));
                        }}
                        className="text-sm"
                    />

                    {preview && <img src={preview} className="mt-2 h-20 w-20 rounded-lg border object-cover" />}
                    {errors.logo && <p className={errorClass}>{errors.logo}</p>}
                </div>


                <div className="space-y-4">
                    <h2 className="text-lg font-bold dark:text-white">Store Location</h2>

                    <input
                        type="text"
                        placeholder="Store Address"
                        className={inputClass}
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                    />

                    <StoreMapPicker data={data} setData={setData} />
                </div>

                {/* SUBMIT */}
                <Button disabled={processing} className="w-full">
                    {store ? 'Update Store' : 'Create Store'}
                </Button>
            </form>
        </div>
    );
}
