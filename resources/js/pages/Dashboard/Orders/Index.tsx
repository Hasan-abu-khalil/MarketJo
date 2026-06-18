import OrderFilters from '@/components/Dashboard/Orders/order-filters';
import OrdersTable from '@/components/Dashboard/Orders/order-table';
import useAutoRefresh from '@/hooks/useAutoRefresh';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

import { Head, router } from '@inertiajs/react';

import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: ' Orders', href: '/dashboard/orders' }];
export default function OrdersDashboard({ orders, filters, user }) {
        useAutoRefresh(['orders']);
    
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status ?? '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route('dashboard.orders.index'),
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
            <Head title="Orders Dashboard" />

            <OrderFilters search={search} setSearch={setSearch} status={status} setStatus={setStatus} role="admin" />

            <OrdersTable
                orders={orders}
                role="admin"
                filters={{
                    search,
                    status: status !== null ? status : undefined,
                }}
            />
        </AppLayout>
    );
}
