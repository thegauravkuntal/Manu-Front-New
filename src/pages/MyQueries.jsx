import React, { useState, useEffect } from 'react';
import { FaClock, FaCheckCircle, FaExclamationCircle, FaSearch, FaChevronRight } from 'react-icons/fa';
import { API_BASE_URL } from "../api/config";

const MyQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMyQueries = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/leads/my-queries`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setQueries(data.leads);
        }
      } catch (err) {
        console.error("Fetch queries error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyQueries();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Converted': return 'bg-blue-100 text-orange-600 border-orange-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Negotiation': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredQueries = queries.filter(q => 
    q.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-20 md:pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">My Queries</h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium">Track your product inquiries and supplier conversations.</p>
          </div>
          
          <div className="relative group w-full md:min-w-[300px] md:w-auto">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E3A8A] transition-colors" />
            <input 
              type="text" 
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 md:pl-12 pr-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold focus:ring-2 focus:ring-[#1E3A8A]/20 outline-none transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-slate-100"></div>
            ))}
          </div>
        ) : filteredQueries.length > 0 ? (
          <div className="grid gap-4 md:gap-6">
            {filteredQueries.map((query) => (
              <div key={query._id} className="bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                  <div className="flex items-center md:items-start gap-4 md:gap-5">
                    <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 bg-[#1E3A8A]/5 rounded-xl md:rounded-2xl flex items-center justify-center text-[#1E3A8A] text-lg group-hover:bg-[#1E3A8A] group-hover:text-white transition-all duration-500">
                      <FaClock className="animate-pulse text-sm md:text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-sm md:text-lg font-black text-slate-900 truncate">{query.project}</h3>
                        <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(query.status)}`}>
                          {query.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[10px] md:text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1">📍 {query.location}</span>
                        <span className="hidden sm:inline w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="truncate">Sent {new Date(query.createdAt).toLocaleDateString()}</span>
                        <span className="hidden sm:inline w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-[#1E3A8A]">Budget: {query.budget}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Inquiry ID</p>
                      <p className="text-[10px] md:text-xs font-mono font-bold text-slate-500">#{query._id.slice(-6).toUpperCase()}</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-slate-50 hover:bg-[#1E3A8A] text-slate-700 hover:text-white rounded-xl md:rounded-2xl font-bold text-xs transition-all duration-300">
                      Details
                      <FaChevronRight className="text-[8px] md:text-[10px]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 md:py-24 bg-white rounded-[32px] md:rounded-[48px] border border-dashed border-slate-200 px-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationCircle className="text-slate-200 text-2xl md:text-3xl" />
            </div>
            <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2">No inquiries found</h3>
            <p className="text-xs md:text-sm text-slate-500 font-medium max-w-sm mx-auto">You haven't sent any product inquiries yet. Explore machines to get started!</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyQueries;
