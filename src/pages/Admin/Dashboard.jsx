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
  Clock
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
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Lead Received", message: "Rahul Verma submitted a query for EV Component Prototyping", time: "5 mins ago", read: false, type: "Leads" },
    { id: 2, title: "New Order Placed", message: "Order #ORD-7729 placed by Acme Corp", time: "1 hour ago", read: false, type: "Orders" },
    { id: 3, title: "Partner Verification Request", message: "Vikram Joshi requested seller verification", time: "2 hours ago", read: true, type: "Verifications" },
  ]);

  const API_URL = import.meta.env.VITE_API_URL || "https://manu-back-bpob.onrender.com/api";

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

      // Fallback Search
      const searchFields = [
        item._id,
        item.id,
        item.orderId,
        item.name,
        item.title,
        item.email,
        item.companyName,
        item.userId?.name,
        item.userId?.email,
        item.customer?.name,
        item.customer?.email,
        item.category,
        item.status,
        item.role,
        item.verificationStatus,
        item.message,
        item.review
      ];
      return searchFields.some(field => field && String(field).toLowerCase().includes(query));
    });
  }, [search, filter]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}` };

      // Admin Profile from local storage
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (savedUser.id || savedUser._id) {
        setAdminProfile({
          id: savedUser.id || savedUser._id,
          name: savedUser.name || "Admin",
          email: savedUser.email || "admin@example.com",
          role: savedUser.role || "admin"
        });
      }

      // Parallel fetching
      const [
        statsRes,
        usersRes,
        servicesRes,
        subsRes,
        leadsRes,
        productsRes,
        catRes,
        partnersRes,
        navbarRes
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

      const [
        statsData,
        usersData,
        servicesData,
        subsData,
        leadsData,
        productsData,
        catData,
        partnersData,
        navbarData
      ] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        servicesRes.json(),
        subsRes.json(),
        leadsRes.json(),
        productsRes.json(),
        catRes.json(),
        partnersRes.json(),
        navbarRes.json()
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
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ showMainCategory: !showMainCategory })
      });
      const data = await res.json();
      if (data.success) {
        setShowMainCategory(!showMainCategory);
      } else {
        alert(data.msg || "Failed to update visibility.");
      }
    } catch (err) {
      console.error("Toggle visibility error:", err);
    }
  };

  const handleVerification = async (id, status) => {
    if (window.confirm(`Are you sure you want to mark this seller as ${status}?`)) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/admin/partner-profiles/${id}/verify`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({ status })
        });
        const data = await res.json();
        if (data.success) {
          setPartnerProfiles(partnerProfiles.map(p => p._id === id ? data.profile : p));
        } else {
          alert(data.msg || "Failed to update status.");
        }
      } catch (err) {
        console.error("Verification error:", err);
      }
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
        if (data.success) {
          fetchData();
        } else {
          alert(data.msg || "Failed to delete item.");
        }
      } catch (err) {
        console.error("Delete error:", err);
      }
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem || isSubmitting) return;

    if (activeMenu === "Products") {
      const shortLen = (formData.shortDescription || "").trim().length;
      const longLen = (formData.longDescription || "").trim().length;
      if (shortLen < 10) {
        alert(`Short description must be at least 10 characters (you have ${shortLen}).`);
        return;
      }
      if (longLen < 10) {
        alert(`Long description must be at least 10 characters (you have ${longLen}).`);
        return;
      }
    }

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

      let fetchOptions = {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      };

      if (["Products", "Sub Categories", "Main Categories"].includes(activeMenu)) {
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
          if (formData[key] !== "" && formData[key] !== null && formData[key] !== undefined) {
             formDataObj.append(key, formData[key]);
          }
        });
        if (imageFile) {
          if (Array.isArray(imageFile)) {
            imageFile.forEach(file => formDataObj.append("image", file));
          } else {
            formDataObj.append("image", imageFile);
          }
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
      } else {
        alert(data.msg || "Error updating item");
      }
    } catch (err) {
      console.error("Edit Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (activeMenu === "Products") {
      const shortLen = (formData.shortDescription || "").trim().length;
      const longLen = (formData.longDescription || "").trim().length;
      if (shortLen < 10) {
        alert(`Short description must be at least 10 characters (you have ${shortLen}).`);
        return;
      }
      if (longLen < 10) {
        alert(`Long description must be at least 10 characters (you have ${longLen}).`);
        return;
      }
      if (!imageFile || (Array.isArray(imageFile) && imageFile.length === 0)) {
        alert("Please upload at least one product image.");
        return;
      }
      if (!formData.partnerId) {
        alert("Please select an assigned partner (supplier).");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const endpoint = activeMenu === "Products" ? "products" : 
                      activeMenu === "Sub Categories" ? "categories" :
                       activeMenu === "Main Categories" ? "manufacturing" :
                      activeMenu === "Users" ? "admin/users" : "";
      
      if (!endpoint) {
        setIsSubmitting(false);
        return;
      }

      let fetchOptions = {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      };

      if (["Products", "Sub Categories", "Main Categories"].includes(activeMenu)) {
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
          if (formData[key] !== "" && formData[key] !== null && formData[key] !== undefined) {
             formDataObj.append(key, formData[key]);
          }
        });
        if (imageFile) {
          if (Array.isArray(imageFile)) {
            imageFile.forEach(file => formDataObj.append("image", file));
          } else {
            formDataObj.append("image", imageFile);
          }
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
        setFormData({ 
          title: "", 
          slug: "",
          name: "", 
          email: "", 
          phone: "",
          category: "", 
          subcategory: "", 
          subcategories: "", 
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
        setImageFile(null);
        fetchData();
      } else {
        alert(data.msg || "Error adding item");
      }
    } catch (err) {
      console.error("Add Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={16} />,
    },
    {
      name: "Users",
      icon: <Users size={16} />,
    },
    {
      name: "Partners",
      icon: <Handshake size={16} />,
    },
    {
      name: "Leads",
      icon: <Briefcase size={16} />,
    },
    {
      name: "Main Categories",
      icon: <Briefcase size={16} />,
    },
    {
      name: "Sub Categories",
      icon: <Folder size={16} />,
    },
    {
      name: "Products",
      icon: <Package size={16} />,
    },
    {
      name: "Subscribers",
      icon: <Mail size={16} />,
    },
    {
      name: "Profile",
      icon: <User size={16} />,
    },
{
      name: "Verifications",
      icon: <ShieldCheck size={16} />,
    },
    {
      name: "Expirations",
      icon: <Clock size={16} />,
    },
  ];

  const stats = [
    {
      title: "Total Users",
      value: realStats?.totalUsers || "1,245",
      growth: "12.5%",
      icon: <Users size={15} />,
      bg: "from-blue-600 to-orange-600",
    },
    {
      title: "Total Products",
      value: realStats?.totalProducts || "320",
      growth: "8.2%",
      icon: <Package size={15} />,
      bg: "from-purple-500 to-violet-700",
    },
    {
      title: "Total Revenue",
      value: realStats ? `₹${(realStats.totalRevenue / 100000).toFixed(1)}L` : "₹1,25,430",
      growth: "22.4%",
      icon: <IndianRupee size={15} />,
      bg: "from-blue-500 to-cyan-700",
    },
    {
      title: "Total Leads",
      value: realStats?.totalLeads || "890",
      growth: "18.7%",
      icon: <Users size={15} />,
      bg: "from-orange-400 to-orange-600",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#020817] text-white">

      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        menuItems={menuItems}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        adminProfile={adminProfile}
      />

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <AdminHeader
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          setShowGlobalSearch={setShowGlobalSearch}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          notifications={notifications}
          setNotifications={setNotifications}
          setActiveMenu={setActiveMenu}
          adminProfile={adminProfile}
        />

        {/* CONTENT */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col">

          {/* DASHBOARD PAGE */}
          {activeMenu === "Dashboard" && (
            <OverviewTab
              stats={stats}
              setActiveMenu={setActiveMenu}
              leads={leads}
            />
          )}

          {/* OTHER PAGES */}
          {activeMenu !== "Dashboard" && activeMenu !== "Profile" && activeMenu !== "Verifications" && activeMenu !== "Partners" && activeMenu !== "Expirations" && (
            <TableTab
              activeMenu={activeMenu}
              search={search}
              setSearch={setSearch}
              filter={filter}
              setFilter={setFilter}
              setIsAddModalOpen={setIsAddModalOpen}
              getFilteredItems={getFilteredItems}
              handleEditClick={handleEditClick}
              handleDelete={handleDelete}
              showMainCategory={showMainCategory}
              navbarId={navbarId}
              onToggleMainCategoryVisibility={handleToggleMainCategoryVisibility}
              users={users}
              services={services}
              subscribers={subscribers}
              leads={leads}
              products={products}
              categories={categories}
              productCategoryNames={productCategoryNames}
              partnerProfiles={partnerProfiles}
              navigate={navigate}
            />
          )}
          {/* PARTNERS PAGE */}
          {activeMenu === "Partners" && (
            <PartnersTab
              partnerProfiles={partnerProfiles}
              getFilteredItems={getFilteredItems}
              navigate={navigate}
              search={search}
              setSearch={setSearch}
              filter={filter}
              setFilter={setFilter}
              onRefresh={fetchData}
              handleEditClick={handleEditClick}
            />
          )}
          {/* VERIFICATIONS PAGE */}
          {activeMenu === "Verifications" && (
            <VerificationsTab
              partnerProfiles={partnerProfiles}
              getFilteredItems={getFilteredItems}
              handleVerification={handleVerification}
              navigate={navigate}
              search={search}
              setSearch={setSearch}
              filter={filter}
              setFilter={setFilter}
            />
          )}
          {/* EXPIRATIONS PAGE */}
          {activeMenu === "Expirations" && (
            <ExpirationsTab
              partnerProfiles={partnerProfiles}
              navigate={navigate}
            />
          )}
          {/* PROFILE PAGE */}
          {activeMenu === "Profile" && (
            <ProfileTab
              adminProfile={adminProfile}
              setAdminProfile={setAdminProfile}
            />
          )}
        </div>
      </main>

      {/* EDIT MODAL */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setImageFile(null); }}
        activeMenu={activeMenu}
        formData={formData}
        setFormData={setFormData}
        imageFile={imageFile}
        setImageFile={setImageFile}
        onSubmit={handleEditSubmit}
        categories={categories}
        mainCategories={services}
        partnerProfiles={partnerProfiles}
        isSubmitting={isSubmitting}
      />

      {/* ADD MODAL */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setImageFile(null); }}
        activeMenu={activeMenu}
        formData={formData}
        setFormData={setFormData}
        imageFile={imageFile}
        setImageFile={setImageFile}
        onSubmit={handleAddSubmit}
        categories={categories}
        mainCategories={services}
        partnerProfiles={partnerProfiles}
        isSubmitting={isSubmitting}
      />

      {/* GLOBAL SEARCH DIALOG (COMMAND+K) */}
      <GlobalSearchModal
        isOpen={showGlobalSearch}
        onClose={() => { setShowGlobalSearch(false); setGlobalSearchQuery(""); }}
        searchQuery={globalSearchQuery}
        setSearchQuery={setGlobalSearchQuery}
        menuItems={menuItems}
        users={users}
        leads={leads}
        products={products}
        setActiveMenu={setActiveMenu}
        handleEditClick={handleEditClick}
      />

    </div>
  );
};

export default Dashboard;