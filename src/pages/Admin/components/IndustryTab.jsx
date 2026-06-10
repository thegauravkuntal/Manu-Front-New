import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

const API_URL = "http://localhost:5001/api";

const IndustryTab = ({ onRefresh }) => {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    number: "",
    color: "orange",
    icon: "🏭"
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch Industries
  const fetchIndustries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/industries`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setIndustries(data.industries || []);
      }
    } catch (error) {
      console.error("Error fetching industries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setMessage({ text: "Industry title is required", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }
    
    if (!formData.desc.trim()) {
      setMessage({ text: "Description is required", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }

    if (!formData.icon) {
      setMessage({ text: "Please select an icon", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let url = `${API_URL}/industries`;
      let method = "POST";
      
      if (editingId) {
        url = `${API_URL}/industries/${editingId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: editingId ? "Industry updated successfully!" : "Industry added successfully!", type: "success" });
        setFormData({ title: "", desc: "", number: "", color: "orange", icon: "🏭" });
        setEditingId(null);
        setIsAdding(false);
        fetchIndustries();
        if (onRefresh) onRefresh();
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } else {
        setMessage({ text: data.msg || "Error saving industry", type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ text: "Server error", type: "error" });
    }
  };

  const handleEdit = (industry) => {
    setEditingId(industry._id);
    setFormData({
      title: industry.title || "",
      desc: industry.desc || "",
      number: industry.number || "",
      color: industry.color || "orange",
      icon: industry.icon || "🏭"
    });
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this industry?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/industries/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: "Industry deleted successfully!", type: "success" });
        fetchIndustries();
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } else {
        setMessage({ text: data.msg || "Error deleting industry", type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: "", desc: "", number: "", color: "orange", icon: "🏭" });
  };

  // Icon options for dropdown
  const iconOptions = [
    { value: "🏭", label: "🏭 Factory / Industry" },
    { value: "⚙️", label: "⚙️ Gear / Engineering" },
    { value: "🔧", label: "🔧 Tools / Maintenance" },
    { value: "🏗️", label: "🏗️ Construction" },
    { value: "🧪", label: "🧪 Chemical / Lab" },
    { value: "🚗", label: "🚗 Automotive" },
    { value: "📦", label: "📦 Packaging / Logistics" },
    { value: "⚡", label: "⚡ Energy / Power" },
    { value: "🔬", label: "🔬 Research / Science" },
    { value: "💻", label: "💻 Technology / IT" },
    { value: "🌾", label: "🌾 Agriculture / Farming" },
    { value: "🩺", label: "🩺 Healthcare / Medical" },
    { value: "📊", label: "📊 Analytics / Data" },
    { value: "🎨", label: "🎨 Design / Creative" },
    { value: "📈", label: "📈 Finance / Trading" },
    { value: "🎓", label: "🎓 Education" },
    { value: "🏥", label: "🏥 Hospital" },
    { value: "🏪", label: "🏪 Retail" },
    { value: "🍽️", label: "🍽️ Food / Restaurant" },
    { value: "🏨", label: "🏨 Hospitality" },
  ];

  // Color options
  const colorOptions = [
    { name: "orange", code: "#f97316" },
    { name: "purple", code: "#a855f7" },
    { name: "blue", code: "#3b82f6" },
    { name: "green", code: "#22c55e" },
    { name: "red", code: "#ef4444" },
    { name: "pink", code: "#ec4899" },
    { name: "yellow", code: "#eab308" },
    { name: "cyan", code: "#06b6d4" },
    { name: "indigo", code: "#6366f1" },
    { name: "teal", code: "#14b8a6" },
  ];

  return (
    <div className="bg-[#0f1724] rounded-xl p-6 h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-white">Industries Manager</h2>
          <p className="text-gray-400 text-sm mt-1">Manage industries we serve across multiple sectors</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Industry
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

      {/* Scrollable Form + List Area */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        
        {/* Add/Edit Form */}
        {isAdding && (
          <div className="mb-6 bg-[#1a2332] rounded-lg p-4 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">{editingId ? "Edit Industry" : "Add New Industry"}</h3>
              <button onClick={handleCancel} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title and Number */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Industry Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g., Chemical, Automotive"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Display Number</label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g., 01, 02, 03"
                  />
                </div>
              </div>

              {/* Icon Dropdown */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">Icon *</label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-64 p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500 text-xl"
                  required
                >
                  {iconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-gray-500 text-xs mt-1">Select an icon for this industry</p>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">Theme Color</label>
                <div className="flex gap-3 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.name })}
                      className={`w-10 h-10 rounded-full transition-all ${
                        formData.color === color.name 
                          ? "ring-2 ring-white ring-offset-2 ring-offset-[#1a2332]" 
                          : ""
                      }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    />
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-2">Selected: {formData.color || "orange"}</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">Description *</label>
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="Enter industry description..."
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                  {editingId ? "Update Industry" : "Add Industry"}
                </button>
                <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Industries List */}
        {loading ? (
          <div className="text-center py-8 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            Loading industries...
          </div>
        ) : industries.length === 0 ? (
          <div className="text-center py-8 text-gray-400 border border-dashed border-white/20 rounded-lg">
            No industries found. Click "Add Industry" to create one.
          </div>
        ) : (
          <div className="space-y-3">
            {industries.map((industry) => (
              <div key={industry._id} className="bg-[#1a2332] rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl bg-gray-800/50 p-2 rounded-lg">
                        {industry.icon || "🏭"}
                      </span>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{industry.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          {industry.number && (
                            <span className="text-orange-400 text-sm font-mono">#{industry.number}</span>
                          )}
                          {industry.color && (
                            <span className="flex items-center gap-1 text-xs">
                              <span 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: industry.color }}
                              />
                              <span className="text-gray-400">{industry.color}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">{industry.desc}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(industry)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(industry._id)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryTab;