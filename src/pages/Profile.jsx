import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaShieldAlt, 
  FaCamera, 
  FaCheckCircle, 
  FaChartLine, 
  FaArrowRight, 
  FaLock, 
  FaTimes, 
  FaSpinner, 
  FaCalendarAlt, 
  FaInfoCircle 
} from 'react-icons/fa';

import { API_BASE_URL } from "../api/config";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'edit', 'password', 'orders'
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setEditForm({
        name: parsedUser.name || '',
        phone: parsedUser.phone || ''
      });
    }
  }, []);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      alert("Name is required ❌");
      return;
    }
    
    try {
      setSubmitLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editForm.name,
          phone: editForm.phone
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        alert(data.msg || "Failed to update profile ❌");
        setSubmitLoading(false);
        return;
      }
      
      alert("Profile updated successfully ✅");
      const updatedUser = { ...user, name: data.user.name, phone: data.user.phone };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setActiveModal(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert("All fields are required ❌");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirm password do not match ❌");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters ❌");
      return;
    }
    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!strongPassword.test(passwordForm.newPassword)) {
      alert("New password must contain letters and numbers ❌");
      return;
    }
    
    try {
      setSubmitLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        alert(data.msg || "Failed to change password ❌");
        setSubmitLoading(false);
        return;
      }
      
      alert("Password changed successfully ✅");
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setActiveModal(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    } finally {
      setSubmitLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (!response.ok) {
        alert(data.msg || "Failed to fetch order history ❌");
        return;
      }
      
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while fetching orders ❌");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleOpenOrders = () => {
    setActiveModal('orders');
    fetchOrders();
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 p-6">
        <FaUser className="text-6xl mb-4 opacity-20" />
        <p className="text-xl font-bold">Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-12 px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Card */}
      <div className="bg-[#1E3A8A] rounded-[32px] md:rounded-[40px] p-6 md:p-12 text-white relative overflow-hidden mb-6 md:mb-8 shadow-2xl shadow-blue-900/20">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 md:w-48 h-32 md:h-48 bg-orange-400/20 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="relative group">
            <div className="w-24 h-24 md:w-40 md:h-40 bg-white/10 backdrop-blur-md rounded-[24px] md:rounded-[32px] flex items-center justify-center text-3xl md:text-5xl font-extrabold border-2 md:border-4 border-white/20 shadow-inner">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <button 
              onClick={() => setActiveModal('edit')}
              className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 bg-white text-[#1E3A8A] rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
            >
              <FaCamera className="text-xs md:text-base" />
            </button>
          </div>

          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-1 md:mb-2">
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">{user.name}</h1>
              <FaCheckCircle className="text-orange-400 text-lg" />
            </div>
            <p className="text-blue-100/70 font-bold text-sm md:text-lg mb-4 md:mb-6 capitalize">{user.role || 'Verified User'}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4">
              <span className="px-3 md:px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] md:text-xs font-bold border border-white/10">Member since 2024</span>
              <span className="px-3 md:px-4 py-1 bg-orange-400 text-[#1E3A8A] rounded-full text-[10px] md:text-xs font-bold">Premium Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Shortcut for Partners/Admins */}
      {(user.role === 'partner' || user.role === 'admin') && (
        <div className="mb-6 md:mb-8 bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] rounded-[24px] md:rounded-[32px] p-0.5 md:p-1 shadow-lg">
          <div className="bg-white rounded-[22px] md:rounded-[30px] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 text-[#1E3A8A] rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl shadow-inner">
                <FaChartLine />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Partner Management Portal</h3>
                <p className="text-[10px] md:text-xs text-slate-500 font-medium">Manage leads, inventory, and business analytics.</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = user.role === 'admin' ? '/admin/dashboard' : '/partner/dashboard'}
              className="w-full md:w-auto px-6 md:px-8 py-2.5 md:py-3 bg-[#1E3A8A] text-white rounded-xl md:rounded-2xl font-bold hover:bg-[#1E40AF] transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2 text-xs md:text-sm"
            >
              Go to Dashboard
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        
        {/* Contact Info */}
        <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm">
          <h3 className="text-base md:text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FaEnvelope className="text-sm" />
            </div>
            Contact Information
          </h3>
          
          <div className="space-y-4 md:space-y-6">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
              <p className="text-slate-700 font-bold text-sm md:text-base">{user.email}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
              <p className="text-slate-700 font-bold text-sm md:text-base">{user.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm">
          <h3 className="text-base md:text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <FaShieldAlt className="text-sm" />
            </div>
            Security & Privacy
          </h3>
          
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Password</p>
                <p className="text-slate-700 font-bold text-sm">••••••••••••</p>
              </div>
              <button 
                onClick={() => setActiveModal('password')}
                className="text-xs font-black text-[#1E3A8A] hover:underline"
              >
                Change
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">2FA Status</p>
                <p className="text-red-500 font-black text-xs uppercase">Disabled</p>
              </div>
              <button className="text-xs font-black text-[#1E3A8A] hover:underline">Enable</button>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
        <button 
          onClick={() => setActiveModal('edit')}
          className="flex-1 bg-[#1E3A8A] text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-lg shadow-blue-900/10 hover:bg-[#1E40AF] transition-all active:scale-95 text-xs md:text-sm"
        >
          Edit Profile Details
        </button>
        <button 
          onClick={handleOpenOrders}
          className="flex-1 bg-slate-900 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-lg shadow-slate-900/10 hover:bg-black transition-all active:scale-95 text-xs md:text-sm"
        >
          View Order History
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ======================= EDIT PROFILE DETAILS MODAL ======================= */}
      {/* ========================================================================= */}
      {activeModal === 'edit' && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 relative border border-slate-100 scale-in duration-300">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg transition-colors p-1"
            >
              <FaTimes />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center justify-center gap-2">
                <FaUser className="text-[#1E3A8A] text-lg md:text-xl" />
                Edit Profile
              </h2>
              <p className="text-slate-500 text-xs mt-1">Keep your profile information up to date</p>
            </div>

            <form onSubmit={handleEditProfile} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 text-sm" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:bg-white transition-all font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 text-sm" />
                  <input
                    type="tel"
                    placeholder="10-digit Phone Number"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:bg-white transition-all font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-2xl text-xs md:text-sm font-bold transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white py-3.5 rounded-2xl text-xs md:text-sm font-bold shadow-lg shadow-blue-900/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ======================= CHANGE PASSWORD MODAL =========================== */}
      {/* ========================================================================= */}
      {activeModal === 'password' && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 relative border border-slate-100 scale-in duration-300">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg transition-colors p-1"
            >
              <FaTimes />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center justify-center gap-2">
                <FaLock className="text-[#1E3A8A] text-lg md:text-xl" />
                Change Password
              </h2>
              <p className="text-slate-500 text-xs mt-1">Strengthen your account security</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Current Password</label>
                <div className="relative">
                  <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 text-sm" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:bg-white transition-all font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">New Password</label>
                <div className="relative">
                  <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 text-sm" />
                  <input
                    type="password"
                    required
                    placeholder="At least 6 chars (letters & numbers)"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:bg-white transition-all font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Confirm New Password</label>
                <div className="relative">
                  <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 text-sm" />
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:bg-white transition-all font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-2xl text-xs md:text-sm font-bold transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white py-3.5 rounded-2xl text-xs md:text-sm font-bold shadow-lg shadow-blue-900/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Updating...
                    </>
                  ) : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ======================= VIEW ORDER HISTORY MODAL ======================= */}
      {/* ========================================================================= */}
      {activeModal === 'orders' && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300">
          <div className="bg-slate-50 w-full max-w-2xl h-[85vh] md:h-[75vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col relative border border-slate-100 scale-in duration-300">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 text-lg transition-colors p-2 bg-white rounded-full shadow-md z-10"
            >
              <FaTimes />
            </button>

            {/* Header */}
            <div className="bg-white px-6 md:px-8 pt-6 pb-4 border-b border-slate-100">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-sm">
                  ORD
                </div>
                Order History
              </h2>
              <p className="text-slate-500 text-xs mt-1">Review your recent orders and shipment statuses</p>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4">
              {ordersLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                  <FaSpinner className="animate-spin text-4xl mb-4 text-[#1E3A8A]" />
                  <p className="font-bold text-sm">Retrieving your order records...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <FaInfoCircle className="text-2xl text-slate-300" />
                  </div>
                  <p className="text-lg font-bold text-slate-800">No Orders Found</p>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">You haven't placed any orders yet. Once you make an inquiry or complete a purchase, your orders will appear here!</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-slate-800 text-sm md:text-base">{order.orderId}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            order.status === 'Delivered' ? 'bg-blue-50 text-orange-600' :
                            order.status === 'Shipped' ? 'bg-blue-50 text-blue-700' :
                            order.status === 'Processing' ? 'bg-yellow-50 text-yellow-700' :
                            order.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                            'bg-slate-50 text-slate-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                          <FaCalendarAlt />
                          {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>

                      <div className="flex flex-col items-start sm:items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</span>
                        <span className="text-slate-800 font-black text-sm md:text-lg">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Billing Client</span>
                        <span className="text-slate-700 font-bold text-xs">{order.customer?.name} ({order.customer?.email})</span>
                      </div>
                      
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5 text-left sm:text-right">Payment Status</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          order.paymentStatus === 'Paid' ? 'bg-blue-100 text-blue-800' :
                          order.paymentStatus === 'Refunded' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="bg-white px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs transition-all active:scale-95"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
