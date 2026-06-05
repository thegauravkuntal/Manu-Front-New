import React, { useState, useEffect } from 'react';
import { 
  FaBoxOpen, 
  FaChartLine, 
  FaUsers, 
  FaWallet, 
  FaBell, 
  FaEllipsisV,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../api/config';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-current/10`}>
      <Icon />
    </div>
  </div>
);

const PartnerDashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeOrders: 0,
    successRate: 0,
    totalRevenue: '₹0'
  });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const downloadReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Leads,${stats.totalLeads}\n`
      + `Active Orders,${stats.activeOrders}\n`
      + `Total Revenue,${stats.totalRevenue.replace(/₹/, 'INR ')}\n`
      + `Success Rate,${stats.successRate}%`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "partner_performance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [showNotifications, setShowNotifications] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [activeLead, setActiveLead] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch Stats
        const statsRes = await fetch(`${API_BASE_URL}/partner/stats`, { headers });
        const statsData = await statsRes.json();

        // Fetch Leads
        const leadsRes = await fetch(`${API_BASE_URL}/partner/leads`, { headers });
        const leadsData = await leadsRes.json();

        if (statsRes.ok) setStats(statsData);
        if (leadsRes.ok) {
          const list = Array.isArray(leadsData) ? leadsData : leadsData.leads || [];
          setLeads(list.slice(0, 5));
        }
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Leads', value: stats.totalLeads, icon: FaUsers, color: 'bg-blue-500' },
    { title: 'Active Orders', value: stats.activeOrders, icon: FaBoxOpen, color: 'bg-blue-600' },
    { title: 'Total Revenue', value: stats.totalRevenue, icon: FaWallet, color: 'bg-orange-500' },
    { title: 'Success Rate', value: `${stats.successRate}%`, icon: FaChartLine, color: 'bg-purple-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Partner Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back! Here's what's happening with your manufacturing leads.</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-11 h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <FaBell className="text-sm" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-14 right-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h3 className="font-bold text-slate-800">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600"><FaTimesCircle /></button>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-800">New Lead Assigned</p>
                  <p className="text-[10px] text-blue-600">Custom Paper Bag machine inquiry from Mumbai.</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-800">Payment Received</p>
                  <p className="text-[10px] text-orange-500">₹45,000 processed for Order #234.</p>
                </div>
              </div>
              <button className="w-full mt-4 py-2 text-xs font-bold text-[#1E3A8A] hover:underline text-center">View All Notifications</button>
            </div>
          )}

          <button 
            onClick={downloadReport}
            className="bg-[#1E3A8A] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/10 hover:bg-[#1E40AF] hover:shadow-xl hover:shadow-blue-900/20 transition-all active:scale-95"
          >
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Recent Leads Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Recent Manufacturing Leads</h3>
            <button 
              onClick={() => navigate('/partner/leads')}
              className="text-[#1E3A8A] text-sm font-bold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{lead.name}</p>
                          <p className="text-[11px] text-slate-400">{lead.location}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">{lead.project}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                          lead.status === 'New' ? 'bg-blue-100 text-blue-600' :
                          lead.status === 'In Progress' ? 'bg-orange-100 text-orange-600' :
                          lead.status === 'Converted' ? 'bg-blue-100 text-orange-500' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={() => setActiveLead(activeLead === lead._id ? null : lead._id)}
                          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                        >
                          <FaEllipsisV />
                        </button>
                        {activeLead === lead._id && (
                          <div className="absolute right-10 top-4 w-40 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <button onClick={() => {navigate(`/partner/leads`); setActiveLead(null);}} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">View Details</button>
                            <button onClick={() => {window.location.href = `mailto:${lead.email}`; setActiveLead(null);}} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 border-t border-slate-50 flex items-center gap-2">Contact Client</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm">
                      No recent leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Plans Modal */}
      {showPlans && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-[#1E3A8A] p-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold">Premium Partner Plans</h3>
              <button onClick={() => setShowPlans(false)}><FaTimesCircle className="text-xl" /></button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-100 rounded-3xl p-6 hover:border-blue-600 transition-colors">
                <h4 className="font-bold text-slate-800 mb-2">Growth Starter</h4>
                <p className="text-2xl font-black text-slate-900 mb-4">₹4,999<span className="text-xs text-slate-400 font-medium">/mo</span></p>
                <ul className="text-xs text-slate-500 space-y-2 mb-6">
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-blue-600" /> 10 Featured Leads</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-blue-600" /> Email Support</li>
                </ul>
                <button className="w-full py-2 bg-[#1E3A8A] text-white rounded-xl text-xs font-bold">Choose Plan</button>
              </div>
              <div className="border-2 border-blue-600 rounded-3xl p-6 relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase">Most Popular</span>
                <h4 className="font-bold text-slate-800 mb-2">Industrial Pro</h4>
                <p className="text-2xl font-black text-slate-900 mb-4">₹9,999<span className="text-xs text-slate-400 font-medium">/mo</span></p>
                <ul className="text-xs text-slate-500 space-y-2 mb-6">
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-blue-600" /> Unlimited Verified Leads</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-blue-600" /> 24/7 Priority Support</li>
                </ul>
                <button className="w-full py-2 bg-[#1E3A8A] text-white rounded-xl text-xs font-bold">Choose Plan</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PartnerDashboard;
