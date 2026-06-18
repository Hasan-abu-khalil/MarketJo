import { router } from '@inertiajs/react';
import toastr from 'toastr';

interface UserRoleSwitchProps {
    userId: number;
    role: string;
}

export default function UserRoleSwitch({ userId, role }: UserRoleSwitchProps) {
    const isAdmin = role === 'admin';
    const isCustomer = role === 'customer';

    const handleChange = () => {
        if (isAdmin) return;

        const newRole = isCustomer ? 'vendor' : 'customer';

        router.put(
            route('dashboard.users.update', userId),
            {
                role: newRole,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toastr.success('User role updated successfully.');
                },
            },
        );
    };

    return (
        <button
            type="button"
            onClick={handleChange}
            disabled={isAdmin}
            className={`flex items-center gap-3 ${isAdmin ? 'cursor-not-allowed opacity-50' : ''}`}
        >
            <span className={`text-sm font-medium ${!isCustomer ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>Vendor</span>

            <div className={`relative h-6 w-12 rounded-full transition ${isCustomer ? 'bg-green-600' : 'bg-blue-600'}`}>
                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${isCustomer ? 'left-7' : 'left-1'}`} />
            </div>

            <span className={`text-sm font-medium ${isCustomer ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>Customer</span>
        </button>
    );
}
