import { useState, useEffect } from "react";
import {
  Siren,
  Shield,
  MapPin,
  Phone,
  AlertTriangle,
  Navigation,
  Heart,
  Bell,
  Activity,
  Zap,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthService from "../services/auth.service";
import AddToHomeScreen from "../components/AddToHomeScreen";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [alertSent, setAlertSent] = useState(false);
  const [showShortcutPrompt, setShowShortcutPrompt] = useState(false);
  const user = AuthService.getCurrentUser();

  const [contacts, setContacts] = useState([]);
  const [fetchingContacts, setFetchingContacts] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Error getting location", err),
      );
    }

    // Fetch contacts
    const fetchContacts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setContacts(response.data.user.emergency_contacts || []);
      } catch (err) {
        console.error("Failed to fetch contacts", err);
      } finally {
        setFetchingContacts(false);
      }
    };
    
    fetchContacts();
    checkAndShowShortcutPrompt();
  }, []);

  const checkAndShowShortcutPrompt = () => {
    const isDontShow = localStorage.getItem("addToHomeScreen_dontShow");
    const isCreated = localStorage.getItem("addToHomeScreen_created");
    const lastShown = localStorage.getItem("addToHomeScreen_lastShown");
    
    if (!isCreated && !isDontShow) {
      if (!lastShown || (Date.now() - parseInt(lastShown)) > 7 * 24 * 60 * 60 * 1000) {
        setShowShortcutPrompt(true);
      }
    }
  };

  const handleShortcutCreated = () => {
    localStorage.setItem("addToHomeScreen_created", "true");
    setShowShortcutPrompt(false);
  };

  const handleSOS = async () => {
    setLoading(true);
    setAlertSent(false);
    try {
      await axios.post(
        "http://localhost:5000/api/sos/sos-call",
        {
          location: location,
        },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        },
      );
      setAlertSent(true);
      setTimeout(() => setAlertSent(false), 5000);
    } catch (err) {
      console.error("SOS failed", err);
      alert(
        err.response?.data?.message ||
          "SOS Call failed. Ensure you have emergency contacts configured in your profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-12 md:px-8">
        {/* Shortcut Prompt */}
        {showShortcutPrompt && (
          <AddToHomeScreen
            onClose={() => setShowShortcutPrompt(false)}
            onShortcutCreated={handleShortcutCreated}
          />
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
              Safe<span className="text-red-600">Her</span>{" "}
              <span className="text-slate-400">Dashboard</span>
            </h1>
            <p className="text-slate-500 text-lg mt-4 flex items-center gap-3">
              <Activity className="text-green-500 animate-pulse" size={20} />
              Welcome, <span className="font-bold text-slate-800">{user?.name || "Guardian"}</span> • Your safety is our priority
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-white/80 backdrop-blur-md border border-slate-200 px-6 py-4 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location Status</p>
                <p className="text-sm font-bold text-slate-700">Active Monitoring</p>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md border border-slate-200 px-6 py-4 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Mode</p>
                <p className="text-sm font-bold text-slate-700">High Protection</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Control Panel */}
          <div className="lg:col-span-8 space-y-8">
            <div className="relative group overflow-hidden bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200 border border-slate-100 transition-all duration-500 hover:shadow-red-100">
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-30"></div>

              <div className="relative z-10 text-center">
                <h2 className="text-3xl font-black text-slate-900 mb-4">Emergency Assistance</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-12 text-lg">
                  Instant alert system. One tap to notify emergency services and trusted contacts with your location.
                </p>

                <div className="flex flex-col items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    {/* Animated rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping group-hover:animate-none scale-150"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-red-500/10 animate-ping delay-300 scale-[2]"></div>
                    
                    <button
                      onClick={handleSOS}
                      disabled={loading}
                      className={`relative z-10 w-64 h-64 rounded-full flex flex-col items-center justify-center gap-4 font-black transition-all duration-500 shadow-2xl ${
                        alertSent 
                        ? 'bg-green-600 scale-105' 
                        : 'bg-red-600 hover:bg-black hover:scale-105 active:scale-95'
                      } text-white group`}
                    >
                      {loading ? (
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : alertSent ? (
                        <>
                          <Shield size={64} className="animate-bounce" />
                          <span className="text-2xl mt-2 tracking-widest uppercase">Sent!</span>
                        </>
                      ) : (
                        <>
                          <Siren size={72} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
                          <span className="text-5xl tracking-tighter">SOS</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="mt-12 flex items-center gap-3 px-6 py-2 bg-red-50 rounded-full text-red-600 font-bold text-xs tracking-widest uppercase animate-pulse">
                    <Zap size={16} />
                    Live Emergency System Enabled
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  title: "Trusted Contacts", 
                  desc: "Manage your core safety circle and notification preferences.",
                  icon: Heart, 
                  color: "pink", 
                  link: "/manage-contacts" 
                },
                { 
                  title: "Nearby Safety", 
                  desc: "Locate verified police hubs, clinics, and safe-zones near you.",
                  icon: Navigation, 
                  color: "blue", 
                  link: "/safe-places" 
                },
                { 
                  title: "Fake Call", 
                  desc: "Simulate a realistic call to discreetly exit uncomfortable situations.",
                  icon: Phone, 
                  color: "indigo", 
                  link: "/fake-call" 
                },
                { 
                  title: "Face Sentinel", 
                  desc: "Advanced criminal detection to scan potential suspects against databases.",
                  icon: Shield, 
                  color: "red", 
                  link: "/criminal-detection" 
                },
              ].map((feature, i) => (
                <Link
                  key={i}
                  to={feature.link}
                  className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-${feature.color}-50 rounded-bl-[4rem] group-hover:scale-125 transition-transform duration-500`}></div>
                  
                  <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-50 flex items-center justify-center text-${feature.color}-600 mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon size={32} />
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {feature.desc}
                  </p>
                  
                  <div className={`inline-flex items-center gap-2 text-${feature.color}-600 font-bold group-hover:gap-4 transition-all uppercase text-xs tracking-widest`}>
                    Open Feature <ArrowRight size={16} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 font-black"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black flex items-center gap-3">
                    <Heart className="text-red-500" size={28} />
                    My Circle
                  </h3>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">{contacts.length} Active</span>
                </div>
                
                <div className="space-y-6">
                  {fetchingContacts ? (
                    <div className="flex justify-center py-10">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : contacts.length > 0 ? (
                    contacts.map((contact, i) => (
                      <div key={i} className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                        <div className="bg-red-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                          <User size={24} />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-white truncate">{contact.name}</h5>
                          <p className="text-xs text-slate-400 font-medium truncate">{contact.contact}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 px-4 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                      <p className="text-slate-400 text-sm mb-4">No contacts added.</p>
                      <Link to="/manage-contacts" className="inline-block bg-white text-slate-900 px-6 py-2 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-all">
                        Add Trusted Contacts
                      </Link>
                    </div>
                  )}
                </div>
                
                <Link to="/manage-contacts" className="block text-center mt-10 py-5 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-sm uppercase tracking-widest transition-all border border-white/5">
                  Manage Circle
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-700 p-10 rounded-[3rem] text-white shadow-2xl shadow-red-200 group overflow-hidden relative">
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10 text-center">
                <div className="bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-inner">
                  <Phone size={40} className="text-white drop-shadow-lg" />
                </div>
                <h3 className="text-3xl font-black mb-4">Quick Dial</h3>
                <p className="text-red-100 mb-8 leading-relaxed font-medium">
                  One-tap connection to the national women's helpline.
                </p>
                <a
                  href="tel:1091"
                  className="block bg-white text-red-600 py-6 rounded-[2rem] font-black text-4xl shadow-2xl hover:scale-[1.03] active:scale-95 transition-all"
                >
                  1091
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default Dashboard;