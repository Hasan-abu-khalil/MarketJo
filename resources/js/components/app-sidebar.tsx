import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    BoxIcon,
    HandshakeIcon,
    HomeIcon,
    LayoutGrid,
    ListTree,
    Moon,
    PackageIcon,
    ShoppingCart,
    Store,
    Sun,
    User,
    User2Icon,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { useAppearance } from '@/hooks/use-appearance';
import AppLogo from './app-logo';

export function AppSidebar() {
    const user = usePage().props.auth.user;
    const { nav, notifications } = usePage().props as any;
    const { appearance, updateAppearance } = useAppearance();

    const navItems = [
        {
            title: 'Home',
            url: '/',
            icon: HomeIcon,
            show: true,
        },

        {
            title: 'Dashboard',
            url: '/dashboard/adminPanel',
            icon: LayoutGrid,
            show: nav?.dashboard,
        },

        {
            title: 'Users',
            url: '/dashboard/users',
            icon: User2Icon,
            show: nav?.users,
        },

        {
            title: 'Vendor Requests',
            url: '/dashboard/vendor-requests',
            icon: HandshakeIcon,
            show: nav?.vendorRequests,
        },

        {
            title: 'Employees',
            url: '/dashboard/employees',
            icon: User,
            show: nav?.employees,
        },

        {
            title: 'Stores',
            url: '/dashboard/stores',
            icon: Store,
            show: nav?.stores,
        },

        {
            title: 'Categories',
            url: '/dashboard/categories',
            icon: ListTree,
            show: nav?.categories,
        },

        {
            title: 'Products',
            url: '/dashboard/products',
            icon: BoxIcon,
            show: nav?.products,
        },

        {
            title: 'Orders',
            url: '/dashboard/orders',
            icon: ShoppingCart,
            show: nav?.orders,
        },

        {
            title: 'Order Items',
            url: '/dashboard/order-items',
            icon: PackageIcon,
            show: nav?.orderItems,
        },

        {
            title: 'Vendor Orders',
            url: '/dashboard/vendor-orders',
            icon: ShoppingCart,
            show: nav?.vendorOrders,
        },

        {
            title: 'Notifications',
            url: '/dashboard/notifications',
            icon: Bell,
            badge: notifications?.count ?? 0,
            show: nav?.notifications,
        },
    ].filter((item) => item.show);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard/adminPanel">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <div className="mt-2 flex justify-start">
                        <button
                            onClick={() => updateAppearance(appearance === 'dark' ? 'light' : 'dark')}
                            className="flex items-center gap-1 text-sm"
                        >
                            {appearance === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            {appearance === 'dark' ? 'Light' : 'Dark'}
                        </button>
                    </div>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
