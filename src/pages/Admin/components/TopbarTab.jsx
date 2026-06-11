import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { API_BASE_URL } from "../../../api/config";

const DEFAULT_TOPBAR = {
  promoLabel: "PROMO:",
  promoText: "20% OFF",
  marqueeText: "PAPER CUP MACHINE MANUFACTURERS • CONNECT WITH TRUSTED INDUSTRIAL SUPPLIERS • GET BEST DEALS ON DISPOSABLE PRODUCT MACHINES • GROW YOUR MANUFACTURING BUSINESS FASTER •",
  partnerButtonText: "Partner Join",
  profileButtonText: "Profile",
  accountButtonText: "My Account",
};

const TopbarTab = ({ onRefresh }) => {
  const [topbar, setTopbar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTopbar = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/topbar`);
        const data = await res.json();
        if (data.success && data.topbar) {
          setTopbar(data.topbar);
        } else {
          setTopbar(DEFAULT_TOPBAR);
        }
      } catch {
        setTopbar(DEFAULT_TOPBAR);
      } finally {
        setLoading(false);
      }
    };
    fetchTopbar();
  }, []);

  const handleChange = (field, value) => {
    setTopbar((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const body = {
        promoLabel: topbar.promoLabel,
        promoText: topbar.promoText,
        marqueeText: topbar.marqueeText,
        partnerButtonText: topbar.partnerButtonText,
        profileButtonText: topbar.profileButtonText,
        accountButtonText: topbar.accountButtonText,
      };

      let res;
      if (topbar._id) {
        res = await fetch(`${API_BASE_URL}/topbar/${topbar._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`${API_BASE_URL}/topbar`, {
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
        if (data.topbar) setTopbar(data.topbar);
        if (onRefresh) onRefresh();
      } else {
        alert(data.msg || "Failed to save");
      }
    } catch (err) {
      console.error("Topbar save error:", err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 animate-pulse">Loading topbar...</p>
      </div>
    );
  }

  if (!topbar) return null;

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-hidden">
      <div className="bg-[#081120] border border-white/10 rounded-xl p-4 flex items-start justify-between flex-shrink-0">
        <div>
          <h2 className="text-[24px] font-bold leading-none">Topbar</h2>
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
        {/* Promo Label */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">Promo Label</h3>
          <input
            type="text"
            value={topbar.promoLabel || ""}
            onChange={(e) => handleChange("promoLabel", e.target.value)}
            placeholder="e.g. PROMO:"
            className="w-full h-[38px] bg-[#0b1220] border border-white/10 rounded-lg px-4 text-sm text-white outline-none focus:border-blue-600"
          />
        </div>

        {/* Promo Text */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">Promo Text</h3>
          <input
            type="text"
            value={topbar.promoText || ""}
            onChange={(e) => handleChange("promoText", e.target.value)}
            placeholder="e.g. 20% OFF"
            className="w-full h-[38px] bg-[#0b1220] border border-white/10 rounded-lg px-4 text-sm text-white outline-none focus:border-blue-600"
          />
        </div>

        {/* Marquee Text */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">Marquee Text</h3>
          <textarea
            value={topbar.marqueeText || ""}
            onChange={(e) => handleChange("marqueeText", e.target.value)}
            rows={3}
            placeholder="Scrolling announcement text..."
            className="w-full bg-[#0b1220] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-blue-600 resize-none"
          />
        </div>

        {/* Partner Button Text */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">Partner Join Button Text</h3>
          <input
            type="text"
            value={topbar.partnerButtonText || ""}
            onChange={(e) => handleChange("partnerButtonText", e.target.value)}
            placeholder="e.g. Partner Join"
            className="w-full h-[38px] bg-[#0b1220] border border-white/10 rounded-lg px-4 text-sm text-white outline-none focus:border-blue-600"
          />
        </div>

        {/* Profile Button Text */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">Profile Button Text (Partner/Admin)</h3>
          <input
            type="text"
            value={topbar.profileButtonText || ""}
            onChange={(e) => handleChange("profileButtonText", e.target.value)}
            placeholder="e.g. Profile"
            className="w-full h-[38px] bg-[#0b1220] border border-white/10 rounded-lg px-4 text-sm text-white outline-none focus:border-blue-600"
          />
        </div>

        {/* Account Button Text */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">My Account Button Text (Regular User)</h3>
          <input
            type="text"
            value={topbar.accountButtonText || ""}
            onChange={(e) => handleChange("accountButtonText", e.target.value)}
            placeholder="e.g. My Account"
            className="w-full h-[38px] bg-[#0b1220] border border-white/10 rounded-lg px-4 text-sm text-white outline-none focus:border-blue-600"
          />
        </div>
      </div>
    </div>
  );
};

export default TopbarTab;
