

import StoresShow from '@/components/Dashboard/Stores/store-show';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Show({ store }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: ' Stores', href: '/dashboard/stores' },
        { title: `Store - ${store.name}`, href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Store - ${store.name}`} />

            <StoresShow store={store} backRoute="dashboard.stores.index" />
        </AppLayout>
    );
}
