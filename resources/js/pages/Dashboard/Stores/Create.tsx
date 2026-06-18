import FormStores from '@/components/Dashboard/Stores/form-store';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Create({}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: ' Stores', href: '/dashboard/stores' },
        { title: ' Create', href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Store" />

            <FormStores submitRoute="dashboard.stores.store" method="post" redirectRoute="dashboard.stores.index" backRoute="dashboard.stores.index" />
        </AppLayout>
    );
}
