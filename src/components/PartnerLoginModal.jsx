import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaArrowRight, FaHandshake, FaTimes, FaUser, FaPhone } from 'react-icons/fa';
import { API_BASE_URL } from "../api/config";
import logo from "../assets/logo.png";

const PartnerLoginModal = ({ isOpen, onClose, initialMode = 'signup' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
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
      setShowForgotPassword(false);
      setForgotSent(false);
      setForgotEmail('');
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
      });
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
        body: JSON.stringify({ ...formData, role: 'partner' }),
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.msg || 'Failed to send reset email');
      } else {
        setForgotSent(true);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong ❌');
    } finally {
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
      <div className="relative w-full max-w-md md:max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden md:flex md:flex-row border border-slate-100 animate-in fade-in zoom-in duration-300 max-h-[90vh] md:max-h-none">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 z-50 w-7 h-7 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors md:bg-white/20 md:hover:bg-white/40 md:text-slate-400 md:hover:text-slate-600"
        >
          <FaTimes className="text-xs" />
        </button>

        {/* Left Side: Information - DESKTOP PE DIKHEGA, MOBILE PE HIDDEN */}
        <div className="hidden md:flex md:w-2/5 bg-[#1E3A8A] p-5 text-white flex-col justify-center relative overflow-hidden shrink-0">
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-white/10 rounded-xl mb-3">
              <FaHandshake className="text-lg text-orange-300" />
            </div>
            <h2 className="text-base font-bold mb-1 leading-tight">
              {isLogin ? 'Grow Your Business with' : 'Become an Elite'} <span className="text-orange-300">Ultra Clap</span> Partner
            </h2>
            <p className="text-blue-50/70 text-xs mb-3 max-w-sm">
              Access exclusive wholesale pricing and manage your industrial partnerships.
            </p>
            
            <ul className="space-y-1.5 mb-3 text-[10px]">
              {[
                'Exclusive Partner Discounts',
                'Bulk Ordering System',
                'Priority Support & Tracking'
              ].map((item, index) => (
                <li key={index} className="flex items-center text-blue-100">
                  <div className="w-2.5 h-2.5 bg-orange-400/20 rounded-full flex items-center justify-center mr-2">
                    <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side: Form - Mobile mein full width */}
        <div className="w-full md:w-3/5 p-4 md:p-5 flex flex-col justify-center bg-white overflow-y-auto">
          {showForgotPassword ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="text-center mb-3 md:text-left">
                <img src={logo} alt="UltraClap Logo" className="h-10 mx-auto md:mx-0 object-contain mb-2" />
                <h3 className="text-base font-bold text-slate-800">Reset Password</h3>
                <p className="text-slate-400 text-xs">{forgotSent ? 'Check your email inbox.' : 'Enter your email to receive a reset link.'}</p>
              </div>

              {forgotSent ? (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                    <p className="text-green-700 text-xs font-bold">Email Sent! 📧</p>
                    <p className="text-green-600 text-[10px]">Check your inbox for reset link.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(false); setForgotSent(false); setForgotEmail(''); }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl font-bold text-sm transition-all"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600">Email Address</label>
                    <div className="relative mt-1">
                      <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 text-sm" />
                      <input
                        type="email"
                        required
                        placeholder="partner@company.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-[#1E3A8A] transition-all text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-700"
                  >
                    Back to Login
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
              <div className="text-center mb-4 md:text-left">
                <img src={logo} alt="UltraClap Logo" className="h-10 mx-auto md:mx-0 object-contain mb-2" />
                <h3 className="text-lg font-bold text-slate-800">Partner {isLogin ? 'Login' : 'Sign Up'}</h3>
                <p className="text-slate-400 text-xs">{isLogin ? 'Welcome back!' : 'Join our network of manufacturers.'}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {!isLogin && (
                  <>
                    <div>
                      <label className="text-xs font-medium text-slate-600">Company / Full Name</label>
                      <div className="relative mt-1">
                        <FaUser className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 text-sm" />
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="Manufacturing Ltd."
                          value={formData.name}
                          onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-[#1E3A8A] transition-all text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600">Phone Number</label>
                    <div className="relative mt-1">
                      <FaPhone className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 text-sm" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-[#1E3A8A] transition-all text-sm text-slate-900"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-xs font-medium text-slate-600">Email Address</label>
                  <div className="relative mt-1">
                    <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 text-sm" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="partner@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-[#1E3A8A] transition-all text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-slate-600">Password</label>
                    {isLogin && (
                      <button type="button" onClick={() => setShowForgotPassword(true)} className="text-xs text-[#1E3A8A] font-semibold">
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative mt-1">
                    <FaLock className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 text-sm" />
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-[#1E3A8A] transition-all text-sm text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm mt-4"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {isLogin ? 'Access Partner Portal' : 'Create Partner Account'}
                      <FaArrowRight className="text-xs" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <p className="text-slate-400 text-xs">
                  {isLogin ? "New to the platform?" : "Already have a partner account?"}{' '}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[#1E3A8A] font-bold hover:underline"
                  >
                    {isLogin ? 'Sign Up' : 'Login'}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerLoginModal;