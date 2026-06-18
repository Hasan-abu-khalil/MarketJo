
import ProductFilters from '@/components/Dashboard/Stores/store-filters';
import StoreTable from '@/components/Dashboard/Stores/store-table';
import useAutoRefresh from '@/hooks/useAutoRefresh';


import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

import { Head, router } from '@inertiajs/react';

import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: ' Stores', href: '/dashboard/stores' }];
export default function StoresDashboard({ stores, filters, user, permissions }) {
        useAutoRefresh(['stores']);
    
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status ?? null);

   

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route('dashboard.stores.index'),
                {
                    search,
                    status: status !== null ? status : undefined,
                    page: 1,
                },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, status]);

  

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stores Dashboard" />

            <ProductFilters
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
                role="admin"
                permissions={permissions}
            />

            <StoreTable
                stores={stores}
                role="admin"
                filters={{
                    search,
                    status: status !== null ? status : undefined,
                }}
            />
        </AppLayout>
    );
}
