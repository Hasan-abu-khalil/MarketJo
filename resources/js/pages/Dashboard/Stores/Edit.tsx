


import FormStores from '@/components/Dashboard/Stores/form-store';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Edit({  store }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: ' Stores', href: '/dashboard/stores' },
        { title: `Store - ${store.name}`, href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Store" />

            <div className="p-6">
                <FormStores
                    submitRoute="dashboard.stores.update"
                    method="put"
                    store={store}
                    redirectRoute="dashboard.stores.index"
                    backRoute="dashboard.stores.index"
                />
            </div>
        </AppLayout>
    );
}
