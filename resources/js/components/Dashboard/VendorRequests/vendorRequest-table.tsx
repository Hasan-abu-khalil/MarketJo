import SharedTable from '../Shared/SharedTable';
import TableActions from '../shared/table-actions';
import VendorRequestStatusSelect from './vendorRequest-status-select';

export default function VendorRequestsTable({ vendorRequests, role, filters }) {
    const columns = [
        { key: 'id', label: '#' },
        { key: 'customer', label: 'Customer' },
        { key: 'email', label: 'Email' },
        { key: 'store_name', label: 'Store Name' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions', center: true },
    ];

    return (
        <SharedTable
            columns={columns}
            data={vendorRequests.data}
            links={vendorRequests.links}
            filters={filters}
            renderRow={(vendorRequest, index) => (
                <tr key={vendorRequest.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{index + 1}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{vendorRequest.user?.name}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{vendorRequest.user?.email}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">{vendorRequest.store_name}</td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        {vendorRequest.can.update ? (
                            <VendorRequestStatusSelect
                                vendorRequestId={vendorRequest.id}
                                status={vendorRequest.status}
                                isActive={vendorRequest.is_active}
                            />
                        ) : (
                            <span className="capitalize">{vendorRequest.status}</span>
                        )}
                    </td>

                    <td className="px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4">
                        <TableActions
                            id={vendorRequest.id}
                            role={role}
                            resource="vendor-requests"
                            edit={false}
                            destroy={vendorRequest.can.delete}
                            show={vendorRequest.can.view}
                        />
                    </td>
                </tr>
            )}
        />
    );
}
