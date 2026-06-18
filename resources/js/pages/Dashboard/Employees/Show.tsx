import ShowEmployee from '@/components/Dashboard/Employees/employee-show';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Show({ employee }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Employees', href: '/dashboard/employees' },
        { title: employee.user?.name, href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Employee - ${employee.user?.name}`} />

            <ShowEmployee employee={employee} backRoute="dashboard.employees.index" />
        </AppLayout>
    );
}
