import { router } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
    className?: string;
}

export default function Pagination({ links, className = '' }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <div className={`mt-10 flex flex-wrap items-center justify-center gap-2 ${className}`}>
            {links.map((link, index) => (
                <button
                    key={index}
                    disabled={!link.url}
                    onClick={() => {
                        if (link.url) {
                            router.visit(link.url, {
                                preserveState: true,
                                preserveScroll: true,
                            });
                        }
                    }}
                    className={`h-8 min-w-[32px] rounded-full border px-2.5 text-xs font-medium transition ${
                        link.active
                            ? 'border-orange-500 bg-orange-500 text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-500'
                    } ${!link.url ? 'cursor-not-allowed opacity-40' : ''} `}
                    dangerouslySetInnerHTML={{
                        __html: link.label,
                    }}
                />
            ))}
        </div>
    );
}
