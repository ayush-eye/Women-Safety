import { useState, useEffect } from "react";
import { Siren, Shield, MapPin, Phone, AlertTriangle, Navigation, Heart, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthService from "../services/auth.service";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [alertSent, setAlertSent] = useState(false);
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Error getting location", err)
      );
    }
  }, []);

  const handleSOS = async () => {
    setLoading(true);
    setAlertSent(false);
    try {
      const response = await axios.post("http://localhost:5000/api/sos/sos-call", {
        location: location
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAlertSent(true);
      setTimeout(() => setAlertSent(false), 5000);
    } catch (err) {
      console.error("SOS failed", err);
      alert(err.response?.data?.message || "SOS Call failed. Ensure you have emergency contacts configured in your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:px-8 bg-gray-50 min-h-[calc(100vh-80px)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-5xl font-black text-gray-900 tracking-tight">
            Safety <span className="text-red-600">Dashboard</span>
          </h2>
          <p className="text-gray-500 text-lg mt-3 flex items-center gap-2">
            Welcome back,{" "}
            <span className="font-bold text-gray-700">{user?.name}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 px-6">
            <div className="bg-red-50 p-2 rounded-xl text-red-600">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-wider">
                STATUS
              </p>
              <p className="text-sm font-bold text-gray-800">Tracking Active</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Control Panel */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-red-100 border border-red-50 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-50 rounded-full group-hover:scale-110 transition-transform duration-700"></div>

            <div className="relative z-10 text-center">
              <h3 className="text-3xl font-black text-gray-900 mb-6">
                Emergency Assistance
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-12 text-lg leading-relaxed">
                Press the button below to instantly alert emergency services and
                your trusted contacts with your exact location.
              </p>

              <div className="flex flex-col items-center">
                <button
                  onClick={handleSOS}
                  disabled={loading}
                  className={`w-72 h-72 rounded-full flex flex-col items-center justify-center gap-6 text-white font-black text-4xl shadow-[0_0_80px_rgba(220,38,38,0.4)] transition-all duration-500 active:scale-90 border-[15px] border-white ring-2 ring-red-100 ${
                    alertSent
                      ? "bg-green-600 shadow-green-200"
                      : "bg-red-600 hover:bg-black group-active:animate-ping"
                  }`}
                >
                  {loading ? (
                    <div className="w-20 h-20 border-8 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : alertSent ? (
                    <div className="animate-bounce flex flex-col items-center gap-4">
                      <Shield size={64} />
                      <span className="text-xl">SENT!</span>
                    </div>
                  ) : (
                    <>
                      <Siren
                        size={80}
                        strokeWidth={2.5}
                        className="animate-pulse"
                      />
                      SOS
                    </>
                  )}
                </button>
                <p className="mt-10 text-red-600 font-bold tracking-widest text-sm animate-pulse uppercase">
                  ACTIVE MONITORING ENABLED
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="bg-pink-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-pink-600 group-hover:scale-110 transition-transform">
                <Heart size={32} />
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-3">
                Trusted Contacts
              </h4>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Manage who gets notified during your emergency alerts.
              </p>
              <Link
                to="/manage-contacts"
                className="text-pink-600 font-bold flex items-center gap-2 hover:gap-4 transition-all w-fit"
              >
                Manage Contacts <ArrowRight size={18} />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                <Navigation size={32} />
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-3">
                Nearby Safety
              </h4>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Find police stations, hospitals, and safe zones around you.
              </p>
              <Link
                to="/safe-places"
                className="text-blue-600 font-bold flex items-center gap-2 hover:gap-4 transition-all w-fit"
              >
                Find Safe Places <ArrowRight size={18} />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 cursor-pointer">
              {/* Icon */}
              <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <Navigation size={28} />
              </div>

              {/* Title */}
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Fake Call
              </h4>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Simulate an incoming call to quickly exit uncomfortable or
                unsafe situations.
              </p>

              {/* Link */}
              <Link
                to="/fake-call"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold transition-all group-hover:gap-3"
              >
                Try Now
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-black text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-4">
              <Bell className="text-red-500" />
              Recent Alerts
            </h3>
            <div className="space-y-6">
              {[1, 2].map((_, i) => (
                <div
                  key={i}
                  className="flex gap-5 items-start bg-white/5 p-5 rounded-2xl border border-white/10"
                >
                  <div className="bg-red-500/20 p-3 rounded-xl text-red-500">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-1">
                      Emergency Call
                    </h5>
                    <p className="text-sm text-gray-400">
                      March 24, 2026 • 2:45 PM
                    </p>
                    <p className="text-xs mt-2 text-red-400 font-bold">
                      SENT SUCCESSFULLY
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all">
              View All History
            </button>
          </div>

          <div className="bg-red-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-red-200">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
              <Phone size={32} />
            </div>
            <h3 className="text-2xl font-black mb-4">Quick Dial</h3>
            <p className="text-white/80 mb-8 leading-relaxed">
              Instantly connect with national women helpline services.
            </p>
            <a
              href="tel:1091"
              className="block text-center bg-white text-red-600 py-5 rounded-2xl font-black text-2xl shadow-xl hover:scale-105 transition-transform"
            >
              1091
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default Dashboard;
