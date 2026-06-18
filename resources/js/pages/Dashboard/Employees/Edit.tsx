import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import FormEmployee from '@/components/Dashboard/Employees/form-employee';

export default function Edit({ employee, stores, permissions, authUser }) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Employees', href: '/dashboard/employees' },
            { title: employee.user.name, href: '' },
        ]}>
            <Head title="Edit Employee" />

            <FormEmployee
                submitRoute="dashboard.employees.update"
                method="put"
                employee={employee}
                stores={stores}
                permissions={permissions}
                authUser={authUser}
                redirectRoute="dashboard.employees.index"
                backRoute="dashboard.employees.index"
            />
        </AppLayout>
    );
}