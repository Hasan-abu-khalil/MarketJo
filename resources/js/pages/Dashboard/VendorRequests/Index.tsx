import VendorRequestFilters from '@/components/Dashboard/VendorRequests/vendorRequest-filters';
import VendorRequestsTable from '@/components/Dashboard/VendorRequests/vendorRequest-table';
import useAutoRefresh from '@/hooks/useAutoRefresh';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: ' Vendor Requests', href: '/dashboard/vendor-requests' }];
export default function VendorRequestsDashboard({ vendorRequests, filters, user }) {
        useAutoRefresh(['vendorRequests']);
    
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status ?? '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route('dashboard.vendor-requests.index'),
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
            <Head title="Vendor Requests Dashboard" />

            <VendorRequestFilters search={search} setSearch={setSearch} status={status} setStatus={setStatus} role="admin" />

            <VendorRequestsTable
                vendorRequests={vendorRequests}
                role="admin"
                filters={{
                    search,
                    status: status !== null ? status : undefined,
                }}
            />
        </AppLayout>
    );
}
