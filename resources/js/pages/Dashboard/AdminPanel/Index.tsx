import DashboardCharts from '@/components/Dashboard/Charts/DashboardCharts';
import useAutoRefresh from '@/hooks/useAutoRefresh';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type Props = {
    role: 'admin' | 'vendor';

    stats: {
        users?: number;
        vendors?: number;
        stores?: number;
        pendingRequests?: number;

        products: number;
        orders: number;
        revenue: number;
        salesValue: number;

        lowStockProducts?: number;
        pendingOrders?: number;
    };

    recentOrders: {
        id: number;
        total_price: number;
        status: string;
        created_at: string;
        user?: {
            name: string;
        };
    }[];

    latestProducts: {
        id: number;
        name: string;
        price: number;
        store?: {
            name: string;
        };
    }[];

    pendingVendorRequests: {
        id: number;
        store_name: string;
        status: string;
        user?: {
            name: string;
        };
    }[];

    charts: {
        sales: {
            date: string;
            total: number;
        }[];

        ordersStatus: {
            status: string;
            total: number;
        }[];

        productsByStore?: {
            name: string;
            products_count: number;
        }[];
    };
};

export default function AdminPanelIndex({ role, stats, recentOrders, latestProducts, pendingVendorRequests, charts }: Props) {
    useAutoRefresh(['stats', 'recentOrders', 'latestProducts', 'pendingVendorRequests', 'charts']);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={role === 'admin' ? 'Admin Dashboard' : 'Vendor Dashboard'} />

            <div className="space-y-6 p-6">
                {/* ================= ADMIN STATS ================= */}
                {role === 'admin' && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard title="Users" value={stats.users ?? 0} />
                        <StatCard title="Vendors" value={stats.vendors ?? 0} />
                        <StatCard title="Stores" value={stats.stores ?? 0} />
                        <StatCard title="Pending Requests" value={stats.pendingRequests ?? 0} />
                    </div>
                )}

                {/* ================= VENDOR STATS ================= */}
                {role === 'vendor' && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard title="My Products" value={stats.products} />
                        <StatCard title="My Orders" value={stats.orders} />
                        <StatCard title="Pending Orders" value={stats.pendingOrders ?? 0} />
                        <StatCard title="Low Stock" value={stats.lowStockProducts ?? 0} />
                    </div>
                )}

                {/* ================= SHARED STATS ================= */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <StatCard title="Products" value={stats.products} />
                    <StatCard title="Orders" value={stats.orders} />
                    {/* <StatCard title="Revenue" value={`$${Number(stats.revenue).toFixed(2)}`} /> */}
                    <StatCard title="Sales Value" value={`$${Number(stats.salesValue).toFixed(2)}`} />
                </div>

                {/* ================= ALERTS ================= */}
                <div className={`grid grid-cols-1 gap-4 ${role === 'admin' ? 'lg:grid-cols-2' : 'grid grid-cols-1'}`}>
                    {role === 'admin' && (
                        <div className="rounded-xl border bg-yellow-50 p-4 dark:bg-yellow-900/20">
                            <h2 className="mb-3 font-semibold">Pending Vendor Requests</h2>

                            {pendingVendorRequests.length === 0 ? (
                                <p className="text-sm text-gray-500">No pending requests</p>
                            ) : (
                                <div className="space-y-2">
                                    {pendingVendorRequests.map((req) => (
                                        <div key={req.id} className="flex justify-between border-b pb-2 text-sm">
                                            <span>{req.user?.name ?? 'Unknown'}</span>

                                            <span className="font-medium">{req.store_name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="rounded-xl border p-4">
                        <h2 className="mb-3 font-semibold">{role === 'admin' ? 'Latest Products' : 'My Latest Products'}</h2>

                        {latestProducts.length === 0 ? (
                            <p className="text-sm text-gray-500">No products found</p>
                        ) : (
                            latestProducts.map((product) => (
                                <div key={product.id} className="flex justify-between border-b py-2 text-sm">
                                    <span>{product.name}</span>

                                    <span className="text-gray-500">${product.price}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <DashboardCharts charts={charts} role={role} />
                {/* ================= RECENT ORDERS ================= */}
                <div className="overflow-hidden rounded-xl border">
                    <div className="border-b bg-gray-50 p-4 font-semibold dark:bg-gray-900">
                        🧾 {role === 'admin' ? 'Recent Orders' : 'My Recent Orders'}
                    </div>

                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-900">
                            <tr>
                                <th className="p-3 text-left">Order</th>
                                <th className="p-3 text-left">Customer</th>
                                <th className="p-3 text-left">Total</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="border-t">
                                        <td className="p-3">#{order.id}</td>

                                        <td className="p-3">{order.user?.name ?? 'Guest'}</td>

                                        <td className="p-3 font-semibold">${Number(order.total_price).toFixed(2)}</td>

                                        <td className="p-3">
                                            <StatusBadge status={order.status} />
                                        </td>

                                        <td className="p-3 text-gray-500">{new Date(order.created_at).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
    return (
        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-neutral-900">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700',
        paid: 'bg-green-100 text-green-700',
        shipped: 'bg-blue-100 text-blue-700',
        cancelled: 'bg-red-100 text-red-700',
        completed: 'bg-gray-200 text-gray-700',
    };

    return <span className={`rounded px-2 py-1 text-xs font-medium ${colors[status] || 'bg-gray-200 text-gray-700'}`}>{status}</span>;
}
