import FormCategory from '@/components/Dashboard/Categories/form-category';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Edit({ category ,stores  }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: ' Categories', href: '/dashboard/categories' },
        { title: `Category - ${category.name}`, href: '' },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Category" />

            <FormCategory
                submitRoute="dashboard.categories.update"
                method="put"
                stores={stores}
                category={category}
                redirectRoute="dashboard.categories.index"
                backRoute="dashboard.categories.index"
            />
        </AppLayout>
    );
}
