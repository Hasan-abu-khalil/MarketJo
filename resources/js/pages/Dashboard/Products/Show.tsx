import ProductShow from '@/components/Dashboard/Products/product-show';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Show({ product }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: ' Products', href: '/dashboard/products' },
        { title: `Product - ${product.name}`, href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Product - ${product.name}`} />

            <ProductShow product={product} backRoute="dashboard.products.index" />
        </AppLayout>
    );
}
