

import OrderItemShow from '@/components/Dashboard/OrderItems/orderItem-show';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Show({ orderItem ,product }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Order Items', href: '/dashboard/order-items' },
        { title: `Order Item - ${orderItem.product.name}`, href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <Head title={`Order Item - ${orderItem.product.name}`} />

            <OrderItemShow orderItem={orderItem} product={product} backRoute="dashboard.order-items.index" />
        </AppLayout>
    );
}
