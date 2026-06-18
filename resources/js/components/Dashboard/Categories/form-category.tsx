import { Button } from '@/components/ui/button';
import { router, useForm } from '@inertiajs/react';
import toastr from 'toastr';

import BackButton from '../Shared/back-button';

type Props = {
    submitRoute: string;
    method?: 'post' | 'put';
    category?: any;
    stores?: any[];
    redirectRoute?: string;
    backRoute?: string;
};

export default function FormCategory({ submitRoute, method = 'post', category, redirectRoute, backRoute, stores }: Props) {
    const { data, setData, post,put, processing, errors } = useForm({
        name: category?.name || '',
        store_id: category?.store_id || '',
    });
    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (method === 'put' && category?.id) {
            put(
                route(submitRoute, category.id),
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
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">{category ? 'Edit Category' : 'Create Category'}</h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage product categories</p>
                </div>

                {backRoute && <BackButton routeName={backRoute} className="w-full sm:w-auto" />}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* NAME */}

                <div>
                    <label className="mb-1 block text-sm font-medium">Store</label>

                    <select className={inputClass} value={data.store_id} onChange={(e) => setData('store_id', e.target.value)}>
                        <option value="">Select Store</option>

                        {stores?.map((store) => (
                            <option key={store.id} value={store.id}>
                                {store.name}
                            </option>
                        ))}
                    </select>

                    {errors.store_id && <p className={errorClass}>{errors.store_id}</p>}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">category Name</label>
                    <input
                        className={inputClass}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Enter category name"
                    />

                    {errors.name && <p className={errorClass}>{errors.name}</p>}
                </div>

                {/* SUBMIT */}
                <Button disabled={processing} className="w-full">
                    {category ? 'Update Category' : 'Create Category'}
                </Button>
            </form>
        </div>
    );
}
