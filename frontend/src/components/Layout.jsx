import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-white to-slate-50 -z-10 pointer-events-none"></div>
      <Navbar />
      <main className="flex-grow relative z-0">
        {children}
      </main>
      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
              <span className="text-xl font-black text-slate-900 tracking-tighter">Safe<span className="text-red-600">Her</span></span>
            </div>
            <p className="text-slate-400 text-sm font-medium tracking-wide">
              © 2026 SafeHer Security Systems • Empowering safety through technology
            </p>
            <div className="flex gap-6 mt-2">
              {['Privacy', 'Safety Tips', 'Emergency Numbers', 'Contact Support'].map((item) => (
                <span key={item} className="text-xs text-slate-400 hover:text-red-600 cursor-pointer transition-colors font-semibold uppercase tracking-widest">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

