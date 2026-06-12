import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

const API_URL = "http://localhost:5001/api";

const RedirectTab = ({ onRefresh }) => {
  const [redirects, setRedirects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    oldUrl: "",
    newUrl: "",
    statusCode: 301,
    note: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchRedirects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/redirects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRedirects(data.redirects || []);
      }
    } catch (error) {
      console.error("Error fetching redirects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedirects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.oldUrl || !formData.newUrl) {
      setMessage({ text: "Old URL and New URL are required", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let url = `${API_URL}/redirects`;
      let method = "POST";

      if (editingId) {
        url = `${API_URL}/redirects/${editingId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({
          text: editingId ? "Redirect updated!" : "Redirect added!",
          type: "success",
        });
        setFormData({ oldUrl: "", newUrl: "", statusCode: 301, note: "" });
        setEditingId(null);
        setIsAdding(false);
        fetchRedirects();
        if (onRefresh) onRefresh();
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } else {
        setMessage({ text: data.msg || "Error saving redirect", type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (redirect) => {
    setEditingId(redirect._id);
    setFormData({
      oldUrl: redirect.oldUrl,
      newUrl: redirect.newUrl,
      statusCode: redirect.statusCode,
      note: redirect.note || "",
    });
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this redirect?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/redirects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: "Redirect deleted!", type: "success" });
        fetchRedirects();
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ oldUrl: "", newUrl: "", statusCode: 301, note: "" });
  };

  return (
    <div className="bg-[#0f1724] rounded-xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-white">301 Redirects</h2>
          <p className="text-gray-400 text-sm mt-1">
            Manage URL redirects for moved or renamed pages
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
          >
            <Plus size={16} />
            Add Redirect
          </button>
        )}
      </div>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        {isAdding && (
          <div className="mb-6 bg-[#1a2332] rounded-lg p-4 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">
                {editingId ? "Edit Redirect" : "Add New Redirect"}
              </h3>
              <button onClick={handleCancel} className="text-gray-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Old URL *
                </label>
                <input
                  type="text"
                  name="oldUrl"
                  value={formData.oldUrl}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white"
                  placeholder="/old-product-url"
                  required
                />
                <p className="text-gray-500 text-xs mt-1">
                  Example: /product/cup-making-machine
                </p>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  New URL *
                </label>
                <input
                  type="text"
                  name="newUrl"
                  value={formData.newUrl}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white"
                  placeholder="/new-product-url"
                  required
                />
                <p className="text-gray-500 text-xs mt-1">
                  Example: /product/paper-cup-making-machine
                </p>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Redirect Type
                </label>
                <select
                  name="statusCode"
                  value={formData.statusCode}
                  onChange={handleChange}
                  className="w-32 p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white"
                >
                  <option value={301}>301 - Permanent</option>
                  <option value={302}>302 - Temporary</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white"
                  placeholder="Why this redirect exists?"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg"
                >
                  {editingId ? "Update Redirect" : "Add Redirect"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : redirects.length === 0 ? (
          <div className="text-center py-8 text-gray-400 border border-dashed rounded-lg">
            No redirects found. Click "Add Redirect" to create one.
          </div>
        ) : (
          <div className="space-y-2">
            {redirects.map((redirect) => (
              <div
                key={redirect._id}
                className="bg-[#1a2332] rounded-lg p-3 border border-white/10"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gray-400 text-sm">
                        {redirect.oldUrl}
                      </span>
                      <span className="text-orange-400">→</span>
                      <span className="text-green-400 text-sm">
                        {redirect.newUrl}
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                        {redirect.statusCode}
                      </span>
                    </div>
                    {redirect.note && (
                      <p className="text-gray-500 text-xs mt-1">{redirect.note}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(redirect)}
                      className="p-1.5 text-blue-400 hover:text-blue-300"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(redirect._id)}
                      className="p-1.5 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={14} />
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

export default RedirectTab;