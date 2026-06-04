import React, { useState } from "react";
import { Edit2, ShieldCheck, Lock, User as UserIcon } from "lucide-react";

const ProfileTab = ({
  adminProfile,
  setAdminProfile,
}) => {
  const API_URL = import.meta.env.VITE_API_URL || "https://manu-back-bpob.onrender.com/api";
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [activeSubTab, setActiveSubTab] = useState("general");

  const handleProfileSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!adminProfile.id) return alert("No User ID found.");
      
      const res = await fetch(`${API_URL}/admin/users/${adminProfile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: adminProfile.name, email: adminProfile.email })
      });
      
      const data = await res.json();
      if (data.success) {
        alert("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        alert(data.msg || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("New passwords do not match!");
    }
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/auth/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          currentPassword: passwordData.currentPassword, 
          newPassword: passwordData.newPassword 
        })
      });
      
      const data = await res.json();
      if (data.success) {
        alert("Password updated successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert(data.msg || "Failed to update password.");
      }
    } catch (err) {
      console.error("Password update error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6 flex-1 overflow-hidden p-4">
      <div className="max-w-4xl w-full mx-auto flex flex-col gap-6">
        
        {/* HEADER CARD */}
        <div className="bg-[#081120] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-blue-600/30 overflow-hidden group-hover:border-blue-600 transition-all duration-300">
              <img 
                src={`https://ui-avatars.com/api/?name=${adminProfile.name}&background=10b981&color=fff&size=256`} 
                alt="admin" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer">
              <Edit2 size={16} className="text-white" />
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">{adminProfile.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-2">
              <span className="bg-blue-600/10 text-orange-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-600/20">
                {adminProfile.role}
              </span>
              <span className="text-gray-500 text-sm">{adminProfile.email}</span>
            </div>
          </div>

          <div className="flex gap-2">
             <button 
               onClick={() => setActiveSubTab("general")}
               className={`flex items-center gap-2 px-4 h-[40px] rounded-xl text-xs font-bold transition-all ${activeSubTab === 'general' ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
             >
               <UserIcon size={14} /> Profile
             </button>
             <button 
               onClick={() => setActiveSubTab("security")}
               className={`flex items-center gap-2 px-4 h-[40px] rounded-xl text-xs font-bold transition-all ${activeSubTab === 'security' ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
             >
               <Lock size={14} /> Security
             </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {activeSubTab === "general" && (
            <div className="bg-[#081120] border border-white/10 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600">
                  <UserIcon size={18} />
                </div>
                <h3 className="text-lg font-bold text-white">General Information</h3>
              </div>
              
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={adminProfile.name}
                      onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})}
                      className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[48px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all shadow-inner"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={adminProfile.email}
                      onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                      className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[48px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all shadow-inner"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1">Account Role</label>
                  <div className="w-full bg-[#0b1220]/50 border border-white/5 rounded-xl h-[48px] px-4 text-sm text-gray-500 flex items-center cursor-not-allowed">
                    {adminProfile.role.toUpperCase()}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={handleProfileSave}
                    className="px-8 h-[48px] rounded-xl text-sm font-bold bg-orange-500 hover:bg-blue-600 text-white shadow-lg shadow-orange-500/20 transition-all active:scale-95"
                  >
                    Save Profile Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSubTab === "security" && (
            <div className="bg-[#081120] border border-white/10 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <ShieldCheck size={18} />
                </div>
                <h3 className="text-lg font-bold text-white">Security & Password</h3>
              </div>
              
              <form className="space-y-6" onSubmit={handlePasswordChange}>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1">Current Password</label>
                  <input 
                    type="password" 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[48px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1">New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[48px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[48px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-end">
                  <button 
                    type="submit"
                    className="px-8 h-[48px] rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
