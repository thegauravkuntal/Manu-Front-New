import React from "react";
import { Clock, Eye, Mail, Phone, Calendar, AlertCircle } from "lucide-react";

const ExpirationsTab = ({ partnerProfiles, navigate }) => {
  const getExpiringPartners = () => {
    const today = new Date();
    const fifteenDaysFromNow = new Date();
    fifteenDaysFromNow.setDate(today.getDate() + 15);

    return partnerProfiles.filter((profile) => {
      if (!profile.subscriptionExpiry) return false;
      const expiryDate = new Date(profile.subscriptionExpiry);
      return expiryDate >= today && expiryDate <= fifteenDaysFromNow;
    });
  };

  const expiringPartners = getExpiringPartners();

  const getDaysRemaining = (expiryDate) => {
    const today = new Date();
    const diffTime = new Date(expiryDate) - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-hidden">
      <div className="bg-[#081120] border border-white/10 rounded-2xl p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-white flex items-center gap-2">
              <Clock className="text-amber-500" size={24} />
              Upcoming Expirations
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Partners whose subscription will expire within the next 15 days.
            </p>
          </div>
          <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs font-bold uppercase tracking-wider">
            Total: {expiringPartners.length}
          </div>
        </div>
      </div>

      <div className="bg-[#081120] border border-white/10 rounded-2xl flex-1 overflow-hidden flex flex-col">
        <div className="p-4 bg-white/5 border-b border-white/10 grid grid-cols-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span className="col-span-2">Partner / Company</span>
          <span>Plan</span>
          <span>Expiry Date</span>
          <span>Time Left</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {expiringPartners.length > 0 ? (
            expiringPartners.map((profile) => {
              const daysLeft = getDaysRemaining(profile.subscriptionExpiry);
              return (
                <div key={profile._id} className="grid grid-cols-6 items-center px-4 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-bold border border-white/10">
                      {profile.companyName?.[0] || profile.userId?.name?.[0] || "P"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white truncate max-w-[200px]">{profile.companyName}</p>
                      <p className="text-[10px] text-gray-500">{profile.userId?.email}</p>
                    </div>
                  </div>

                  <div>
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      profile.plan === 'Elite' ? 'bg-purple-500/10 text-purple-400' :
                      profile.plan === 'Premium' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-blue-600/10 text-orange-400'
                    }`}>
                      {profile.plan}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                    <Calendar size={12} className="text-gray-500" />
                    {new Date(profile.subscriptionExpiry).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>

                  <div>
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${
                      daysLeft <= 3 ? 'text-red-500' : 
                      daysLeft <= 7 ? 'text-orange-500' : 'text-amber-500'
                    }`}>
                      <AlertCircle size={12} />
                      {daysLeft} days
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <a href={`mailto:${profile.userId?.email}`} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all" title="Send Email">
                      <Mail size={14} />
                    </a>
                    <button 
                      onClick={() => navigate(`/admin/partner/${profile._id}`)}
                      className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                      title="View Profile"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
              <Clock size={48} className="opacity-10" />
              <p className="text-sm">No subscriptions expiring within the next 15 days.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpirationsTab;
