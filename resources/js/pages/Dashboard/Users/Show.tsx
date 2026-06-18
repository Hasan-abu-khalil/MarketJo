

import UsersShow from '@/components/Dashboard/Users/user-show';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Show({ user }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: ' Users', href: '/dashboard/users' },
        { title: `User - ${user.name}`, href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User - ${user.name}`} />

            <UsersShow user={user} backRoute="dashboard.users.index" />
        </AppLayout>
    );
}
