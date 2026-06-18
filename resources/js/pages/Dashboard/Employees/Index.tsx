import EmployeeFilters from '@/components/Dashboard/Employees/employee-filters';
import EmployeeTable from '@/components/Dashboard/Employees/employee-table';
import useAutoRefresh from '@/hooks/useAutoRefresh';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Index({ employees, permissions, filters }) {
        useAutoRefresh(['employees']);
    
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route('dashboard.employees.index'),
                {
                    search,
                    page: 1,
                },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Employees', href: '/dashboard/employees' }]}>
            <Head title="Employees" />

            <EmployeeFilters permissions={permissions} search={search} setSearch={setSearch} />

            <EmployeeTable employees={employees} role="admin" filters={{ search }} />
        </AppLayout>
    );
}
