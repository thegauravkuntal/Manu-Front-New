import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  FileText, 
  ExternalLink, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Building2,
  Calendar,
  Briefcase,
  Package,
  IndianRupee,
  ChevronRight,
  User,
  ShieldAlert,
  Clock,
  LayoutDashboard
} from 'lucide-react';

const PartnerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(false);

  useEffect(() => {
    fetchPartnerDetails();
  }, [id]);

  const fetchPartnerDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${ (import.meta.env.VITE_API_URL || "https://manu-back-bpob.onrender.com/api")}/admin/partner-profiles/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPartner(data.profile);
      } else {
        alert(data.msg || "Failed to load partner details.");
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error("Fetch partner details error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (status) => {
    if (window.confirm(`Are you sure you want to mark this seller as ${status}?`)) {
      setActioning(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${ (import.meta.env.VITE_API_URL || "https://manu-back-bpob.onrender.com/api")}/admin/partner-profiles/${id}/verify`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({ status })
        });
        const data = await res.json();
        if (data.success) {
          setPartner(data.profile);
          alert(`Partner successfully ${status === 'Verified' ? 'approved' : 'rejected'}.`);
        } else {
          alert(data.msg || "Failed to update status.");
        }
      } catch (err) {
        console.error("Verification error:", err);
      } finally {
        setActioning(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!partner) return null;

  return (
    <div className="min-h-screen bg-[#020817] text-white p-4 md:p-8 lg:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <LayoutDashboard size={14} className="text-blue-600" />
                <span>Admin</span>
                <ChevronRight size={12} />
                <span>Partners</span>
                <ChevronRight size={12} />
                <span className="text-white">Profile Details</span>
            </div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-all text-sm font-medium group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Return to List
            </button>
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {partner.companyName}
              </h1>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${
                partner.verificationStatus === 'Verified' ? 'bg-blue-600/10 text-orange-400 border-blue-600/20' :
                partner.verificationStatus === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                'bg-orange-500/10 text-orange-400 border-orange-500/20'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    partner.verificationStatus === 'Verified' ? 'bg-blue-600' :
                    partner.verificationStatus === 'Rejected' ? 'bg-red-500' : 'bg-orange-500'
                }`}></div>
                {partner.verificationStatus}
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 bg-white/5 text-blue-400`}>
                {partner.plan} Plan
              </div>
              {partner.subscriptionExpiry && (
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 ${new Date(partner.subscriptionExpiry) < new Date() ? 'bg-red-500/10 text-red-400' : 'bg-blue-600/10 text-orange-400'}`}>
                  Expires: {new Date(partner.subscriptionExpiry).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {partner.verificationStatus === 'Pending' && (
              <>
                <button 
                  disabled={actioning}
                  onClick={() => handleVerification('Rejected')}
                  className="px-8 py-4 rounded-2xl bg-white/5 text-gray-400 hover:bg-red-600/10 hover:text-red-500 transition-all font-bold text-sm flex items-center gap-2 border border-white/10"
                >
                  <XCircle size={18} />
                  Reject
                </button>
                <button 
                  disabled={actioning}
                  onClick={() => handleVerification('Verified')}
                  className="px-8 py-4 rounded-2xl bg-orange-500 text-white hover:bg-blue-600 transition-all font-bold text-sm flex items-center gap-2 shadow-xl shadow-orange-500/20"
                >
                  <CheckCircle size={18} />
                  Approve Partner
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Profile Info (Left) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Identity Card */}
            <div className="bg-[#081120] border border-white/10 rounded-[40px] p-8 md:p-12 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px] group-hover:bg-blue-600/10 transition-colors duration-700"></div>
               
               <div className="relative z-10 space-y-12">
                  <div className="flex flex-col md:flex-row gap-10">
                      {/* Logo Placeholder/Real */}
                      <div className="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-2xl">
                          {partner.logo ? (
                              <img src={partner.logo} alt="Logo" className="w-full h-full object-cover" />
                          ) : (
                              <Building2 size={40} className="text-gray-600" />
                          )}
                      </div>

                      <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[2px]">Website</p>
                                <a href={partner.website} target="_blank" rel="noreferrer" className="text-lg font-bold text-white hover:text-blue-600 transition-colors flex items-center gap-2 group/link">
                                    {partner.website || 'Not provided'}
                                    <ExternalLink size={14} className="text-gray-600 group-hover/link:text-blue-600 transition-colors" />
                                </a>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[2px]">Registration ID</p>
                                <p className="text-lg font-mono font-bold text-white">#{partner._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[2px]">Business Address</p>
                                <p className="text-lg font-bold text-gray-300 leading-relaxed max-w-xl">
                                    {partner.address || 'No physical address listed in profile.'}
                                </p>
                            </div>
                        </div>
                      </div>
                  </div>

                  <div className="h-px bg-white/5 w-full"></div>

                  {/* Representative Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                              <User size={20} />
                          </div>
                          <div>
                              <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">Owner Name</p>
                              <p className="text-sm font-bold text-white">{partner.userId?.name || 'N/A'}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                              <Mail size={20} />
                          </div>
                          <div className="min-w-0">
                              <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">Email Contact</p>
                              <p className="text-sm font-bold text-white truncate">{partner.userId?.email || 'N/A'}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-orange-400 flex items-center justify-center">
                              <Phone size={20} />
                          </div>
                          <div>
                              <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">Primary Phone</p>
                              <p className="text-sm font-bold text-white">{partner.userId?.phone || 'N/A'}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                              <Phone size={20} />
                          </div>
                          <div>
                              <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">Alternate Phone</p>
                              <p className="text-sm font-bold text-white">{partner.alternatePhone || 'N/A'}</p>
                          </div>
                      </div>
                  </div>
               </div>
            </div>

            {/* Verification Documents */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <ShieldCheck size={24} className="text-blue-600" />
                    <h2 className="text-2xl font-black">Verification Assets</h2>
                    <div className="h-px flex-1 bg-white/5"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { title: 'GST Certificate', id: partner.gstNumber, doc: partner.gstDoc, color: 'blue', icon: FileText },
                        { title: 'Business License', id: partner.businessRegistrationNumber, doc: partner.businessRegDoc, color: 'purple', icon: Briefcase },
                        { title: 'Aadhar Card', id: partner.aadharNumber, doc: partner.aadharDoc, color: 'green', icon: User },
                        { title: 'PAN Card', id: partner.panNumber, doc: partner.panDoc, color: 'orange', icon: ShieldAlert }
                    ].map((item, idx) => (
                        <div key={idx} className={`bg-[#081120] border border-white/10 rounded-[32px] p-6 hover:border-${item.color}-500/30 transition-all group/doc`}>
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-14 h-14 rounded-2xl bg-${item.color}-500/10 text-${item.color}-400 flex items-center justify-center group-hover/doc:scale-110 transition-transform duration-500`}>
                                    <item.icon size={24} />
                                </div>
                                {item.doc ? (
                                    <a href={item.doc} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                                        View Full <ExternalLink size={12} />
                                    </a>
                                ) : (
                                    <span className="text-[10px] font-black text-red-500/50 uppercase tracking-widest bg-red-500/5 px-3 py-1.5 rounded-lg border border-red-500/10">Missing</span>
                                )}
                            </div>
                            <h4 className="font-black text-white uppercase tracking-wider text-sm mb-1">{item.title}</h4>
                            <p className="text-xs font-mono text-gray-500 font-bold">{item.id || 'N/A'}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Sidebar Area (Right) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Status Tracking */}
            <div className="bg-[#081120] border border-white/10 rounded-[40px] p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-[3px] text-gray-500">Timeline</h3>
                    <Clock size={16} className="text-gray-600" />
                </div>

                <div className="space-y-8 relative">
                    <div className="absolute left-4 top-2 bottom-2 w-px bg-white/5"></div>
                    
                    <div className="relative pl-12">
                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center z-10">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        </div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider mb-1">Account Created</p>
                        <p className="text-xs font-bold text-white">{new Date(partner.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="relative pl-12">
                        <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border flex items-center justify-center z-10 ${partner.kycSubmittedAt ? 'bg-blue-500/20 border-blue-500/30' : 'bg-white/5 border-white/10'}`}>
                            <div className={`w-2 h-2 rounded-full ${partner.kycSubmittedAt ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                        </div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider mb-1">KYC Submission</p>
                        <p className="text-xs font-bold text-white">{partner.kycSubmittedAt ? new Date(partner.kycSubmittedAt).toLocaleDateString() : 'Awaiting Docs'}</p>
                    </div>

                    <div className="relative pl-12">
                        <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border flex items-center justify-center z-10 ${partner.verificationStatus === 'Verified' ? 'bg-blue-600/20 border-blue-600/30' : partner.verificationStatus === 'Rejected' ? 'bg-red-500/20 border-red-500/30' : 'bg-white/5 border-white/10'}`}>
                            <div className={`w-2 h-2 rounded-full ${partner.verificationStatus === 'Verified' ? 'bg-blue-600' : partner.verificationStatus === 'Rejected' ? 'bg-red-500' : 'bg-gray-700'}`}></div>
                        </div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider mb-1">Final Approval</p>
                        <p className="text-xs font-bold text-white">{partner.verificationStatus}</p>
                    </div>

                    {partner.subscriptionExpiry && (
                      <div className="relative pl-12">
                          <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border flex items-center justify-center z-10 ${new Date(partner.subscriptionExpiry) < new Date() ? 'bg-red-500/20 border-red-500/30' : 'bg-blue-600/20 border-blue-600/30'}`}>
                              <div className={`w-2 h-2 rounded-full ${new Date(partner.subscriptionExpiry) < new Date() ? 'bg-red-500' : 'bg-blue-600'}`}></div>
                          </div>
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider mb-1">Subscription Expiry</p>
                          <p className="text-xs font-bold text-white">{new Date(partner.subscriptionExpiry).toLocaleDateString()}</p>
                      </div>
                    )}
                </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default PartnerDetails;