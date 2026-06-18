import VendorOrderShow from '@/components/Dashboard/VendorOrders/vendor-order-show';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Show({ vendorOrder }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Vendor Orders', href: '/dashboard/vendor-orders' },
        { title: `Order - ${vendorOrder.id}`, href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Vendor Order - ${vendorOrder.id}`} />

            <VendorOrderShow vendorOrder={vendorOrder} backRoute="dashboard.vendor-orders.index" />
        </AppLayout>
    );
}
