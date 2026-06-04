import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaDownload, FaPhone, FaEnvelope, FaMapMarkerAlt, FaExclamationCircle } from 'react-icons/fa';
import { API_BASE_URL } from '../../api/config';

const MyLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeLead, setActiveLead] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const exportLeads = () => {
    if (leads.length === 0) return alert("No leads to export");
    const headers = "Name,Project,Location,Status,Budget,Email,Phone,Date\n";
    const rows = leads.map(l => `${l.name},${l.project},${l.location},${l.status},${l.budget},${l.email},${l.phone},${new Date(l.createdAt).toLocaleDateString()}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/partner/leads`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        const list = Array.isArray(data) ? data : data.leads || [];
        setLeads(list);
      }
    } catch (err) {
      console.error("Fetch leads error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/partner/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchLeads();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Update lead error:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-orange-100 text-orange-700';
      case 'Converted': return 'bg-blue-100 text-orange-600';
      case 'Nurturing': return 'bg-purple-100 text-purple-700';
      case 'Lost': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Leads</h1>
          <p className="text-slate-500 font-medium">Manage and track your manufacturing inquiries</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border ${
              showFilters ? 'bg-blue-50 border-blue-600 text-[#1E3A8A]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FaFilter className="text-xs" />
            Filters
          </button>
          
          {showFilters && (
            <div className="absolute top-14 right-0 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-2 animate-in fade-in slide-in-from-top-2">
              {['All', 'New', 'In Progress', 'Converted', 'Lost'].map((status) => (
                <button
                  key={status}
                  onClick={() => {setStatusFilter(status); setShowFilters(false);}}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    statusFilter === status ? 'bg-blue-50 text-[#1E3A8A]' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}

          <button 
            onClick={exportLeads}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] text-white rounded-xl font-bold hover:bg-[#1E40AF] transition-all shadow-lg shadow-blue-900/10"
          >
            <FaDownload className="text-xs" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Inquiries', count: leads.length, color: 'bg-blue-500' },
          { label: 'Active Negotiations', count: leads.filter(l => l.status === 'In Progress').length, color: 'bg-orange-500' },
          { label: 'Closed Deals', count: leads.filter(l => l.status === 'Converted').length, color: 'bg-blue-600' },
          { label: 'Conversion Rate', count: leads.length > 0 ? `${Math.round((leads.filter(l => l.status === 'Converted').length / leads.length) * 100)}%` : '0%', color: 'bg-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-800">{stat.count}</h3>
            <div className={`h-1 w-8 ${stat.color} rounded-full mt-3`}></div>
          </div>
        ))}
      </div>

      {/* Filters Area */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search leads by name, company or project..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-600 transition-all text-sm"
          />
        </div>
      </div>

      {/* Leads List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <div key={lead._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-600/30 transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-xl font-bold group-hover:bg-blue-50 group-hover:text-orange-500 transition-colors">
                    {lead.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 flex-wrap">
                      {lead.name}
                      <select 
                        value={lead.status}
                        onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                        className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold outline-none border-none cursor-pointer ${getStatusColor(lead.status)}`}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Converted">Converted</option>
                        <option value="Nurturing">Nurturing</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">{lead.project}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5"><FaMapMarkerAlt /> {lead.location}</span>
                      <span className="flex items-center gap-1.5 font-bold text-slate-600">Budget: {lead.budget}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <a href={`tel:${lead.phone}`} className="flex-1 lg:flex-none p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors" title="Call">
                    <FaPhone />
                  </a>
                  <a href={`mailto:${lead.email}`} className="flex-1 lg:flex-none p-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors" title="Email">
                    <FaEnvelope />
                  </a>
                  <button 
                    onClick={() => setActiveLead(lead)}
                    className="flex-1 lg:flex-none px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <FaExclamationCircle className="text-4xl text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No leads found.</p>
          </div>
        )}
      </div>

      {/* Lead Details Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-[#1E3A8A] p-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold">Lead Details</h3>
              <button onClick={() => setActiveLead(null)}><FaExclamationCircle className="rotate-180" /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Client Name</label>
                  <p className="font-bold text-slate-800">{activeLead.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Project</label>
                  <p className="font-bold text-slate-800">{activeLead.project}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email</label>
                  <p className="font-bold text-slate-800">{activeLead.email}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Phone</label>
                  <p className="font-bold text-slate-800">{activeLead.phone}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Location</label>
                  <p className="font-bold text-slate-800">{activeLead.location}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Budget</label>
                  <p className="font-bold text-slate-800">{activeLead.budget}</p>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Message</label>
                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">{activeLead.message || "No specific message provided."}</p>
              </div>
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button onClick={() => setActiveLead(null)} className="px-6 py-2 bg-[#1E3A8A] text-white rounded-xl font-bold">Close Details</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLeads;
