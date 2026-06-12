import { X, Package } from "lucide-react";
import { useState, useEffect } from "react";

// 100KB LIMIT
const MAX_FILE_SIZE = 100 * 1024; // 100KB in bytes

const EditModal = ({
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
  isSubmitting = false,
  existingImages = []
}) => {
  // 🔥 HOOKS - MUST BE BEFORE ANY EARLY RETURN
  const [descTab, setDescTab] = useState("short");
  const [imageAltTexts, setImageAltTexts] = useState({});
  const [existingImageAlts, setExistingImageAlts] = useState({});
  
  // 🔥 useEffect - BEFORE early return
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      const alts = {};
      existingImages.forEach((img, idx) => {
        alts[idx] = img.alt || "";
      });
      setExistingImageAlts(alts);
    }
  }, [existingImages, isOpen]);

  // 🔥 EARLY RETURN - AFTER ALL HOOKS
  if (!isOpen) return null;

  // Validate image size (100KB limit)
  const validateImageSize = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      alert(`Image "${file.name}" size ${(file.size / 1024).toFixed(2)}KB exceeds 100KB limit. Please compress your image.`);
      return false;
    }
    return true;
  };

  const handleImageSelect = (files) => {
    if (!files || files.length === 0) return;
    
    if (activeMenu === "Products") {
      const fileArray = Array.isArray(files) ? files : [files];
      const validFiles = fileArray.filter(validateImageSize);
      if (validFiles.length !== fileArray.length) {
        alert(`${fileArray.length - validFiles.length} file(s) skipped due to size > 100KB`);
      }
      if (validFiles.length > 0) {
        setImageFile(prev => Array.isArray(prev) ? [...prev, ...validFiles] : validFiles);
        const newAltTexts = { ...imageAltTexts };
        const startIndex = Array.isArray(imageFile) ? imageFile.length : 0;
        validFiles.forEach((file, idx) => {
          newAltTexts[startIndex + idx] = "";
        });
        setImageAltTexts(newAltTexts);
      }
    } else {
      const file = files[0] || files;
      if (validateImageSize(file)) {
        setImageFile(file);
      }
    }
  };

  const removeFile = (index) => {
    if (Array.isArray(imageFile)) {
      const newFiles = imageFile.filter((_, i) => i !== index);
      setImageFile(newFiles);
      const newAltTexts = { ...imageAltTexts };
      delete newAltTexts[index];
      const reindexed = {};
      Object.keys(newAltTexts).forEach((key, newIdx) => {
        reindexed[newIdx] = newAltTexts[key];
      });
      setImageAltTexts(reindexed);
    } else {
      setImageFile(null);
    }
  };

  const handleExistingAltChange = (index, altText) => {
    setExistingImageAlts(prev => ({
      ...prev,
      [index]: altText
    }));
  };

  const handleNewAltChange = (index, altText) => {
    setImageAltTexts(prev => ({
      ...prev,
      [index]: altText
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (activeMenu === "Products") {
      const updatedExistingImages = existingImages.map((img, idx) => ({
        url: img.url || img,
        alt: existingImageAlts[idx] || img.alt || ""
      }));
      
      const newImagesWithAlt = Array.isArray(imageFile) 
        ? imageFile.map((file, idx) => ({
            file: file,
            alt: imageAltTexts[idx] || ""
          }))
        : [];
      
      const combinedImages = {
        existing: updatedExistingImages,
        new: newImagesWithAlt
      };
      
      setFormData(prev => ({
        ...prev,
        __imagesData: combinedImages
      }));
    }
    
    onSubmit(e);
  };

  const filteredSubCategories = categories.filter(cat => 
    cat.parentCategory?.title === formData.category || 
    cat.parentCategory === formData.category
  );

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#020817] animate-in fade-in duration-300">
      <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#081120]">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Edit {activeMenu === "Main Categories" ? "Main Category" : activeMenu.slice(0, -1)}</h2>
        <button 
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#020817]">
        <div className="p-6 md:p-12">
          <form onSubmit={handleFormSubmit} className="max-w-7xl mx-auto space-y-8 bg-[#081120] border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl">
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
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all">
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                  <option value="Nurturing">Nurturing</option>
                </select>
              </div>
            </div>
          )}

          {activeMenu === "Orders" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Order ID</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" required />
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

          {activeMenu === "Partners" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Company Name</label>
                <input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Website</label>
                <input type="text" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Address</label>
                <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-blue-600 outline-none transition-all min-h-[80px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Plan</label>
                  <select 
                    value={formData.plan} 
                    onChange={(e) => {
                      const newPlan = e.target.value;
                      let newExpiry = formData.subscriptionExpiry;
                      
                      const durations = { 'Basic': 3, 'Premium': 6, 'Elite': 12 };
                      if (durations[newPlan]) {
                        const date = new Date();
                        date.setMonth(date.getMonth() + durations[newPlan]);
                        newExpiry = date.toISOString().split('T')[0];
                      } else if (newPlan === 'Free') {
                        newExpiry = "";
                      }
                      
                      setFormData({...formData, plan: newPlan, subscriptionExpiry: newExpiry});
                    }} 
                    className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all"
                  >
                    <option value="Free">Free</option>
                    <option value="Basic">Basic (3 Months)</option>
                    <option value="Premium">Premium (6 Months)</option>
                    <option value="Elite">Elite (12 Months)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all">
                    <option value="Not Submitted">Not Submitted</option>
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Subscription Expiry</label>
                <input 
                  type="date" 
                  value={formData.subscriptionExpiry ? new Date(formData.subscriptionExpiry).toISOString().split('T')[0] : ""} 
                  onChange={(e) => setFormData({...formData, subscriptionExpiry: e.target.value})} 
                  className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all" 
                />
              </div>
            </div>
          )}

          {activeMenu === "Subscribers" && (
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-[#0b1220] border border-white/10 rounded-xl h-[45px] px-4 text-sm text-white focus:border-blue-600 outline-none transition-all">
                <option value="Active">Active</option>
                <option value="Unsubscribed">Unsubscribed</option>
              </select>
            </div>
          )}

          {/* Image Upload with Size Validation and Alt Text */}
          {["Products", "Sub Categories", "Main Categories"].includes(activeMenu) && (
            <div className="space-y-2 pb-4">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                {activeMenu === "Sub Categories" ? "Subcategory Icon" : activeMenu === "Products" ? "Product Images (Multiple)" : "Image"}
              </label>
              <div className="space-y-3">
                <div className="text-xs text-gray-500">
                  ⚠️ Image size must be less than <span className="text-orange-400 font-bold">100KB</span>
                </div>
                
                {/* Existing Images with Alt Text Inputs */}
                {existingImages && existingImages.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <div className="text-[11px] text-gray-400 font-medium">Existing Images</div>
                    {existingImages.map((img, idx) => (
                      <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          {typeof img === 'string' ? (
                            <img src={img} alt="Product" className="w-12 h-12 rounded object-cover" />
                          ) : (
                            <img src={img.url} alt={img.alt || "Product"} className="w-12 h-12 rounded object-cover" />
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] text-gray-300 truncate block">Image {idx + 1}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <label className="text-[10px] text-gray-400 block mb-1">Alt Text (for SEO)</label>
                          <input
                            type="text"
                            value={existingImageAlts[idx] || (typeof img === 'string' ? "" : img.alt) || ""}
                            onChange={(e) => handleExistingAltChange(idx, e.target.value)}
                            placeholder="Describe the image for SEO and accessibility"
                            className="w-full text-xs bg-[#0f1724] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                          />
                          <p className="text-[8px] text-gray-500 mt-1">Helps search engines understand the image</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add New Images Section */}
                <div className="text-[11px] text-gray-400 font-medium mt-2">Add New Images</div>
                <input 
                  type="file" 
                  multiple={activeMenu === "Products"}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleImageSelect(e.target.files)}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-orange-400 transition-all cursor-pointer" 
                />

                {/* New Selected Files Preview with Alt Text Input */}
                {imageFile && (
                  <div className="space-y-3 mt-3">
                    <div className="text-[10px] text-gray-400">New images ({Array.isArray(imageFile) ? imageFile.length : 1})</div>
                    {Array.isArray(imageFile) ? (
                      <div className="space-y-3">
                        {imageFile.map((file, idx) => (
                          <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-12 h-12 rounded bg-blue-600/20 flex items-center justify-center shrink-0">
                                <Package size={20} className="text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[11px] text-gray-300 truncate block">{file.name}</span>
                                <span className="text-[9px] text-gray-500">{(file.size / 1024).toFixed(1)}KB</span>
                              </div>
                              <button 
                                type="button"
                                onClick={() => removeFile(idx)}
                                className="text-gray-500 hover:text-red-500 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <div className="mt-2">
                              <label className="text-[10px] text-gray-400 block mb-1">Alt Text (for SEO)</label>
                              <input
                                type="text"
                                value={imageAltTexts[idx] || ""}
                                onChange={(e) => handleNewAltChange(idx, e.target.value)}
                                placeholder="Describe the image for SEO and accessibility"
                                className="w-full text-xs bg-[#0f1724] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                              />
                              <p className="text-[8px] text-gray-500 mt-1">Helps search engines understand the image</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded bg-blue-600/20 flex items-center justify-center shrink-0">
                            <Package size={20} className="text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] text-gray-300 truncate block">{imageFile.name}</span>
                            <span className="text-[9px] text-gray-500">{(imageFile.size / 1024).toFixed(1)}KB</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setImageFile(null)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="mt-2">
                          <label className="text-[10px] text-gray-400 block mb-1">Alt Text (for SEO)</label>
                          <input
                            type="text"
                            value={imageAltTexts[0] || ""}
                            onChange={(e) => handleNewAltChange(0, e.target.value)}
                            placeholder="Describe the image for SEO and accessibility"
                            className="w-full text-xs bg-[#0f1724] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                          />
                          <p className="text-[8px] text-gray-500 mt-1">Helps search engines understand the image</p>
                        </div>
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
                Updating...
              </>
            ) : (
              `Update ${activeMenu === "Main Categories" ? "Main Category" : activeMenu.slice(0, -1)}`
            )}
          </button>
        </form>
      </div>
    </div>
  </div>
  );
};

export default EditModal;