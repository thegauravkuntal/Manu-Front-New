import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { API_BASE_URL } from "../../../api/config";

const HeroTab = ({ onRefresh }) => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    desc: "",
    image: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/hero`);
      const data = await res.json();
      if (data.success) {
        setSlides(data.slides || []);
      }
    } catch (error) {
      console.error("Error fetching hero slides:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.desc.trim()) {
      setMessage({ text: "Title and Description are required", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let url = `${API_BASE_URL}/hero`;
      let method = "POST";

      if (editingId) {
        url = `${API_BASE_URL}/hero/${editingId}`;
        method = "PUT";
      }

      const formDataObj = new FormData();
      formDataObj.append("title", formData.title.trim());
      formDataObj.append("desc", formData.desc.trim());
      if (formData.subtitle) formDataObj.append("subtitle", formData.subtitle.trim());
      if (imageFile) formDataObj.append("image", imageFile);
      if (formData.image && !imageFile) formDataObj.append("image", formData.image);

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj,
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: editingId ? "Slide updated successfully!" : "Slide added successfully!", type: "success" });
        setFormData({ title: "", subtitle: "", desc: "", image: "" });
        setImageFile(null);
        setImagePreview(null);
        setEditingId(null);
        setIsAdding(false);
        fetchSlides();
        if (onRefresh) onRefresh();
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } else {
        setMessage({ text: data.msg || "Error saving slide", type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ text: "Server error", type: "error" });
    }
  };

  const handleEdit = (slide) => {
    setEditingId(slide._id);
    setFormData({
      title: slide.title || "",
      subtitle: slide.subtitle || "",
      desc: slide.desc || "",
      image: slide.image || "",
    });
    setImagePreview(slide.image || null);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/hero/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: "Slide deleted successfully!", type: "success" });
        fetchSlides();
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } else {
        setMessage({ text: data.msg || "Error deleting slide", type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: "", subtitle: "", desc: "", image: "" });
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="bg-[#0f1724] rounded-xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-white">Hero Section Manager</h2>
          <p className="text-gray-400 text-sm mt-1">Manage homepage hero slides</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Slide
          </button>
        )}
      </div>

      {message.text && (
        <div className={`mb-4 p-3 rounded-lg flex-shrink-0 ${
          message.type === "success"
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        {isAdding && (
          <div className="mb-6 bg-[#1a2332] rounded-lg p-4 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">{editingId ? "Edit Slide" : "Add New Slide"}</h3>
              <button onClick={handleCancel} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g., Manufacturing Success"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g., Trusted Partner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Description *</label>
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="Slide description..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" className="h-20 rounded object-cover" />
                  </div>
                )}
                {editingId && !imageFile && formData.image && (
                  <p className="text-gray-400 text-xs mt-1">Current image kept if no new file selected</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                  {editingId ? "Update Slide" : "Add Slide"}
                </button>
                <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            Loading slides...
          </div>
        ) : slides.length === 0 ? (
          <div className="text-center py-8 text-gray-400 border border-dashed border-white/20 rounded-lg">
            No hero slides found. Click "Add Slide" to create one.
          </div>
        ) : (
          <div className="space-y-3">
            {slides.map((slide) => (
              <div key={slide._id} className="bg-[#1a2332] rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {slide.image && (
                        <img src={slide.image} alt={slide.title} className="w-16 h-16 rounded-lg object-cover" />
                      )}
                      <div>
                        <h3 className="text-white font-semibold">{slide.title}</h3>
                        {slide.subtitle && (
                          <span className="text-orange-400 text-sm">{slide.subtitle}</span>
                        )}
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{slide.desc}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(slide)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(slide._id)}
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

export default HeroTab;
