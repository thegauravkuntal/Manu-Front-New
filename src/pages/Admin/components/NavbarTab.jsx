import { useState, useEffect } from "react";
import { Save, X, Plus } from "lucide-react";
import { API_BASE_URL } from "../../../api/config";

const DEFAULT_NAVBAR = {
  categories: ["Manufacturing", "Packaging", "Machinery"],
  placeholder: "Search machines, products, suppliers...",
  signInButton: "Sign In",
  defaultCity: "Select City",
  showMainCategory: true,
};

const NavbarTab = ({ onRefresh }) => {
  const [navbar, setNavbar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const fetchNavbar = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/navbar`);
        const data = await res.json();
        if (data.success && data.navbar) {
          setNavbar(data.navbar);
        } else {
          setNavbar(DEFAULT_NAVBAR);
        }
      } catch {
        setNavbar(DEFAULT_NAVBAR);
      } finally {
        setLoading(false);
      }
    };
    fetchNavbar();
  }, []);

  const handleChange = (field, value) => {
    setNavbar((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    setNavbar((prev) => ({
      ...prev,
      categories: [...(prev.categories || []), newCategory.trim()],
    }));
    setNewCategory("");
  };

  const handleRemoveCategory = (index) => {
    setNavbar((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const body = {
        categories: navbar.categories,
        placeholder: navbar.placeholder,
        signInButton: navbar.signInButton,
        defaultCity: navbar.defaultCity,
        showMainCategory: navbar.showMainCategory,
      };

      let res;
      if (navbar._id) {
        res = await fetch(`${API_BASE_URL}/navbar/${navbar._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`${API_BASE_URL}/navbar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      }

      const data = await res.json();
      if (data.success) {
        if (data.navbar) setNavbar(data.navbar);
        if (onRefresh) onRefresh();
      } else {
        alert(data.msg || "Failed to save");
      }
    } catch (err) {
      console.error("Navbar save error:", err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 animate-pulse">Loading navbar...</p>
      </div>
    );
  }

  if (!navbar) return null;

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-hidden">
      <div className="bg-[#081120] border border-white/10 rounded-xl p-4 flex items-start justify-between flex-shrink-0">
        <div>
          <h2 className="text-[24px] font-bold leading-none">Navbar</h2>
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
        {/* Search Placeholder */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">Search Placeholder</h3>
          <input
            type="text"
            value={navbar.placeholder || ""}
            onChange={(e) => handleChange("placeholder", e.target.value)}
            placeholder="Search placeholder text"
            className="w-full h-[38px] bg-[#0b1220] border border-white/10 rounded-lg px-4 text-sm text-white outline-none focus:border-blue-600"
          />
        </div>

        {/* Default City */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">Default City</h3>
          <input
            type="text"
            value={navbar.defaultCity || ""}
            onChange={(e) => handleChange("defaultCity", e.target.value)}
            placeholder="e.g. Select City"
            className="w-full h-[38px] bg-[#0b1220] border border-white/10 rounded-lg px-4 text-sm text-white outline-none focus:border-blue-600"
          />
        </div>

        {/* Sign In Button Text */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">Sign In Button Text</h3>
          <input
            type="text"
            value={navbar.signInButton || ""}
            onChange={(e) => handleChange("signInButton", e.target.value)}
            placeholder="e.g. Sign In"
            className="w-full h-[38px] bg-[#0b1220] border border-white/10 rounded-lg px-4 text-sm text-white outline-none focus:border-blue-600"
          />
        </div>

        {/* Show Main Category Toggle */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">Show Main Category</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => handleChange("showMainCategory", !navbar.showMainCategory)}
              className={`relative w-11 h-6 rounded-full transition-colors ${navbar.showMainCategory ? "bg-blue-600" : "bg-gray-600"}`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${navbar.showMainCategory ? "translate-x-5" : "translate-x-0"}`}
              />
            </div>
            <span className="text-sm text-gray-300">
              {navbar.showMainCategory ? "Visible" : "Hidden"}
            </span>
          </label>
        </div>

        {/* Categories */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">Categories</h3>
          <div className="space-y-2 mb-3">
            {(navbar.categories || []).map((cat, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={cat}
                  onChange={(e) => {
                    const updated = [...navbar.categories];
                    updated[index] = e.target.value;
                    handleChange("categories", updated);
                  }}
                  className="flex-1 h-[36px] bg-[#0b1220] border border-white/10 rounded-lg px-3 text-sm text-white outline-none focus:border-blue-600"
                />
                <button
                  onClick={() => handleRemoveCategory(index)}
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
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
              placeholder="Add new category..."
              className="flex-1 h-[36px] bg-[#0b1220] border border-white/10 rounded-lg px-3 text-sm text-white outline-none focus:border-blue-600"
            />
            <button
              onClick={handleAddCategory}
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

export default NavbarTab;
