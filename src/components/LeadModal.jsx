import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaPaperPlane,
  FaCheckCircle,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClipboardList,
  FaShieldAlt,
} from "react-icons/fa";
import { API_BASE_URL, getServerUrl, getLocalFallback } from "../api/config";

const LeadModal = ({ isOpen, onClose, product, partnerId }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
    location: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const base = {
      project: product?.title || "",
      location: "",
      notes: "",
    };

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || user.phoneNumber || "",
          ...base,
        });
        return;
      } catch {
        /* fall through */
      }
    }

    setFormData({
      name: "",
      email: "",
      phone: "",
      ...base,
    });
    setError("");
    setSubmitted(false);
  }, [isOpen, product]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const resolvedPartnerId = partnerId || product?.partnerId;
    if (!resolvedPartnerId) {
      setError("This product is not linked to a supplier yet. Please contact support.");
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setError("Please enter a valid phone number (at least 10 digits).");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/leads`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          project: formData.project.trim() || product?.title || "Product inquiry",
          location: formData.location.trim() || "Not specified",
          notes: formData.notes.trim(),
          partnerId: resolvedPartnerId,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setSubmitted(false);
        }, 2500);
      } else {
        setError(data.msg || "Could not send inquiry. Please try again.");
      }
    } catch (err) {
      console.error("Lead submission error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const productImage =
    getServerUrl(product?.image || product?.img) ||
    getLocalFallback(product?.title, product?.category);

  const inputClass =
    "w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1E3A8A]/25 focus:border-[#1E3A8A] outline-none transition-all";

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquire-modal-title"
    >
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-t-[28px] sm:rounded-[28px] w-full max-w-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in duration-300">
        {submitted ? (
          <div className="p-10 sm:p-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-blue-50">
              <FaCheckCircle className="text-orange-500 text-4xl" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Inquiry sent!</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
              Your request was delivered to the supplier. They will contact you soon.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] px-5 sm:px-6 pt-5 pb-6 text-white shrink-0">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-200/90 mb-1">
                    Inquire now
                  </p>
                  <h3 id="inquire-modal-title" className="text-xl sm:text-2xl font-black leading-tight">
                    Contact supplier
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2.5 hover:bg-white/15 rounded-full transition-colors shrink-0"
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>

              {product && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/15">
                  <img
                    src={productImage}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover border-2 border-white/30 shrink-0"
                    onError={(e) => {
                      e.target.src = getLocalFallback(product?.title, product?.category);
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-orange-200/80 font-bold">
                      Product
                    </p>
                    <p className="font-bold text-sm sm:text-base truncate">{product.title}</p>
                    {product.category && (
                      <p className="text-xs text-blue-100/70 mt-0.5">{product.category}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                <FaShieldAlt className="text-[#1E3A8A] shrink-0" />
                <span>Verified supplier · Your details are shared only with this seller</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">
                    Full name *
                  </label>
                  <FaUser className="absolute left-3.5 top-[34px] text-slate-400 text-sm pointer-events-none" />
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">
                    Phone *
                  </label>
                  <FaPhone className="absolute left-3.5 top-[34px] text-slate-400 text-sm pointer-events-none" />
                  <input
                    required
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">
                  Email *
                </label>
                <FaEnvelope className="absolute left-3.5 top-[34px] text-slate-400 text-sm pointer-events-none" />
                <input
                  required
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>

              <div className="relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">
                  City / location
                </label>
                <FaMapMarkerAlt className="absolute left-3.5 top-[34px] text-slate-400 text-sm pointer-events-none" />
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Mumbai, Maharashtra"
                  autoComplete="address-level2"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block flex items-center gap-1.5">
                  <FaClipboardList className="text-[#1E3A8A]" />
                  Requirements *
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1E3A8A]/25 focus:border-[#1E3A8A] outline-none resize-none"
                  placeholder="Quantity, specifications, delivery timeline, or any questions for the supplier..."
                />
              </div>

              {error && (
                <p className="text-red-700 text-xs font-semibold text-center bg-red-50 border border-red-100 rounded-xl py-3 px-4">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#1E3A8A] text-white rounded-xl font-black text-sm shadow-lg shadow-blue-900/20 hover:bg-[#1E40AF] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send inquiry
                    <FaPaperPlane className="text-xs" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadModal;
