import FormProduct from '@/components/Dashboard/Products/form-product';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';


export default function Edit({ product, stores, categories }) {
    const breadcrumbs: BreadcrumbItem[] = [
    { title: ' Products', href: '/dashboard/products' },
    { title: `Product - ${product.name}`, href: '' },
];  
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />

            <div className="p-6">
                <FormProduct
                    submitRoute="dashboard.products.update"
                    method="put"
                    product={product}
                    stores={stores}
                    categories={categories}
                    redirectRoute="dashboard.products.index"
                    backRoute="dashboard.products.index"
                />
            </div>
        </AppLayout>
    );
}
