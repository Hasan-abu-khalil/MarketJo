import SharedTable from '../Shared/SharedTable';
import StatusBadge from '../shared/status-badge';
import TableActions from '../shared/table-actions';
import StockBadge from './stock-badge';

export default function ProductTable({ products, role, stringToColor, filters }) {
    const columns = [
        { key: 'id', label: '#' },
        { key: 'store', label: 'Store' },
        { key: 'categories', label: 'Categories' },
        { key: 'name', label: 'Name' },
        { key: 'image', label: 'Image' },
        { key: 'price', label: 'Price' },
        { key: 'stock', label: 'Stock' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions', center: true },
    ];

    return (
        <SharedTable
            columns={columns}
            data={products.data}
            links={products.links}
            filters={filters}
            renderRow={(product, index) => (
                <tr key={product.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{index + 1}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{product.store?.name}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <div className="flex flex-wrap gap-1">
                            {product.categories?.slice(0, 2).map((cat) => (
                                <span
                                    key={cat.id}
                                    className="rounded-full px-2 py-1 text-xs text-white"
                                    style={{
                                        backgroundColor: stringToColor(cat.name),
                                    }}
                                >
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                    </td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{product.name}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <img
                            src={product.image ? `/storage/${product.image}` : '/placeholder.png'}
                            className="h-10 w-10 rounded-full object-cover"
                            alt={product.name}
                        />
                    </td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">${Number(product.price || 0).toFixed(2)}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <StockBadge stock={product.variants?.reduce((sum, v) => sum + Number(v.stock || 0), 0) || 0} />
                    </td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <StatusBadge status={product.is_active} />
                    </td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <TableActions
                            id={product.id}
                            role={role}
                            resource="products"
                            edit={product.can.update}
                            destroy={product.can.delete}
                            show={product.can.view}
                            toggleable={product.can.update}
                            isActive={product.is_active}
                            toggleRoute="dashboard.products.toggle"
                        />
                    </td>
                </tr>
            )}
        />
    );
}
