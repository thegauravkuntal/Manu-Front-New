import { X, Package } from "lucide-react";
import { useState } from "react";

const AddModal = ({
  isOpen,
  onClose,
  activeMenu,
  formData,
  setFormData,
  imageFile,
  setImageFile,
  onSubmit,
  categories = [],
  mainCategories = [],
  partnerProfiles = [],
  isSubmitting = false
}) => {
  const [descTab, setDescTab] = useState("short");
  if (!isOpen) return null;

  const removeFile = (index) => {
    if (Array.isArray(imageFile)) {
      const newFiles = imageFile.filter((_, i) => i !== index);
      setImageFile(newFiles);
    } else {
      setImageFile(null);
    }
  };

  // Find subcategories (machinery) for the selected Main Category (manufacturing)
  const filteredSubCategories = categories.filter(cat => 
    cat.parentCategory?.title === formData.category || 
    cat.parentCategory === formData.category
  );

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#020817] animate-in fade-in duration-300">
      <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#081120]">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Add New {activeMenu === "Main Categories" ? "Main Category" : activeMenu.slice(0, -1)}</h2>
        <button 
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#020817]">
        <div className="p-6 md:p-12">
          <form onSubmit={onSubmit} className="max-w-7xl mx-auto space-y-8 bg-[#081120] border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl">
            {/* SUB CATEGORY FIELDS */}
          {activeMenu === "Sub Categories" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Subcategory Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Main Category</label>
                <select 
                  value={formData.parentCategory} 
                  onChange={(e) => setFormData({...formData, parentCategory: e.target.value})} 
                  className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all"
                  required
                >
                  <option value="">Select Main Category</option>
                  {mainCategories.map((mc) => (
                    <option key={mc._id} value={mc._id}>{mc.title}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* PRODUCT / SERVICE FIELDS */}
          {(activeMenu === "Products" || activeMenu === "Main Categories") && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  {activeMenu === "Main Categories" ? "Name" : "Title"}
                </label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" required />
              </div>

              {activeMenu === "Products" && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Slug (Optional - auto-generated from title if empty)</label>
                  <input type="text" value={formData.slug || ""} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" placeholder="e.g. industrial-packaging-system" />
                </div>
              )}
              
              {activeMenu === "Products" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Main Category</label>
                      <select 
                        value={formData.category} 
                        onChange={(e) => {
                          setFormData({...formData, category: e.target.value, subcategory: ""});
                        }} 
                        className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all"
                        required
                      >
                        <option value="">Select Main Category</option>
                        {mainCategories.map((mc) => (
                          <option key={mc._id} value={mc.title}>{mc.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Sub Category</label>
                      <select 
                        value={formData.subcategory} 
                        onChange={(e) => setFormData({...formData, subcategory: e.target.value})} 
                        className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all"
                      >
                        <option value="">Select Sub Category</option>
                        {filteredSubCategories.map((sub) => (
                          <option key={sub._id} value={sub.name}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mobile Number</label>
                      <input type="text" value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Location</label>
                      <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Assigned Partner (Supplier)</label>
                    <select
                      value={formData.partnerId || ""}
                      onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                      className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all"
                      required
                    >
                      <option value="">Select Partner</option>
                      {partnerProfiles.map((p) => {
                        const userId = p.userId?._id || p.userId;
                        if (!userId) return null;
                        return (
                          <option key={userId} value={userId}>
                            {p.companyName || p.userId?.name || "Partner"} ({p.userId?.email || ""})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-2 p-1 bg-white/5 rounded-lg w-fit">
                      <button 
                        type="button"
                        onClick={() => setDescTab("short")}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${descTab === 'short' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        Short Desc
                      </button>
                      <button 
                        type="button"
                        onClick={() => setDescTab("long")}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${descTab === 'long' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        Long Desc
                      </button>
                    </div>

                    {descTab === "short" ? (
                      <div className="space-y-2 animate-in fade-in duration-300">
                        <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Short Description (min 10 characters)</label>
                        <textarea value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} minLength={10} className="w-full bg-[#0b1220] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-blue-600 outline-none transition-all min-h-[100px]" required />
                        <p className={`text-[10px] ${(formData.shortDescription?.length || 0) < 10 ? "text-amber-400" : "text-gray-500"}`}>
                          {(formData.shortDescription?.length || 0)} / 10 characters
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 animate-in fade-in duration-300">
                        <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Long Description (min 10 characters)</label>
                        <textarea value={formData.longDescription} onChange={(e) => setFormData({...formData, longDescription: e.target.value})} minLength={10} className="w-full bg-[#0b1220] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-blue-600 outline-none transition-all min-h-[150px]" required />
                        <p className={`text-[10px] ${(formData.longDescription?.length || 0) < 10 ? "text-amber-400" : "text-gray-500"}`}>
                          {(formData.longDescription?.length || 0)} / 10 characters
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeMenu === "Users" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Full Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Phone</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all">
                  <option value="user">User</option>
                  <option value="partner">Partner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          )}

          {activeMenu === "Leads" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Phone</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Project Description</label>
                <input type="text" value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Budget</label>
                  <input type="text" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" />
                </div>
              </div>
            </div>
          )}

          {activeMenu === "Orders" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Order ID</label>
                  <input type="text" placeholder="e.g. ORD-123" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Amount (₹)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Customer Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all">
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Payment Status</label>
                  <select value={formData.paymentStatus} onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all">
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeMenu === "Subscribers" && (
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email Address</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" required />
            </div>
          )}

          {/* Image Upload */}
          {["Products", "Machinery", "Main Categories"].includes(activeMenu) && (
            <div className="space-y-2 pb-4">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                {activeMenu === "Machinery" ? "Machinery Icon" : activeMenu === "Products" ? "Product Images (Multiple)" : "Image"}
              </label>
              <div className="space-y-3">
                <input 
                  type="file" 
                  multiple={activeMenu === "Products"}
                  onChange={(e) => {
                    if (activeMenu === "Products") {
                      const files = Array.from(e.target.files);
                      setImageFile(prev => Array.isArray(prev) ? [...prev, ...files] : files);
                    } else {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-orange-400 transition-all cursor-pointer" 
                />

                {/* Selected Files Preview */}
                {imageFile && (
                  <div className="space-y-2">
                    {Array.isArray(imageFile) ? (
                      <div className="grid grid-cols-2 gap-2">
                        {imageFile.map((file, idx) => (
                          <div key={idx} className="relative group bg-white/5 rounded-lg p-2 flex items-center gap-2 border border-white/5">
                            <div className="w-8 h-8 rounded bg-blue-600/20 flex items-center justify-center shrink-0">
                              <Package size={14} className="text-blue-600" />
                            </div>
                            <span className="text-[10px] text-gray-300 truncate flex-1">{file.name}</span>
                            <button 
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="text-gray-500 hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="relative group bg-white/5 rounded-lg p-2 flex items-center gap-2 border border-white/5">
                        <div className="w-8 h-8 rounded bg-blue-600/20 flex items-center justify-center shrink-0">
                          <Package size={14} className="text-blue-600" />
                        </div>
                        <span className="text-[10px] text-gray-300 truncate flex-1">{imageFile.name}</span>
                        <button 
                          type="button"
                          onClick={() => setImageFile(null)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full h-[45px] mt-4 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
              isSubmitting 
              ? "bg-gray-600 cursor-not-allowed opacity-70" 
              : "bg-orange-500 hover:bg-blue-600 shadow-orange-500/20"
            } text-white`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              `Save ${activeMenu === "Main Categories" ? "Main Category" : activeMenu.slice(0, -1)}`
            )}
          </button>
        </form>
      </div>
    </div>
  </div>
  );
};

export default AddModal;
