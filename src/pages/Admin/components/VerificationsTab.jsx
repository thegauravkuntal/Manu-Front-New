import React from "react";
import { FileText, Eye, CheckCircle, XCircle, ShieldCheck, Search } from "lucide-react";

const VerificationsTab = ({
  partnerProfiles,
  getFilteredItems,
  handleVerification,
  navigate,
  search,
  setSearch,
  filter,
  setFilter,
}) => {
  return (
    <div className="flex flex-col gap-3 flex-1 overflow-hidden">
      <div className="bg-[#081120] border border-white/10 rounded-xl p-4 flex items-start justify-between flex-shrink-0">
        <div>
          <h2 className="text-[24px] font-bold leading-none">KYC & Verifications</h2>
          <p className="text-gray-400 mt-2 text-[11px]">Review legal documents and approve partner requests.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search partner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[220px] h-[38px] bg-[#0b1220] border border-white/10 rounded-lg pl-4 pr-10 text-[11px] text-white outline-none focus:border-blue-600"
            />
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-[38px] px-3 bg-[#0b1220] border border-white/10 rounded-lg text-[11px] text-white outline-none focus:border-blue-600"
          >
            <option>ID</option>
            <option>Name</option>
            <option>Status</option>
          </select>
        </div>
      </div>

      <div className="bg-[#081120] border border-white/10 rounded-xl overflow-hidden flex flex-col flex-1">
        <div className="grid grid-cols-7 px-4 h-[45px] items-center text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-white/10">
          <span>Company / ID</span>
          <span>GST Number</span>
          <span>Documents</span>
          <span>Status</span>
          <span>Submitted</span>
          <span className="text-center">Details</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {getFilteredItems(partnerProfiles).length > 0 ? getFilteredItems(partnerProfiles).map((profile) => (
            <div key={profile._id} className="grid grid-cols-7 items-center px-4 py-4 border-t border-white/5 text-[10px]">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-white truncate pr-2">{profile.companyName}</span>
                <span className="text-gray-500 font-mono">#{profile._id.slice(-6).toUpperCase()}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-gray-300 font-bold">{profile.gstNumber || 'N/A'}</span>
                <span className="text-gray-500 text-[8px] truncate pr-2">Reg: {profile.businessRegistrationNumber || 'N/A'}</span>
              </div>

              <div className="flex items-center gap-2">
                {profile.gstDoc ? (
                  <a href={profile.gstDoc} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 p-1.5 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500 hover:text-white transition-all" title={`GST: ${profile.gstNumber || 'N/A'}`}>
                     <FileText size={12} /> GST
                  </a>
                ) : <span className="text-gray-600">-</span>}
                {profile.businessRegDoc ? (
                  <a href={profile.businessRegDoc} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 p-1.5 bg-purple-500/10 text-purple-400 rounded-md hover:bg-purple-500 hover:text-white transition-all" title={`Reg: ${profile.businessRegistrationNumber || 'N/A'}`}>
                     <FileText size={12} /> Reg
                  </a>
                ) : <span className="text-gray-600">-</span>}
                {profile.aadharDoc ? (
                  <a href={profile.aadharDoc} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 p-1.5 bg-blue-600/10 text-orange-400 rounded-md hover:bg-blue-600 hover:text-white transition-all" title={`Aadhar: ${profile.aadharNumber || 'N/A'}`}>
                     <FileText size={12} /> Aadhar
                  </a>
                ) : null}
                {profile.panDoc ? (
                  <a href={profile.panDoc} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 p-1.5 bg-orange-500/10 text-orange-400 rounded-md hover:bg-orange-500 hover:text-white transition-all" title={`PAN: ${profile.panNumber || 'N/A'}`}>
                     <FileText size={12} /> PAN
                  </a>
                ) : null}
              </div>

              <span>
                <span className={`px-3 py-1 rounded-md text-[9px] font-bold ${
                  profile.verificationStatus === "Verified" ? "bg-blue-600/10 text-orange-400" : 
                  profile.verificationStatus === "Rejected" ? "bg-red-500/10 text-red-400" : 
                  "bg-orange-500/10 text-orange-400"
                }`}>
                  {profile.verificationStatus}
                </span>
              </span>

              <span className="text-gray-400">
                {profile.kycSubmittedAt ? new Date(profile.kycSubmittedAt).toLocaleDateString() : 'N/A'}
              </span>

              <div className="flex justify-center">
                <button 
                  onClick={() => navigate(`/admin/partner/${profile._id}`)}
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Eye size={16} />
                </button>
              </div>

              <div className="flex items-center justify-end gap-2">
                {profile.verificationStatus === "Pending" ? (
                  <>
                    <button 
                      onClick={() => handleVerification(profile._id, 'Verified')}
                      className="px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-blue-600 transition-all text-[9px] font-bold flex items-center gap-1"
                    >
                      <CheckCircle size={12} /> Approve
                    </button>
                    <button 
                      onClick={() => handleVerification(profile._id, 'Rejected')}
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-all text-[9px] font-bold flex items-center gap-1"
                    >
                      <XCircle size={12} /> Reject
                    </button>
                  </>
                ) : (
                  <span className="text-gray-600 italic">No actions</span>
                )}
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-500 py-20">
              <ShieldCheck size={40} className="opacity-20" />
              <p className="text-xs">No verification requests found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationsTab;
