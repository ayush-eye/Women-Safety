import { useState, useEffect } from "react";
import { MapPin, Shield, AlertTriangle, Save, Map as MapIcon, Plus, X } from "lucide-react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const safeIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const dangerIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Component to handle map clicks for picking location
function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} icon={L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] })} /> : null;
}

const AdminDashboard = () => {
    const [placeType, setPlaceType] = useState('safe');
    const [formData, setFormData] = useState({
        name: '',
        type: 'police',
        address: '',
        phone: '',
        description: '',
        severity: 'medium',
    });
    const [position, setPosition] = useState([20.9320, 77.7523]); // Default Amravati
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const data = {
            ...formData,
            lat: position[0],
            lng: position[1],
        };

        const endpoint = placeType === 'safe' 
            ? "http://localhost:5000/api/safeplaces/add-safe-place" 
            : "http://localhost:5000/api/dangerplaces/add-danger-place";

        try {
            const res = await axios.post(endpoint, data);
            setMessage({ type: 'success', text: res.data.message });
            setFormData({ name: '', type: 'police', address: '', phone: '', description: '', severity: 'medium' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Error saving data' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 bg-gray-50 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
                <div className="max-w-xl">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-4">
                        Admin <span className="text-red-600">Console</span>
                    </h2>
                    <p className="text-gray-500 text-lg leading-relaxed font-semibold">
                        Register new safety and danger zones to protect our community.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Form Section */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 h-full relative overflow-hidden">
                        <div className="flex gap-4 mb-8 bg-gray-50 p-2 rounded-2xl relative z-10">
                            <button 
                                onClick={() => setPlaceType('safe')}
                                className={`flex-1 py-4 px-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${placeType === 'safe' ? 'bg-white shadow-xl scale-105 text-green-600' : 'text-gray-500 opacity-60'}`}
                            >
                                <Shield size={20} /> SAFE ZONE
                            </button>
                            <button 
                                onClick={() => setPlaceType('danger')}
                                className={`flex-1 py-4 px-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${placeType === 'danger' ? 'bg-white shadow-xl scale-105 text-red-600' : 'text-gray-500 opacity-60'}`}
                            >
                                <AlertTriangle size={20} /> DANGER ZONE
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Place Name</label>
                                <input 
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-[1.25rem] px-6 py-4 font-bold outline-none transition-all placeholder:text-gray-300"
                                    placeholder="Enter full name of the place..."
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>

                            {placeType === 'safe' ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Type</label>
                                            <select 
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-[1.25rem] px-6 py-4 font-bold outline-none transition-all appearance-none"
                                                value={formData.type}
                                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                            >
                                                <option value="police">Police Station</option>
                                                <option value="hospital">Hospital</option>
                                                <option value="pharmacy">Pharmacy</option>
                                                <option value="shelter">Safe Shelter</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Phone</label>
                                            <input 
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-[1.25rem] px-6 py-4 font-bold outline-none transition-all placeholder:text-gray-300"
                                                placeholder="Emergency number..."
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Physical Address</label>
                                        <textarea 
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-[1.25rem] px-6 py-4 font-bold outline-none transition-all placeholder:text-gray-300 min-h-[100px]"
                                            placeholder="Enter complete address..."
                                            value={formData.address}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                            required
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Description</label>
                                        <textarea 
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-[1.25rem] px-6 py-4 font-bold outline-none transition-all placeholder:text-gray-300 min-h-[100px]"
                                            placeholder="What makes this area risky?"
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Severity</label>
                                        <select 
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-[1.25rem] px-6 py-4 font-bold outline-none transition-all appearance-none"
                                            value={formData.severity}
                                            onChange={(e) => setFormData({...formData, severity: e.target.value})}
                                        >
                                            <option value="low">Low Risk</option>
                                            <option value="medium">Medium Risk</option>
                                            <option value="high">High Risk</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {message && (
                                <div className={`p-4 rounded-xl font-bold flex items-center gap-3 animate-shake ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message.type === 'success' ? <Plus size={18} /> : <X size={18} />}
                                    {message.text}
                                </div>
                            )}

                            <button 
                                type="submit"
                                disabled={loading}
                                className={`w-full py-5 rounded-[1.5rem] font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl ${placeType === 'safe' ? 'bg-green-600 hover:bg-black text-white shadow-green-100' : 'bg-red-600 hover:bg-black text-white shadow-red-100'}`}
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save size={24} /> REGISTER NOW
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Map Section */}
                <div className="lg:col-span-12 xl:col-span-8 bg-white p-6 rounded-[3rem] shadow-2xl border-white border-4 min-h-[600px] relative overflow-hidden group">
                    <div className="absolute top-10 left-10 z-[1000] bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 max-w-[200px] group-hover:scale-105 transition-transform">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">SELECTED LOCATION</p>
                        <p className="font-bold text-gray-900 truncate">{position[0].toFixed(5)}, {position[1].toFixed(5)}</p>
                    </div>

                    <div className="absolute top-10 right-10 z-[1000] bg-black text-white px-6 py-3 rounded-2xl shadow-2xl font-black text-xs flex items-center gap-2">
                        <MapIcon size={16} /> CLICK ON MAP TO PICK LOCATION
                    </div>

                    <MapContainer center={position} zoom={13} style={{ height: '600px', width: '100%', borderRadius: '2rem' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <LocationPicker position={position} setPosition={setPosition} />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
