import { Link, useForm } from '@inertiajs/react';
import toastr from 'toastr';

import BackButton from '../Shared/back-button';

export default function AddUserForm({ redirectRoute, backRoute }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('dashboard.users.store'), {
            forceFormData: true,

            onSuccess: () => {
                toastr.success('User created successfully!');
            },

            onError: () => {
                toastr.error('Something went wrong. Please check the form.');
            },
        });
    };

    return (
        <div className="space-y-6 rounded-xl border bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold dark:text-white">Create User</h1>

                {backRoute && <BackButton routeName={backRoute} className="mb-4" />}
            </div>
            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Name */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Full Name</label>

                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            placeholder="John Doe"
                        />

                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Email Address</label>

                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            placeholder="example@email.com"
                        />

                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Password</label>

                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="********"
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />

                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Confirm Password</label>

                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="********"
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />

                        {errors.password_confirmation && <p className="mt-1 text-sm text-red-500">{errors.password_confirmation}</p>}
                    </div>

                    {/* Role */}
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">Role</label>

                        <select
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select a role</option>
                            <option value="vendor">Vendor</option>
                            <option value="customer">Customer</option>
                        </select>

                        {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 border-t pt-6">
                    <Link
                        href={route('dashboard.users.index')}
                        className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                        {processing ? 'Creating...' : 'Create User'}
                    </button>
                </div>
            </form>
        </div>
    );
}
