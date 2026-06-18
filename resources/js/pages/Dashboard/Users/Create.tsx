


import FormUser from '@/components/Dashboard/Users/form-user';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: ' Users', href: '/dashboard/users' },
    { title: ' Create', href: '' },
];
export default function Create({}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            <FormUser submitRoute="dashboard.users.store" method="post" redirectRoute="dashboard.users.index" backRoute="dashboard.users.index" />
        </AppLayout>
    );
}
