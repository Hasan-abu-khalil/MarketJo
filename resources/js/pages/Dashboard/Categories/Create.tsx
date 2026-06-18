import FormCategory from '@/components/Dashboard/Categories/form-category';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: ' Categories', href: '/dashboard/categories' },
    { title: ' Create', href: '' },
];
export default function Create({ stores }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Category" />

            <FormCategory
                submitRoute="dashboard.categories.store"
                method="post"
                stores={stores}
                redirectRoute="dashboard.categories.index"
                backRoute="dashboard.categories.index"
            />
        </AppLayout>
    );
}
