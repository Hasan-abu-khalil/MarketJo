import SharedTable from '../Shared/SharedTable';
import TableActions from '../Shared/table-actions';
import VendorOrderStatusSelect from './vendor-order-status-select';
export default function VendorOrderTable({ orders, filters }) {
    const columns = [
        { key: 'id', label: '#' },
        { key: 'customer', label: 'Customer' },
        { key: 'order', label: 'Order Item' },
        { key: 'product', label: 'Product' },
        { key: 'quantity', label: 'Qty' },
        { key: 'price', label: 'Price' },
        { key: 'status', label: 'Status' },
        { key: 'image', label: 'Image' },
        { key: 'created_at', label: 'Created At' },
        { key: 'actions', label: 'Actions', center: true },
    ];
    

    return (
        <SharedTable
            columns={columns}
            data={orders.data}
            links={orders.links}
            filters={filters}
            renderRow={(item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{index + 1}</td>

                    <td className="px-3 py-4 ">{item.order?.user?.name}</td>
                    <td>
                        #{item.order_id}
                        <span className="text-xs text-gray-500"> item #{item.order_item_id}</span>
                    </td>
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{item.order_item?.product?.name }</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{item.quantity}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">${Number(item.price).toFixed(2)}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4 capitalize">
                        {' '}
                        <VendorOrderStatusSelect vendorOrderId={item.id} status={item.status} />
                    </td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <img
                            src={
                                item.order_item?.variant?.image
                                    ? `/storage/${item.order_item.variant.image}`
                                    : item.order_item?.product?.image
                                      ? `/storage/${item.order_item.product.image}`
                                      : '/placeholder.png'
                            }
                            className="h-10 w-10 rounded-full object-cover"
                            alt={item.order_item?.product?.name || 'Product'}
                        />
                    </td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{new Date(item.created_at).toLocaleString()}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <TableActions
                            id={item.id}
                            role="vendor"
                            resource="vendor-orders"
                            edit={false}
                            destroy={item.can.delete}
                            show={item.can.show}
                        />
                    </td>
                </tr>
            )}
        />
    );
}
