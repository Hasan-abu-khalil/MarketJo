import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import TablePagination from './table-pagination';

toastr.options = {
    closeButton: true,
    progressBar: true,
    timeOut: 3000,
};

export default function SharedTable({ columns, data, links, filters, renderRow }) {
    return (
        <div className="mt-2 bg-white dark:bg-gray-900">
            <div className="rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
                {/* Horizontal scroll only when needed */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className={`px-2 py-2 text-xs sm:px-3 sm:text-sm md:px-4 ${
                                            column.center ? 'text-center' : 'text-left'
                                        } `}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-900">
                            {data.map((item, index) => renderRow(item, index))}
                        </tbody>
                    </table>
                </div>

                <div className="px-2 py-3 sm:px-4">
                    <TablePagination links={links} filters={filters} />
                </div>
            </div>
        </div>
    );
}
