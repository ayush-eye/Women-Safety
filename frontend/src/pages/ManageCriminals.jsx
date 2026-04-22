import { useEffect, useState } from "react";
import axios from "axios";

const ManageCriminals = () => {
  const [criminals, setCriminals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCriminals();
  }, []);

  const fetchCriminals = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/criminals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCriminals(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      setMessage("Please select a photo.");
      return;
    }

    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("photo", photo);

    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/criminals/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Criminal saved successfully.");
      setName("");
      setDescription("");
      setPhoto(null);
      setShowForm(false);
      fetchCriminals();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save criminal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Criminal Database</h1>
          <p className="text-sm text-gray-500 mt-1">
            Add new criminal records and view stored criminal photos.
          </p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          {showForm ? "Hide form" : "Add criminal"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Criminal"}
          </button>
          {message && <p className="text-sm text-gray-700">{message}</p>}
        </form>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {criminals.map((criminal) => (
          <div key={criminal._id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/${criminal.photo}`}
              alt={criminal.name}
              className="h-56 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{criminal.name}</h2>
              <p className="text-sm text-gray-600 mt-2">{criminal.description}</p>
              <p className="mt-3 text-xs text-gray-500">Added by: {criminal.addedBy?.name || "Admin"}</p>
            </div>
          </div>
        ))}
      </div>

      {criminals.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
          No criminal records yet.
        </div>
      )}
    </div>
  );
};

export default ManageCriminals;
