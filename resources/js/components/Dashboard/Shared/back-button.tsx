import { Button } from '@/components/ui/button';

import {  Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

type Props = {
    routeName: string;
    params?: any;
    label?: string;
    className?: string;
};

export default function BackButton({ routeName, params, label = 'Back', className = '' }: Props) {
    return (
        <Link href={route(routeName, params)}>
            <Button
                type="button"
                variant="outline"
                title='Back'
                className={`flex items-center gap-2 dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 ${className}`}
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </Button>
        </Link>
    );
}
