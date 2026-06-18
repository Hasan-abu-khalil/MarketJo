import CategoryFilters from '@/components/Dashboard/Categories/category-filters';
import CategoryTable from '@/components/Dashboard/Categories/category-table';
import AppLayout from '@/layouts/app-layout';

import { Head, router } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import { useEffect, useState } from 'react';
import useAutoRefresh from '@/hooks/useAutoRefresh';

const breadcrumbs: BreadcrumbItem[] = [{ title: ' Categories', href: '/dashboard/categories' }];
export default function CategoriesDashboard({ categories, filters, stores, permissions }) {
    useAutoRefresh(['categories']);

    const [search, setSearch] = useState(filters.search || '');
    const [storeId, setStoreId] = useState(filters.store_id || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route('dashboard.categories.index'),
                {
                    search,
                    store_id: storeId,
                    page: 1,
                },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, storeId]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories Dashboard" />

            <CategoryFilters
                search={search}
                setSearch={setSearch}
                storeId={storeId}
                setStoreId={setStoreId}
                permissions={permissions}
                stores={stores}
                role="admin"
            />

            <CategoryTable
                categories={categories}
                stores={stores}
                role="admin"
                filters={{
                    search,
                    store_id: storeId,
                }}
            />
        </AppLayout>
    );
}
