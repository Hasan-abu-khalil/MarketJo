import ShowCategory from '@/components/Dashboard/Categories/category-show';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Show({ category , stores }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: ' Categories', href: '/dashboard/categories' },
        { title: `Category - ${category.name}`, href: '' },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Category - ${category.name}`} />

            <ShowCategory category={category} stores={stores} backRoute="dashboard.categories.index" />
        </AppLayout>
    );
}
