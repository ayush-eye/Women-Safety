import { useState, useEffect, useRef } from "react";
import { MapPin, Search, Navigation, Phone, Shield, Search as SearchIcon, AlertTriangle, X, Activity, Flame, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import "leaflet-routing-machine";

import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const safeIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});
const dangerIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});
const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

function Routing({ start, end }) {
  const map = useMap();
  const routingControlRef = useRef(null);
  useEffect(() => {
    if (!map || !start || !end) return;
    if (routingControlRef.current) map.removeControl(routingControlRef.current);
    routingControlRef.current = L.Routing.control({
      waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
      lineOptions: { styles: [{ color: "#ef4444", weight: 6, opacity: 0.8 }] },
      addWaypoints: false, draggableWaypoints: false, show: true, createMarker: () => null,
    }).addTo(map);
    return () => { if (routingControlRef.current) map.removeControl(routingControlRef.current); };
  }, [map, start, end]);
  return null;
}

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => { if (center && zoom) map.setView(center, zoom); }, [center, zoom, map]);
  return null;
}

function HeatmapLayer({ points, visible }) {
  const map = useMap();
  const heatRef = useRef(null);

  useEffect(() => {
    if (!map) return;
    const cleanup = () => {
      if (heatRef.current) {
        try { map.removeLayer(heatRef.current); } catch (e) { }
        heatRef.current = null;
      }
    };
    if (!visible || !points || points.length === 0) { cleanup(); return; }

    const addHeat = () => {
      cleanup();
      heatRef.current = L.heatLayer(points, {
        radius: 35, blur: 25, maxZoom: 18, max: 1.0,
        gradient: { 0.1: '#3b82f6', 0.3: '#22c55e', 0.55: '#eab308', 0.75: '#f97316', 1.0: '#ef4444' },
      }).addTo(map);
    };

    if (L.heatLayer) {
      addHeat();
    } else {
      const existing = document.getElementById('leaflet-heat-script');
      if (existing) { existing.addEventListener('load', addHeat); return cleanup; }
      const script = document.createElement('script');
      script.id = 'leaflet-heat-script';
      script.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
      script.onload = addHeat;
      document.head.appendChild(script);
    }
    return cleanup;
  }, [map, points, visible]);

  return null;
}

const SEV_STYLES = {
  Low: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', bar: 'bg-green-500', badge: 'bg-green-100 text-green-800', ring: 'ring-green-400' },
  Moderate: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', bar: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-800', ring: 'ring-yellow-400' },
  High: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', bar: 'bg-orange-500', badge: 'bg-orange-100 text-orange-800', ring: 'ring-orange-400' },
  Critical: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', bar: 'bg-red-500', badge: 'bg-red-100 text-red-800', ring: 'ring-red-400' },
};

const SafePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [dangerPlaces, setDangerPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.9320, 77.7523]);
  const [activeTab, setActiveTab] = useState('safe');
  const [destination, setDestination] = useState(null);

  const [severityLoading, setSeverityLoading] = useState(false);
  const [severityData, setSeverityData] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

  useEffect(() => {
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const currentLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(currentLoc);
          if (!destination) setMapCenter([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
    return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
  }, [destination]);

  const fetchNearby = async () => {
    if (!location) return;
    setLoading(true);
    try {
      const safeResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/safeplaces/nearby-safe-places`, { lat: location.lat, lng: location.lng });
      setPlaces(safeResponse.data.safePlaces);
      const dangerResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/dangerplaces/nearby-danger-places`, { lat: location.lat, lng: location.lng });
      setDangerPlaces(dangerResponse.data.dangerPlaces);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchSeverity = async () => {
    if (!location) return;
    setSeverityLoading(true);
    setActiveTab('severity');
    setSeverityData(null);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/severity/nearby`, { lat: location.lat, lng: location.lng, radius: 1000 });
      setSeverityData(res.data);
      setShowHeatmap(true);
    } catch (err) { console.error(err); }
    finally { setSeverityLoading(false); }
  };

  const handleDirections = (placeLat, placeLng) => {
    setDestination({ lat: placeLat, lng: placeLng });
    setMapCenter([placeLat, placeLng]);
  };

  const sev = severityData ? (SEV_STYLES[severityData.severityLabel] || SEV_STYLES.Low) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 bg-gray-50 min-h-[calc(100vh-80px)]">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-6 md:space-y-0">
        <div className="max-w-xl">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Safe <span className="text-red-600">Places</span>
          </h2>
          <p className="text-gray-500 font-semibold">
            Locate police stations and safe zones near you.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {destination && (
            <button onClick={() => setDestination(null)} className="bg-black text-white px-5 py-4 rounded-3xl font-black flex items-center gap-2">
              <X size={18} /> CLEAR ROUTE
            </button>
          )}
          {severityData && (
            <button
              onClick={() => setShowHeatmap(v => !v)}
              className={`px-5 py-4 rounded-3xl font-black flex items-center gap-2 border-2 transition-all ${showHeatmap ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-600 border-purple-300'}`}
            >
              {showHeatmap ? <EyeOff size={18} /> : <Eye size={18} />}
              {showHeatmap ? 'HIDE MAP' : 'SHOW MAP'}
            </button>
          )}
          <button
            onClick={fetchSeverity}
            disabled={severityLoading || !location}
            className="bg-purple-600 hover:bg-purple-800 text-white font-black px-7 py-4 rounded-3xl shadow-xl shadow-purple-100 transition-all transform active:scale-95 flex items-center gap-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {severityLoading
              ? <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
              : <><Flame size={20} strokeWidth={3} /> SEVERITY SCAN</>}
          </button>
          <button
            onClick={fetchNearby}
            disabled={loading || !location}
            className="bg-red-600 hover:bg-black text-white font-black px-7 py-4 rounded-3xl shadow-xl shadow-red-100 transition-all transform active:scale-95 flex items-center gap-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
              : <><SearchIcon size={20} strokeWidth={3} /> SCAN NEARBY</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Map */}
        <div className="lg:col-span-8 bg-white p-4 rounded-[2rem] shadow-2xl border-4 border-white min-h-[600px] relative overflow-hidden">
          <MapContainer center={mapCenter} zoom={13} style={{ height: '600px', width: '100%', borderRadius: '1.5rem' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ChangeView center={mapCenter} zoom={15} />

            {location && (
              <Marker position={[location.lat, location.lng]} icon={userIcon}>
                <Popup><div className="font-bold flex items-center gap-2"><MapPin size={16} className="text-blue-600" />YOU ARE HERE</div></Popup>
              </Marker>
            )}

            {location && destination && <Routing start={location} end={destination} />}

            {!destination && places.map((place, i) => (
              <Marker key={`safe-${i}`} position={[place.location.lat, place.location.lng]} icon={safeIcon}>
                <Popup>
                  <div className="p-2 min-w-[150px]">
                    <h4 className="font-bold text-gray-900 mb-1">{place.name}</h4>
                    <p className="text-xs text-gray-500 mb-3">{place.address}</p>
                    <div className="flex flex-col gap-2">
                      <a href={`tel:${place.phone}`} className="flex items-center gap-2 text-xs bg-green-50 text-green-700 p-2 rounded-lg font-bold"><Phone size={14} /> CALL: {place.phone}</a>
                      <button onClick={() => handleDirections(place.location.lat, place.location.lng)} className="bg-black text-white p-2 rounded-lg text-xs font-bold w-full">SEE ROUTE</button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {destination && (
              <Marker position={[destination.lat, destination.lng]} icon={safeIcon}>
                <Popup><div className="p-2 font-bold text-green-600">DESTINATION</div></Popup>
              </Marker>
            )}

            {!destination && dangerPlaces.map((place, i) => (
              <Marker key={`danger-${i}`} position={[place.location.lat, place.location.lng]} icon={dangerIcon}>
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold text-red-600 flex items-center gap-2 mb-1"><AlertTriangle size={16} /> DANGER ZONE</h4>
                    <p className="text-xs font-bold text-gray-900">{place.name}</p>
                    <p className="text-xs text-gray-500">{place.description}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Heatmap overlay */}
            {severityData && (
              <HeatmapLayer points={severityData.heatmapPoints} visible={showHeatmap} />
            )}
          </MapContainer>

          {/* Heatmap legend */}
          {severityData && showHeatmap && (
            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-gray-100 z-[1000]">
              <p className="text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">Severity Heatmap</p>
              <div className="flex items-center gap-1">
                {['#3b82f6', '#22c55e', '#eab308', '#f97316', '#ef4444'].map((c, i) => (
                  <div key={i} className="w-6 h-3 rounded-sm" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
                <span>Low</span><span>Critical</span>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col h-[600px]">

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-50 p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab('safe')}
                className={`flex-1 py-2.5 px-2 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${activeTab === 'safe' ? 'bg-white shadow-md text-green-600' : 'text-gray-400'}`}
              >
                <Shield size={15} /> SAFE
              </button>
              <button
                onClick={() => setActiveTab('danger')}
                className={`flex-1 py-2.5 px-2 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${activeTab === 'danger' ? 'bg-white shadow-md text-red-600' : 'text-gray-400'}`}
              >
                <AlertTriangle size={15} /> DANGER
              </button>
              <button
                onClick={() => setActiveTab('severity')}
                className={`flex-1 py-2.5 px-2 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${activeTab === 'severity' ? 'bg-white shadow-md text-purple-600' : 'text-gray-400'}`}
              >
                <Activity size={15} /> SEVERITY
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">

              {/* SAFE Tab */}
              {activeTab === 'safe' && (
                <div className="space-y-4">
                  {places.length > 0 ? places.map((place, i) => (
                    <div key={i} className={`p-5 rounded-2xl border transition-all shadow-sm ${destination?.lat === place.location.lat ? 'border-red-500 bg-red-50/20' : 'bg-gray-50 border-transparent hover:border-green-200'}`}>
                      <h5 className="font-black text-lg text-gray-900 mb-1 leading-tight">{place.name}</h5>
                      <p className="text-xs font-bold text-gray-500 mb-4 flex items-center gap-2">
                        <Navigation size={12} className="text-red-500" />{place.distance} km away
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
                  )) : (
                    <div className="text-center py-10 opacity-50">
                      <Search size={40} className="mx-auto mb-2 text-gray-300" />
                      <p className="font-bold text-sm">No safe zones found yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* DANGER Tab */}
              {activeTab === 'danger' && (
                <div className="space-y-4">
                  {dangerPlaces.length > 0 ? dangerPlaces.map((place, i) => (
                    <div key={i} className="p-5 bg-red-50/50 rounded-2xl border border-transparent hover:border-red-200 transition-all shadow-sm">
                      <h5 className="font-black text-lg text-red-600 mb-1 leading-tight">{place.name}</h5>
                      <p className="text-xs text-gray-600 mb-3 font-semibold">{place.description}</p>
                      <p className="text-[10px] font-black uppercase text-red-400 tracking-wider">High Risk Area</p>
                    </div>
                  )) : (
                    <div className="text-center py-10 opacity-50">
                      <AlertTriangle size={40} className="mx-auto mb-2 text-gray-300" />
                      <p className="font-bold text-sm">No danger zones reported.</p>
                    </div>
                  )}
                </div>
              )}

              {/* SEVERITY Tab */}
              {activeTab === 'severity' && (
                <div className="space-y-4">
                  {severityLoading && (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <p className="font-black text-sm text-gray-500">Analyzing area severity...</p>
                    </div>
                  )}

                  {!severityLoading && !severityData && (
                    <div className="text-center py-12 opacity-50">
                      <Flame size={44} className="mx-auto mb-3 text-gray-300" />
                      <p className="font-black text-sm text-gray-500">Click SEVERITY SCAN to analyze this region.</p>
                    </div>
                  )}

                  {!severityLoading && severityData && sev && (
                    <>
                      {/* ── SAFE / DANGER Verdict Banner ── */}
                      <div className={`rounded-2xl p-5 flex items-center gap-4 ${severityData.isSafe ? 'bg-green-500' : 'bg-red-600'}`}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${severityData.isSafe ? 'bg-green-400' : 'bg-red-500'}`}>
                          {severityData.isSafe ? '🛡️' : '⚠️'}
                        </div>
                        <div>
                          <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Current Area Status</p>
                          <p className="text-white text-2xl font-black leading-tight">
                            {severityData.isSafe ? 'THIS PLACE IS SAFE' : 'THIS PLACE IS DANGEROUS'}
                          </p>
                        </div>
                      </div>

                      {/* ── Time of Day Context ── */}
                      <div className="flex gap-2">
                        <div className={`flex-1 flex items-center gap-2 rounded-xl px-4 py-3 ${severityData.isNightTime ? 'bg-indigo-50 border border-indigo-200' : 'bg-amber-50 border border-amber-200'}`}>
                          <span className="text-lg">{severityData.isNightTime ? '🌙' : '☀️'}</span>
                          <div>
                            <p className={`text-xs font-black uppercase ${severityData.isNightTime ? 'text-indigo-700' : 'text-amber-700'}`}>
                              {severityData.isNightTime ? 'Night Assessment' : 'Day Assessment'}
                            </p>
                            <p className={`text-[10px] font-bold ${severityData.isNightTime ? 'text-indigo-500' : 'text-amber-500'}`}>
                              {severityData.isNightTime ? 'Night penalty applied' : 'Standard scoring'}
                            </p>
                          </div>
                        </div>
                        {severityData.nightMultiplierApplied && (
                          <div className="flex items-center gap-1 bg-indigo-100 border border-indigo-200 rounded-xl px-3 py-2 text-center">
                            <div>
                              <p className="text-indigo-700 text-xs font-black">×1.4</p>
                              <p className="text-indigo-500 text-[10px] font-bold">multiplier</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ── Score Card ── */}
                      <div className={`p-5 rounded-2xl border-2 ${sev.bg} ${sev.border}`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-black uppercase tracking-widest text-gray-500">Danger Score</span>
                          <span className={`text-xs font-black px-3 py-1 rounded-full ${sev.badge}`}>
                            {severityData.severityEmoji} {severityData.severityLabel}
                          </span>
                        </div>
                        <div className={`text-6xl font-black ${sev.text} mb-1`}>{severityData.severityScore}</div>
                        <div className="text-xs text-gray-400 font-bold mb-3">out of 100</div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-700 ${sev.bar}`}
                            style={{ width: `${severityData.severityScore}%` }}
                          />
                        </div>
                      </div>

                      {/* ── Stats Row ── */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-2xl p-4 text-center">
                          <div className="text-2xl font-black text-gray-800">{severityData.count}</div>
                          <div className="text-[10px] font-black uppercase text-gray-400 mt-1">
                            {severityData.usedFallback ? 'Closest Point' : `Within ${severityData.searchRadius}m`}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 text-center">
                          <div className="text-2xl font-black text-gray-800">{severityData.searchRadius}m</div>
                          <div className="text-[10px] font-black uppercase text-gray-400 mt-1">Scan Radius</div>
                        </div>
                      </div>

                      {severityData.usedFallback && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700 font-semibold">
                          ℹ️ No incidents within radius — showing nearest available data point.
                        </div>
                      )}



                      {/* Incident Breakdown */}
                      {severityData.incidents.length > 0 && (
                        <div>
                          <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-3">Incident Breakdown</p>
                          <div className="space-y-2">
                            {severityData.incidents.slice(0, 8).map((inc, i) => (
                              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${(SEV_STYLES[inc.region_severity.charAt(0).toUpperCase() + inc.region_severity.slice(1)] || SEV_STYLES.Low).badge}`}>
                                      {inc.region_severity}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-bold">{inc.time_of_day}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">{inc.distance}m away</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-black text-gray-700">{(inc.crime_rate * 100).toFixed(1)}</div>
                                  <div className="text-[10px] text-gray-400 font-bold">crime rate</div>
                                </div>
                              </div>
                            ))}
                            {severityData.incidents.length > 8 && (
                              <p className="text-center text-xs text-gray-400 font-bold py-2">+{severityData.incidents.length - 8} more incidents</p>
                            )}
                          </div>
                        </div>
                      )}
                    </>
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
