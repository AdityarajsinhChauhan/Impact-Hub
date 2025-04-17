import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

// Component to update map center
const SetMapCenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);
  return null;
};

const MapView = ({ markers = [], onMarkerClick }) => {
  const [userPosition, setUserPosition] = useState([22.7196, 75.8577]); // default to Indore

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserPosition([
            position.coords.latitude,
            position.coords.longitude
          ]);
        },
        err => console.log("Location access denied or failed", err)
      );
    }
  }, []);

  return (
    <div className="w-full z-40 h-[27rem] rounded-2xl overflow-hidden shadow-2xl border border-gray-300">
      <MapContainer
        center={userPosition}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <SetMapCenter position={userPosition} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        {/* User markers from backend */}
        {markers.map((user, index) => (
          <Marker
            key={index}
            position={[user.location.latitude, user.location.longitude]}
            eventHandlers={{
              click: () => {
                onMarkerClick && onMarkerClick(user);
              }
            }}
          >
            <Popup>
              <strong>{user.name}</strong><br />
              {user.email}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};


export default MapView;
