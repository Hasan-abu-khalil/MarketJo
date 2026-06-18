import SharedTable from '../Shared/SharedTable';
import TableActions from '../shared/table-actions';
import UserStatusSelect from './user-status-select';

export default function UsersTable({ users, role, filters }) {
    const filteredUsers = users.data.filter((user) => user.role !== 'admin');
    const columns = [
        { key: 'id', label: '#' },
        { key: 'name', label: 'Customer' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'actions', label: 'Actions', center: true },
    ];
    return (
        <SharedTable
            columns={columns}
            data={filteredUsers}
            links={users.links}
            filters={filters}
            renderRow={(user, index) => (
                <tr key={user.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{index + 1}</td>
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{user.name}</td>
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{user.email}</td>
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        {user.can.update ? <UserStatusSelect userId={user.id} role={user.role} /> : <span className="capitalize">{user.role}</span>}
                    </td>
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <TableActions id={user.id} role={role} resource="users" edit={false} destroy={user.can.delete} show={user.can.show} />
                    </td>
                </tr>
            )}
        />
    );
}
