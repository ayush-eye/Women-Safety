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
  useEffect(() => {
   
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Error getting location", err),
      );
    }

    // Check if we should show the shortcut prompt
    checkAndShowShortcutPrompt();
  }, []);

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser?.emergency_contacts) {
    setContacts(storedUser.emergency_contacts);
  }
}, []);

  const checkAndShowShortcutPrompt = () => {
    // Check if shortcut has already been created
    const shortcutCreated = localStorage.getItem("addToHomeScreen_created");
    const dontShow = localStorage.getItem("addToHomeScreen_dontShow");
    const lastShown = localStorage.getItem("addToHomeScreen_lastShown");

    console.log("=== Shortcut Prompt Check ===");
    console.log("shortcutCreated:", shortcutCreated);
    console.log("dontShow:", dontShow);
    console.log("lastShown:", lastShown);

    // If shortcut already created, never show again
    if (shortcutCreated === "true") {
      console.log("❌ Shortcut already created, not showing popup");
      return;
    }

    // If user selected "Don't show again" within the week
    if (dontShow === "true") {
      console.log(
        "❌ User chose not to see again for a week, not showing popup",
      );
      return;
    }

    // Check if less than 7 days since last shown
    if (lastShown) {
      const lastShownDate = new Date(parseInt(lastShown));
      const now = new Date();
      const daysDiff = (now - lastShownDate) / (1000 * 60 * 60 * 24);
      console.log("Days since last shown:", daysDiff);

      if (daysDiff < 7) {
        console.log(
          `❌ Less than 7 days (${daysDiff.toFixed(2)} days) since last shown, not showing`,
        );
        return;
      } else {
        console.log(
          `✓ More than 7 days (${daysDiff.toFixed(2)} days) since last shown, can show`,
        );
      }
    } else {
      console.log("✓ No lastShown record, first time showing");
    }

    // Show the prompt after a delay
    console.log(
      "✅ All conditions met! Showing shortcut prompt in 3 seconds...",
    );
    setTimeout(() => {
      console.log("🎯 Setting showShortcutPrompt to true");
      setShowShortcutPrompt(true);
    }, 3000);
  };

  const handleShortcutCreated = () => {
    console.log("=== Shortcut Created Callback ===");
    // Mark that the shortcut has been created
    localStorage.setItem("addToHomeScreen_created", "true");
    console.log("✅ Set addToHomeScreen_created to true");
    setShowShortcutPrompt(false);
  };

  const handleSOS = async () => {
    setLoading(true);
    setAlertSent(false);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/sos/sos-call`,
        {
          location: location,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
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
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 md:px-8 bg-gray-50 min-h-[calc(100vh-80px)]">
      {/* Add the shortcut prompt */}
      {showShortcutPrompt && (
        <AddToHomeScreen
          onClose={() => {
            console.log("Closing shortcut prompt without creating shortcut");
            setShowShortcutPrompt(false);
          }}
          onShortcutCreated={handleShortcutCreated}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            Safety <span className="text-red-600">Dashboard</span>
          </h2>
          <div className="text-gray-500 text-base md:text-lg mt-2 flex items-center gap-2">
            Welcome,{" "}
            <span className="font-bold text-gray-700">{user?.name?.split(' ')[0]}</span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block"></span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 md:gap-4 px-4 md:px-6">
            <div className="bg-red-50 p-2 rounded-xl text-red-600">
              <MapPin size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <div className="text-[10px] md:text-xs font-bold text-gray-400 tracking-wider">
                STATUS
              </div>
              <div className="text-xs md:text-sm font-bold text-gray-800">
                Tracking Active
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        {/* Main Control Panel */}
        <div className="lg:col-span-8 space-y-6 md:space-y-10">
          <div className="bg-white p-6 md:p-12 rounded-3xl md:rounded-[2.5rem] shadow-2xl shadow-red-100 border border-red-50 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-50 rounded-full group-hover:scale-110 transition-transform duration-700"></div>

            <div className="relative z-10 text-center">
              <h3 className="text-3xl font-black text-gray-900 mb-6">
                Emergency Assistance
              </h3>
              <div className="text-gray-500 max-w-md mx-auto mb-12 text-lg leading-relaxed">
                Press the button below to instantly alert emergency services and
                your trusted contacts with your exact location.
              </div>

              <div className="flex flex-col items-center">
                <button
                  onClick={handleSOS}
                  disabled={loading}
                  className={`w-56 h-56 md:w-72 md:h-72 rounded-full flex flex-col items-center justify-center gap-4 md:gap-6 text-white font-black text-3xl md:text-4xl shadow-[0_0_80px_rgba(220,38,38,0.4)] transition-all duration-500 active:scale-90 border-[10px] md:border-[15px] border-white ring-2 ring-red-100 ${
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
                        size={64}
                        strokeWidth={2.5}
                        className="animate-pulse"
                      />
                      SOS
                    </>
                  )}
                </button>
                <div className="mt-10 text-red-600 font-bold tracking-widest text-sm animate-pulse uppercase">
                  ACTIVE MONITORING ENABLED
                </div>
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
              <div className="text-gray-500 mb-6 leading-relaxed">
                Manage who gets notified during your emergency alerts.
              </div>
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
              <div className="text-gray-500 mb-6 leading-relaxed">
                Find police stations, hospitals, and safe zones around you.
              </div>
              <Link
                to="/safe-places"
                className="text-blue-600 font-bold flex items-center gap-2 hover:gap-4 transition-all w-fit"
              >
                Find Safe Places <ArrowRight size={18} />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 cursor-pointer">
              <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-green-600 group-hover:scale-110 transition-transform duration-300">
                <Phone size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Fake Call
              </h4>
              <div className="text-gray-500 text-sm leading-relaxed mb-5">
                Simulate an incoming call to quickly exit uncomfortable or
                unsafe situations.
              </div>
              <Link
                to="/fake-call"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold transition-all group-hover:gap-3"
              >
                Try Now
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Criminal Detection Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 cursor-pointer">
              <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-red-600 group-hover:scale-110 transition-transform duration-300">
                <Shield size={28} />
              </div>

              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Face Sentinel
              </h4>

              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Intelligent Face Detection to scan suspects against offender databases.
              </p>

              <Link
                to="/criminal-detection"
                className="inline-flex items-center gap-2 text-red-600 font-semibold transition-all group-hover:gap-3"
              >
                Scan Now
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-black text-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-4">
              <Bell className="text-red-500" />
              Emergency Contacts
            </h3>
           <div className="space-y-6">
  {contacts.map((contact, i) => (
    <div
      key={i}
      className="flex gap-5 items-start bg-white/5 p-5 rounded-2xl border border-white/10"
    >
      <div className="bg-red-500/20 p-3 rounded-xl text-red-500">
        <AlertTriangle size={24} />
      </div>

      <div>
        <div className="font-bold text-white mb-1">
          {contact.name}
        </div>

        <div className="text-sm text-gray-400">
          {contact.contact}
        </div>

        <div className="text-xs mt-2 text-red-400 font-bold">
          SENT SUCCESSFULLY
        </div>
      </div>
    </div>
  ))}
</div>
            <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all">
              View All History
            </button>
          </div>

          <div className="bg-red-600 p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] text-white shadow-2xl shadow-red-200">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
              <Phone size={32} />
            </div>
            <h3 className="text-2xl font-black mb-4">Quick Dial</h3>
            <div className="text-white/80 mb-8 leading-relaxed">
              Instantly connect with national women helpline services.
            </div>
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
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default Dashboard;
