import SharedTable from '../Shared/SharedTable';
import TableActions from '../shared/table-actions';

export default function OrderItemsTable({ orderItems, role, filters }) {
    const columns = [
        { key: 'id', label: '#' },
        { key: 'order_by', label: 'Order By' },
        { key: 'product', label: 'Product' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'price', label: 'Price' },
        { key: 'variant', label: 'Variant' },
        { key: 'image', label: 'Image' },
        { key: 'created_at', label: 'Created At' },
        { key: 'actions', label: 'Actions', center: true },
    ];

    return (
        <SharedTable
            columns={columns}
            data={orderItems.data}
            links={orderItems.links}
            filters={filters}
            renderRow={(item, index) => (
                <tr key={item.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{index + 1}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{item.order?.user?.name}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{item.product?.name}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{item.quantity}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">${Number(item.price || 0).toFixed(2)}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        {item.variant_label ? (
                            <span className="text-sm">{item.variant_label}</span>
                        ) : (
                            <span className="text-gray-400">No variant</span>
                        )}
                    </td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <img
                            src={
                                item.variant?.image
                                    ? `/storage/${item.variant.image}`
                                    : item.product?.image
                                      ? `/storage/${item.product.image}`
                                      : '/placeholder.png'
                            }
                            className="h-10 w-10 rounded-full object-cover"
                            alt={item.product?.name}
                        />
                    </td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{new Date(item.created_at).toLocaleString()}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <TableActions id={item.id} role={role} resource="order-items" edit={false} destroy={item.can.delete} show={item.can.show} />
                    </td>
                </tr>
            )}
        />
    );
}
