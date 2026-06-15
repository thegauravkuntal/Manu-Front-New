import React, { useState, useEffect } from "react";
import { Phone, MessageCircle, BarChart3, RefreshCw, Trash2 } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const API_URL = "http://localhost:5001/api";

const AnalyticsTab = () => {
  const [analytics, setAnalytics] = useState({});
  const [totalClicks, setTotalClicks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Button icons mapping
  const buttonIcons = {
    call: <Phone size={18} />,
    whatsapp: <MessageCircle size={18} />,
    facebook: <FaFacebookF size={16} />,
    instagram: <FaInstagram size={16} />,
    linkedin: <FaLinkedinIn size={16} />,
    youtube: <FaYoutube size={16} />,
    contact: <MessageCircle size={18} />,
    email: <MessageCircle size={18} />,
  };

  // Button display names
  const buttonNames = {
    call: "Call Button",
    whatsapp: "WhatsApp Button",
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    contact: "Contact Supplier",
    email: "Email",
  };

  // Button colors
  const buttonColors = {
    call: "bg-green-500/20 text-green-400 border-green-500/30",
    whatsapp: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    facebook: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    instagram: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    linkedin: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    youtube: "bg-red-500/20 text-red-400 border-red-500/30",
    contact: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    email: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/analytics`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.analytics);
        setTotalClicks(data.totalClicks);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset all analytics data?")) return;
    
    setResetting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/analytics/reset`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: "Analytics reset successfully!", type: "success" });
        fetchAnalytics();
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      }
    } catch (error) {
      setMessage({ text: "Error resetting analytics", type: "error" });
    } finally {
      setResetting(false);
    }
  };

  const getPercentage = (count) => {
    if (totalClicks === 0) return 0;
    return ((count / totalClicks) * 100).toFixed(1);
  };

  // Get all button keys from analytics or use default list - YOUTUBE ADDED
  const buttonKeys = Object.keys(analytics).length > 0 
    ? Object.keys(analytics)
    : ["call", "whatsapp", "facebook", "instagram", "linkedin", "youtube", "contact", "email"];

  if (loading) {
    return (
      <div className="bg-[#0f1724] rounded-xl p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1724] rounded-xl p-6 h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <BarChart3 size={20} className="text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Click Analytics</h2>
            <p className="text-gray-400 text-sm mt-1">Track button clicks on your website</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#1a2332] hover:bg-[#1f2a3a] text-gray-300 rounded-lg transition-colors text-sm"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            <Trash2 size={14} />
            {resetting ? "Resetting..." : "Reset All"}
          </button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg flex-shrink-0 ${
          message.type === "success" 
            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
            : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          {message.text}
        </div>
      )}

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2 space-y-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {buttonKeys.map((key) => (
            <div key={key} className={`rounded-xl p-3 border ${buttonColors[key] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
              <div className="flex items-center gap-2 mb-1">
                {buttonIcons[key] || <BarChart3 size={16} />}
                <span className="text-[10px] font-medium truncate">{buttonNames[key] || key}</span>
              </div>
              <div className="text-xl font-bold text-white">
                {analytics[key]?.count || 0}
              </div>
              <div className="text-[8px] text-gray-400 mt-1">
                {getPercentage(analytics[key]?.count || 0)}%
              </div>
            </div>
          ))}
        </div>

        {/* Total Clicks Card */}
        <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-sm font-medium">Total Clicks</p>
              <p className="text-3xl font-bold text-white mt-1">{totalClicks.toLocaleString()}</p>
              <p className="text-gray-400 text-xs mt-2">All button clicks combined</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-orange-500/30 flex items-center justify-center">
              <BarChart3 size={28} className="text-orange-400" />
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-[#1a2332] rounded-xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left py-3 px-4 text-gray-400 text-xs uppercase">Button</th>
                  <th className="text-left py-3 px-4 text-gray-400 text-xs uppercase">Click Count</th>
                  <th className="text-left py-3 px-4 text-gray-400 text-xs uppercase">Percentage</th>
                  <th className="text-left py-3 px-4 text-gray-400 text-xs uppercase">Last Clicked</th>
                </tr>
              </thead>
              <tbody>
                {buttonKeys.map((key) => {
                  const count = analytics[key]?.count || 0;
                  const percentage = getPercentage(count);
                  const lastClicked = analytics[key]?.lastClickedAt;
                  
                  return (
                    <tr key={key} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {buttonIcons[key] || <BarChart3 size={14} />}
                          <span className="text-white text-sm capitalize">{buttonNames[key] || key}</span>
                        </div>
                       </td>
                      <td className="py-3 px-4 text-white text-sm font-medium">{count.toLocaleString()} </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-orange-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-gray-400 text-xs">{percentage}%</span>
                        </div>
                       </td>
                      <td className="py-3 px-4 text-gray-400 text-xs">
                        {lastClicked ? new Date(lastClicked).toLocaleString() : "Never"}
                       </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Refresh Note */}
        <div className="text-center text-gray-500 text-xs py-2">
          <p>Data updates in real-time when users click buttons on the website</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;