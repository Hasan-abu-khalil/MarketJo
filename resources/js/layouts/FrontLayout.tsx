import { Link, router, usePage } from '@inertiajs/react';
import { Bell, HomeIcon, LayoutDashboard, LogIn, LogOut, ShoppingBag, ShoppingCart, Store, User, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-bottom-right',
    timeOut: 3000,
};

export default function FrontLayout({ children, cart_cleared }: { children: React.ReactNode; cart_cleared: boolean }) {
    const { auth, cartCount, notifications } = usePage().props as any;
    const user = auth?.user;
    // const [globalSearch, setGlobalSearch] = useState('');

    const [openNotifications, setOpenNotifications] = useState(false);

    const notificationCount = notifications?.count ?? 0;
    const displayNotificationCount = notificationCount > 99 ? '99+' : notificationCount;

    const openNotificationsPanel = () => {
        setOpenNotifications(true);
    };

    // CLOSE dropdown (also mark as read fallback)
    const closeNotificationsPanel = () => {
        setOpenNotifications(false);

        router.patch(
            route('notifications.readAll'),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    router.reload({ only: ['notifications'] });
                },
            },
        );
    };

    useEffect(() => {
        if (cart_cleared) {
            router.reload({ only: ['cartCount'] });
        }
    }, [cart_cleared]);

    // const handleSearch = () => {
    //     if (!globalSearch.trim()) return;

    //     router.get(
    //         route('products.index'),
    //         {
    //             search: globalSearch,
    //         },
    //         {
    //             preserveState: false,
    //             replace: true,
    //         },
    //     );

    //     setGlobalSearch('');
    //     setMobileMenu(false);
    // };

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#f5f7fb] text-gray-800">
            {/* HEADER */}
            <header className="top-0 z-50 w-full border-b border-white/10 bg-[#0f172a]/90 backdrop-blur-xl md:fixed">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                    {/* LOGO */}
                    <Link href="/" className="shrink-0 text-xl font-black tracking-tight text-white sm:text-2xl lg:text-2xl">
                        Market
                        <span className="text-orange-500">Jo</span>
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden items-center gap-4 lg:flex xl:gap-8">
                        <Link href="/" className="font-medium text-gray-300 transition hover:text-orange-500">
                            Home
                        </Link>

                        <Link href="/products" className="font-medium text-gray-300 transition hover:text-orange-500">
                            Products
                        </Link>

                        <Link href="/stores" className="font-medium text-gray-300 transition hover:text-orange-500">
                            Stores
                        </Link>
                        <Link href="/stores-map" className="font-medium text-gray-300 hover:text-white">
                            Map
                        </Link>
                        <Link href="/categories" className="font-medium text-gray-300 transition hover:text-orange-500">
                            Categories
                        </Link>
                    </nav>

                    {/* RIGHT SIDE */}
                    <div className="hidden items-center gap-2 md:gap-3 lg:flex lg:gap-4">
                        {/* NOTIFICATIONS */}
                        <div className="relative">
                            {/* Bell */}
                            <button
                                onClick={openNotificationsPanel}
                                className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20"
                            >
                                <Bell size={16} />

                                {notificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-2 text-xs">{displayNotificationCount}</span>
                                )}
                            </button>

                            {openNotifications && (
                                <>
                                    {/* overlay */}
                                    <div className="fixed inset-0 z-40" onClick={closeNotificationsPanel} />

                                    <div className="absolute right-0 z-50 mt-3 w-96 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                                        {/* header */}
                                        <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
                                            <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>

                                            <Link
                                                href={route('notifications.index')}
                                                onClick={closeNotificationsPanel}
                                                className="text-xs font-medium text-orange-500 hover:text-orange-600"
                                            >
                                                View all
                                            </Link>
                                        </div>

                                        {/* list */}
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications?.items?.length > 0 ? (
                                                notifications.items.map((n: any) => (
                                                    <div
                                                        key={n.id}
                                                        className={`flex gap-3 px-4 py-3 transition hover:bg-gray-50 ${
                                                            !n.read_at ? 'bg-orange-100/50' : ''
                                                        }`}
                                                    >
                                                        {/* dot indicator */}
                                                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-300" />

                                                        <div className="flex-1">
                                                            <p className="text-sm font-semibold text-gray-800">{n.data.title}</p>

                                                            <p className="text-xs text-gray-500">{n.data.status}</p>

                                                            {n.data.order_id && (
                                                                <p className="mt-1 text-[11px] text-gray-400">Order #{n.data.order_id}</p>
                                                            )}
                                                        </div>

                                                        {!n.read_at && <span className="h-2 w-2 rounded-full bg-orange-500" />}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-6 text-center text-sm text-gray-500">No notifications</div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* CART */}
                        <Link
                            href="/cart"
                            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20"
                        >
                            <ShoppingCart size={18} />

                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
                                {cartCount ?? 0}
                            </span>
                        </Link>

                        {/* AUTH */}
                        <div className="hidden items-center gap-3 lg:flex">
                            {user ? (
                                <>
                                    <Link
                                        href={
                                            user?.role === 'admin' || user?.role === 'vendor' || user?.role === 'employee'
                                                ? route('dashboard.admin-panel')
                                                : route('dashboard.index')
                                        }
                                        className="flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400"
                                    >
                                        <LayoutDashboard size={16} />
                                        Dashboard
                                    </Link>

                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-300 transition hover:text-white"
                                    >
                                        <LogIn size={16} />
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
                                    >
                                        <UserPlus size={16} />
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <div className="fixed bottom-0 left-0 z-50 w-full border-t border-white/10 bg-[#0f172a]/90 backdrop-blur-xl lg:hidden">
                <div className="flex items-center justify-around py-2 text-white">
                    <Link href="/" className="flex flex-col items-center text-xs text-gray-400 hover:text-white">
                        <HomeIcon size={14} />
                        <span>Home</span>
                    </Link>

                    <Link href="/products" className="flex flex-col items-center text-xs text-gray-400 hover:text-white">
                        <ShoppingBag size={14} />
                        <span>Shop</span>
                    </Link>
                    <Link
                        href={route('notifications.index')}
                        className="relative flex flex-col items-center justify-center text-xs text-gray-400 hover:text-white"
                    >
                        <Bell size={14} className="mx-auto" />
                        {notificationCount > 0 && (
                            <span className="absolute -top-2 right-5 rounded-full bg-red-500 px-2 text-xs text-white">
                                {displayNotificationCount}
                            </span>
                        )}
                        <span>Alerts</span>
                    </Link>
                    <Link href="/stores" className="flex flex-col items-center text-xs text-gray-400 hover:text-white">
                        <Store size={14} />
                        <span>Stores</span>
                    </Link>

                    <Link href="/cart" className="relative flex flex-col items-center text-xs text-gray-400 hover:text-white">
                        <ShoppingCart size={14} />
                        <span>Cart</span>

                        {cartCount > 0 && (
                            <span className="absolute -top-1 right-5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* PROFILE / DASHBOARD (SMART ICON) */}
                    <Link
                        href={
                            user
                                ? user.role === 'admin' || user.role === 'vendor' || user?.role === 'employee'
                                    ? route('dashboard.admin-panel')
                                    : route('dashboard.index')
                                : '/login'
                        }
                        className="flex flex-col items-center text-xs text-gray-400 hover:text-white"
                    >
                        {user ? <LayoutDashboard size={14} /> : <User size={14} />}

                        <span>{user ? 'Dashboard' : 'Login'}</span>
                    </Link>
                </div>
            </div>

            {/* PAGE CONTENT */}
            <main className="mt-0 overflow-x-hidden md:mt-14 lg:mt-16">{children}</main>

            {/* FOOTER */}
            <footer className="mt-20 bg-[#0f172a] text-white">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:py-16">
                    {/* BRAND */}
                    <div>
                        <h2 className="text-2xl font-black sm:text-3xl">
                            Market
                            <span className="text-orange-500">Jo</span>
                        </h2>

                        <p className="mt-5 leading-7 text-gray-400">
                            Modern multi vendor ecommerce platform built with Laravel, Inertia.js, React and TailwindCSS.
                        </p>
                    </div>

                    {/* LINKS */}
                    <div>
                        <h3 className="mb-5 text-lg font-bold">Shop</h3>

                        <ul className="space-y-3 text-gray-400">
                            <li>
                                <Link href="/products" className="transition hover:text-white">
                                    Products
                                </Link>
                            </li>

                            <li>
                                <Link href="/stores" className="transition hover:text-white">
                                    Stores
                                </Link>
                            </li>

                            <li>
                                <Link href="/categories" className="transition hover:text-white">
                                    Categories
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <h3 className="mb-5 text-lg font-bold">Contact</h3>

                        <div className="space-y-3 text-gray-400">
                            <p className="break-all">hasan.aak1998@gmail.com</p>

                            <p>+962 798 832 182</p>

                            <p>Amman, Jordan</p>
                        </div>
                    </div>
                </div>

                {/* BOTTOM */}
                <div className="border-t border-white/10 px-4 py-6 text-center text-sm text-gray-500">© 2026 Marketplace. All rights reserved.</div>
            </footer>
        </div>
    );
}
