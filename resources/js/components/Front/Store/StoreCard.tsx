import { Link } from '@inertiajs/react';

interface StoreCardProps {
    store: {
        id: number;
        name: string;
        slug: string;
        logo?: string | null;
        description?: string | null;
    };
    variant?: 'grid' | 'featured' | 'sidebar';
}

export default function StoreCard({ store, variant = 'grid' }: StoreCardProps) {
    if (variant === 'sidebar') {
        return (
            <Link href={route('stores.show', store.slug)} className="block rounded-md px-2 py-1 text-sm text-gray-700 hover:bg-gray-100">
                {store.name}
            </Link>
        );
    }

    if (variant === 'featured') {
        return (
            <div className="rounded-md bg-white p-4 shadow-sm">
                <img
                    src={store.logo ? `/storage/${store.logo}` : '/placeholder.png'}
                    alt={store.name}
                    className="h-40 w-full rounded-md object-cover"
                />

                <h3 className="mt-3 font-semibold">{store.name}</h3>

                <p className="mt-1 line-clamp-2 text-sm text-gray-600">{store.description}</p>

                <Link href={route('stores.show', store.slug)} className="mt-3 inline-block text-sm text-blue-600 hover:underline">
                    Visit Store →
                </Link>
            </div>
        );
    }

    return (
        <Link href={route('stores.show', store.slug)} className="block bg-white p-4 transition hover:shadow-md">
            <div className="border border-gray-100 bg-white">
                <img
                    src={store.logo ? `/storage/${store.logo}` : '/placeholder.png'}
                    alt={store.name}
                    className="h-40 w-full rounded-md object-cover"
                />
            </div>

            <div className="mt-3">
                <h2 className="text-base font-semibold text-gray-900">{store.name}</h2>

                <p className="mt-1 line-clamp-3 text-xs text-gray-500">{store.description}</p>

                <div className="mt-3 text-sm font-medium text-blue-600">Visit Store →</div>
            </div>
        </Link>
    );
}
