import SharedTable from '../Shared/SharedTable';
import StatusBadge from '../shared/status-badge';
import TableActions from '../shared/table-actions';

export default function StoreTable({ stores, role, filters }) {
    const columns = [
        { key: 'id', label: '#' },
        { key: 'created_by', label: 'Created by' },
        { key: 'name', label: 'Store Name' },
        { key: 'logo', label: 'Logo' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions', center: true },
    ];

    return (
        <SharedTable
            columns={columns}
            data={stores.data}
            links={stores.links}
            filters={filters}
            renderRow={(store, index) => (
                <tr key={store.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{index + 1}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{store.user?.name}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{store.name}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <img
                            src={store.logo ? `/storage/${store.logo}` : '/placeholder.png'}
                            className="h-10 w-10 rounded-full object-cover"
                            alt={store.name}
                        />
                    </td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <StatusBadge status={store.status} />
                    </td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <TableActions
                            id={store.id}
                            role={role}
                            resource="stores"
                            edit={store.can.update}
                            destroy={store.can.delete}
                            toggleable={store.can.toggle}
                            isActive={store.status}
                            toggleRoute="dashboard.stores.toggle"
                        />
                    </td>
                </tr>
            )}
        />
    );
}
