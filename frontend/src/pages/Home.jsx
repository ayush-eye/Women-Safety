import { Shield, MapPin, PhoneCall, Siren } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-red-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-red-600">SafeHer 🚨</h1>
        <button className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-16">
        <div className="max-w-xl">
          <h2 className="text-5xl font-bold text-gray-800 leading-tight">
            Your Safety, <span className="text-red-600">Our Priority</span>
          </h2>

          <p className="mt-6 text-gray-600 text-lg">
            Instantly alert your loved ones with your location and stay
            protected anytime, anywhere.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-red-700">
              🚨 Try SOS Now
            </button>
            <button className="border border-red-600 text-red-600 px-6 py-3 rounded-xl hover:bg-red-50">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="mt-10 md:mt-0">
          <div className="bg-red-200 p-10 rounded-full shadow-xl">
            <Siren size={120} className="text-red-600" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-10 py-16 bg-white">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Powerful Features
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-red-50 rounded-xl shadow hover:shadow-lg transition">
            <Shield className="text-red-600 mb-4" size={40} />
            <h4 className="text-xl font-semibold mb-2">Instant SOS</h4>
            <p className="text-gray-600">
              Send emergency alerts with just one click to your trusted
              contacts.
            </p>
          </div>

          <div className="p-6 bg-red-50 rounded-xl shadow hover:shadow-lg transition">
            <MapPin className="text-red-600 mb-4" size={40} />
            <h4 className="text-xl font-semibold mb-2">Live Location</h4>
            <p className="text-gray-600">
              Share real-time location to help responders reach you quickly.
            </p>
          </div>

          <div className="p-6 bg-red-50 rounded-xl shadow hover:shadow-lg transition">
            <PhoneCall className="text-red-600 mb-4" size={40} />
            <h4 className="text-xl font-semibold mb-2">Emergency Contacts</h4>
            <p className="text-gray-600">
              Notify family and friends instantly during emergencies.
            </p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="text-center py-16 bg-gradient-to-r from-red-500 to-pink-500 text-white">
        <h3 className="text-3xl font-bold mb-4">Stay Safe, Stay Connected</h3>
        <p className="mb-6">
          Join thousands of users who trust SafeHer for their safety.
        </p>

        <button className="bg-white text-red-600 px-8 py-3 rounded-xl font-semibold shadow hover:bg-gray-100">
          🚀 Get Started Now
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-white text-gray-600">
        © 2026 SafeHer | Women Safety Application
      </footer>
    </div>
  );
}
