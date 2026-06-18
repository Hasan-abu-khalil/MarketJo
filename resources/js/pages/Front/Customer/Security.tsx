import FrontLayout from '@/layouts/FrontLayout';
import { Link, useForm } from '@inertiajs/react';
import toastr from 'toastr';

export default function Security({ user }) {
    /* PROFILE FORM */
    const profileForm = useForm({
        name: user.name || '',
    });

    /* PASSWORD FORM */
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile = (e) => {
        e.preventDefault();

        profileForm.put(route('account.profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toastr.success('Profile updated successfully');
            },
            onError: () => {
                toastr.error('Failed to update profile');
            },
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();

        passwordForm.put(route('account.password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                toastr.success('Password updated successfully');
            },
            onError: () => {
                passwordForm.reset('current_password', 'password', 'password_confirmation');
                toastr.error('Failed to update password');
            },
        });
    };

    return (
        <FrontLayout>
            <div className="min-h-screen bg-gray-50">
                {/* HEADER */}

               

                <section className="bg-[#131921] text-white">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
                        {/* HEADER + BACK BUTTON */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold sm:text-3xl">Login & Security</h1>
                                <p className="mt-2 text-sm text-gray-300">Manage your account information and password</p>
                            </div>

                            <Link
                                href={route('account.orders')}
                                className="inline-flex w-fit items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                            >
                                ← Back
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CONTENT */}
                <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                    {/* PROFILE */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>

                            <p className="mt-1 text-sm text-gray-500">Update your name</p>
                        </div>

                        <form onSubmit={submitProfile} className="space-y-5">
                            {/* NAME */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>

                                <input
                                    type="text"
                                    value={profileForm.data.name}
                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />

                                {profileForm.errors.name && <p className="mt-2 text-sm text-red-500">{profileForm.errors.name}</p>}
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>

                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-orange-400 disabled:opacity-50"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>

                    {/* PASSWORD */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>

                            <p className="mt-1 text-sm text-gray-500">Enter your old password before changing to a new password</p>
                        </div>

                        <form onSubmit={submitPassword} className="space-y-5">
                            {/* CURRENT PASSWORD */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Current Password</label>

                                <input
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />

                                {passwordForm.errors.current_password && (
                                    <p className="mt-2 text-sm text-red-500">{passwordForm.errors.current_password}</p>
                                )}
                            </div>

                            {/* NEW PASSWORD */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">New Password</label>

                                <input
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />

                                {passwordForm.errors.password && <p className="mt-2 text-sm text-red-500">{passwordForm.errors.password}</p>}
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Confirm Password</label>

                                <input
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-orange-400 disabled:opacity-50"
                            >
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
