import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

const API_URL = "http://localhost:5001/api";

const FAQTab = ({ onRefresh }) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ question: "", answer: "", order: 0 });
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/faq`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFaqs(data.faqs || []);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      setMessage({ text: "Please fill both question and answer", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let url = `${API_URL}/faq`;
      let method = "POST";
      
      if (editingId) {
        url = `${API_URL}/faq/${editingId}`;
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
        setMessage({ text: editingId ? "FAQ updated!" : "FAQ added!", type: "success" });
        setFormData({ question: "", answer: "", order: 0 });
        setEditingId(null);
        setIsAdding(false);
        fetchFAQs();
        if (onRefresh) onRefresh();
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } else {
        setMessage({ text: data.msg || "Error saving FAQ", type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ text: "Server error", type: "error" });
    }
  };

  const handleEdit = (faq) => {
    setEditingId(faq._id);
    setFormData({ question: faq.question, answer: faq.answer, order: faq.order || 0 });
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/faq/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: "FAQ deleted!", type: "success" });
        fetchFAQs();
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
    setFormData({ question: "", answer: "", order: 0 });
  };

  return (
    <div className="bg-[#0f1724] rounded-xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-white">FAQ Manager</h2>
          <p className="text-gray-400 text-sm mt-1">Manage frequently asked questions for your website</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add FAQ
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
          <h3 className="text-white font-medium mb-4">{editingId ? "Edit FAQ" : "Add New FAQ"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Question</label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                placeholder="Enter frequently asked question..."
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Answer</label>
              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                placeholder="Enter answer..."
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Display Order (optional)</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-32 p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                placeholder="0"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                {editingId ? "Update FAQ" : "Add FAQ"}
              </button>
              <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAQs List - SCROLLABLE */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading FAQs...</div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-8 text-gray-400 border border-dashed border-white/20 rounded-lg">
          No FAQs found. Click "Add FAQ" to create one.
        </div>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto pr-2 min-h-0">
          {faqs.map((faq, index) => (
            <div key={faq._id} className="bg-[#1a2332] rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-500 text-xs">#{index + 1}</span>
                    <h3 className="text-white font-medium">{faq.question}</h3>
                  </div>
                  <p className="text-gray-400 text-sm">{faq.answer}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(faq._id)}
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
  );
};

export default FAQTab;