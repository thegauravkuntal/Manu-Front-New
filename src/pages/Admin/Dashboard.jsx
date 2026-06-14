import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Briefcase,
  Package,
  Folder,
  ShoppingCart,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  MoreVertical,
  Menu,
  Search,
  Bell,
  ChevronDown,
  IndianRupee,
  Plus,
  X,
  Edit2,
  Trash2,
  ShieldCheck,
  CheckCircle,
  XCircle,
  ExternalLink,
  FileText,
  Eye,
  Handshake,
  User,
  Clock,
  Star,
  MapPin,
  Factory,
  Image,
  BarChart3,
  RefreshCw,
  Navigation
} from "lucide-react";
import GlobalSearchModal from "./components/GlobalSearchModal";
import NotificationsDropdown from "./components/NotificationsDropdown";
import EditModal from "./components/EditModal";
import AddModal from "./components/AddModal";
import Sidebar from "./components/Sidebar";
import AdminHeader from "./components/AdminHeader";
import OverviewTab from "./components/OverviewTab";
import VerificationsTab from "./components/VerificationsTab";
import ExpirationsTab from "./components/ExpirationsTab";
import ProfileTab from "./components/ProfileTab";
import TableTab from "./components/TableTab";
import PartnersTab from "./components/PartnersTab";
import FooterTab from "./components/FooterTab";
import Toast from "../../components/Toast";
import FAQTab from "./components/FAQTab";
import TestimonialTab from "./components/TestimonialTab";
import CityTab from "./components/CityTab";
import IndustryTab from "./components/IndustryTab";
import SliderTab from "./components/SliderTab";
import SEOTab from "./components/SEOTab";
import NavbarTab from "./components/NavbarTab";
import TopbarTab from "./components/TopbarTab";
import HeroTab from "./components/HeroTab";
import BannerGuideTab from "./components/BannerGuideTab";
import AnalyticsTab from "./components/AnalyticsTab";
import RedirectTab from "./components/RedirectTab";
import ProductSEOModal from "./components/ProductSEOModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ID");
  const [realStats, setRealStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCategoryNames, setProductCategoryNames] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [partnerProfiles, setPartnerProfiles] = useState([]);
  const [showMainCategory, setShowMainCategory] = useState(true);
  const [navbarId, setNavbarId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSEOModalOpen, setIsSEOModalOpen] = useState(false);
  const [seoProduct, setSeoProduct] = useState(null);
  const [isSEOUpdating, setIsSEOUpdating] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    name: "",
    email: "",
    phone: "",
    category: "",
    subcategory: "",
    subcategories: "",
    parentCategory: "",
    price: "",
    location: "Delhi",
    description: "",
    shortDescription: "",
    longDescription: "",
    mobileNumber: "",
    partnerId: "",
    status: "Active",
    role: "user",
    project: "",
    budget: "",
    notes: "",
    rating: "0",
    tag: "",
    paymentStatus: "Unpaid"
  });
  const [adminProfile, setAdminProfile] = useState({
    id: "",
    name: "Admin",
    email: "admin@example.com",
    role: "admin"
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Lead Received", message: "Rahul Verma submitted a query for EV Component Prototyping", time: "5 mins ago", read: false, type: "Leads" },
    { id: 2, title: "New Order Placed", message: "Order #ORD-7729 placed by Acme Corp", time: "1 hour ago", read: false, type: "Orders" },
    { id: 3, title: "Partner Verification Request", message: "Vikram Joshi requested seller verification", time: "2 hours ago", read: true, type: "Verifications" },
  ]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  const getFilteredItems = useCallback((items) => {
    if (!items || items.length === 0) return [];
    if (!search || search.trim() === "") return items;

    const query = search.toLowerCase().trim();

    return items.filter((item) => {
      if (filter === "ID") {
        const id = item._id || item.id || item.orderId || "";
        return id.toLowerCase().includes(query);
      }
      if (filter === "Name") {
        const name = item.name || item.title || item.customer?.name || item.author || item.companyName || "";
        return name.toLowerCase().includes(query);
      }
      if (filter === "Category") {
        const category = item.category || item.industry || "";
        return category.toLowerCase().includes(query);
      }
      if (filter === "Status") {
        const status = item.status || item.role || item.verificationStatus || "";
        return status.toLowerCase().includes(query);
      }

      const searchFields = [
        item._id, item.id, item.orderId, item.name, item.title, item.email,
        item.companyName, item.userId?.name, item.userId?.email,
        item.customer?.name, item.customer?.email, item.category,
        item.status, item.role, item.verificationStatus, item.message, item.review
      ];
      return searchFields.some(field => field && String(field).toLowerCase().includes(query));
    });
  }, [search, filter]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}` };

      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (savedUser.id || savedUser._id) {
        setAdminProfile({
          id: savedUser.id || savedUser._id,
          name: savedUser.name || "Admin",
          email: savedUser.email || "admin@example.com",
          role: savedUser.role || "admin"
        });
      }

      const [
        statsRes, usersRes, servicesRes, subsRes, leadsRes,
        productsRes, catRes, partnersRes, navbarRes
      ] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers }),
        fetch(`${API_URL}/admin/users`, { headers }),
        fetch(`${API_URL}/admin/services`, { headers }),
        fetch(`${API_URL}/admin/subscribers`, { headers }),
        fetch(`${API_URL}/leads`, { headers }),
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/admin/partner-profiles`, { headers }),
        fetch(`${API_URL}/navbar`)
      ]);

      const [statsData, usersData, servicesData, subsData, leadsData,
        productsData, catData, partnersData, navbarData] = await Promise.all([
        statsRes.json(), usersRes.json(), servicesRes.json(), subsRes.json(), leadsRes.json(),
        productsRes.json(), catRes.json(), partnersRes.json(), navbarRes.json()
      ]);

      if (statsData.success) setRealStats(statsData.stats);
      if (usersData.success) setUsers(usersData.users || []);
      if (servicesData.success) setServices(servicesData.services || []);
      if (subsData.success) setSubscribers(subsData.subscribers || []);
      if (leadsData.success) setLeads(leadsData.leads || []);
      if (productsData.success) {
        setProducts(productsData.products || []);
        const seen = new Set();
        const names = [];
        (productsData.products || []).forEach(p => {
          const name = p.category || 'Uncategorized';
          if (!seen.has(name)) { seen.add(name); names.push(name); }
        });
        setProductCategoryNames(names);
      }
      if (catData.success) setCategories(catData.categories || []);
      if (partnersData.success) setPartnerProfiles(partnersData.profiles || []);
      if (navbarData.success && navbarData.navbar) {
        setShowMainCategory(navbarData.navbar.showMainCategory !== false);
        if (navbarData.navbar._id) setNavbarId(navbarData.navbar._id);
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleMainCategoryVisibility = async () => {
    try {
      if (!navbarId) return;
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/navbar/${navbarId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ showMainCategory: !showMainCategory })
      });
      const data = await res.json();
      if (data.success) setShowMainCategory(!showMainCategory);
      else alert(data.msg || "Failed to update visibility.");
    } catch (err) { console.error("Toggle visibility error:", err); }
  };

  const handleVerification = async (id, status) => {
    if (window.confirm(`Are you sure you want to mark this seller as ${status}?`)) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/admin/partner-profiles/${id}/verify`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ status })
        });
        const data = await res.json();
        if (data.success) setPartnerProfiles(partnerProfiles.map(p => p._id === id ? data.profile : p));
        else alert(data.msg || "Failed to update status.");
      } catch (err) { console.error("Verification error:", err); }
    }
  };

  const handleDelete = async (id, endpoint) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) fetchData();
        else alert(data.msg || "Failed to delete item.");
      } catch (err) { console.error("Delete error:", err); }
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || item.project || "",
      slug: item.slug || "",
      name: item.name || item.author || item.customer?.name || "",
      email: item.email || item.customer?.email || "",
      phone: item.phone || "",
      category: item.category || "",
      subcategory: item.subcategory || "",
      subcategories: item.subcategories ? item.subcategories.join(", ") : "",
      parentCategory: item.parentCategory?._id || item.parentCategory || "",
      price: item.price || "",
      location: item.location || "Delhi",
      description: item.description || item.desc || item.message || item.review || item.notes || "",
      shortDescription: item.shortDescription || "",
      longDescription: item.longDescription || "",
      mobileNumber: item.mobileNumber || "",
      partnerId: item.partnerId?._id || item.partnerId || "",
      status: item.status || item.verificationStatus || "Active",
      role: item.role || "user",
      project: item.project || "",
      budget: item.budget || "",
      notes: item.notes || "",
      rating: item.rating || "0",
      tag: item.tag || "",
      paymentStatus: item.paymentStatus || "Unpaid",
      companyName: item.companyName || "",
      address: item.address || "",
      website: item.website || "",
      plan: item.plan || "Free",
      subscriptionExpiry: item.subscriptionExpiry || "",
      isBlocked: item.isBlocked || false
    });
    setImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleSEOClick = (product) => {
    setSeoProduct(product);
    setIsSEOModalOpen(true);
  };

  const handleSEOSubmit = async (productId, seoData) => {
    if (isSEOUpdating) return;
    try {
      setIsSEOUpdating(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(seoData)
      });
      const data = await res.json();
      if (data.success) {
        setIsSEOModalOpen(false);
        setSeoProduct(null);
        fetchData();
        setToast({ message: "SEO meta data updated successfully!", type: "success" });
      } else {
        alert(data.msg || "Error updating SEO data");
      }
    } catch (err) {
      console.error("SEO Update Error:", err);
      alert("Error updating SEO data");
    } finally {
      setIsSEOUpdating(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const endpoint = activeMenu === "Products" ? "products" : 
                      activeMenu === "Sub Categories" ? "categories" :
                      activeMenu === "Main Categories" ? "manufacturing" :
                      activeMenu === "Users" ? "admin/users" :
                      activeMenu === "Orders" ? "admin/orders" :
                      activeMenu === "Subscribers" ? "admin/subscribers" :
                      activeMenu === "Partners" ? "admin/partner-profiles" :
                      activeMenu === "Leads" ? "leads" : "";
      
      if (!endpoint) return;

      let fetchOptions = { method: "PUT", headers: { "Authorization": `Bearer ${token}` } };

      if (["Products", "Sub Categories", "Main Categories"].includes(activeMenu)) {
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
          if (formData[key] !== "" && formData[key] !== null && formData[key] !== undefined) {
            formDataObj.append(key, formData[key]);
          }
        });
        if (imageFile) {
          if (Array.isArray(imageFile)) imageFile.forEach(file => formDataObj.append("image", file));
          else formDataObj.append("image", imageFile);
        }
        fetchOptions.body = formDataObj;
      } else {
        fetchOptions.headers["Content-Type"] = "application/json";
        fetchOptions.body = JSON.stringify(formData);
      }

      const res = await fetch(`${API_URL}/${endpoint}/${editingItem._id}`, fetchOptions);
      const data = await res.json();
      if (data.success) {
        setIsEditModalOpen(false);
        setEditingItem(null);
        fetchData();
        setToast({ message: "Updated successfully!", type: "success" });
      } else alert(data.msg || "Error updating item");
    } catch (err) { console.error("Edit Error:", err); }
    finally { setIsSubmitting(false); }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const endpoint = activeMenu === "Products" ? "products" : 
                      activeMenu === "Sub Categories" ? "categories" :
                      activeMenu === "Main Categories" ? "manufacturing" :
                      activeMenu === "Users" ? "admin/users" : "";
      
      if (!endpoint) { setIsSubmitting(false); return; }

      let fetchOptions = { method: "POST", headers: { "Authorization": `Bearer ${token}` } };

      if (["Products", "Sub Categories", "Main Categories"].includes(activeMenu)) {
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
          if (formData[key] !== "" && formData[key] !== null && formData[key] !== undefined) {
            formDataObj.append(key, formData[key]);
          }
        });
        if (imageFile) {
          if (Array.isArray(imageFile)) imageFile.forEach(file => formDataObj.append("image", file));
          else formDataObj.append("image", imageFile);
        }
        fetchOptions.body = formDataObj;
      } else {
        fetchOptions.headers["Content-Type"] = "application/json";
        fetchOptions.body = JSON.stringify(formData);
      }

      const res = await fetch(`${API_URL}/${endpoint}`, fetchOptions);
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setFormData({ title: "", slug: "", name: "", email: "", phone: "", category: "", subcategory: "", subcategories: "", price: "", location: "Delhi", description: "", shortDescription: "", longDescription: "", mobileNumber: "", partnerId: "", status: "Active", role: "user", project: "", budget: "", notes: "", rating: "0", tag: "", paymentStatus: "Unpaid" });
        setImageFile(null);
        fetchData();
        setToast({ message: `${activeMenu.slice(0, -1)} added successfully!`, type: "success" });
      } else alert(data.msg || "Error adding item");
    } catch (err) { console.error("Add Error:", err); }
    finally { setIsSubmitting(false); }
  };

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { name: "Users", icon: <Users size={16} /> },
    { name: "Partners", icon: <Handshake size={16} /> },
    { name: "Leads", icon: <Briefcase size={16} /> },
    { name: "Main Categories", icon: <Briefcase size={16} /> },
    { name: "Sub Categories", icon: <Folder size={16} /> },
    { name: "Products", icon: <Package size={16} /> },
    { name: "Subscribers", icon: <Mail size={16} /> },
    { name: "Cities", icon: <MapPin size={16} /> },
    { name: "Industries", icon: <Factory size={16} /> },
    { name: "Testimonials", icon: <Star size={16} /> },
    { name: "Banner Slider", icon: <Image size={16} /> },
    { name: "Hero", icon: <LayoutDashboard size={16} /> },
    { name: "Topbar", icon: <Menu size={16} /> },
    { name: "Navbar", icon: <Navigation size={16} /> },
    { name: "SEO Manager", icon: <Search size={16} /> },
    { name: "301 Redirects", icon: <RefreshCw size={16} /> },
    { name: "Banner Guide", icon: <Image size={16} /> },
    { name: "Analytics", icon: <BarChart3 size={16} /> },
    { name: "Profile", icon: <User size={16} /> },
    { name: "Verifications", icon: <ShieldCheck size={16} /> },
    { name: "Expirations", icon: <Clock size={16} /> },
    { name: "Footer", icon: <FileText size={16} /> },
    { name: "FAQ", icon: <MessageSquare size={16} /> },
  ];

  const stats = [
    { title: "Total Users", value: realStats?.totalUsers || "1,245", growth: "12.5%", icon: <Users size={15} />, bg: "from-blue-600 to-orange-600" },
    { title: "Total Products", value: realStats?.totalProducts || "320", growth: "8.2%", icon: <Package size={15} />, bg: "from-purple-500 to-violet-700" },
    { title: "Total Revenue", value: realStats ? `₹${(realStats.totalRevenue / 100000).toFixed(1)}L` : "₹1,25,430", growth: "22.4%", icon: <IndianRupee size={15} />, bg: "from-blue-500 to-cyan-700" },
    { title: "Total Leads", value: realStats?.totalLeads || "890", growth: "18.7%", icon: <Users size={15} />, bg: "from-orange-400 to-orange-600" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#020817] text-white">
      <Sidebar sidebarOpen={sidebarOpen} menuItems={menuItems} activeMenu={activeMenu} setActiveMenu={setActiveMenu} adminProfile={adminProfile} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} setShowGlobalSearch={setShowGlobalSearch} showNotifications={showNotifications} setShowNotifications={setShowNotifications} notifications={notifications} setNotifications={setNotifications} setActiveMenu={setActiveMenu} adminProfile={adminProfile} />
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          {activeMenu === "Dashboard" && (<OverviewTab stats={stats} setActiveMenu={setActiveMenu} leads={leads} />)}
          
          {activeMenu !== "Dashboard" && activeMenu !== "Profile" && activeMenu !== "Verifications" && activeMenu !== "Partners" && activeMenu !== "Expirations" && activeMenu !== "Footer" && activeMenu !== "FAQ" && activeMenu !== "Testimonials" && activeMenu !== "Cities" && activeMenu !== "Industries" && activeMenu !== "Banner Slider" && activeMenu !== "Hero" && activeMenu !== "Topbar" && activeMenu !== "Navbar" && activeMenu !== "SEO Manager" && activeMenu !== "301 Redirects" && activeMenu !== "Banner Guide" && activeMenu !== "Analytics" && (
            <TableTab activeMenu={activeMenu} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} setIsAddModalOpen={setIsAddModalOpen} getFilteredItems={getFilteredItems} handleEditClick={handleEditClick} handleDelete={handleDelete} showMainCategory={showMainCategory} navbarId={navbarId} onToggleMainCategoryVisibility={handleToggleMainCategoryVisibility} users={users} services={services} subscribers={subscribers} leads={leads} products={products} categories={categories} productCategoryNames={productCategoryNames} partnerProfiles={partnerProfiles} navigate={navigate} handleSEOClick={handleSEOClick} />
          )}
          
          {activeMenu === "Partners" && (<PartnersTab partnerProfiles={partnerProfiles} getFilteredItems={getFilteredItems} navigate={navigate} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} onRefresh={fetchData} handleEditClick={handleEditClick} />)}
          {activeMenu === "Verifications" && (<VerificationsTab partnerProfiles={partnerProfiles} getFilteredItems={getFilteredItems} handleVerification={handleVerification} navigate={navigate} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} />)}
          {activeMenu === "Expirations" && (<ExpirationsTab partnerProfiles={partnerProfiles} navigate={navigate} />)}
          {activeMenu === "Footer" && (<FooterTab onRefresh={fetchData} />)}
          {activeMenu === "FAQ" && (<FAQTab onRefresh={fetchData} />)}
          {activeMenu === "Testimonials" && (<TestimonialTab onRefresh={fetchData} />)}
          {activeMenu === "Cities" && (<CityTab onRefresh={fetchData} />)}
          {activeMenu === "Industries" && (<IndustryTab onRefresh={fetchData} />)}
          {activeMenu === "Banner Slider" && (<SliderTab onRefresh={fetchData} />)}
          {activeMenu === "Hero" && (<HeroTab onRefresh={fetchData} />)}
          {activeMenu === "Topbar" && (<TopbarTab onRefresh={fetchData} />)}
          {activeMenu === "Navbar" && (<NavbarTab onRefresh={fetchData} />)}
          {activeMenu === "SEO Manager" && (<SEOTab onRefresh={fetchData} />)}
          {activeMenu === "301 Redirects" && (<RedirectTab onRefresh={fetchData} />)}
          {activeMenu === "Banner Guide" && (<BannerGuideTab />)}
          {activeMenu === "Analytics" && (<AnalyticsTab />)}
          {activeMenu === "Profile" && (<ProfileTab adminProfile={adminProfile} setAdminProfile={setAdminProfile} />)}
        </div>
      </main>

      <EditModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setImageFile(null); }} activeMenu={activeMenu} formData={formData} setFormData={setFormData} imageFile={imageFile} setImageFile={setImageFile} onSubmit={handleEditSubmit} categories={categories} mainCategories={services} partnerProfiles={partnerProfiles} isSubmitting={isSubmitting} />
      <AddModal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setImageFile(null); }} activeMenu={activeMenu} formData={formData} setFormData={setFormData} imageFile={imageFile} setImageFile={setImageFile} onSubmit={handleAddSubmit} categories={categories} mainCategories={services} partnerProfiles={partnerProfiles} isSubmitting={isSubmitting} />
      <ProductSEOModal isOpen={isSEOModalOpen} onClose={() => { setIsSEOModalOpen(false); setSeoProduct(null); }} product={seoProduct} onSubmit={handleSEOSubmit} isSubmitting={isSEOUpdating} />

      <GlobalSearchModal isOpen={showGlobalSearch} onClose={() => { setShowGlobalSearch(false); setGlobalSearchQuery(""); }} searchQuery={globalSearchQuery} setSearchQuery={setGlobalSearchQuery} menuItems={menuItems} users={users} leads={leads} products={products} setActiveMenu={setActiveMenu} handleEditClick={handleEditClick} />

      {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />)}
    </div>
  );
};

export default Dashboard;