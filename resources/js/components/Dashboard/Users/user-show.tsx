import BackButton from '../Shared/back-button';
type Props = {
    user: any;
    backRoute?: string;
};

export default function Show({ user, backRoute }: Props) {
    return (
        <div className="space-y-6 rounded-xl border bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900">
            {/* Top Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">Customer Details</h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View complete customer information</p>
                </div>

                {backRoute && <BackButton routeName={backRoute} className="w-full sm:w-auto" />}
            </div>

            {/* Profile section */}
            <div className="flex items-center gap-4 border-b pb-6 dark:border-gray-700">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-bold dark:bg-gray-700">
                    {user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-500">{user.email}</p>

                    <span className="mt-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                        {user.role}
                    </span>
                </div>
            </div>

            {/* Info section */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user.name}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{user.email}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium capitalize">{user.role}</p>
                </div>
            </div>
        </div>
    );
}
