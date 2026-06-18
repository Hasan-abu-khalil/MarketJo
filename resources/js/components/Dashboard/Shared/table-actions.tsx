import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { confirmDelete } from './delete-modal';

interface TableActionsProps {
    id: number;
    role: string;
    resource: string;

    show?: boolean;
    edit?: boolean;
    destroy?: boolean;
}

export default function TableActions({
    id,
    role,
    resource,

    show = true,
    edit = true,
    destroy = true,

    toggleable = false,
    isActive = false,
    toggleRoute,
}: TableActionsProps) {
    const handleDelete = async () => {
        const result = await confirmDelete();

        if (result.isConfirmed) {
            router.delete(route(`dashboard.${resource}.destroy`, id), {
                preserveScroll: true,

                onSuccess: () => {
                    toastr.success('Deleted successfully');
                },
            });
        }
    };

    const handleToggle = () => {
        if (!toggleRoute) return;

        router.put(
            route(toggleRoute, id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toastr.success(isActive ? 'Deactivated successfully' : 'Activated successfully');
                },
            },
        );
    };

    return (
        <div className="flex justify-center gap-2">
            {toggleable && (
                <button
                    onClick={handleToggle}
                    title='Change'
                    className={`relative inline-flex h-6 w-11 items-center self-center rounded-full transition ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                    <span className={`h-4 w-4 transform rounded-full bg-white transition ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            )}

            {show && (
                <Link href={route(`dashboard.${resource}.show`, id)}>
                    <Button variant="outline" size="sm" title='View'>
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
            )}

            {edit && (
                <Link href={route(`dashboard.${resource}.edit`, id)}>
                    <Button variant="outline" size="sm" title='Edit'>
                        <Pencil className="h-4 w-4" />
                    </Button>
                </Link>
            )}

            {destroy && (
                <Button variant="destructive" size="sm" onClick={handleDelete} title='Delete'>
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
