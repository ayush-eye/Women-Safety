import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-100 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 font-medium tracking-wide flex items-center justify-center gap-2">
            © 2026 <span className="text-red-600 font-bold">SafeHer</span> | Powered by advanced AI for your security
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

