import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MapPin, X } from "lucide-react";

const API_URL = "http://localhost:5001/api";

const CityTab = ({ onRefresh }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    state: ""
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch Cities
  const fetchCities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/cities`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCities(data.cities || []);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setMessage({ text: "City name is required", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let url = `${API_URL}/cities`;
      let method = "POST";
      
      if (editingId) {
        url = `${API_URL}/cities/${editingId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          image: formData.image || undefined,
          state: formData.state || undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: editingId ? "City updated!" : "City added!", type: "success" });
        setFormData({ name: "", image: "", state: "" });
        setEditingId(null);
        setIsAdding(false);
        fetchCities();
        if (onRefresh) onRefresh();
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } else {
        setMessage({ text: data.msg || "Error saving city", type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ text: "Server error", type: "error" });
    }
  };

  const handleEdit = (city) => {
    setEditingId(city._id);
    setFormData({
      name: city.name,
      image: city.image || "",
      state: city.state || ""
    });
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/cities/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: "City deleted!", type: "success" });
        fetchCities();
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } else {
        setMessage({ text: data.msg || "Error deleting", type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", image: "", state: "" });
  };

  return (
    <div className="bg-[#0f1724] rounded-xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-white">Cities Manager</h2>
          <p className="text-gray-400 text-sm mt-1">Manage service locations across India</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add City
          </button>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg flex-shrink-0 ${
          message.type === "success" 
            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
            : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          {message.text}
        </div>
      )}

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="mb-6 bg-[#1a2332] rounded-lg p-4 border border-white/10 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-medium">{editingId ? "Edit City" : "Add New City"}</h3>
            <button onClick={handleCancel} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">City Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                placeholder="e.g., Mumbai, Delhi, Bangalore"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">State (optional)</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                placeholder="e.g., Maharashtra, Delhi, Karnataka"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Image URL (optional)</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                placeholder="https://example.com/city-image.jpg"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                {editingId ? "Update City" : "Add City"}
              </button>
              <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cities List - SCROLLABLE */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading cities...</div>
      ) : cities.length === 0 ? (
        <div className="text-center py-8 text-gray-400 border border-dashed border-white/20 rounded-lg">
          No cities found. Click "Add City" to create one.
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cities.map((city) => (
              <div key={city._id} className="bg-[#1a2332] rounded-lg p-3 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-orange-400" />
                    <div>
                      <h3 className="text-white font-medium text-sm">{city.name}</h3>
                      {city.state && (
                        <p className="text-gray-500 text-xs">{city.state}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(city)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(city._id)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CityTab;