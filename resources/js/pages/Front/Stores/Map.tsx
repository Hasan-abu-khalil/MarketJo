import useAutoRefresh from '@/hooks/useAutoRefresh';
import FrontLayout from '@/layouts/FrontLayout';
import { Link } from '@inertiajs/react';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const getStoreLogo = (store: any) => (store.logo ? `/storage/${store.logo}` : '/placeholder.png');

const createStoreIcon = (store: any) =>
    L.divIcon({
        className: '',
        html: `
            <div class="flex items-center justify-center">
                <div class="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white">
                    <img src="${getStoreLogo(store)}" class="w-full h-full object-cover"/>
                </div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });

export default function StoresMap({ stores }: any) {
        useAutoRefresh(['stores']);
    
    const center: [number, number] = [31.9539, 35.9106];

    const mapRef = useRef<any>(null);
    const markerRefs = useRef<any>({});

    const [activeStore, setActiveStore] = useState<any>(null);
    const [search, setSearch] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [orderedStores, setOrderedStores] = useState(stores);

    const focusStore = (store: any) => {
        setActiveStore(store);

        setOrderedStores((prev: any[]) => {
            const updated = prev.filter((s) => s.id !== store.id);
            return [store, ...updated];
        });

        const map = mapRef.current;
        const marker = markerRefs.current[store.id];

        if (map) {
            map.flyTo([store.latitude, store.longitude], 16, {
                duration: 1.2,
            });
        }

        if (marker) marker.openPopup();

        // auto close mobile drawer
        setSidebarOpen(false);
    };

    const filteredStores = orderedStores.filter((store: any) => {
        const keyword = search.toLowerCase();

        return store.name?.toLowerCase().includes(keyword) || store.address?.toLowerCase().includes(keyword);
    });

    useEffect(() => {
        setOrderedStores(stores);
    }, [stores]);

    return (
        <FrontLayout>
            <div className="relative flex h-[calc(100vh-64px)] w-full bg-gray-100 pt-0 ">
                {/* ================= MOBILE TOP BAR ================= */}
                <div className="absolute top-0 right-0 left-0 z-[1100] flex items-center gap-2 bg-white p-3 shadow md:hidden">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-lg border px-3 py-1 text-sm">
                        ☰
                    </button>

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search stores..."
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                    />
                </div>

                {/* ================= LEFT SIDEBAR (DESKTOP) ================= */}
                <div className="hidden w-80 flex-col border-r bg-white shadow-sm md:flex">
                    <div className="border-b p-4">
                        <h2 className="text-lg font-bold">🏪 Stores</h2>

                        <input
                            type="text"
                            placeholder="Search stores..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mt-3 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex-1 space-y-2 overflow-y-auto p-2">
                        {filteredStores.map((store: any) => (
                            <div
                                key={store.id}
                                onClick={() => focusStore(store)}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl p-3 transition hover:bg-gray-50 ${
                                    activeStore?.id === store.id ? 'border-2 border-orange-500 bg-blue-50' : 'border'
                                }`}
                            >
                                <img src={getStoreLogo(store)} className="h-10 w-10 rounded-full border object-cover" />

                                <div className="flex-1">
                                    <p className="text-sm font-semibold">{store.name}</p>
                                    <p className="text-xs text-gray-500">{store.address}</p>

                                    <Link
                                        href={`/stores/${store.slug}`}
                                        className="text-xs text-blue-600 underline"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        View Store
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ================= MOBILE SIDEBAR (DRAWER) ================= */}
                {sidebarOpen && (
                    <div className="absolute top-0 left-0 z-[1200] h-full w-full bg-white md:hidden">
                        <div className="border-b p-4">
                            <h2 className="text-lg font-bold">🏪 Stores</h2>
                        </div>

                        <div className="space-y-2 overflow-y-auto p-2">
                            {filteredStores.map((store: any) => (
                                <div key={store.id} onClick={() => focusStore(store)} className="flex items-center gap-3 rounded-xl border p-3">
                                    <img src={getStoreLogo(store)} className="h-10 w-10 rounded-full border object-cover" />

                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">{store.name}</p>
                                        <p className="text-xs text-gray-500">{store.address}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ================= MAP ================= */}
                <div className="flex-1 pt-14 md:pt-0">
                    <MapContainer center={center} zoom={7} className="h-full w-full" whenCreated={(map) => (mapRef.current = map)}>
                        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {filteredStores.map((store: any) => (
                            <Marker
                                key={store.id}
                                position={[store.latitude, store.longitude]}
                                icon={createStoreIcon(store)}
                                ref={(ref) => {
                                    if (ref) markerRefs.current[store.id] = ref;
                                }}
                                eventHandlers={{
                                    click: () => focusStore(store),
                                }}
                            >
                                <Popup>
                                    <div className="w-48 space-y-2 text-center">
                                        <img src={getStoreLogo(store)} className="mx-auto h-10 w-10 rounded-full" />
                                        <p className="font-bold">{store.name}</p>

                                        <Link href={`/stores/${store.slug}`} className="text-sm text-blue-600">
                                            Open Store
                                        </Link>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </FrontLayout>
    );
}
