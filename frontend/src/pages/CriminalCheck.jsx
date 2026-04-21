import { useState } from "react";
import axios from "axios";

const CriminalCheck = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a photo.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("photo", selectedFile);
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await axios.post(
        "http://localhost:5000/api/criminals/identify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to identify the photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-4">Criminal Identification</h1>
      <p className="text-sm text-gray-500 mb-6">
        Upload a photo and the backend will compare it against the stored criminal database.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check Photo"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-lg bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h2 className="text-xl font-semibold mb-2">Result</h2>
          <p className="mb-3">{result.message}</p>
          {result.matches?.length > 0 ? (
            <div className="space-y-3">
              {result.matches.map((match) => (
                <div key={match.id} className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="font-semibold">Name: {match.name}</p>
                  <p>Description: {match.description}</p>
                  <p>Confidence: {match.confidence.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No match was detected.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CriminalCheck;
