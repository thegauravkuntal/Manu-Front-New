import React, { useState } from "react";
import { Search, Eye, Trash2, Handshake, Building2, ChevronDown, Edit2, Ban, ShieldCheck } from "lucide-react";

const PLAN_COLORS = {
  Free: "bg-gray-500/10 text-gray-400",
  Basic: "bg-blue-500/10 text-blue-400",
  Premium: "bg-purple-500/10 text-purple-400",
  Elite: "bg-amber-500/10 text-amber-400",
};

const PartnersTab = ({
  partnerProfiles,
  getFilteredItems,
  navigate,
  search,
  setSearch,
  filter,
  setFilter,
  onRefresh,
  handleEditClick
}) => {
  const [changingPlan, setChangingPlan] = useState(null);
  const [togglingBlock, setTogglingBlock] = useState(null);

  const handleToggleBlock = async (profileId) => {
    setTogglingBlock(profileId);
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "https://manu-back-new.onrender.com/api";
      const res = await fetch(`${API_URL}/admin/partner-profiles/${profileId}/block`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.msg || "Failed to toggle block status.");
      }
    } catch (err) {
      console.error("Block toggle error:", err);
    } finally {
      setTogglingBlock(null);
    }
  };

  const handlePlanChange = async (profileId, newPlan) => {
    setChangingPlan(profileId);
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "https://manu-back-new.onrender.com/api";
      const res = await fetch(`${API_URL}/admin/partner-profiles/${profileId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: newPlan }),
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.msg || "Failed to update plan.");
      }
    } catch (err) {
      console.error("Plan change error:", err);
    } finally {
      setChangingPlan(null);
    }
  };

  const filtered = getFilteredItems(partnerProfiles);

  return (
    <div className="flex flex-col gap-3 flex-1 overflow-hidden">
      <div className="bg-[#081120] border border-white/10 rounded-xl p-4 flex items-start justify-between flex-shrink-0">
        <div>
          <h2 className="text-[24px] font-bold leading-none">Partners</h2>
          <p className="text-gray-400 mt-2 text-[11px]">Manage registered partners, plans, and profiles.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search partners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[220px] h-[38px] bg-[#0b1220] border border-white/10 rounded-lg pl-4 pr-10 text-[11px] text-white outline-none focus:border-blue-600"
            />
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-[38px] px-3 bg-[#0b1220] border border-white/10 rounded-lg text-[11px] text-white outline-none focus:border-blue-600"
          >
            <option>ID</option>
            <option>Name</option>
            <option>Status</option>
          </select>
        </div>
      </div>

      <div className="bg-[#081120] border border-white/10 rounded-2xl p-6 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold">Manage Partners</h2>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Total:</span>
            <span className="text-blue-600">{filtered.length} of {partnerProfiles?.length || 0}</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10 flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-12 bg-white/5 h-[40px] items-center px-4 text-[11px] font-semibold text-gray-300 sticky top-0 z-10">
            <span className="col-span-2">Company</span>
            <span className="col-span-2">Owner</span>
            <span className="col-span-2">Plan</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-1">Joined</span>
            <span className="col-span-1">Expiry</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          <div>
            {filtered.length > 0 ? filtered.map((profile) => (
              <div key={profile._id} className={`grid grid-cols-12 items-center px-4 h-[62px] border-t border-white/5 text-[10px] ${profile.isBlocked ? 'opacity-60 bg-red-500/5' : ''}`}>
                <div className="col-span-2 flex items-center gap-3">
                  {profile.logo ? (
                    <img
                      src={profile.logo}
                      alt={profile.companyName}
                      className="w-8 h-8 rounded-lg object-cover border border-white/10 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Building2 size={14} className="text-gray-500" />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-white truncate">{profile.companyName}</span>
                    <span className="text-gray-500 font-mono text-[9px]">#{profile._id.slice(-6).toUpperCase()}</span>
                    {profile.isBlocked && <span className="text-red-500 text-[8px] font-black uppercase">Blocked</span>}
                  </div>
                </div>

                <div className="col-span-2 flex flex-col min-w-0">
                  <span className="text-gray-300 truncate">{profile.userId?.name || 'N/A'}</span>
                  <span className="text-gray-500 text-[9px] truncate">{profile.userId?.email || ''}</span>
                </div>

                <div className="col-span-2">
                  <div className="relative inline-block">
                    <select
                      value={profile.plan || 'Free'}
                      onChange={(e) => handlePlanChange(profile._id, e.target.value)}
                      disabled={changingPlan === profile._id}
                      className={`appearance-none px-3 py-1 rounded-md text-[9px] font-bold cursor-pointer outline-none border border-white/10 ${PLAN_COLORS[profile.plan] || PLAN_COLORS.Free} ${changingPlan === profile._id ? 'opacity-50' : ''}`}
                      style={{ paddingRight: '20px' }}
                    >
                      <option value="Free" className="bg-[#0b1220] text-gray-300">Free</option>
                      <option value="Basic" className="bg-[#0b1220] text-gray-300">Basic (3m)</option>
                      <option value="Premium" className="bg-[#0b1220] text-gray-300">Premium (6m)</option>
                      <option value="Elite" className="bg-[#0b1220] text-gray-300">Elite (12m)</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60" />
                  </div>
                </div>

                <div className="col-span-2">
                  <span className={`px-3 py-1 rounded-md text-[9px] font-bold ${
                    profile.verificationStatus === "Verified" ? "bg-blue-600/10 text-orange-400" :
                    profile.verificationStatus === "Rejected" ? "bg-red-500/10 text-red-400" :
                    profile.verificationStatus === "Pending" ? "bg-orange-500/10 text-orange-400" :
                    "bg-gray-500/10 text-gray-400"
                  }`}>
                    {profile.verificationStatus}
                  </span>
                </div>

                <div className="col-span-1 text-gray-400">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'N/A'}
                </div>

                <div className="col-span-1 text-gray-400">
                  {profile.subscriptionExpiry ? (
                    <span className={new Date(profile.subscriptionExpiry) < new Date() ? 'text-red-400' : 'text-orange-400'}>
                      {new Date(profile.subscriptionExpiry).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </span>
                  ) : 'N/A'}
                </div>

                <div className="col-span-2 flex items-center justify-end gap-1 text-gray-400">
                  <button
                    onClick={() => handleToggleBlock(profile._id)}
                    disabled={togglingBlock === profile._id}
                    className={`p-1.5 rounded-lg transition-colors ${profile.isBlocked ? 'hover:bg-blue-600/10 hover:text-orange-400' : 'hover:bg-red-500/10 hover:text-red-400'}`}
                    title={profile.isBlocked ? "Unblock Partner" : "Temporary Block"}
                  >
                    {profile.isBlocked ? <ShieldCheck size={14} /> : <Ban size={14} />}
                  </button>
                  <button
                    onClick={() => handleEditClick(profile)}
                    className="p-1.5 rounded-lg hover:bg-white/5 hover:text-blue-400 transition-colors"
                    title="Edit Partner"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => navigate(`/admin/partner/${profile._id}`)}
                    className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
                    title="View Details"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
                <Handshake size={40} className="opacity-20" />
                <p className="text-xs">No partners found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersTab;