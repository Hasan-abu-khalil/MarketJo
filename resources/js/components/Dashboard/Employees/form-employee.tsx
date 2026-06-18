import { Button } from '@/components/ui/button';
import { router, useForm } from '@inertiajs/react';
import toastr from 'toastr';
import BackButton from '../Shared/back-button';

export default function FormEmployee({ submitRoute, method = 'post', employee, stores, permissions, authUser, redirectRoute, backRoute }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: employee?.user?.name || '',
        email: employee?.user?.email || '',
        password: '',
        scope: employee?.scope || 'vendor',
        store_ids: employee?.stores?.map((s) => s.id) || [],
        permissions: employee?.permissions?.map((p) => p.id) || [],
    });

    const inputClass =
        'w-full rounded-lg border px-3 py-2 text-sm ' +
        'bg-white text-gray-900 border-gray-300 ' +
        'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700';

    const errorClass = 'text-sm text-red-500 mt-1';

    const toggleStore = (id) => {
        setData('store_ids', data.store_ids.includes(id) ? data.store_ids.filter((x) => x !== id) : [...data.store_ids, id]);
    };

    const togglePermission = (id) => {
        setData('permissions', data.permissions.includes(id) ? data.permissions.filter((x) => x !== id) : [...data.permissions, id]);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (method === 'put' && employee?.id) {
            put(
                route(submitRoute, employee.id),
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

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6 rounded-xl border bg-white p-4 shadow sm:p-6 dark:border-gray-700 dark:bg-gray-900">
            {/* HEADER */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-bold sm:text-2xl dark:text-white">{employee ? 'Edit Employee' : 'Create Employee'}</h1>

                {backRoute && <BackButton routeName={backRoute} />}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* BASIC INFO GRID */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium dark:text-white">Name</label>

                        <input
                            className={inputClass}
                            placeholder="Enter employee name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />

                        {errors.name && <p className={errorClass}>{errors.name}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium dark:text-white">Email</label>

                        <input
                            type="email"
                            className={inputClass}
                            placeholder="Enter employee email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        {errors.email && <p className={errorClass}>{errors.email}</p>}
                    </div>

                    {!employee && (
                        <div>
                            <label className="mb-1 block text-sm font-medium dark:text-white">Password</label>

                            <input
                                className={inputClass}
                                type="password"
                                placeholder="Enter password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />

                            {errors.password && <p className={errorClass}>{errors.password}</p>}
                        </div>
                    )}

                    {authUser?.role === 'admin' ? (
                        <div>
                            <label className="mb-1 block text-sm font-medium dark:text-white">Employee Type</label>

                            <select className={inputClass} value={data.scope} onChange={(e) => setData('scope', e.target.value)}>
                                <option value="vendor">Vendor Employee</option>
                                <option value="admin">Admin Employee</option>
                            </select>

                            {errors.scope && <p className={errorClass}>{errors.scope}</p>}
                        </div>
                    ) : (
                        <div>
                            <label className="mb-1 block text-sm font-medium dark:text-white">Employee Type</label>

                            <input className={inputClass} disabled placeholder="Vendor Employee" value="Vendor Employee" />
                        </div>
                    )}
                </div>

                {/* STORES */}
                {data.scope === 'vendor' && (
                    <div className="space-y-3">
                        <h3 className="font-bold dark:text-white">Stores</h3>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {stores?.map((store) => (
                                <label key={store.id} className="flex items-center gap-2 rounded border p-2 dark:border-gray-700">
                                    <input type="checkbox" checked={data.store_ids.includes(store.id)} onChange={() => toggleStore(store.id)} />
                                    <span className="text-sm dark:text-white">{store.name}</span>
                                </label>
                            ))}
                        </div>
                        {(errors.store_ids || errors['store_ids.0']) && <p className={errorClass}>{errors.store_ids || errors['store_ids.0']}</p>}
                    </div>
                )}

                {/* PERMISSIONS */}
                <div className="space-y-3">
                    <h3 className="font-bold dark:text-white">Permissions</h3>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {permissions?.map((p) => (
                            <label key={p.id} className="flex items-center gap-2 rounded border p-2 dark:border-gray-700">
                                <input type="checkbox" checked={data.permissions.includes(p.id)} onChange={() => togglePermission(p.id)} />
                                <span className="text-sm dark:text-white">{p.name}</span>
                            </label>
                        ))}
                    </div>
                    {(errors.permissions || errors['permissions.0']) && <p className={errorClass}>{errors.permissions || errors['permissions.0']}</p>}
                </div>

                {/* SUBMIT */}
                <Button disabled={processing} className="w-full">
                    {employee ? 'Update Employee' : 'Create Employee'}
                </Button>
            </form>
        </div>
    );
}
