import SharedTable from '../Shared/SharedTable';
import TableActions from '../Shared/table-actions';

export default function EmployeeTable({ employees, role, filters }) {
    const columns = [
        { key: 'id', label: '#' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'store', label: 'Store' },
        // { key: 'permissions', label: 'Permissions' },
        { key: 'actions', label: 'Actions', center: true },
    ];

    return (
        <SharedTable
            columns={columns}
            data={employees.data}
            links={employees.links}
            filters={filters}
            renderRow={(employee, index) => (
                <tr key={employee.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                    {/* ID */}
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{index + 1}</td>

                    {/* NAME */}
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{employee.user?.name}</td>

                    {/* EMAIL */}
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{employee.user?.email}</td>

                    {/* STORE */}
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        {employee.stores?.length ? (
                            <div className="flex flex-wrap gap-2">
                                {employee.stores.map((s) => (
                                    <span key={s.id} className="rounded border border-gray-300 px-2 py-1 text-sm">
                                        {s.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            '-'
                        )}
                    </td>

                    {/* PERMISSIONS */}
                    {/* <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <div className="flex flex-wrap gap-1">
                            {employee.permissions.map((p) => (
                                <span
                                    key={p.id}
                                    className="rounded bg-gray-200 px-2 py-1 text-xs"
                                >
                                    {p.name}
                                </span>
                            ))}
                        </div>
                    </td> */}

                    {/* ACTIONS */}
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <TableActions
                            id={employee.id}
                            role={role}
                            resource="employees"
                            show={employee.can?.show}
                            edit={employee.can?.update}
                            destroy={employee.can?.delete}
                        />
                    </td>
                </tr>
            )}
        />
    );
}
