import { useState, useEffect } from "react";
import {
  X,
  Smartphone,
  Monitor,
  Download,
  AlertTriangle,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

const AddToHomeScreen = ({ onClose, onShortcutCreated }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [installStatus, setInstallStatus] = useState(null);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(
          userAgent,
        );
      const isIOSDevice = /iphone|ipad|ipod/i.test(userAgent);

      setIsMobile(isMobileDevice);
      setIsIOS(isIOSDevice);
    };
    checkDevice();

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleCreateShortcut = async () => {
    if (deferredPrompt) {
      setInstallStatus("installing");
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setInstallStatus("installed");
        saveUserPreference(true); // Mark shortcut as created
        setTimeout(() => {
          onShortcutCreated?.();
          onClose?.();
        }, 1500);
      } else {
        setInstallStatus(null);
      }
      setDeferredPrompt(null);
      return;
    }

    if (isIOS) {
      showIOSInstructions();
      return;
    }

    createDesktopShortcut();
  };

  const showIOSInstructions = () => {
    setShowInstructions(true);
  };

  const createDesktopShortcut = () => {
    const isWindows = navigator.userAgent.indexOf("Windows") !== -1;

    if (isWindows) {
      const shortcutContent = `[InternetShortcut]
URL=${window.location.href}
IDList=
HotKey=0
IconFile=${window.location.origin}/favicon.ico
IconIndex=0
`;
      const blob = new Blob([shortcutContent], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "SafeHer.url";
      link.click();
      URL.revokeObjectURL(link.href);

      alert(
        "Shortcut file downloaded! Move it to your desktop for easy access.",
      );
      saveUserPreference(false);
      onShortcutCreated?.();
      onClose?.();
    } else {
      const message = `To create a desktop shortcut for "SafeHer":

Chrome/Edge:
1. Click the 🔒 or 🌐 icon in the address bar
2. Drag it to your desktop
3. Or click "Install app" / "Create shortcut" from the menu

Firefox:
1. Resize browser to see desktop
2. Drag the 🔒 icon from address bar to desktop

Alternatively, right-click on desktop → New → Shortcut → Enter: ${window.location.href}`;

      alert(message);
      saveUserPreference(false);
      onShortcutCreated?.();
      onClose?.();
    }
  };

  const saveUserPreference = (shortcutCreated = false) => {
    if (shortcutCreated) {
      localStorage.setItem("addToHomeScreen_created", "true");
    }
    if (dontShowAgain) {
      localStorage.setItem("addToHomeScreen_dontShow", "true");
    }
    localStorage.setItem("addToHomeScreen_lastShown", Date.now().toString());
  };

  const handleDontShowChange = (e) => {
    setDontShowAgain(e.target.checked);
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("addToHomeScreen_dontShow", "true");
    }
    localStorage.setItem("addToHomeScreen_lastShown", Date.now().toString());
    setShowInstructions(false);
    setInstallStatus(null);
    onClose?.();
  };

  if (installStatus === "installed") {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-[10000] animate-slide-up">
        <div className="bg-white rounded-2xl shadow-2xl shadow-green-200 border-2 border-green-100 max-w-md mx-auto md:mx-0 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle size={48} className="text-white" />
            </div>
            <h3 className="text-white font-bold text-xl">
              Installation Started!
            </h3>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-4">
              SafeHer is being installed. You'll find it on your home
              screen/desktop shortly!
            </p>
            <button
              onClick={handleClose}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showInstructions && isIOS) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl max-w-md w-full border-2 border-red-100 shadow-2xl shadow-red-200">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Smartphone size={24} className="text-white" />
              </div>
              <h3 className="text-white font-bold text-lg">
                Add to Home Screen
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <p className="text-gray-700 mb-4 font-semibold">
              Follow these steps to add SafeHer to your home screen:
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center text-red-600 font-bold shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    Tap the Share button
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="bg-gray-100 p-2 rounded-lg inline-flex items-center gap-1">
                      <ExternalLink size={20} />
                      <span className="text-sm">Share icon</span>
                    </div>
                    <span className="text-gray-500">
                      at the bottom of Safari
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center text-red-600 font-bold shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    Scroll down and tap
                  </p>
                  <div className="mt-1">
                    <div className="bg-gray-100 p-2 rounded-lg inline-flex items-center gap-1">
                      <span className="text-sm font-bold">
                        "Add to Home Screen"
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center text-red-600 font-bold shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    Tap "Add" in the top right
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    The app icon will appear on your home screen
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-red-50 rounded-xl p-3 border border-red-100">
              <p className="text-sm text-red-800 flex items-center gap-2">
                <AlertTriangle size={16} />
                Once added, you can access SafeHer instantly from your home
                screen!
              </p>
            </div>

            <button
              onClick={() => {
                saveUserPreference(false);
                onShortcutCreated?.();
                onClose?.();
              }}
              className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-[10000] animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl shadow-red-200 border-2 border-red-100 max-w-md mx-auto md:mx-0 overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              {isMobile ? (
                <Smartphone size={24} className="text-white" />
              ) : (
                <Monitor size={24} className="text-white" />
              )}
            </div>
            <h3 className="text-white font-bold text-lg">
              Quick Access Shortcut
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4 leading-relaxed">
            Add <span className="font-bold text-red-600">SafeHer</span> to your{" "}
            {isMobile ? "home screen" : "desktop"} for quick access during
            emergencies.
          </p>

          <div className="bg-red-50 rounded-xl p-3 mb-6 flex items-start gap-2 border border-red-100">
            <div className="text-red-600 mt-0.5">
              {deferredPrompt ? (
                <Download size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}
            </div>
            <p className="text-sm text-red-800">
              {deferredPrompt
                ? "✓ One-click installation available! Click 'Install App' below."
                : isIOS
                  ? "⚠️ iOS requires manual setup. We'll guide you through the steps."
                  : "📱 Click below and follow the browser prompts to install."}
            </p>
          </div>

          <label className="flex items-center gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={handleDontShowChange}
              className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
            />
            <span className="text-sm text-gray-600">
              Do not show this reminder for one week
            </span>
          </label>

          <div className="flex gap-3">
            <button
              onClick={handleCreateShortcut}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-red-200 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Download size={18} />
              {deferredPrompt ? "Install App (One Click)" : "Create Shortcut"}
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-3 border-2 border-red-200 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Remind Later
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-red-100">
            <p className="text-xs text-gray-400 text-center">
              {deferredPrompt ? (
                "Click Install App - the browser will handle everything for you!"
              ) : isIOS ? (
                <>
                  Tap Share{" "}
                  <span className="inline-block mx-1 text-red-600">⎋</span> →
                  "Add to Home Screen"
                </>
              ) : (
                <>
                  Look for install icon{" "}
                  <span className="inline-block mx-1 text-red-600">⬇️</span> in
                  address bar
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddToHomeScreen;
