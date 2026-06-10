import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Star, X } from "lucide-react";

const API_URL = "http://localhost:5001/api";

const TestimonialTab = ({ onRefresh }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    text: "",        // paragraph/message
    name: "",        // customer name
    location: "",    // city, state
    rating: 5,       // stars rating (1-5)
    color: "green"   // green or purple
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch Testimonials
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/testimonials`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.testimonials || []);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text.trim() || !formData.name.trim() || !formData.location.trim()) {
      setMessage({ text: "Please fill text, name and location", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let url = `${API_URL}/testimonials`;
      let method = "POST";
      
      if (editingId) {
        url = `${API_URL}/testimonials/${editingId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          text: formData.text,
          name: formData.name,
          location: formData.location,
          rating: formData.rating,
          color: formData.color
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: editingId ? "Testimonial updated!" : "Testimonial added!", type: "success" });
        setFormData({ text: "", name: "", location: "", rating: 5, color: "green" });
        setEditingId(null);
        setIsAdding(false);
        fetchTestimonials();
        if (onRefresh) onRefresh();
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } else {
        setMessage({ text: data.msg || "Error saving testimonial", type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ text: "Server error", type: "error" });
    }
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial._id);
    setFormData({
      text: testimonial.text || "",
      name: testimonial.name || "",
      location: testimonial.location || "",
      rating: testimonial.rating || 5,
      color: testimonial.color || "green"
    });
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/testimonials/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: "Testimonial deleted!", type: "success" });
        fetchTestimonials();
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
    setFormData({ text: "", name: "", location: "", rating: 5, color: "green" });
  };

  // Render stars for display
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? "text-amber-400 fill-amber-400" : "text-gray-500"}
      />
    ));
  };

  return (
    <div className="bg-[#0f1724] rounded-xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-white">Testimonials Manager</h2>
          <p className="text-gray-400 text-sm mt-1">Manage customer reviews and testimonials for your website</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Testimonial
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
            <h3 className="text-white font-medium">{editingId ? "Edit Testimonial" : "Add New Testimonial"}</h3>
            <button onClick={handleCancel} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Testimonial Message *</label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                placeholder="What did the customer say..."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Customer Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="e.g., Rajesh Kumar"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="e.g., Bhiwadi, Rajasthan"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Rating (1-5 stars)</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={star <= formData.rating ? "text-amber-400 fill-amber-400" : "text-gray-500"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Theme Color</label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="green">Green (Orange theme)</option>
                  <option value="purple">Purple (Purple theme)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                {editingId ? "Update Testimonial" : "Add Testimonial"}
              </button>
              <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials List - SCROLLABLE */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading testimonials...</div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-8 text-gray-400 border border-dashed border-white/20 rounded-lg">
          No testimonials found. Click "Add Testimonial" to create one.
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 min-h-0">
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="bg-[#1a2332] rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Testimonial Text */}
                    <p className="text-gray-300 text-sm italic mb-3">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    
                    {/* Stars Rating */}
                    <div className="flex gap-1 mb-2">
                      {renderStars(testimonial.rating || 5)}
                    </div>
                    
                    {/* Name */}
                    <h3 className={`text-white font-semibold ${
                      testimonial.color === "green" ? "text-orange-500" : "text-purple-500"
                    }`}>
                      {testimonial.name}
                    </h3>
                    
                    {/* Location */}
                    <p className="text-gray-400 text-sm">
                      📍 {testimonial.location}
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
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
        </div>
      )}
    </div>
  );
};

export default TestimonialTab;