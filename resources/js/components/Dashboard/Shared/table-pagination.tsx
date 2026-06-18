import { router } from '@inertiajs/react';
export default function TablePagination({ links, filters = [] }) {
    if (!links || links.length <= 3) return null;
    // Laravel often includes "prev, 1, 2, next" even when not needed

    return (
        <div className="my-5 flex flex-wrap items-center justify-center gap-1">
            {links.map((link, i) => {
                const isDisabled = !link.url;
                const isActive = link.active;

                return (
                    <button
                        key={i}
                        disabled={isDisabled}
                        onClick={() => {
                            if (!link.url) return;
                            router.get(link.url, filters, {
                                preserveScroll: true,
                                preserveState: true,
                                replace: true,
                            });
                        }}
                        className={`min-w-[36px] rounded-full border px-3 py-1 text-sm transition ${
                            isActive ? 'border-black bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                        } ${isDisabled ? 'cursor-not-allowed opacity-40' : ''}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
