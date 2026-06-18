import OrderItemFilters from '@/components/Dashboard/OrderItems/orderItem-filters';
import OrderItemsTable from '@/components/Dashboard/OrderItems/orderItem-table';
import useAutoRefresh from '@/hooks/useAutoRefresh';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

import { Head, router } from '@inertiajs/react';

import { useEffect, useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Order Items', href: '/dashboard/order-items' }];
    
export default function OrderItemsDashboard({ orderItems, filters, order, product }) {
        useAutoRefresh(['orderItems']);
    
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route('dashboard.order-items.index'),
                {
                    search,
                    page: 1,
                },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders Dashboard" />

            <OrderItemFilters search={search} setSearch={setSearch} role="admin" />

            <OrderItemsTable
                orderItems={orderItems}
                role="admin"
                filters={{
                    search,
                }}
            />
        </AppLayout>
    );
}
