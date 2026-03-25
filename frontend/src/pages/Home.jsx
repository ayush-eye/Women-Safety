import { Shield, MapPin, PhoneCall, Siren, ArrowRight, Activity, Users, Zap, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-white selection:bg-red-100 selection:text-red-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-52 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-red-50">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-red-100/30 to-transparent rounded-bl-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="flex flex-col space-y-10">
              <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-100/50 w-fit animate-fade-in shrink-0">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
                <span className="text-red-700 font-black text-sm tracking-widest uppercase">Global Safety Protocol Active</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.9] tracking-tighter">
                Your Safety, <br/>
                <span className="bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent">Reimagined.</span>
              </h1>

              <p className="text-xl text-gray-500 max-w-lg leading-relaxed font-medium">
                SafeHer leverages AI-driven location intelligence to keep you protected. Instantly alert contacts and find secure zones in seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  to="/register"
                  className="bg-red-600 hover:bg-black text-white font-black px-10 py-6 rounded-3xl shadow-2xl shadow-red-200 hover:shadow-black/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 text-lg"
                >
                  Get Started Free
                  <ArrowRight size={20} />
                </Link>
                <div className="flex items-center gap-4 px-6 border-2 border-gray-100 rounded-3xl group hover:border-red-600 transition-all cursor-pointer">
                  <div className="bg-red-50 p-2 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Activity size={24} className="text-red-600 group-hover:text-white" />
                  </div>
                  <span className="text-gray-700 font-bold">Watch Security Demo</span>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 flex items-center gap-10">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-gray-900 font-black text-lg">+12,400 Users</p>
                  <p className="text-gray-400 font-medium text-sm">Protected by SafeHer daily</p>
                </div>
              </div>
            </div>

            <div className="relative pointer-events-none group">
               <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-[5rem] blur-3xl opacity-20 animate-pulse"></div>
               <div className="relative bg-white p-12 rounded-[5rem] shadow-2xl border-4 border-white transform lg:rotate-6 group-hover:rotate-0 transition-transform duration-700">
                  <div className="w-full aspect-square flex flex-col items-center justify-center gap-8">
                     <div className="bg-red-600 w-32 h-32 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-red-200 animate-bounce">
                        <Siren size={64} className="text-white" strokeWidth={2.5} />
                     </div>
                     <div className="space-y-4 text-center">
                        <p className="text-red-600 font-black text-2xl tracking-widest uppercase">SOS Signal Ready</p>
                        <div className="flex justify-center gap-2">
                           {[1,2,3,4,5].map(i => <div key={i} className="w-3 h-3 rounded-full bg-red-100"></div>)}
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Decorative floating elements */}
               <div className="absolute top-10 -left-20 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 animate-bounce-slow border border-gray-50">
                  <div className="bg-green-500 w-4 h-4 rounded-full"></div>
                  <p className="text-gray-900 font-black">Live Tracking: <span className="text-green-600">Enabled</span></p>
               </div>
               <div className="absolute bottom-10 -right-20 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 animate-bounce-delayed border border-gray-50">
                  <div className="bg-blue-500 p-2 rounded-xl text-white"><MapPin size={24}/></div>
                  <p className="text-gray-900 font-black">2.4km <span className="text-gray-400 font-medium">to Safe Zone</span></p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-32 space-y-6">
            <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-none">
              Engineered for <br/>
              <span className="text-red-600">Ultimate Protection</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium">
              We've integrated state-of-the-art security features to provide you with a safety net that never sleeps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="p-12 bg-gray-50 rounded-[4rem] hover:bg-black group transition-all duration-700 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 group-hover:bg-red-600/20 rounded-bl-full opacity-50 transition-all duration-700"></div>
               <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 transition-all duration-700 text-red-600 group-hover:bg-red-600 group-hover:text-white">
                 <Shield size={40} strokeWidth={2.5}/>
               </div>
               <h3 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-white transition-colors duration-700">Instant SOS</h3>
               <p className="text-gray-500 text-lg leading-relaxed group-hover:text-gray-400 transition-colors duration-700">
                  One-tap emergency broadcast that bypasses do-not-disturb and reaches your trusted contacts immediately.
               </p>
            </div>

            <div className="p-12 bg-red-50 rounded-[4rem] hover:bg-red-600 group transition-all duration-700 relative overflow-hidden border border-red-100">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-bl-full opacity-50 transition-all duration-700"></div>
               <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 transition-all duration-700 text-red-600">
                 <MapPin size={40} strokeWidth={2.5}/>
               </div>
               <h3 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-white transition-colors duration-700">Safe Zone Finder</h3>
               <p className="text-gray-600 text-lg leading-relaxed group-hover:text-white/80 transition-colors duration-700">
                  Powered by location intelligence to find verified police stations, security posts, and hospitals in real-time.
               </p>
            </div>

            <div className="p-12 bg-gray-50 rounded-[4rem] hover:bg-black group transition-all duration-700 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 group-hover:bg-red-600/20 rounded-bl-full opacity-50 transition-all duration-700"></div>
               <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 transition-all duration-700 text-red-600 group-hover:bg-red-600 group-hover:text-white">
                 <Users size={40} strokeWidth={2.5}/>
               </div>
               <h3 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-white transition-colors duration-700">Circle of Trust</h3>
               <p className="text-gray-500 text-lg leading-relaxed group-hover:text-gray-400 transition-colors duration-700">
                  Invite family and friends to your security circle. Seamlessly share live coordinates when you feel unsafe.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Numbers */}
      <section className="py-32 bg-black text-white px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <div>
            <p className="text-5xl lg:text-7xl font-black text-red-600 mb-2 tracking-tighter">99%</p>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-sm">Response Accuracy</p>
          </div>
          <div>
            <p className="text-5xl lg:text-7xl font-black text-red-600 mb-2 tracking-tighter">2s</p>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-sm">Average Alert Speed</p>
          </div>
          <div>
            <p className="text-5xl lg:text-7xl font-black text-red-600 mb-2 tracking-tighter">5k+</p>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-sm">Safe Zones Indexed</p>
          </div>
          <div>
            <p className="text-5xl lg:text-7xl font-black text-red-600 mb-2 tracking-tighter">24/7</p>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-sm">Live Monitoring</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-red-600 to-pink-500 rounded-[5rem] p-16 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-red-200">
             <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
             
             <div className="relative z-10 space-y-12">
               <div className="bg-white/20 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl backdrop-blur-md">
                 <Shield size={48} />
               </div>
               <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-10">
                 Peace of Mind is <br className="hidden md:block"/> Just One Click Away.
               </h2>
               <div className="flex flex-col sm:flex-row justify-center gap-6">
                 <Link to="/register" className="bg-white text-red-600 font-black px-12 py-6 rounded-3xl text-xl hover:bg-black hover:text-white transition-all transform hover:-translate-y-2 active:scale-95 shadow-2xl">
                   Join the Movement
                 </Link>
                 <Link to="/login" className="bg-black/20 backdrop-blur-md border-2 border-white/30 text-white font-black px-12 py-6 rounded-3xl text-xl hover:bg-white/10 transition-all">
                   User Login
                 </Link>
               </div>
               <p className="text-white/70 font-bold flex items-center justify-center gap-2">
                 <CheckCircle2 size={18} className="text-white" />
                 Encrypted connections • No credit card required • GDPR Compliant
               </p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
