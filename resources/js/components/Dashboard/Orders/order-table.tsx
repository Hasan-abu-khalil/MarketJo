import SharedTable from '../Shared/SharedTable';
import TableActions from '../shared/table-actions';
import OrderStatusSelect from './order-status-select';

export default function OrdersTable({ orders, role, filters }) {
    const columns = [
        { key: 'id', label: '#' },
        { key: 'customer', label: 'Customer' },
        { key: 'total_price', label: 'Total Price' },
        { key: 'status', label: 'Status' },
        { key: 'created_at', label: 'Created At' },
        { key: 'actions', label: 'Actions', center: true },
    ];

    return (
        <SharedTable
            columns={columns}
            data={orders.data}
            links={orders.links}
            filters={filters}
            renderRow={(order, index) => (
                <tr key={order.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{index + 1}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{order.user?.name}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">${Number(order.total_price || 0).toFixed(2)}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        {order?.can?.update ? <OrderStatusSelect orderId={order.id} status={order.status} /> : <span>{order.status}</span>}
                    </td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{new Date(order.created_at).toLocaleString()}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <TableActions id={order.id} role={role} resource="orders" edit={false} destroy={order.can.delete} show={order.can.view} />
                    </td>
                </tr>
            )}
        />
    );
}
