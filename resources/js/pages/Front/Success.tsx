import FrontLayout from '@/layouts/FrontLayout';
import { Link, router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Success() {
    useEffect(() => {
        router.reload({ only: ['cartCount'] });
    }, []);
    return (
        <FrontLayout cart_cleared={true}>
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-green-600">Order Placed Successfully 🎉</h1>

                    <p className="mt-4 pb-5 text-gray-600">Thank you for your purchase</p>
                    <Link href="/" className="rounded-xl border-3 border-indigo-400 p-1 text-3xl font-black text-indigo-400">
                        Home
                    </Link>
                </div>
            </div>
        </FrontLayout>
    );
}
