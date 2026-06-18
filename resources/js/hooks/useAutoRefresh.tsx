import { router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function useAutoRefresh(props, interval = 5000) {
    useEffect(() => {
        const timer = setInterval(() => {
            if (document.visibilityState === 'visible') {
                router.reload({
                    only: props,
                    preserveState: true,
                    preserveScroll: true,
                });
            }
        }, interval);

        return () => clearInterval(timer);
    }, [props, interval]);
}
