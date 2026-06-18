import FrontLayout from '@/Layouts/FrontLayout';
import { router, useForm } from '@inertiajs/react';
import toastr from 'toastr';

export default function BecomeVendor({ hasActiveRequest, latestRequest }) {
    const { data, setData, post, processing, errors } = useForm({
        store_name: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('vendor-requests.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toastr.success('Application submitted 🚀');
                router.visit(route('vendor-requests.index'), {
                    preserveScroll: true,
                    preserveState: true,
                });
            },
            onError: () => {
                toastr.error('Please fix errors');
            },
        });
    };

    return (
        <FrontLayout>
            {/* HERO */}
            {/* HERO (same as Home) */}
            <section className="bg-[#131921] text-white">
                <div className="mx-auto max-w-7xl px-4 py-10">
                    <h1 className="text-3xl font-bold">Become a Vendor</h1>
                    <p className="mt-2 text-sm text-gray-300">Start selling your products to thousands of customers</p>
                </div>
            </section>

            {/* STEPS */}
            <section className="mx-auto max-w-6xl px-6 pt-14">
                <h2 className="mb-10 text-center text-3xl font-bold text-gray-800">How it works</h2>

                <div className="grid gap-8 md:grid-cols-3">
                    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                        <div className="text-3xl">📝</div>
                        <h3 className="mt-3 font-bold">Apply</h3>
                        <p className="mt-2 text-sm text-gray-500">Submit your store details and business idea.</p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                        <div className="text-3xl">✅</div>
                        <h3 className="mt-3 font-bold">Get Approved</h3>
                        <p className="mt-2 text-sm text-gray-500">Our team reviews and activates your store.</p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                        <div className="text-3xl">🚀</div>
                        <h3 className="mt-3 font-bold">Start Selling</h3>
                        <p className="mt-2 text-sm text-gray-500">Add products and start earning immediately.</p>
                    </div>
                </div>
            </section>

            {/* FORM SECTION */}
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
                <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
                    {/* LEFT */}
                    <div className="flex flex-col justify-center bg-gradient-to-br from-orange-600 to-orange-400 p-10 text-white">
                        <h1 className="text-3xl font-bold">Start Selling With Us</h1>
                        <p className="mt-4 text-indigo-100">Join our marketplace and reach thousands of customers instantly.</p>

                        <ul className="mt-8 space-y-3 text-sm text-indigo-100">
                            <li>✔ Create your own store</li>
                            <li>✔ Upload unlimited products</li>
                            <li>✔ Track your sales</li>
                            <li>✔ Get paid securely</li>
                        </ul>
                    </div>

                    {/* RIGHT */}
                    <div className="p-10">
                        <h2 className="mb-6 text-2xl font-bold text-gray-800">Vendor Application</h2>

                        {/* STATUS BLOCK */}
                        {hasActiveRequest ? (
                            <div className="rounded-2xl border bg-gray-50 p-6 text-center">
                                <p className="font-semibold">Application Submitted</p>

                                <p className="mt-2 text-sm text-gray-500">
                                    Store: <b>{latestRequest?.store_name}</b>
                                </p>

                                <p className="mt-2 text-sm text-gray-500">
                                    Status: <span className="font-bold text-indigo-600">{latestRequest?.status}</span>
                                </p>

                                {latestRequest?.status === 'pending' && <p className="mt-3 text-amber-600">Under review ⏳</p>}

                                {latestRequest?.status === 'approved' && <p className="mt-3 text-green-600">You are now a vendor 🎉</p>}

                                {latestRequest?.status === 'rejected' && <p className="mt-3 text-red-600">Rejected — you can apply again.</p>}
                            </div>
                        ) : (
                            /* FORM */
                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label className="text-sm">Store Name</label>
                                    <input
                                        className="mt-2 w-full rounded-xl border p-3"
                                        value={data.store_name}
                                        onChange={(e) => setData('store_name', e.target.value)}
                                    />
                                    {errors.store_name && <p className="text-sm text-red-500">{errors.store_name}</p>}
                                </div>

                                <div>
                                    <label className="text-sm">Why become vendor?</label>
                                    <textarea
                                        className="mt-2 w-full rounded-xl border p-3"
                                        rows="5"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                    />
                                    {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                                </div>

                                <button disabled={processing} className="w-full rounded-xl bg-orange-500 py-3 text-white">
                                    Submit Application
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <section className="bg-white py-12">
                <div className="mx-auto max-w-5xl px-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800">Trusted by growing sellers</h3>

                    <p className="mt-2 text-gray-500">Join vendors who are already making sales every day.</p>

                    <div className="mt-6 flex flex-col justify-center gap-4 text-sm text-gray-400 md:flex-row xl:flex-row xl:gap-8">
                        <span>⚡ Fast approval</span>
                        <span>🔒 Secure platform</span>
                        <span>📦 Easy management</span>
                    </div>
                </div>
            </section>
        </FrontLayout>
    );
}
