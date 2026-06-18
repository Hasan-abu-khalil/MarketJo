import { Link } from '@inertiajs/react';

interface CategoryCardProps {
    category: {
        id: number;
        name: string;
        slug: string;
    };
    variant?: 'grid' | 'sidebar';
}

export default function CategoryCard({ category, variant = 'grid' }: CategoryCardProps) {
    if (variant === 'sidebar') {
        return (
            <Link href={route('categories.show', category.slug)} className="block rounded-md px-2 py-1 text-sm text-gray-700 hover:bg-gray-100">
                {category.name}
            </Link>
        );
    }

    return (
        <Link href={route('categories.show', category.slug)} className="border border-gray-200 bg-white p-4 transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center border border-gray-200 bg-gray-50 text-xl">📦</div>

            <h3 className="mt-3 text-base font-semibold text-gray-900">{category.name}</h3>

            <p className="mt-1 line-clamp-2 text-xs text-gray-500">Explore products from this category</p>

            <div className="mt-3 text-xs font-medium text-blue-600">Browse →</div>
        </Link>
    );
}
