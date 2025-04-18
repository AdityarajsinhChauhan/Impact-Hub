import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { useEffect, useState } from 'react';
import "./mapview.css"; // Import this if you create a separate CSS file instead

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

const MapView = ({ markers = [], onMarkerClick, onViewDetails }) => {
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

  const handleViewDetailsClick = (e, user) => {
    e.stopPropagation();
    // Call both marker click (to select the user) and view details
    onMarkerClick && onMarkerClick(user);
    onViewDetails && onViewDetails(user);
  };

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
            <Popup className="custom-popup">
              <div className="min-w-[200px] py-1">
                <div className="font-bold text-emerald-700 text-lg border-b pb-1 mb-2">
                  {user.name}
                </div>
                <div className="flex flex-col space-y-1 text-sm">
                  <div>{user.email}</div>
                  {user.passion && (
                    <div className="text-gray-700">
                      <span className="font-medium">Passion:</span> {user.passion}
                    </div>
                  )}
                  {user.interests && user.interests.length > 0 && (
                    <div className="mt-1">
                      <div className="font-medium text-gray-700">Interests:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.interests.slice(0, 3).map((interest, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                            {interest}
                          </span>
                        ))}
                        {user.interests.length > 3 && (
                          <span className="text-xs text-gray-500">+{user.interests.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={(e) => handleViewDetailsClick(e, user)}
                    className="mt-2 w-full text-center py-1.5 bg-emerald-500 text-white text-sm rounded hover:bg-black transition-all duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};


export default MapView;
