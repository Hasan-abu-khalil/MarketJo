import VendorRequestShow from '@/components/Dashboard/VendorRequests/vendorRequest-show';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Show({ vendorRequest }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: ' Vendor Requests', href: '/dashboard/vendor-requests' },
        { title: `Vendor Request - ${vendorRequest.user.name}`, href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Vendor Request - ${vendorRequest.user.name}`} />

            <VendorRequestShow vendorRequest={vendorRequest} backRoute="dashboard.vendor-requests.index" />
        </AppLayout>
    );
}
