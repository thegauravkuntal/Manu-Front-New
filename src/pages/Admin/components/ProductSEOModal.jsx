import React, { useState, useEffect } from "react";
import { X, Save, Code } from "lucide-react";

const ProductSEOModal = ({ isOpen, onClose, product, onSubmit, isSubmitting }) => {
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ogTitle: "",
    ogDescription: "",
    schemaJson: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setSeoData({
        metaTitle: product.metaTitle || "",
        metaDescription: product.metaDescription || "",
        metaKeywords: product.metaKeywords || "",
        ogTitle: product.ogTitle || "",
        ogDescription: product.ogDescription || "",
        schemaJson: product.schemaJson
          ? typeof product.schemaJson === "object"
            ? JSON.stringify(product.schemaJson, null, 2)
            : product.schemaJson
          : "",
      });
      setErrors({});
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeoData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (seoData.metaTitle && seoData.metaTitle.length > 65) {
      newErrors.metaTitle = "Max 65 characters";
    }
    if (seoData.metaDescription && seoData.metaDescription.length > 155) {
      newErrors.metaDescription = "Max 155 characters";
    }
    if (seoData.schemaJson) {
      try {
        JSON.parse(seoData.schemaJson);
      } catch {
        newErrors.schemaJson = "Invalid JSON";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...seoData,
      schemaJson: seoData.schemaJson ? JSON.parse(seoData.schemaJson) : null,
    };
    onSubmit(product._id, payload);
  };

  const getCharCount = (text, max) => `${text?.length || 0}/${max}`;
  const isOverLimit = (text, max) => (text?.length || 0) > max;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#020817] animate-in fade-in duration-300">
      <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#081120]">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
          SEO Meta Data — {product?.title || ""}
        </h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#020817]">
        <div className="p-6 md:p-12">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 bg-[#081120] border border-white/10 p-8 md:p-10 rounded-[40px] shadow-2xl">
            {/* Basic SEO */}
            <div className="bg-[#1a2332] rounded-lg p-5 border border-white/10">
              <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">Basic SEO</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Meta Title <span className="text-orange-400">(max 65 characters)</span>
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={seoData.metaTitle}
                    onChange={handleChange}
                    maxLength={65}
                    className={`w-full p-2 bg-[#0f1724] border rounded-lg text-white focus:outline-none focus:border-orange-500 ${
                      errors.metaTitle ? "border-red-500" : isOverLimit(seoData.metaTitle, 65) ? "border-red-500" : "border-white/10"
                    }`}
                    placeholder="Leave empty to use product title"
                  />
                  <div className={`text-xs mt-1 ${isOverLimit(seoData.metaTitle, 65) ? "text-red-400" : "text-gray-500"}`}>
                    {getCharCount(seoData.metaTitle, 65)} characters
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-1">Meta Keywords (comma separated)</label>
                  <input
                    type="text"
                    name="metaKeywords"
                    value={seoData.metaKeywords}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g. industrial, packaging, machinery"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Meta Description <span className="text-orange-400">(max 155 characters)</span>
                  </label>
                  <textarea
                    name="metaDescription"
                    value={seoData.metaDescription}
                    onChange={handleChange}
                    maxLength={155}
                    rows={3}
                    className={`w-full p-2 bg-[#0f1724] border rounded-lg text-white focus:outline-none focus:border-orange-500 ${
                      errors.metaDescription ? "border-red-500" : isOverLimit(seoData.metaDescription, 155) ? "border-red-500" : "border-white/10"
                    }`}
                    placeholder="Brief description for search engine results"
                  />
                  <div className={`text-xs mt-1 ${isOverLimit(seoData.metaDescription, 155) ? "text-red-400" : "text-gray-500"}`}>
                    {getCharCount(seoData.metaDescription, 155)} characters
                  </div>
                </div>
              </div>
            </div>

            {/* Open Graph */}
            <div className="bg-[#1a2332] rounded-lg p-5 border border-white/10">
              <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">Open Graph Tags (Social Media)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">OG Title</label>
                  <input
                    type="text"
                    name="ogTitle"
                    value={seoData.ogTitle}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Title for social media shares"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">OG Description</label>
                  <textarea
                    name="ogDescription"
                    value={seoData.ogDescription}
                    onChange={handleChange}
                    rows={2}
                    className="w-full p-2 bg-[#0f1724] border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Description for social media shares"
                  />
                </div>
              </div>
            </div>

            {/* Schema Markup */}
            <div className="bg-[#1a2332] rounded-lg p-5 border border-white/10">
              <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                <Code size={16} className="text-orange-400" />
                Schema Markup (JSON-LD)
              </h3>
              <div>
                <label className="block text-gray-300 text-sm mb-1">JSON-LD Schema</label>
                <textarea
                  name="schemaJson"
                  value={seoData.schemaJson}
                  onChange={handleChange}
                  rows={8}
                  className={`w-full p-2 bg-[#0f1724] border rounded-lg text-white font-mono text-sm focus:outline-none focus:border-orange-500 ${
                    errors.schemaJson ? "border-red-500" : "border-white/10"
                  }`}
                  placeholder={`{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name"
}`}
                />
                {errors.schemaJson && (
                  <p className="text-red-400 text-xs mt-1">{errors.schemaJson}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">Paste valid JSON-LD schema markup for rich results</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-[45px] mt-4 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                isSubmitting
                  ? "bg-gray-600 cursor-not-allowed opacity-70"
                  : "bg-orange-500 hover:bg-blue-600 shadow-orange-500/20"
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving SEO...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save SEO Meta Data
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductSEOModal;
