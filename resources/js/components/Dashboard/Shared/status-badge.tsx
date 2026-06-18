interface StatusBadgeProps {
    status: boolean | number | string;
}

export default function StatusBadge({
    status,
}: StatusBadgeProps) {
    const active =
        status === true ||
        status === 1 ||
        status === 'active';

    return (
        <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
                active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
            }`}
        >
            {active ? 'Active' : 'InActive'}
        </span>
    );
}