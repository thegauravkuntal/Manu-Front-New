import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaCloudUploadAlt, FaSpinner, FaTrashAlt, FaShieldAlt } from 'react-icons/fa';
import { API_BASE_URL } from '../../api/config';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    alternatePhone: '',
    address: '',
    website: '',
    logo: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {};

      const res = await fetch(`${API_BASE_URL}/partner/kyc-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      const profile = data.profile || {};
      const loadedData = {
        companyName: profile.companyName || user.name || 'Ultra Partner',
        phone: user.phone || profile.phone || '',
        alternatePhone: profile.alternatePhone || '',
        address: profile.address || '',
        website: profile.website || '',
        logo: profile.logo || ''
      };

      setFormData(loadedData);
      setInitialData(loadedData);
    } catch (err) {
      console.error("Fetch profile details error:", err);
    } finally {
      setLoading(false);
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a local preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('companyName', formData.companyName);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('website', formData.website);
      if (selectedFile) {
        data.append('logo', selectedFile);
      } else {
        data.append('logo', formData.logo);
      }

      const res = await fetch(`${API_BASE_URL}/partner/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });
      const resData = await res.json();
      if (res.ok) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.phone = formData.phone;
          user.name = formData.companyName;
          localStorage.setItem('user', JSON.stringify(user));
        }
        alert("Profile updated successfully! 🎉");
        setInitialData(formData);
        setSelectedFile(null);
      } else {
        alert(resData.msg || "Failed to update profile");
      }
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("New passwords do not match!");
    }
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password updated successfully! 🔐");
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(data.msg || "Failed to update password");
      }
    } catch (err) {
      console.error("Password update error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 font-medium">Manage your company profile and security</p>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-50">
          
          {/* Tabs */}
          <div className="w-full md:w-64 p-6 bg-slate-50/30">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('Profile')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === 'Profile' ? 'bg-white text-orange-500 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-white/50'
                }`}
              >
                <FaUser className={activeTab === 'Profile' ? 'text-blue-600' : 'text-slate-400'} />
                Profile Info
              </button>
              <button
                onClick={() => setActiveTab('Security')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === 'Security' ? 'bg-white text-orange-500 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-white/50'
                }`}
              >
                <FaLock className={activeTab === 'Security' ? 'text-blue-600' : 'text-slate-400'} />
                Security
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-8 md:p-10">
            {activeTab === 'Profile' ? (
              <form onSubmit={handleProfileSubmit} className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                      {formData.logo ? (
                        <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-black text-slate-300">{formData.companyName[0]}</span>
                      )}
                    </div>
                    <label htmlFor="logo-up" className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 text-white rounded-xl flex items-center justify-center cursor-pointer border-2 border-white shadow-lg">
                      <FaCloudUploadAlt size={12} />
                    </label>
                    <input type="file" id="logo-up" hidden accept="image/*" onChange={handleFileChange} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Company Logo</h4>
                    <button type="button" onClick={() => setFormData({...formData, logo: ''})} className="text-[10px] text-red-500 font-bold uppercase mt-1 flex items-center gap-1 hover:underline">
                      <FaTrashAlt /> Remove
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                    <input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Phone</label>
                    <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alternate Phone</label>
                    <input type="text" value={formData.alternatePhone} onChange={(e) => setFormData({...formData, alternatePhone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600/20" placeholder="e.g. WhatsApp Number" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Website</label>
                    <input type="url" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600/20" placeholder="https://" />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
                    <textarea rows="3" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600/20 resize-none" />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex justify-end">
                  <button type="submit" disabled={saving} className="px-8 py-3 bg-[#1E3A8A] text-white rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center gap-2">
                    {saving && <FaSpinner className="animate-spin" />} Save Profile
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <FaShieldAlt />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Update Password</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                    <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600/20" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                      <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600/20" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                      <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600/20" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex justify-end">
                  <button type="submit" disabled={saving} className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center gap-2">
                    {saving && <FaSpinner className="animate-spin" />} Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
