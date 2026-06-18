import axios from 'axios';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function LocationMarker({ data, setData }: any) {
    useMapEvents({
        async click(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;

            // save coordinates
            setData('latitude', lat);
            setData('longitude', lng);

            try {
                // reverse geocoding
                const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);

                // save address
                setData('address', response.data.display_name);
            } catch (error) {
                console.error(error);
            }
        },
    });

    return <Marker position={[data.latitude, data.longitude]} icon={markerIcon} />;
}

export default function StoreMapPicker({ data, setData }: any) {
    return (
        <MapContainer
            center={[data.latitude, data.longitude]}
            zoom={13}
            style={{
                height: '400px',
                width: '100%',
                borderRadius: '12px',
            }}
        >
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <LocationMarker data={data} setData={setData} />
        </MapContainer>
    );
}
