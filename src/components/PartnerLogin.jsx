import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaArrowRight, FaHandshake } from 'react-icons/fa';
import { API_BASE_URL } from "../api/config";

const PartnerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

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
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || 'Login failed');
        setLoading(false);
        return;
      }

      alert('Partner Login Successful! ✅');
      if (data.token) localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      
      setLoading(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Something went wrong ❌');
      setLoading(false);
    }
  };

  return (
    <section id="partner-login" className="relative py-20 overflow-hidden bg-slate-50">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
          
          {/* Left Side: Information */}
          <div className="md:w-1/2 bg-[#1E3A8A] p-10 md:p-16 text-white flex flex-col justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-8 backdrop-blur-sm">
              <FaHandshake className="text-3xl text-orange-300" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Grow Your Business with <span className="text-orange-300">Ultra Clap</span>
            </h2>
            <p className="text-blue-50/80 text-lg mb-8">
              Access exclusive wholesale pricing, track your orders, and manage your partnerships with our advanced portal.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                'Exclusive Partner Discounts',
                'Bulk Ordering System',
                'Priority Support & Tracking',
                'Marketing Resources Access'
              ].map((item, index) => (
                <li key={index} className="flex items-center text-blue-100">
                  <div className="w-5 h-5 bg-orange-400/20 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side: Login Form */}
          <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Partner Login</h3>
              <p className="text-slate-500">Welcome back! Please enter your details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 transition-colors group-focus-within:text-[#1E3A8A]" />
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="partner@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-[#1E3A8A] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <a href="#" className="text-xs font-semibold text-[#1E3A8A] hover:underline">Forgot password?</a>
                </div>
                <div className="relative group">
                  <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 transition-colors group-focus-within:text-[#1E3A8A]" />
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-[#1E3A8A] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/10 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Access Partner Portal
                    <FaArrowRight className="text-sm" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">
                Interested in becoming a partner?{' '}
                <a href="#" className="text-[#1E3A8A] font-bold hover:underline">Apply Now</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerLogin;
