import React from "react";
import { Search, Plus, Edit2, Trash2, Eye, Building2 } from "lucide-react";

const TableTab = ({
  activeMenu,
  search,
  setSearch,
  filter,
  setFilter,
  setIsAddModalOpen,
  getFilteredItems,
  handleEditClick,
  handleDelete,
  showMainCategory,
  navbarId,
  onToggleMainCategoryVisibility,
  users = [],
  services = [],
  subscribers = [],
  leads = [],
  products = [],
  categories = [],
  productCategoryNames = [],
  partnerProfiles = [],
  navigate
}) => {
  const filteredCategoryNames = productCategoryNames.filter(name =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-3 flex-1 overflow-hidden">
      {/* TOP BAR */}
      <div className="bg-[#081120] border border-white/10 rounded-xl p-4 flex items-start justify-between flex-shrink-0">
        <div>
          <h2 className="text-[24px] font-bold leading-none">{activeMenu}</h2>
          <p className="text-gray-400 mt-2 text-[11px]">Manage your {activeMenu.toLowerCase()} data efficiently.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${activeMenu.toLowerCase()}...`}
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
            <option>Category</option>
            <option>Status</option>
          </select>
          
          {activeMenu === "Main Categories" && (
            <button
              onClick={onToggleMainCategoryVisibility}
              disabled={!navbarId}
              className={`h-[38px] px-4 rounded-lg flex items-center gap-2 text-[11px] font-bold border transition-all duration-300 ${
                !navbarId ? "opacity-50 cursor-not-allowed border-white/10 bg-white/5 text-gray-500" :
                showMainCategory 
                ? "bg-orange-500/20 border-blue-600/50 text-orange-400 hover:bg-orange-500/30" 
                : "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${!navbarId ? "bg-gray-600" : showMainCategory ? "bg-blue-600 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"}`}></div>
              {!navbarId ? "Loading Setting..." : showMainCategory ? "Home Section: ON" : "Home Section: OFF"}
            </button>
          )}

          {activeMenu !== "Users" && activeMenu !== "Cities" && activeMenu !== "Industries" && activeMenu !== "Testimonials" && activeMenu !== "FAQ" && activeMenu !== "Banner Slider" && activeMenu !== "SEO Manager" && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="h-[38px] px-4 rounded-lg bg-orange-500 hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 text-[11px] font-medium"
            >
              <Plus size={14} />
              Add
            </button>
          )}
        </div>
      </div>

      {/* TABLE AREA */}
      <div className="bg-[#081120] border border-white/10 rounded-2xl p-6 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold">Manage {activeMenu}</h2>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Total:</span>
            <span className="text-blue-600">
              {activeMenu === "Users" ? `${getFilteredItems(users).length} of ${users?.length || 0}` :
               activeMenu === "Leads" ? `${getFilteredItems(leads).length} of ${leads?.length || 0}` :
               activeMenu === "Products" ? `${getFilteredItems(products).length} of ${products?.length || 0}` :
               activeMenu === "Sub Categories" ? `${getFilteredItems(categories).length} of ${categories?.length || 0}` :
               activeMenu === "Main Categories" ? `${getFilteredItems(services).length} of ${services?.length || 0}` :
               activeMenu === "Subscribers" ? `${getFilteredItems(subscribers).length + getFilteredItems(partnerProfiles).length} total` : 0}
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10 flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-7 bg-white/5 h-[40px] items-center px-4 text-[11px] font-semibold text-gray-300 sticky top-0 z-10">
            <span>ID</span>
            <span className="col-span-2">{activeMenu === "Sub Categories" ? "Subcategory Name" : activeMenu === "Users" ? "Full Name" : activeMenu === "Subscribers" ? "Email / Company" : "Title/Name"}</span>
            <span className="col-span-2">{activeMenu === "Leads" ? "Project & Contact" : activeMenu === "Users" ? "Email & Phone" : activeMenu === "Sub Categories" ? "Main Category" : activeMenu === "Subscribers" ? "Plan / Date" : activeMenu === "Products" ? "Main Category & Sub Category" : "Category & Detail"}</span>
            <span>Status / Info</span>
            <span className="text-right">Actions</span>
          </div>

          <div>
            {activeMenu === "Users" && (getFilteredItems(users).length > 0 ? getFilteredItems(users).map((user) => (
              <div key={user._id} className="grid grid-cols-7 items-center px-4 h-[62px] border-t border-white/5 text-[10px]">
                <span className="font-medium text-white">#{user._id.slice(-6).toUpperCase()}</span>
                <span className="text-gray-300 col-span-2">{user.name}</span>
                <div className="col-span-2 flex flex-col gap-0.5">
                  <span className="text-gray-400 truncate pr-4">{user.email}</span>
                  <span className="text-gray-500">{user.phone || 'No Phone'}</span>
                </div>
                <span>
                  <span className={`px-3 py-1 rounded-md text-[9px] ${
                    user.role === "admin" ? "bg-purple-500/10 text-purple-400" : 
                    user.role === "partner" ? "bg-orange-500/10 text-orange-400" : "bg-blue-500/10 text-blue-400"
                  }`}>
                    {user.role}
                  </span>
                </span>
                <div className="flex items-center justify-end gap-3 text-gray-400">
                  <button onClick={() => handleEditClick(user)} className="hover:text-blue-400 transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(user._id, "admin/users")} className="hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            )) : <p className="p-10 text-center text-slate-500 text-xs">No users found.</p>)}

            {activeMenu === "Main Categories" && (getFilteredItems(services).length > 0 ? getFilteredItems(services).map((service) => (
              <div key={service._id} className="grid grid-cols-7 items-center px-4 h-[62px] border-t border-white/5 text-[10px]">
                <span className="font-medium text-white">#{service._id.slice(-6).toUpperCase()}</span>
                <span className="text-gray-300 col-span-2">{service.title}</span>
                <div className="col-span-2 flex flex-col gap-0.5">
                  <span className="text-gray-400 uppercase tracking-tighter text-[9px]">{service.category}</span>
                  <span className="text-blue-600 font-medium">Rating: {service.rating || 'N/A'}</span>
                </div>
                <span className="px-3 py-1 rounded-md bg-blue-600/10 text-orange-400 text-[9px] w-fit">
                  {service.tag || 'Active'}
                </span>
                <div className="flex items-center justify-end gap-3 text-gray-400">
                  {service.image && (
                    <a href={service.image} target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors" title="View Image">
                      <Eye size={14} />
                    </a>
                  )}
                  <button onClick={() => handleEditClick(service)} className="hover:text-blue-400 transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(service._id, "manufacturing")} className="hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            )) : <p className="p-10 text-center text-slate-500 text-xs">No services found.</p>)}

            {activeMenu === "Subscribers" && (
              <>
                {getFilteredItems(subscribers).length > 0 && getFilteredItems(subscribers).map((sub) => (
                  <div key={sub._id} className="grid grid-cols-7 items-center px-4 h-[62px] border-t border-white/5 text-[10px]">
                    <span className="font-medium text-white">#{sub._id.slice(-6).toUpperCase()}</span>
                    <span className="text-gray-300 col-span-2">{sub.email}</span>
                    <span className="text-gray-400 col-span-2">{new Date(sub.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="px-3 py-1 rounded-md bg-blue-600/10 text-orange-400 text-[9px] w-fit">{sub.status}</span>
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      <button onClick={() => handleEditClick(sub)} className="hover:text-blue-400 transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(sub._id, "admin/subscribers")} className="hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}

                {getFilteredItems(partnerProfiles).map((profile) => (
                  <div key={profile._id} className="grid grid-cols-7 items-center px-4 h-[62px] border-t border-white/5 text-[10px] bg-orange-500/5">
                    <span className="font-medium text-white">#{profile._id.slice(-6).toUpperCase()}</span>
                    <div className="col-span-2 flex flex-col min-w-0">
                      <span className="text-gray-300 truncate font-bold">{profile.companyName}</span>
                      <span className="text-gray-500 truncate text-[9px]">{profile.userId?.name || 'N/A'} • {profile.userId?.email || ''}</span>
                    </div>
                    <div className="col-span-2 flex flex-col gap-0.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold w-fit ${
                        profile.plan === "Elite" ? "bg-amber-500/10 text-amber-400" :
                        profile.plan === "Premium" ? "bg-purple-500/10 text-purple-400" :
                        profile.plan === "Basic" ? "bg-blue-500/10 text-blue-400" :
                        "bg-gray-500/10 text-gray-400"
                      }`}>{profile.plan || 'Free'}</span>
                      <span className="text-gray-500 text-[9px]">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                    </div>
                    <span>
                      <span className={`px-3 py-1 rounded-md text-[9px] font-bold ${
                        profile.verificationStatus === "Verified" ? "bg-blue-600/10 text-orange-400" :
                        profile.verificationStatus === "Rejected" ? "bg-red-500/10 text-red-400" :
                        profile.verificationStatus === "Pending" ? "bg-orange-500/10 text-orange-400" :
                        "bg-gray-500/10 text-gray-400"
                      }`}>
                        {profile.verificationStatus}
                      </span>
                    </span>
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      {navigate && (
                        <button onClick={() => navigate(`/admin/partner/${profile._id}`)} className="hover:text-white transition-colors" title="View Details">
                          <Eye size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {getFilteredItems(subscribers).length === 0 && getFilteredItems(partnerProfiles).length === 0 && (
                  <p className="p-10 text-center text-slate-500 text-xs">No subscribers or partners found.</p>
                )}
              </>
            )}

            {activeMenu === "Leads" && (getFilteredItems(leads).length > 0 ? getFilteredItems(leads).map((lead) => (
              <div key={lead._id} className="grid grid-cols-7 items-center px-4 h-[62px] border-t border-white/5 text-[10px]">
                <span className="font-medium text-white">#{lead._id.slice(-6).toUpperCase()}</span>
                <span className="text-gray-300 col-span-2">{lead.name}</span>
                <div className="col-span-2 flex flex-col gap-0.5">
                  <span className="text-white font-medium truncate pr-4">{lead.project}</span>
                  <span className="text-gray-500 text-[9px]">{lead.email} | {lead.phone}</span>
                </div>
                <span>
                  <span className={`px-3 py-1 rounded-md text-[9px] ${
                    lead.status === "New" ? "bg-blue-500/10 text-blue-400" : 
                    lead.status === "Converted" ? "bg-blue-600/10 text-orange-400" : "bg-orange-500/10 text-orange-400"
                  }`}>
                    {lead.status}
                  </span>
                </span>
                <div className="flex items-center justify-end gap-3 text-gray-400">
                  <span className="text-gray-600 italic">No actions</span>
                </div>
              </div>
            )) : <p className="p-10 text-center text-slate-500 text-xs">No leads found.</p>)}

            {activeMenu === "Products" && (getFilteredItems(products).length > 0 ? getFilteredItems(products).map((product) => (
              <div key={product._id} className="grid grid-cols-7 items-center px-4 h-[62px] border-t border-white/5 text-[10px]">
                <span className="font-medium text-white">#{product._id.slice(-6).toUpperCase()}</span>
                <span className="text-gray-300 col-span-2">{product.title}</span>
                <span className="text-gray-400 col-span-2 truncate pr-2">
                  <span className="text-blue-600/80 font-medium">{product.category}</span>
                  {product.subcategory && <span className="text-white/40"> &gt; {product.subcategory}</span>}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-white font-medium">{product.mobileNumber || 'No Phone'}</span>
                  <span className="text-[8px] text-gray-400">{product.location || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-end gap-3 text-gray-400">
                  {product.image && (
                    <a href={product.image} target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors" title="View Image">
                      <Eye size={14} />
                    </a>
                  )}
                  <button onClick={() => handleEditClick(product)} className="hover:text-blue-400 transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(product._id, "products")} className="hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            )) : <p className="p-10 text-center text-slate-500 text-xs">No products found.</p>)}

            {activeMenu === "Sub Categories" && (getFilteredItems(categories).length > 0 ? getFilteredItems(categories).map((cat) => (
              <div key={cat._id} className="grid grid-cols-7 items-center px-4 h-[62px] border-t border-white/5 text-[10px]">
                <span className="font-medium text-white">#{cat._id.slice(-6).toUpperCase()}</span>
                <span className="text-gray-300 col-span-2">{cat.name}</span>
                <span className="text-gray-400 col-span-2 truncate pr-4">{cat.parentCategory?.title || 'No Parent'}</span>
                <span className="px-3 py-1 rounded-md bg-blue-600/10 text-orange-400 text-[9px] w-fit">Active</span>
                <div className="flex items-center justify-end gap-3 text-gray-400">
                  <button onClick={() => handleEditClick(cat)} className="hover:text-blue-400 transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(cat._id, "categories")} className="hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            )) : <p className="p-10 text-center text-slate-500 text-xs">No subcategories found.</p>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableTab;