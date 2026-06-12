import React, { useState, useEffect } from "react";
import { Save, RotateCcw, X, Upload, Image as ImageIcon, Code } from "lucide-react";

const API_URL = "http://localhost:5001/api";

const SEOTab = ({ onRefresh }) => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ogImageFile, setOgImageFile] = useState(null);
  const [ogImagePreview, setOgImagePreview] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  
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
    isActive: true,
    headCode: "",      // 🔥 ADDED
    bodyCode: "",      // 🔥 ADDED
  });

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
        setSeoData({
          ...data.seo,
          schemaJson: typeof data.seo.schemaJson === "object" 
            ? JSON.stringify(data.seo.schemaJson, null, 2) 
            : data.seo.schemaJson || "",
          headCode: data.seo.headCode || "",      // 🔥 ADDED
          bodyCode: data.seo.bodyCode || "",      // 🔥 ADDED
        });
        if (data.seo.ogImage) {
          setOgImagePreview(data.seo.ogImage);
        }
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
    } else {
      setSeoData({
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
        isActive: true,
        headCode: "",      // 🔥 ADDED
        bodyCode: "",      // 🔥 ADDED
      });
      setOgImagePreview(null);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSeoData({
      ...seoData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleOgImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOgImageFile(file);
      setOgImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ text: "", type: "" });
    
    try {
      const token = localStorage.getItem("token");
      
      // If new image uploaded, upload to Cloudinary first
      let ogImageUrl = seoData.ogImage;
      if (ogImageFile) {
        const formData = new FormData();
        formData.append("image", ogImageFile);
        
        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          ogImageUrl = uploadData.url;
        }
      }
      
      const finalData = {
        ...seoData,
        pageSlug: selectedPage,
        ogImage: ogImageUrl,
        schemaJson: seoData.schemaJson ? JSON.parse(seoData.schemaJson) : null,
        headCode: seoData.headCode || "",      // 🔥 ADDED
        bodyCode: seoData.bodyCode || "",      // 🔥 ADDED
      };
      
      const res = await fetch(`${API_URL}/seo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(finalData)
      });
      
      const data = await res.json();
      if (data.success) {
        setMessage({ text: "SEO saved successfully!", type: "success" });
        setOgImageFile(null);
        if (onRefresh) onRefresh();
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } else {
        setMessage({ text: data.msg || "Error saving SEO", type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ text: "Invalid JSON in Schema Markup", type: "error" });
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
          <p className="text-gray-400 text-sm mt-1">Manage SEO meta tags for website pages</p>
        </div>
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
              <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">📄 SEO Information</h3>
              
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

                {/* Meta Keywords */}
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Meta Keywords (comma separated)</label>
                  <input
                    type="text"
                    name="metaKeywords"
                    value={seoData.metaKeywords || ""}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Enter meta keywords (comma separated)"
                  />
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
              </div>
            </div>

            {/* Open Graph Section */}
            <div className="bg-[#1a2332] rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">📱 Open Graph Tags (Social Media)</h3>
              
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
                
                {/* OG Image Upload */}
                <div>
                  <label className="block text-gray-300 text-sm mb-1">OG Image</label>
                  <div className="flex items-center gap-4 flex-wrap">
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#0f1724] border border-white/10 rounded-lg text-gray-300 hover:border-orange-500 transition-colors">
                        <Upload size={16} />
                        <span>Upload OG Image</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleOgImageUpload}
                        className="hidden"
                      />
                    </label>
                    {ogImagePreview && (
                      <div className="flex items-center gap-2">
                        <img src={ogImagePreview} alt="OG Preview" className="w-12 h-12 rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={() => { setOgImagePreview(null); setOgImageFile(null); setSeoData({...seoData, ogImage: ""}); }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Recommended size: 1200 x 630 pixels</p>
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
                  value={seoData.schemaJson || ""}
                  onChange={handleChange}
                  rows="10"
                  className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-orange-500"
                  placeholder={`{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://yourwebsite.com"
}`}
                />
                <p className="text-gray-500 text-xs mt-1">Paste valid JSON-LD schema markup for rich results</p>
              </div>
            </div>

            {/* Canonical URL */}
            <div className="bg-[#1a2332] rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">🔗 Canonical Tag</h3>
              
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
                <p className="text-gray-500 text-xs mt-1">Used to prevent duplicate content issues</p>
              </div>
            </div>

            {/* H1 Tag */}
            <div className="bg-[#1a2332] rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">📝 H1 Tag</h3>
              
              <div>
                <label className="block text-gray-300 text-sm mb-1">Main Heading (H1)</label>
                <input
                  type="text"
                  name="h1Tag"
                  value={seoData.h1Tag || ""}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="Main heading of the page"
                />
                <p className="text-gray-500 text-xs mt-1">Only one H1 tag per page recommended</p>
              </div>
            </div>

            {/* 🔥 ADVANCED SEO SECTION - HEAD/BODY CODE */}
            <div className="bg-[#1a2332] rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                <Code size={16} className="text-orange-400" />
                ⚙️ Advanced SEO
              </h3>
              
              <div className="space-y-4">
                {/* Head Code */}
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Head Code (Analytics, Pixel, Verification)
                  </label>
                  <textarea
                    name="headCode"
                    value={seoData.headCode || ""}
                    onChange={handleChange}
                    rows="6"
                    className="w-full p-3 bg-[#0f1724] border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-orange-500"
                    placeholder={`<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>

<!-- Facebook Pixel -->
<script>
  !function(f,b,e,v,n,t,s){...}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>

<!-- Google Search Console Verification -->
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />`}
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Paste Google Analytics, Google Tag Manager, Facebook Pixel, Search Console verification, or any other code that needs to go in the &lt;head&gt; section.
                  </p>
                </div>

                {/* Body Code */}
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Body Code (Chat Widgets, Scripts)
                  </label>
                  <textarea
                    name="bodyCode"
                    value={seoData.bodyCode || ""}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-3 bg-[#0f1724] border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-orange-500"
                    placeholder={`<!-- Live Chat Widget -->
<script>
  window.__lc = window.__lc || {};
  window.__lc.license = YOUR_LICENSE_KEY;
  (function() {
    var lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = true;
    lc.src = 'https://cdn.livechatinc.com/tracking.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);
  })();
</script>

<!-- Custom Script -->
<script>
  // Your custom JavaScript code here
  console.log('Custom script loaded');
</script>`}
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Paste chat widgets, live support scripts, or any other code that needs to go before the closing &lt;/body&gt; tag.
                  </p>
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="bg-[#1a2332] rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">⚙️ Status</h3>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-gray-300 text-sm">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={seoData.isActive !== false}
                    onChange={(e) => setSeoData({ ...seoData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-white/10 bg-[#0f1724] text-orange-500 focus:ring-orange-500"
                  />
                  Active
                </label>
                <span className="text-gray-500 text-xs">When active, meta tags will be applied to the page</span>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 pb-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:bg-orange-300"
              >
                <Save size={16} />
                {saving ? "Saving..." : "SAVE SEO DATA"}
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