import ProductFilters from '@/components/Dashboard/Products/product-filters';
import ProductTable from '@/components/Dashboard/Products/product-table';
import useAutoRefresh from '@/hooks/useAutoRefresh';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

import { Head, router } from '@inertiajs/react';

import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: ' Products', href: '/dashboard/products' }];

export default function ProductsDashboard({ products, filters, categories, permissions }) {
     useAutoRefresh(['products']);
    const [search, setSearch] = useState(filters.search || '');

    const [category, setCategory] = useState(filters.category || '');

    const [isActive, setIsActive] = useState(filters.is_active ?? null);

    const [stockStatus, setStockStatus] = useState(filters.stock_status || '');
    const handleImport = (file: File) => {
        const formData = new FormData();

        formData.append('file', file);

        router.post(route('dashboard.products.import'), formData, {
            forceFormData: true,
            preserveScroll: true,

            // onStart: () => {
            //     console.log('Import started...');
            // },

            // onSuccess: () => {
            //     console.log('Import success');
            // },

            // onError: (errors) => {
            //     console.log('Import failed', errors);
            // },
        });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route('dashboard.products.index'),
                {
                    search,
                    category,
                    is_active: isActive,
                    stock_status: stockStatus,
                    page: 1,
                },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, category, isActive, stockStatus]);

    

    function stringToColor(str) {
        let hash = 0;

        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        return `hsl(${hash % 360}, 70%, 60%)`;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products Dashboard" />

            <ProductFilters
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                categories={categories}
                isActive={isActive}
                setIsActive={setIsActive}
                stockStatus={stockStatus}
                setStockStatus={setStockStatus}
                permissions={permissions}
                role="admin"
                onImport={handleImport}
            />

            <ProductTable
                products={products}
                role="admin"
                stringToColor={stringToColor}
                filters={{
                    search,
                    category,
                    is_active: isActive,
                    stock_status: stockStatus,
                }}
            />
        </AppLayout>
    );
}
