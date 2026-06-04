import { Search, X, Package, Briefcase, Users } from "lucide-react";

const GlobalSearchModal = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  menuItems = [],
  users = [],
  leads = [],
  products = [],
  setActiveMenu,
  handleEditClick
}) => {
  if (!isOpen) return null;

  const menuMatches = (menuItems || []).filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const userMatches = (users || []).filter(u => (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()));
  const leadMatches = (leads || []).filter(l => (l.project || "").toLowerCase().includes(searchQuery.toLowerCase()) || (l.name || "").toLowerCase().includes(searchQuery.toLowerCase()));
  const productMatches = (products || []).filter(p => (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()));

  const hasResults = menuMatches.length > 0 || userMatches.length > 0 || leadMatches.length > 0 || productMatches.length > 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 px-4 z-[999] text-left">
      {/* Backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="w-full max-w-2xl bg-[#081120] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Input Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            autoFocus
            placeholder="Search anything (users, leads, products, menus)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-white text-sm outline-none placeholder-gray-500"
          />
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results body */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-4 custom-scrollbar">
          {searchQuery.trim() === "" ? (
            <div className="p-8 text-center text-gray-500 text-xs">
              Type to start searching across the system...
              <div className="mt-3 flex justify-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">Users</span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">Leads</span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">Products</span>
              </div>
            </div>
          ) : (
            <>
              {!hasResults ? (
                <div className="p-8 text-center text-gray-500 text-xs">
                  No matches found for <span className="text-blue-600 font-bold">"{searchQuery}"</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Menu Matches */}
                  {menuMatches.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider px-2">Navigation</h4>
                      {menuMatches.map(m => (
                        <div
                          key={m.name}
                          onClick={() => {
                            setActiveMenu(m.name);
                            onClose();
                          }}
                          className="px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer flex items-center justify-between text-xs text-white transition-all group"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-gray-400 group-hover:text-blue-600 transition-colors">{m.icon}</span>
                            <span className="font-semibold">{m.name}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all font-bold">Go to tab →</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Product Matches */}
                  {productMatches.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider px-2">Products</h4>
                      {productMatches.map(p => (
                        <div
                          key={p._id}
                          onClick={() => {
                            setActiveMenu("Products");
                            handleEditClick(p);
                            onClose();
                          }}
                          className="px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer flex items-center justify-between text-xs text-white transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            {p.image ? (
                              <img src={p.image.url || p.image} alt={p.title} className="w-8 h-8 rounded-lg object-cover bg-white/5" />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-600/20 text-orange-400 flex items-center justify-center"><Package size={14} /></div>
                            )}
                            <div>
                              <span className="font-semibold block">{p.title}</span>
                              <span className="text-[10px] text-gray-500 block">{p.category} • {p.mobileNumber || "Verified"}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-500 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all font-bold">Edit Details →</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Lead Matches */}
                  {leadMatches.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider px-2">Leads</h4>
                      {leadMatches.map(l => (
                        <div
                          key={l._id}
                          onClick={() => {
                            setActiveMenu("Leads");
                            onClose();
                          }}
                          className="px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer flex items-center justify-between text-xs text-white transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center"><Briefcase size={14} /></div>
                            <div>
                              <span className="font-semibold block">{l.project}</span>
                              <span className="text-[10px] text-gray-500 block">{l.name} • {l.location} • Budget: {l.budget}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-500 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all font-bold">View in Tab →</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* User Matches */}
                  {userMatches.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider px-2">Users</h4>
                      {userMatches.map(u => (
                        <div
                          key={u._id}
                          onClick={() => {
                            setActiveMenu("Users");
                            handleEditClick(u);
                            onClose();
                          }}
                          className="px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer flex items-center justify-between text-xs text-white transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center"><Users size={14} /></div>
                            <div>
                              <span className="font-semibold block">{u.name}</span>
                              <span className="text-[10px] text-gray-500 block">{u.email} • Role: {u.role}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-500 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all font-bold">Edit User →</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
