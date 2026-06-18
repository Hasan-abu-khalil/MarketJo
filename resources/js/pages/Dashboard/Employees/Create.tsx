import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import FormEmployee from '@/components/Dashboard/Employees/form-employee';

export default function Create({ stores, permissions, authUser }) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Employees', href: '/dashboard/employees' },
            { title: 'Create', href: '' },
        ]}>
            <Head title="Create Employee" />

            <FormEmployee
                submitRoute="dashboard.employees.store"
                method="post"
                stores={stores}
                permissions={permissions}
                authUser={authUser}
                redirectRoute="dashboard.employees.index"
                backRoute="dashboard.employees.index"
            />
        </AppLayout>
    );
}