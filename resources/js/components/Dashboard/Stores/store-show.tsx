import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import BackButton from '../Shared/back-button';
type Props = {
    store: any;
    backRoute?: string;
};

export default function Show({ store, backRoute }: Props) {
    return (
        <div className="space-y-6 rounded-xl border bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900">
            {/* Top Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">{store.name}</h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Store details and information</p>
                </div>

                {backRoute && <BackButton routeName={backRoute} className="w-full sm:w-auto" />}
            </div>

            {/* Main Card */}
            <div className="overflow-hidden rounded-2xl border bg-white shadow-lg dark:bg-gray-900">
                {/* Header Section */}
                <div className="flex flex-col items-center gap-4 bg-gradient-to-r from-gray-800 to-black p-6 text-white">
                    <img
                        src={store.logo ? `/storage/${store.logo}` : '/placeholder.png'}
                        alt={store.name}
                        title={store.name}
                        className="h-24 w-24 rounded-full border-4 border-white object-cover shadow"
                    />

                    <h2 className="text-2xl font-bold">{store.name}</h2>
                </div>

                {/* Content Section */}
                <div className="p-2">
                    {/* Description */}
                    <div className="col-span-2">
                        <h3 className="mb-2 text-sm font-semibold text-gray-500 dark:text-white">Description</h3>
                        <p className="text-gray-700 dark:text-gray-300">{store.description || 'No description provided.'}</p>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-xl border p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <p className="text-sm text-gray-500 dark:text-white">Status</p>
                            <p className="text-lg font-semibold">{store.status ? 'Active' : 'InActive'}</p>
                        </div>
                        <div className="rounded-xl border p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <p className="text-sm text-gray-500 dark:text-white">Created At</p>
                            <p className="text-lg font-semibold">{new Date(store.created_at).toLocaleDateString()}</p>
                        </div>

                        <div className="rounded-xl border p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <p className="text-sm text-gray-500 dark:text-white">Last Updated</p>
                            <p className="text-lg font-semibold">{new Date(store.updated_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-500 dark:text-white">Location</h3>

                <div className="h-72 min-h-[300px] w-full overflow-hidden rounded-xl border">
                    <MapContainer
                        center={[store.latitude, store.longitude]}
                        zoom={10}
                        className="z-0 h-full w-full"
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                        dragging={true}
                        zoomControl={true}
                        doubleClickZoom={true}
                        touchZoom={true}
                    >
                        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        <Marker position={[store.latitude, store.longitude]} />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
