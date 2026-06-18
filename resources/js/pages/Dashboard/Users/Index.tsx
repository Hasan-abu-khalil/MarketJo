
import UserFilters from '@/components/Dashboard/Users/user-filters';
import UsersTable from '@/components/Dashboard/Users/user-table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { BreadcrumbItem } from '@/types';
import useAutoRefresh from '@/hooks/useAutoRefresh';

const breadcrumbs: BreadcrumbItem[] = [{ title: ' Users', href: '/dashboard/users' }];
export default function StoresDashboard({ users, filters ,permissions}) {
        useAutoRefresh(['users']);
    
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role ?? null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route('dashboard.users.index'),
                {
                    search,
                    role: role !== null ? role : undefined,
                    page: 1,
                },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, role]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Dashboard" />

            <UserFilters search={search} setSearch={setSearch} role={role} setRole={setRole} permissions={permissions} />

            <UsersTable
                users={users}
                role="admin"
                filters={{
                    search,
                    status: status !== null ? status : undefined,
                }}
            />
        </AppLayout>
    );
}
