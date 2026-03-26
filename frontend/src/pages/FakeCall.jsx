import { useState, useRef, useEffect } from "react";
import { Phone, PhoneOff, User, Clock, Shield, Bell, X, Mic, Volume2, VideoOff, MessageCircle, Play } from "lucide-react";

export default function FakeCall() {
  const [incoming, setIncoming] = useState(false);
  const [active, setActive] = useState(false);
  const [time, setTime] = useState(0);
  const [delay, setDelay] = useState(5); // seconds
  const [callerName, setCallerName] = useState("Home ❤️");
  const [callerNumber, setCallerNumber] = useState("+91 98765 43210");
  const [status, setStatus] = useState("idle"); // idle, counting, incoming, active

  const ringtoneRef = useRef(null);
  const voiceRef = useRef(null);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearTimeout(countdownRef.current);
      if (ringtoneRef.current) ringtoneRef.current.pause();
      if (voiceRef.current) voiceRef.current.pause();
    };
  }, []);

  const scheduleCall = () => {
    setStatus("counting");
    countdownRef.current = setTimeout(() => {
      triggerCall();
    }, delay * 1000);
  };

  const cancelSchedule = () => {
    if (countdownRef.current) clearTimeout(countdownRef.current);
    setStatus("idle");
  };

  const triggerCall = () => {
    setIncoming(true);
    setStatus("incoming");

    // play ringtone
    try {
      ringtoneRef.current = new Audio("/ringtone.mp3");
      ringtoneRef.current.loop = true;
      ringtoneRef.current.play().catch(e => console.log("Audio autoplay blocked or failed", e));
    } catch(e) {
      console.log("Audio error", e);
    }
  };

  const acceptCall = () => {
    setIncoming(false);
    setActive(true);
    setStatus("active");

    if (ringtoneRef.current) ringtoneRef.current.pause();

    // play voice message
    try {
      voiceRef.current = new Audio("/voice.mp3");
      voiceRef.current.play().catch(e => console.log("Voice audio failed", e));
    } catch(e) {
      console.log("Voice error", e);
    }

    // Start timer
    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const endCall = () => {
    setIncoming(false);
    setActive(false);
    setStatus("idle");
    setTime(0);

    if (ringtoneRef.current) ringtoneRef.current.pause();
    if (voiceRef.current) voiceRef.current.pause();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (t) => {
    const min = String(Math.floor(t / 60)).padStart(2, "0");
    const sec = String(t % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 bg-gray-50 min-h-[calc(100vh-80px)]">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-6 md:space-y-0">
        <div className="max-w-xl">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-4">
            Safety <span className="text-red-600">Simulator</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed font-semibold">
            Trigger a fake call to help you exit uncomfortable situations safely.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Control Card */}
        <div className="lg:col-span-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100 h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-red-50 p-4 rounded-3xl text-red-600">
                <Bell size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Fake Call Setup</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Caller Name</label>
                  <input 
                    type="text" 
                    value={callerName}
                    onChange={(e) => setCallerName(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-red-600 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-800"
                    placeholder="e.g. Mom ❤️"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Caller Number</label>
                  <input 
                    type="text" 
                    value={callerNumber}
                    onChange={(e) => setCallerNumber(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-red-600 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-800"
                    placeholder="e.g. +91 99999 00000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Trigger Delay (Seconds)</label>
                <div className="flex gap-4">
                  {[5, 10, 30, 60].map((s) => (
                    <button
                      key={s}
                      onClick={() => setDelay(s)}
                      className={`flex-1 py-4 rounded-2xl font-black transition-all border-2 ${delay === s ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200' : 'bg-white text-gray-500 border-gray-100 hover:border-red-200'}`}
                    >
                      {s}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                {status === "counting" ? (
                  <button 
                    onClick={cancelSchedule}
                    className="w-full bg-black text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95"
                  >
                    <Clock className="animate-spin" size={24} /> CANCELING... (Trigger in {delay}s)
                  </button>
                ) : (
                  <button 
                    onClick={scheduleCall}
                    className="w-full bg-red-600 hover:bg-black text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 shadow-2xl shadow-red-200 transition-all active:scale-95"
                  >
                    <Play size={24} fill="currentColor" /> SCHEDULE FAKE CALL
                  </button>
                )}
              </div>
            </div>
            
            <div className="mt-10 p-6 bg-red-50/50 rounded-2xl border border-red-100">
               <div className="flex gap-4">
                  <Shield className="text-red-500 shrink-0" size={24} />
                  <p className="text-sm font-semibold text-gray-600 leading-relaxed">
                    Once scheduled, stay in this tab. The phone will "ring" with your custom caller info after the delay.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* 3. Helper/Info Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Shield size={120} />
             </div>
             <h3 className="text-2xl font-black mb-6 relative z-10 flex items-center gap-3">
               <Shield className="text-red-500" />
               Safety Tip
             </h3>
             <p className="text-gray-400 font-semibold leading-relaxed relative z-10 mb-6">
                A pretend phone call can be a very effective way to discourage unwanted attention by signaling that someone knows where you are and is expecting to hear from you.
             </p>
             <div className="bg-white/10 p-4 rounded-2xl border border-white/5 space-y-3 relative z-10">
                <div className="flex items-center gap-3 text-sm font-bold">
                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                   Keep your volume up
                </div>
                <div className="flex items-center gap-3 text-sm font-bold">
                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                   Hold phone to ear naturally
                </div>
                <div className="flex items-center gap-3 text-sm font-bold">
                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                   Act like you're talking
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- SIMULATED INCOMING CALL SCREEN --- */}
      {incoming && (
        <div className="fixed inset-0 bg-black/95 z-[9999] text-white flex flex-col items-center justify-between py-24 backdrop-blur-xl animate-in fade-in duration-500">
           <div className="text-center">
              <p className="text-lg font-black tracking-[0.3em] uppercase text-white/50 mb-4 animate-pulse">Incoming Call</p>
              <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">{callerName}</h1>
              <p className="text-xl md:text-2xl text-white/40 font-bold">{callerNumber}</p>
           </div>

           <div className="flex flex-col items-center gap-10">
              <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-2xl">
                 <User size={64} className="text-white/20" />
              </div>
              
              <div className="flex gap-20">
                <div className="flex flex-col items-center gap-4">
                  <button 
                    onClick={endCall}
                    className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-110 active:scale-95 transition-all outline-none"
                  >
                    <PhoneOff size={32} strokeWidth={3} />
                  </button>
                  <p className="font-bold text-sm text-white/50 tracking-widest uppercase">Decline</p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <button 
                    onClick={acceptCall}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:scale-110 active:scale-95 transition-all animate-bounce outline-none"
                  >
                    <Phone size={32} strokeWidth={3} fill="currentColor" />
                  </button>
                  <p className="font-bold text-sm text-white/50 tracking-widest uppercase">Accept</p>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* --- SIMULATED ACTIVE CALL SCREEN --- */}
      {active && (
        <div className="fixed inset-0 bg-zinc-900 z-[9999] text-white flex flex-col items-center justify-between py-20 animate-in fade-in slide-in-from-bottom-20 duration-500">
           <div className="text-center">
              <p className="text-lg font-black tracking-widest text-green-500 mb-4 uppercase">Connected</p>
              <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">{callerName}</h1>
              <p className="text-2xl text-white/50 font-mono tracking-widest">{formatTime(time)}</p>
           </div>

           <div className="grid grid-cols-3 gap-x-8 gap-y-12 max-w-sm w-full px-10">
              {[
                { icon: Mic, label: "Mute" },
                { icon: VideoOff, label: "Video" },
                { icon: Volume2, label: "Speaker" },
                { icon: MessageCircle, label: "Message" },
                { icon: User, label: "Contacts" },
                { icon: Shield, label: "Security" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                   <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <item.icon size={24} className="text-white/80" />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{item.label}</p>
                </div>
              ))}
           </div>

           <div className="flex flex-col items-center gap-4">
              <button 
                onClick={endCall}
                className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all outline-none"
              >
                <PhoneOff size={40} strokeWidth={3} />
              </button>
              <p className="font-bold text-sm text-white/50 tracking-widest uppercase">End Call</p>
           </div>
        </div>
      )}
    </div>
  );
}
