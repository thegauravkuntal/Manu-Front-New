import React, { useState, useEffect } from "react";
import { Save, RotateCcw, X } from "lucide-react";

const API_URL = "http://localhost:5001/api";

const SEOTab = ({ onRefresh }) => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [seoData, setSeoData] = useState({
    pageName: "",
    pageSlug: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogType: "website",
    schemaJson: "",
    canonicalUrl: "",
    h1Tag: "",
    robotsIndex: "index",
    robotsFollow: "follow",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch all pages for dropdown
  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch(`${API_URL}/seo/pages`);
      const data = await res.json();
      if (data.success) {
        setPages(data.pages);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };

  // Fetch SEO data when page is selected
  const fetchSEOData = async (pageSlug) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/seo/${pageSlug}`);
      const data = await res.json();
      if (data.success) {
        setSeoData(data.seo);
      }
    } catch (error) {
      console.error("Error fetching SEO:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (e) => {
    const slug = e.target.value;
    setSelectedPage(slug);
    if (slug) {
      fetchSEOData(slug);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeoData({ ...seoData, [name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ text: "", type: "" });
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/seo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(seoData)
      });
      
      const data = await res.json();
      if (data.success) {
        setMessage({ text: "SEO saved successfully!", type: "success" });
        if (onRefresh) onRefresh();
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } else {
        setMessage({ text: data.msg || "Error saving SEO", type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ text: "Server error", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Character count helpers
  const getCharCount = (text, max) => `${text?.length || 0}/${max}`;
  const isOverLimit = (text, max) => (text?.length || 0) > max;

  return (
    <div className="bg-[#0f1724] rounded-xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-white">SEO Manager</h2>
          <p className="text-gray-400 text-sm mt-1">Manage SEO for all pages</p>
        </div>
        {selectedPage && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:bg-orange-300"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save SEO"}
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

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        
        {/* Page Selection Dropdown */}
        <div className="mb-6 bg-[#1a2332] rounded-lg p-4 border border-white/10">
          <label className="block text-gray-300 text-sm mb-2">Select Page *</label>
          <select
            value={selectedPage}
            onChange={handlePageChange}
            className="w-full md:w-96 p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
          >
            <option value="">-- Select a Page --</option>
            {pages.map((page) => (
              <option key={page.pageSlug} value={page.pageSlug}>
                {page.pageName} ({page.pageSlug})
              </option>
            ))}
          </select>
        </div>

        {/* SEO Form */}
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading SEO data...</div>
        ) : selectedPage ? (
          <div className="space-y-6">
            
            {/* Basic SEO Section */}
            <div className="bg-[#1a2332] rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">📄 Basic SEO</h3>
              
              <div className="space-y-4">
                {/* Meta Title */}
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Meta Title <span className="text-orange-400">(max 65 characters)</span>
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={seoData.metaTitle || ""}
                    onChange={handleChange}
                    maxLength="65"
                    className={`w-full p-2 bg-[#0f1724] border rounded-lg text-white focus:outline-none focus:border-orange-500 ${
                      isOverLimit(seoData.metaTitle, 65) ? "border-red-500" : "border-white/10"
                    }`}
                    placeholder="Enter meta title"
                  />
                  <div className={`text-xs mt-1 ${isOverLimit(seoData.metaTitle, 65) ? "text-red-400" : "text-gray-500"}`}>
                    {getCharCount(seoData.metaTitle, 65)} characters
                  </div>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Meta Description <span className="text-orange-400">(max 155 characters)</span>
                  </label>
                  <textarea
                    name="metaDescription"
                    value={seoData.metaDescription || ""}
                    onChange={handleChange}
                    maxLength="155"
                    rows="3"
                    className={`w-full p-2 bg-[#0f1724] border rounded-lg text-white focus:outline-none focus:border-orange-500 ${
                      isOverLimit(seoData.metaDescription, 155) ? "border-red-500" : "border-white/10"
                    }`}
                    placeholder="Enter meta description"
                  />
                  <div className={`text-xs mt-1 ${isOverLimit(seoData.metaDescription, 155) ? "text-red-400" : "text-gray-500"}`}>
                    {getCharCount(seoData.metaDescription, 155)} characters
                  </div>
                </div>

                {/* Meta Keywords */}
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Meta Keywords (comma separated)</label>
                  <input
                    type="text"
                    name="metaKeywords"
                    value={seoData.metaKeywords || ""}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="seo, web development, react, nodejs"
                  />
                </div>

                {/* H1 Tag */}
                <div>
                  <label className="block text-gray-300 text-sm mb-1">H1 Tag</label>
                  <input
                    type="text"
                    name="h1Tag"
                    value={seoData.h1Tag || ""}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Main heading of the page"
                  />
                </div>

                {/* Canonical URL */}
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Canonical URL</label>
                  <input
                    type="url"
                    name="canonicalUrl"
                    value={seoData.canonicalUrl || ""}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="https://yourwebsite.com/current-page"
                  />
                </div>

                {/* Robots Meta */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Index/Noindex</label>
                    <select
                      name="robotsIndex"
                      value={seoData.robotsIndex || "index"}
                      onChange={handleChange}
                      className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="index">Index</option>
                      <option value="noindex">No Index</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Follow/Nofollow</label>
                    <select
                      name="robotsFollow"
                      value={seoData.robotsFollow || "follow"}
                      onChange={handleChange}
                      className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="follow">Follow</option>
                      <option value="nofollow">No Follow</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Open Graph Section */}
            <div className="bg-[#1a2332] rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">📱 Open Graph (Social Media)</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">OG Title</label>
                  <input
                    type="text"
                    name="ogTitle"
                    value={seoData.ogTitle || ""}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Title for social media shares"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">OG Description</label>
                  <textarea
                    name="ogDescription"
                    value={seoData.ogDescription || ""}
                    onChange={handleChange}
                    rows="2"
                    className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Description for social media shares"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">OG Image URL</label>
                  <input
                    type="url"
                    name="ogImage"
                    value={seoData.ogImage || ""}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="https://yourwebsite.com/social-preview.jpg"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">OG Type</label>
                  <select
                    name="ogType"
                    value={seoData.ogType || "website"}
                    onChange={handleChange}
                    className="w-48 p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="website">Website</option>
                    <option value="article">Article</option>
                    <option value="product">Product</option>
                    <option value="profile">Profile</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Schema Markup Section */}
            <div className="bg-[#1a2332] rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">🔍 Schema Markup (JSON-LD)</h3>
              
              <div>
                <label className="block text-gray-300 text-sm mb-1">JSON-LD Schema</label>
                <textarea
                  name="schemaJson"
                  value={typeof seoData.schemaJson === "object" ? JSON.stringify(seoData.schemaJson, null, 2) : seoData.schemaJson || ""}
                  onChange={handleChange}
                  rows="8"
                  className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-orange-500"
                  placeholder='{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://yourwebsite.com"
}'
                />
                <p className="text-gray-500 text-xs mt-1">Paste valid JSON-LD schema markup</p>
              </div>
            </div>

            {/* Save Button at Bottom */}
            <div className="flex justify-end pt-4 pb-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:bg-orange-300"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save SEO Settings"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 border border-dashed border-white/20 rounded-lg">
            Select a page from dropdown to edit SEO settings
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOTab;