import OrdersShow from '@/components/Dashboard/Orders/order-show';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Show({ order }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Orders', href: '/dashboard/orders' },
        { title: `Order - ${order.id}`, href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order - ${order.id}`} />

            <OrdersShow order={order} backRoute="dashboard.orders.index" role="admin" />
        </AppLayout>
    );
}
