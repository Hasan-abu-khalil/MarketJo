import FormProduct from '@/components/Dashboard/Products/form-product';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
    { title: ' Products', href: '/dashboard/products' },
    { title: ' Create', href: '' },
];

export default function Create({ stores, categories, permissions }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />

            <FormProduct
                submitRoute="dashboard.products.store"
                method="post"
                stores={stores}
                categories={categories}
                redirectRoute="dashboard.products.index"
                backRoute="dashboard.products.index"
                permissions={permissions}
            />
        </AppLayout>
    );
}
