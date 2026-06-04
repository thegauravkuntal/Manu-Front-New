import React from "react";

const OverviewTab = ({
  stats,
  setActiveMenu,
  leads,
  orders,
}) => {
  return (
    <>
      {/* TITLE */}
      <div className="mb-3 flex-shrink-0">
        <h1 className="text-[24px] font-bold leading-none">
          Dashboard
        </h1>
        <p className="text-gray-400 mt-1 text-[11px]">
          Welcome back, Admin 👋
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-[#081120] border border-white/10 rounded-xl px-3 py-3 h-[88px]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-[10px]">
                  {item.title}
                </p>
                <h2 className="text-[17px] font-bold mt-2">
                  {item.value}
                </h2>
                <p className="text-orange-400 mt-2 text-[9px] font-medium">
                  ↑ {item.growth}
                </p>
              </div>
              <div
                className={`w-[36px] h-[36px] rounded-full bg-gradient-to-br ${item.bg} flex items-center justify-center`}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT TABLES */}
      <div className="mt-3 flex-1 overflow-hidden">
        {/* RECENT LEADS */}
        <div className="bg-[#081120] border border-white/10 rounded-xl p-4 overflow-hidden flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold">
              Recent Leads
            </h2>
            <button 
              onClick={() => setActiveMenu("Leads")}
              className="text-orange-400 text-[10px] hover:text-orange-300 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10 flex-1">
            <div className="grid grid-cols-3 bg-white/5 h-[38px] items-center px-3 text-[10px] font-semibold text-gray-300">
              <span>ID</span>
              <span>Name</span>
              <span>Status</span>
            </div>

            <div>
              {leads && leads.length > 0 ? leads.slice(0, 6).map((lead, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 items-center px-3 h-[58px] border-t border-white/5 text-[10px]"
                >
                  <span className="font-medium text-white">
                    #{lead._id.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-gray-300">
                    {lead.name}
                  </span>
                  <span className={`text-[9px] ${lead.status === 'New' ? 'text-blue-400' : 'text-orange-400'}`}>
                    {lead.status}
                  </span>
                </div>
              )) : (
                <div className="p-4 text-center text-gray-500 text-[10px]">No recent leads.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverviewTab;
