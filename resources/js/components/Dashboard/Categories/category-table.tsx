import SharedTable from '../Shared/SharedTable';
import TableActions from '../shared/table-actions';

export default function CategoryTable({ categories, role, filters }) {
    const columns = [
        { key: 'id', label: '#' },
        { key: 'store', label: 'Store' },
        { key: 'name', label: 'Name' },
        { key: 'actions', label: 'Actions', center: true },
    ];

    return (
        <SharedTable
            columns={columns}
            data={categories.data}
            links={categories.links}
            filters={filters}
            renderRow={(category, index) => (
                <tr key={category.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{index + 1}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{category.store?.name}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{category.name}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <TableActions
                            id={category.id}
                            role={role}
                            resource="categories"
                            show={category.can?.show}
                            edit={category.can?.update}
                            destroy={category.can?.delete}
                        />
                    </td>
                </tr>
            )}
        />
    );
}
