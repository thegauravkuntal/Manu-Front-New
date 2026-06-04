import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaArrowLeft, FaSpinner, FaTimes, FaCheckCircle } from "react-icons/fa";
import { API_BASE_URL } from "../api/config";

const ResetPassword = ({ token: propToken, onClose: propOnClose }) => {
  const { token: urlToken } = useParams();
  const navigate = useNavigate();
  const token = propToken || urlToken;
  
  const onClose = propOnClose || (() => navigate("/"));

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("reset"); // reset, success

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/reset-password/${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || "Failed to reset password ❌");
        setLoading(false);
        return;
      }

      alert(data.msg || "Password has been reset successfully ✅");
      setStep("success");
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 relative border border-slate-100 scale-in duration-300">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg transition-colors p-1"
          >
            <FaTimes />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center justify-center gap-2">
              <FaCheckCircle className="text-[#1E3A8A] text-lg md:text-xl" />
              Password Reset Successful
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => onClose()}
              className="flex-1 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white py-3.5 rounded-2xl text-xs md:text-sm font-bold shadow-lg shadow-blue-900/10 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 relative border border-slate-100 scale-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg transition-colors p-1"
        >
          <FaArrowLeft />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center justify-center gap-2">
            <FaLock className="text-[#1E3A8A] text-lg md:text-xl" />
            Reset Password
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Enter your new password below to complete the password reset process.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
              New Password
            </label>
            <div className="relative">
              <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 text-sm" />
              <input
                type="password"
                name="password"
                required
                placeholder="At least 6 characters (letters & numbers)"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:bg-white transition-all font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 text-sm" />
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Repeat new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:bg-white transition-all font-bold"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => onClose()}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-2xl text-xs md:text-sm font-bold transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white py-3.5 rounded-2xl text-xs md:text-sm font-bold shadow-lg shadow-blue-900/10 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Resetting...
                </>
              ) : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;