import { useState, useEffect, useRef } from "react";
import { MapPin, Search, Navigation, Phone, Shield, Search as SearchIcon, Filter, AlertTriangle, X } from "lucide-react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import "leaflet-routing-machine";

// Fix for default marker icon in Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const safeIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const dangerIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const userIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Component to handle routing
function Routing({ start, end }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !start || !end) return;

    if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng)
      ],
      lineOptions: {
        styles: [{ color: "#ef4444", weight: 6, opacity: 0.8 }]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      show: true,
      createMarker: () => null // Use our own markers
    }).addTo(map);

    return () => {
        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
        }
    };
  }, [map, start, end]);

  return null;
}

// Component to recenter map
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
        map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

const SafePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [dangerPlaces, setDangerPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.9320, 77.7523]); // Default Amravati
  const [activeTab, setActiveTab] = useState('safe');
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
            const currentLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setLocation(currentLoc);
            // Only update map center automatically if not currently navigating
            if (!destination) {
                setMapCenter([pos.coords.latitude, pos.coords.longitude]);
            }
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
    return () => {
        if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [destination]);


  const fetchNearby = async () => {
    if (!location) return;
    setLoading(true);
    try {
      const safeResponse = await axios.post("http://localhost:5000/api/safeplaces/nearby-safe-places", {
        lat: location.lat,
        lng: location.lng
      });
      setPlaces(safeResponse.data.safePlaces);

      const dangerResponse = await axios.post("http://localhost:5000/api/dangerplaces/nearby-danger-places", {
        lat: location.lat,
        lng: location.lng
      });
      setDangerPlaces(dangerResponse.data.dangerPlaces);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDirections = (placeLat, placeLng) => {
    setDestination({ lat: placeLat, lng: placeLng });
    setMapCenter([placeLat, placeLng]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 bg-gray-50 min-h-[calc(100vh-80px)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-6 md:space-y-0 relative">
        <div className="max-w-xl">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-4">
            Safety <span className="text-red-600">Navigator</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed font-semibold">
            Locate police stations and verified safe zones in real-time.
          </p>
        </div>

        <div className="flex gap-4">
             {destination && (
                <button 
                  onClick={() => setDestination(null)}
                  className="bg-black text-white px-6 py-4 rounded-3xl font-black flex items-center gap-2"
                >
                    <X size={20} /> CLEAR ROUTE
                </button>
            )}
            <button
                onClick={fetchNearby}
                disabled={loading || !location}
                className="bg-red-600 hover:bg-black text-white font-black px-8 py-4 rounded-3xl shadow-xl shadow-red-100 transition-all transform active:scale-95 flex items-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <>
                    <SearchIcon size={24} strokeWidth={3} />
                    SCAN NEARBY
                    </>
                )}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Map View */}
        <div className="lg:col-span-8 bg-white p-4 rounded-[2rem] shadow-2xl border-4 border-white min-h-[600px] relative overflow-hidden group">
          <MapContainer center={mapCenter} zoom={13} style={{ height: '600px', width: '100%', borderRadius: '1.5rem' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ChangeView center={mapCenter} zoom={15} />
            
            {/* User Location */}
            {location && (
                <Marker position={[location.lat, location.lng]} icon={userIcon}>
                    <Popup className="rounded-xl">
                        <div className="font-bold flex items-center gap-2">
                            <MapPin size={16} className="text-blue-600" />
                            YOU ARE HERE
                        </div>
                    </Popup>
                </Marker>
            )}

            {/* In-app Navigation Routing */}
            {location && destination && (
                <Routing start={location} end={destination} />
            )}

            {/* Safe Places Markers (Only show if not currently navigating) */}
            {!destination && places.map((place, i) => (
                <Marker key={`safe-${i}`} position={[place.location.lat, place.location.lng]} icon={safeIcon}>
                    <Popup>
                        <div className="p-2 min-w-[150px]">
                            <h4 className="font-bold text-gray-900 mb-1">{place.name}</h4>
                            <p className="text-xs text-gray-500 mb-3">{place.address}</p>
                            <div className="flex flex-col gap-2">
                                <a href={`tel:${place.phone}`} className="flex items-center gap-2 text-xs bg-green-50 text-green-700 p-2 rounded-lg font-bold">
                                    <Phone size={14} /> CALL: {place.phone}
                                </a>
                                <button onClick={() => handleDirections(place.location.lat, place.location.lng)} className="bg-black text-white p-2 rounded-lg text-xs font-bold w-full">
                                    SEE ROUTE
                                </button>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Destination Marker */}
            {destination && (
                <Marker position={[destination.lat, destination.lng]} icon={safeIcon}>
                     <Popup>
                        <div className="p-2 font-bold text-green-600">DESTINATION</div>
                    </Popup>
                </Marker>
            )}

            {/* Danger Places Markers */}
            {!destination && dangerPlaces.map((place, i) => (
                <Marker key={`danger-${i}`} position={[place.location.lat, place.location.lng]} icon={dangerIcon}>
                    <Popup>
                        <div className="p-2">
                            <h4 className="font-bold text-red-600 flex items-center gap-2 mb-1">
                                <AlertTriangle size={16} /> DANGER ZONE
                            </h4>
                            <p className="text-xs font-bold text-gray-900">{place.name}</p>
                            <p className="text-xs text-gray-500">{place.description}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
          </MapContainer>
        </div>

        {/* List View */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col h-[600px]">
            <div className="flex gap-2 mb-6 bg-gray-50 p-1 rounded-2xl">
                <button 
                  onClick={() => setActiveTab('safe')}
                  className={`flex-1 py-3 px-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'safe' ? 'bg-white shadow-md text-green-600' : 'text-gray-500'}`}
                >
                    <Shield size={18} /> SAFE
                </button>
                <button 
                  onClick={() => setActiveTab('danger')}
                  className={`flex-1 py-3 px-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'danger' ? 'bg-white shadow-md text-red-600' : 'text-gray-500'}`}
                >
                    <AlertTriangle size={18} /> DANGER
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                {activeTab === 'safe' ? (
                    <div className="space-y-4">
                        {places.length > 0 ? (
                            places.map((place, i) => (
                                <div key={i} className={`p-5 rounded-2xl border transition-all group shadow-sm ${destination?.lat === place.location.lat ? 'border-red-500 bg-red-50/20' : 'bg-gray-50 border-transparent hover:border-green-200'}`}>
                                    <h5 className="font-black text-lg text-gray-900 mb-1 leading-tight">{place.name}</h5>
                                    <p className="text-xs font-bold text-gray-500 mb-4 flex items-center gap-2">
                                        <Navigation size={12} className="text-red-500" />
                                        {place.distance} km away
                                    </p>
                                    <div className="flex gap-2">
                                        <a href={`tel:${place.phone}`} className="flex-1 bg-white border-2 border-gray-100 hover:border-green-600 text-gray-700 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all">
                                            <Phone size={14} /> CALL
                                        </a>
                                        <button 
                                          onClick={() => handleDirections(place.location.lat, place.location.lng)}
                                          className={`flex-1 font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1 ${destination?.lat === place.location.lat ? 'bg-red-600 text-white' : 'bg-black text-white hover:bg-red-600'}`}
                                        >
                                            {destination?.lat === place.location.lat ? 'SELECTED' : 'NAVIGATE'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 opacity-50">
                                <Search size={40} className="mx-auto mb-2 text-gray-300" />
                                <p className="font-bold text-sm">No safe zones found yet.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                         {dangerPlaces.length > 0 ? (
                            dangerPlaces.map((place, i) => (
                                <div key={i} className="p-5 bg-red-50/50 rounded-2xl border border-transparent hover:border-red-200 transition-all group shadow-sm">
                                    <h5 className="font-black text-lg text-red-600 mb-1 leading-tight">{place.name}</h5>
                                    <p className="text-xs text-gray-600 mb-3 font-semibold">{place.description}</p>
                                    <p className="text-[10px] font-black uppercase text-red-400 tracking-wider">High Risk Area</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 opacity-50">
                                <AlertTriangle size={40} className="mx-auto mb-2 text-gray-300" />
                                <p className="font-bold text-sm">No danger zones reported.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafePlaces;
