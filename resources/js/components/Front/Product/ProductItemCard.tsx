import { Link } from '@inertiajs/react';

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        slug: string;
        price: number | string;
        image?: string | null;
    };
}

export default function ProductItemCard({ product }: ProductCardProps) {
    // Get display image: use first variant's image if product has variants, otherwise base image
    const variants = product.variants || [];
    const firstVariant = variants.length > 0 ? variants[0] : null;
    const displayImage = firstVariant?.image ? `/storage/${firstVariant.image}` : product.image ? `/storage/${product.image}` : '/placeholder.png';

    return (
        <Link href={route('products.show', product.slug)} className="block border border-gray-200 bg-white p-3 transition hover:shadow-md">
            {/* IMAGE */}
            <img
                src={displayImage}
                alt={product.name}
                className="h-44 w-full rounded-md object-contain"
            />

            {/* NAME */}
            <h3 className="mt-2 line-clamp-2 text-sm text-gray-900">{product.name}</h3>

            {/* PRICE */}
            <p className="mt-1 text-lg font-bold text-black">${product.price}</p>

            {/* CTA */}
            <div className="mt-2 text-xs font-medium text-blue-600">View Product →</div>
        </Link>
    );
}
