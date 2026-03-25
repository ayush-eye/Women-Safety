import { useState, useEffect } from "react";
import { MapPin, Search, Navigation, Phone, Shield, Search as SearchIcon, Filter } from "lucide-react";
import axios from "axios";

const SafePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error(err)
      );
    }
  }, []);

  const fetchNearby = async () => {
    if (!location) return;
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/safeplaces/nearby-safe-places", {
        latitude: location.lat,
        longitude: location.lng
      });
      setPlaces(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 bg-gray-50 min-h-[calc(100vh-80px)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 space-y-8 md:space-y-0 relative">
        <div className="max-w-xl">
          <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-none mb-6">
            Find <span className="text-red-600">Safe Zones</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Locate nearby secure zones including police stations, verified hospitals, security booths, and safe community areas.
          </p>
        </div>

        <button
          onClick={fetchNearby}
          disabled={loading}
          className="bg-red-600 hover:bg-black text-white font-black px-10 py-5 rounded-[2rem] shadow-2xl shadow-red-200 transition-all transform active:scale-95 flex items-center gap-3 text-lg"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <SearchIcon size={24} strokeWidth={3} />
              SCAN NEARBY AREAS
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Map Placeholder */}
        <div className="lg:col-span-8 bg-white p-6 rounded-[3rem] shadow-2xl shadow-gray-200 border border-white min-h-[600px] flex flex-col items-center justify-center text-center group transition-all hover:shadow-red-50 relative overflow-hidden ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-blue-50 opacity-10 pattern-grid-slate-300"></div>
          <div className="relative z-10">
            <div className="bg-red-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner ring-4 ring-white animate-pulse">
              <MapPin size={48} className="text-red-600" />
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-4">Interactive Map View</h4>
            <p className="text-gray-400 max-w-sm mx-auto text-lg">
              Allow location access to visualize safe zones on our customized 3D secure map.
            </p>
          </div>
        </div>

        {/* List View */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 h-full max-h-[700px] overflow-y-auto custom-scrollbar">
            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <Filter className="text-red-600" size={24} />
              Nearby Results
            </h3>

            {places.length > 0 ? (
              <div className="space-y-6">
                {places.map((place, i) => (
                  <div key={i} className="p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-red-200 hover:bg-red-50/30 transition-all group cursor-pointer shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-white p-2 rounded-xl shadow-sm text-red-600 group-hover:scale-110 transition-transform">
                        <Shield size={24} />
                      </div>
                      <span className="text-xs font-black px-3 py-1 bg-green-100 text-green-700 rounded-full tracking-widest uppercase">OPEN 24/7</span>
                    </div>
                    <h5 className="font-black text-xl text-gray-900 mb-2 truncate">{place.name}</h5>
                    <p className="text-sm text-gray-500 mb-6 flex items-center gap-2 font-medium">
                      <Navigation size={14} className="text-gray-400" />
                      {place.distance || '0.8 km'} from current position
                    </p>
                    <div className="flex gap-3">
                      <button className="flex-1 bg-white border-2 border-gray-200 hover:border-black text-gray-700 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                        <Phone size={16} /> CALL
                      </button>
                      <button className="flex-1 bg-black text-white font-bold py-3 rounded-xl text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                        DIRECTIONS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                  <Search size={32} />
                </div>
                <p className="text-gray-400 font-bold px-4">No areas scanned yet.<br/>Click scan to find safety.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafePlaces;
