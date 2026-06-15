import React, { useState, useEffect } from "react";
import { Save, Plus, X, GripVertical, Upload } from "lucide-react";
import { API_BASE_URL, getServerUrl } from "../../../api/config";

const DEFAULT_FOOTER = {
  about: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  phone: "",
  email: "",
  timing: "",
  manufacturingHeading: "Categories",
  manufacturingLinks: [],
  projectHeading: "Quick Links",
  projectLinks: [],
};

const FooterTab = ({ onRefresh }) => {
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newMfgLink, setNewMfgLink] = useState("");
  const [newProjectLink, setNewProjectLink] = useState("");

  useEffect(() => {
    const loadFooter = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/footer`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (data.success && data.footer && !data.isDefault) {
          setFooter(data.footer);
          setLoading(false);
          return;
        }
      } catch {
        // API failed, fall through to localStorage
      }

      const saved = localStorage.getItem("footerData");
      if (saved) {
        try {
          setFooter(JSON.parse(saved));
        } catch {
          setFooter(DEFAULT_FOOTER);
        }
      } else {
        setFooter(DEFAULT_FOOTER);
      }
      setLoading(false);
    };
    loadFooter();

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("Categories fetch error:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (field, value) => {
    setFooter((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddMfgLink = () => {
    if (!newMfgLink.trim()) return;
    setFooter((prev) => ({
      ...prev,
      manufacturingLinks: [...(prev.manufacturingLinks || []), newMfgLink.trim()],
    }));
    setNewMfgLink("");
  };

  const handleRemoveMfgLink = (index) => {
    setFooter((prev) => ({
      ...prev,
      manufacturingLinks: prev.manufacturingLinks.filter((_, i) => i !== index),
    }));
  };

  const handleAddProjectLink = () => {
    if (!newProjectLink.trim()) return;
    setFooter((prev) => ({
      ...prev,
      projectLinks: [...(prev.projectLinks || []), newProjectLink.trim()],
    }));
    setNewProjectLink("");
  };

  const handleRemoveProjectLink = (index) => {
    setFooter((prev) => ({
      ...prev,
      projectLinks: prev.projectLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const data = { ...footer };
      if (logoFile) {
        const reader = new FileReader();
        data.logo = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(logoFile);
        });
      }

      const body = {
        about: data.about,
        facebook: data.facebook,
        instagram: data.instagram,
        linkedin: data.linkedin,
        youtube: data.youtube,
        phone: data.phone,
        email: data.email,
        timing: data.timing,
        manufacturingHeading: data.manufacturingHeading,
        manufacturingLinks: data.manufacturingLinks,
        projectHeading: data.projectHeading,
        projectLinks: data.projectLinks,
      };

      let res;
      if (data._id) {
        res = await fetch(`${API_BASE_URL}/footer/${data._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`${API_BASE_URL}/footer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      }

      const result = await res.json();
      if (!res.ok) throw new Error(result.msg || "Failed to save footer");

      if (result.footer?._id) {
        data._id = result.footer._id;
      }

      localStorage.setItem("footerData", JSON.stringify(data));
      if (onRefresh) onRefresh();
      setSaving(false);
      alert("Footer updated successfully!");
    } catch (err) {
      console.error("Footer save error:", err);
      alert(err.message || "Something went wrong");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 animate-pulse">Loading footer...</p>
      </div>
    );
  }

  if (!footer) return null;

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-hidden">
      <div className="bg-[#081120] border border-white/10 rounded-xl p-4 flex items-start justify-between flex-shrink-0">
        <div>
          <h2 className="text-[24px] font-bold leading-none">Footer</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 h-[38px] bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg font-bold text-sm transition-all"
        >
          <Save size={15} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Logo Section */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">Logo</h3>
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 bg-[#0b1220] border border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
              ) : footer?.logo ? (
                <img src={getServerUrl(footer.logo)} alt="Current logo" className="w-full h-full object-contain" />
              ) : (
                <Upload size={24} className="text-gray-500" />
              )}
            </div>
            <div>
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setLogoFile(file);
                      setLogoPreview(URL.createObjectURL(file));
                    }
                  }}
                />
                <div className="flex items-center gap-2 px-4 h-[38px] bg-[#0b1220] border border-white/10 rounded-lg text-sm text-gray-300 hover:border-blue-600 transition">
                  <Upload size={15} />
                  Choose Logo
                </div>
              </label>
              {(logoPreview || footer?.logo) && (
                <button
                  onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                  className="mt-2 text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">About</h3>
          <textarea
            value={footer.about || ""}
            onChange={(e) => handleChange("about", e.target.value)}
            rows={3}
            className="w-full bg-[#0b1220] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-blue-600 resize-none"
          />
        </div>

        {/* Social Links */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["facebook", "instagram", "linkedin", "youtube"].map((platform) => (
              <div key={platform}>
                <label className="text-gray-400 text-[11px] uppercase mb-1 block capitalize">{platform}</label>
                <input
                  type="text"
                  value={footer[platform] || ""}
                  onChange={(e) => handleChange(platform, e.target.value)}
                  placeholder={`https://${platform}.com/...`}
                  className="w-full h-[38px] bg-[#0b1220] border border-white/10 rounded-lg px-4 text-sm text-white outline-none focus:border-blue-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">Contact Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-gray-400 text-[11px] uppercase mb-1 block">Phone</label>
              <input
                type="text"
                value={footer.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full h-[38px] bg-[#0b1220] border border-white/10 rounded-lg px-4 text-sm text-white outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="text-gray-400 text-[11px] uppercase mb-1 block">Email</label>
              <input
                type="text"
                value={footer.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="support@ultraclap.com"
                className="w-full h-[38px] bg-[#0b1220] border border-white/10 rounded-lg px-4 text-sm text-white outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="text-gray-400 text-[11px] uppercase mb-1 block">Timing</label>
              <input
                type="text"
                value={footer.timing || ""}
                onChange={(e) => handleChange("timing", e.target.value)}
                placeholder="Mon – Sat: 9:00 AM – 7:00 PM"
                className="w-full h-[38px] bg-[#0b1220] border border-white/10 rounded-lg px-4 text-sm text-white outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Section Headings */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">Section Headings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-[11px] uppercase mb-1 block">Categories Heading</label>
              <input
                type="text"
                value={footer.manufacturingHeading || ""}
                onChange={(e) => handleChange("manufacturingHeading", e.target.value)}
                className="w-full h-[38px] bg-[#0b1220] border border-white/10 rounded-lg px-4 text-sm text-white outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="text-gray-400 text-[11px] uppercase mb-1 block">Quick Links Heading</label>
              <input
                type="text"
                value={footer.projectHeading || ""}
                onChange={(e) => handleChange("projectHeading", e.target.value)}
                className="w-full h-[38px] bg-[#0b1220] border border-white/10 rounded-lg px-4 text-sm text-white outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Categories Links */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">Categories Links</h3>
          <div className="space-y-2 mb-3">
            {(footer.manufacturingLinks || []).map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <GripVertical size={14} className="text-gray-500 shrink-0" />
                <input
                  type="text"
                  value={link}
                  onChange={(e) => {
                    const updated = [...footer.manufacturingLinks];
                    updated[index] = e.target.value;
                    handleChange("manufacturingLinks", updated);
                  }}
                  className="flex-1 h-[36px] bg-[#0b1220] border border-white/10 rounded-lg px-3 text-sm text-white outline-none focus:border-blue-600"
                />
                <button
                  onClick={() => handleRemoveMfgLink(index)}
                  className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-500/10 rounded-lg transition"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={newMfgLink}
              onChange={(e) => setNewMfgLink(e.target.value)}
              className="flex-1 h-[36px] bg-[#0b1220] border border-white/10 rounded-lg px-3 text-sm text-white outline-none focus:border-blue-600"
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (newMfgLink) {
                  handleAddMfgLink();
                  setNewMfgLink("");
                }
              }}
              className="w-8 h-8 flex items-center justify-center text-green-400 hover:bg-green-500/10 rounded-lg transition"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">Quick Links</h3>
          <div className="space-y-2 mb-3">
            {(footer.projectLinks || []).map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <GripVertical size={14} className="text-gray-500 shrink-0" />
                <input
                  type="text"
                  value={link}
                  onChange={(e) => {
                    const updated = [...footer.projectLinks];
                    updated[index] = e.target.value;
                    handleChange("projectLinks", updated);
                  }}
                  className="flex-1 h-[36px] bg-[#0b1220] border border-white/10 rounded-lg px-3 text-sm text-white outline-none focus:border-blue-600"
                />
                <button
                  onClick={() => handleRemoveProjectLink(index)}
                  className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-500/10 rounded-lg transition"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newProjectLink}
              onChange={(e) => setNewProjectLink(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddProjectLink(); } }}
              placeholder="Add new quick link..."
              className="flex-1 h-[36px] bg-[#0b1220] border border-white/10 rounded-lg px-3 text-sm text-white outline-none focus:border-blue-600"
            />
            <button
              onClick={handleAddProjectLink}
              className="w-8 h-8 flex items-center justify-center text-green-400 hover:bg-green-500/10 rounded-lg transition"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterTab;
