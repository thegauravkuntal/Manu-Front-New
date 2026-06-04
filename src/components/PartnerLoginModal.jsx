import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaArrowRight, FaHandshake, FaTimes, FaUser, FaPhone } from 'react-icons/fa';
import { API_BASE_URL } from "../api/config";

const PartnerLoginModal = ({ isOpen, onClose, initialMode = 'signup' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode === 'login');
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = isLogin 
        ? `${API_BASE_URL}/auth/login` 
        : `${API_BASE_URL}/auth/register`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || 'Action failed');
        setLoading(false);
        return;
      }

      alert(`${isLogin ? 'Login' : 'Sign Up'} Successful! ✅`);
      if (data.token) localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      
      setLoading(false);
      onClose();
      window.location.href = '/partner/dashboard';
    } catch (err) {
      console.error(err);
      alert('Something went wrong ❌');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 md:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl md:rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100 animate-in fade-in zoom-in duration-300 max-h-[95vh] md:max-h-none">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-50 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-black/20 md:bg-white/20 hover:bg-black/40 md:hover:bg-white/40 text-white md:text-slate-400 md:hover:text-slate-600 rounded-full transition-colors"
        >
          <FaTimes className="text-sm md:text-xl" />
        </button>

        {/* Left Side: Information */}
        <div className="md:w-1/2 bg-[#1E3A8A] p-6 md:p-12 text-white flex flex-col justify-center relative overflow-hidden shrink-0">
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10">
            <div className="hidden md:inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm">
              <FaHandshake className="text-2xl text-orange-300" />
            </div>
            <h2 className="text-xl md:text-3xl font-black mb-2 md:mb-4 leading-tight">
              {isLogin ? 'Grow Your Business with' : 'Become an Elite'} <span className="text-orange-300">Ultra Clap</span> Partner
            </h2>
            <p className="text-blue-50/70 text-xs md:text-base mb-4 md:mb-6 max-w-sm">
              Access exclusive wholesale pricing and manage your industrial partnerships.
            </p>
            
            <ul className="hidden md:block space-y-3 mb-4 text-sm">
              {[
                'Exclusive Partner Discounts',
                'Bulk Ordering System',
                'Priority Support & Tracking'
              ].map((item, index) => (
                <li key={index} className="flex items-center text-blue-100">
                  <div className="w-4 h-4 bg-orange-400/20 rounded-full flex items-center justify-center mr-3">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white overflow-y-auto">
          <div className="mb-6 md:mb-8 text-center md:text-left">
            <h3 className="text-lg md:text-xl font-black text-slate-800 mb-1">Partner {isLogin ? 'Login' : 'Sign Up'}</h3>
            <p className="text-slate-500 text-[10px] md:text-sm font-medium uppercase tracking-widest">{isLogin ? 'Please enter your credentials.' : 'Join our network of manufacturers.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company / Full Name</label>
                  <div className="relative group">
                    <FaUser className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 transition-colors group-focus-within:text-[#1E3A8A]" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Manufacturing Ltd."
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-[#1E3A8A] transition-all text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative group">
                    <FaPhone className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 transition-colors group-focus-within:text-[#1E3A8A]" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-[#1E3A8A] transition-all text-sm text-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 transition-colors group-focus-within:text-[#1E3A8A]" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="partner@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-[#1E3A8A] transition-all text-sm text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                {isLogin && <a href="#" className="text-[10px] font-black text-[#1E3A8A] hover:underline uppercase tracking-widest">Forgot?</a>}
              </div>
              <div className="relative group">
                <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 transition-colors group-focus-within:text-[#1E3A8A]" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-[#1E3A8A] transition-all text-sm text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-lg shadow-blue-900/10 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2 text-xs md:text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Access Partner Portal' : 'Create Partner Account'}
                  <FaArrowRight className="text-[10px] md:text-xs" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-[10px] md:text-xs font-medium">
              {isLogin ? "New to the platform?" : "Already have a partner account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#1E3A8A] font-bold hover:underline ml-1"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerLoginModal;
