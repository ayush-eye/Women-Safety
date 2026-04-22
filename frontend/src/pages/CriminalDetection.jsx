import { useState, useRef } from "react";
import { ShieldAlert, Upload, Search, UserX, CheckCircle, Loader2, Camera, Video, XCircle } from "lucide-react";
import axios from "axios";

const CriminalDetection = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Replace with Render URL later if needed. For now, localhost:8000
  const API_URL = "https://criminal-face-detection-myge.onrender.com";


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null); // Reset result on new image
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setResult(null);
      setIsCameraOpen(false); // Close camera if image is dropped
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    setPreview(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
      setIsCameraOpen(false);
    }
  };

  const toggleCameraFacing = () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    if (isCameraOpen) {
      stopCamera();
      // We need to wait a tiny bit for the previous track to fully stop
      setTimeout(() => startCameraWithMode(newMode), 100);
    }
  };

  const startCameraWithMode = async (mode) => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: mode } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        const capturedFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
        setFile(capturedFile);
        setPreview(URL.createObjectURL(capturedFile));
        stopCamera();
      }, "image/jpeg");
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_URL}/api/criminals/detect`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(response.data);
    } catch (error) {
      console.error("Detection failed:", error);
      alert("Error connecting to detection server. Is the FastAPI service running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 md:px-8 bg-gray-50 min-h-[calc(100vh-80px)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Face <span className="text-red-600">Sentinel</span>
            <ShieldAlert size={32} className="text-red-600 md:w-10 md:h-10" />
          </h2>
          <p className="text-gray-500 text-sm md:text-lg mt-2">
            Intelligent Face Detection for offender identification
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 md:space-y-10">
        {/* Detection Panel */}
        <div className="space-y-6 md:space-y-10">
          <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-xl shadow-red-100 border border-red-50 text-center">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              Scan Suspect
            </h3>
            <p className="text-gray-500 text-sm md:text-base mb-6 md:mb-8">
              Upload or capture a photo to check against offender database.
            </p>

            <div className="flex gap-4 mb-8 justify-center">
              <button 
                onClick={() => setIsCameraOpen(false)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${!isCameraOpen ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
              >
                <Upload size={20} /> Upload Image
              </button>
              <button 
                onClick={isCameraOpen ? stopCamera : startCamera}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${isCameraOpen ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
              >
                <Camera size={20} /> {isCameraOpen ? "Close Camera" : "Use Camera"}
              </button>
            </div>

            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-4 border-dashed rounded-3xl p-10 transition-all cursor-pointer relative min-h-[300px] flex items-center justify-center ${
                preview || isCameraOpen ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-red-400 hover:bg-red-50/50"
              }`}
            >
              {!isCameraOpen && (
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}

              {isCameraOpen ? (
                <div className="flex flex-col items-center w-full">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className={`max-h-80 rounded-2xl shadow-2xl border-4 border-gray-900 bg-black ${facingMode === 'user' ? 'mirrored' : ''}`}
                  />
                  
                  <div className="flex gap-4 mt-6">
                    <button 
                      onClick={toggleCameraFacing}
                      className="bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-black transition-all"
                      title="Switch Camera"
                    >
                      <Video size={24} />
                    </button>
                    <button 
                      onClick={capturePhoto}
                      className="flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-full font-black text-xl shadow-xl hover:scale-110 active:scale-95 transition-all"
                    >
                      <div className="w-4 h-4 bg-white rounded-full animate-pulse" /> Capture Suspect
                    </button>
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              ) : preview ? (
                <div className="flex flex-col items-center">
                  <img src={preview} alt="Preview" className="max-h-80 object-contain rounded-xl shadow-lg border-2 border-red-200" />
                  <p className="mt-4 text-sm font-bold text-red-600">Click or drag to change image</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-gray-400">
                  <Upload size={64} className="text-red-300" />
                  <div>
                    <p className="font-bold text-xl text-gray-600">Drag & Drop face image here</p>
                    <p className="text-sm">or click to browse</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleScan}
              disabled={!file || loading}
              className="mt-8 w-full py-5 rounded-2xl bg-gray-900 text-white font-black text-xl hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={28} /> Analyzing Face...
                </>
              ) : (
                <>
                  <Search size={28} /> Scan & Detect
                </>
              )}
            </button>
          </div>

          {/* Results Panel */}
          {result && (
            <div className={`p-6 md:p-8 rounded-3xl md:rounded-[2rem] border-2 shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 ${
              result.match ? "bg-white border-red-500 shadow-red-200" : "bg-white border-green-500 shadow-green-200"
            }`}>
              {result.match ? (
                <div>
                  <div className="flex items-center gap-3 text-red-600 mb-4 md:mb-6">
                    <UserX size={32} className="md:w-10 md:h-10 animate-pulse" />
                    <h3 className="text-2xl md:text-3xl font-black">MATCH FOUND</h3>
                  </div>
                  <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 mb-6 font-bold flex justify-between items-center">
                    <span>Database Match Alert!</span>
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                      {result.confidence}% Confidence
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <img 
                      src={`${API_URL}${result.data.image}`} 
                      alt={result.data.name} 
                      className="w-40 h-40 rounded-full border-4 border-red-500 shadow-lg object-cover"
                    />
                    <div className="flex-1 space-y-2 text-lg">
                      <p><span className="text-gray-500 font-bold">Name:</span> <span className="font-black text-gray-900">{result.data.name}</span></p>
                      <p><span className="text-gray-500 font-bold">Age:</span> {result.data.age}</p>
                      <p><span className="text-gray-500 font-bold">Location:</span> {result.data.location}</p>
                      <p><span className="text-gray-500 font-bold">Crime:</span> <span className="text-red-600 font-black tracking-wide">{result.data.crime}</span></p>
                      <p><span className="text-gray-500 font-bold">Record ID:</span> CR-{String(result.data.id).padStart(4, '0')}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
                  <h3 className="text-3xl font-black text-green-600 mb-2">NO THREAT DETECTED</h3>
                  <div className="inline-block bg-green-50 text-green-800 px-4 py-2 rounded-full font-bold border border-green-200 mb-6 text-sm">
                    {result.confidence || "99.99"}% Security Clearance
                  </div>
                  <p className="text-gray-600 text-lg max-w-lg mx-auto">
                    {result.message || "This individual does not match any offender records currently existing in the database."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Scrollbar styles inside component to ensure they apply */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 1);
        }
        .mirrored {
          transform: scaleX(-1);
        }
      `}} />
    </div>
  );
};

export default CriminalDetection;
