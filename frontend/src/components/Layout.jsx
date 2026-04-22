import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-0">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="hidden md:block bg-white border-t border-gray-100 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 font-medium tracking-wide flex flex-wrap items-center justify-center gap-2">
            © 2026 <span className="text-red-600 font-bold">SafeHer</span> | Powered by advanced AI for your security
          </p>
        </div>
      </footer>
      <BottomNav />
    </div>
  );
};

export default Layout;
