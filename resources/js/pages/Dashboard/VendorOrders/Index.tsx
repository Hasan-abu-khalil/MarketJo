import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import VendorOrderFilters from '@/components/Dashboard/VendorOrders/vendor-order-filters';
import VendorOrderTable from '@/components/Dashboard/VendorOrders/vendor-orders-table';
import useAutoRefresh from '@/hooks/useAutoRefresh';

const breadcrumbs = [{ title: 'Vendor Orders', href: '/dashboard/vendor-orders' }];

export default function VendorOrdersIndex({ orders, filters, permissions }) {
        useAutoRefresh(['orders']);
    
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route('dashboard.vendor-orders.index'),
                {
                    search,
                    status: status || undefined,
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
            <Head title="Vendor Orders" />

            <VendorOrderFilters search={search} setSearch={setSearch} status={status} setStatus={setStatus} permissions={permissions} />

            <VendorOrderTable
                orders={orders}
                filters={{
                    search,
                    status: status !== null ? status : undefined,
                }}
            />
        </AppLayout>
    );
}
