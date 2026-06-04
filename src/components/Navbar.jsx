import {
  FaSearch,
  FaMapMarkerAlt,
  FaChevronDown,
  FaThLarge,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import SignInModal from "../pages/Sign-in";

import logo from "../assets/logo.png";

import {
  useNavigate,
} from "react-router-dom";

import { API_BASE_URL } from "../api/config";
import { getCategoryUrl } from "../utils/urlHelpers";

const DEFAULT_NAVBAR = {
  categories: ["Manufacturing", "Packaging", "Machinery"],
  placeholder: "Search machines, products, suppliers...",
  signInButton: "Sign In",
  defaultCity: "Select City",
};

const Navbar = ({
  city,
  onOpenLocation,
}) => {

  const [authModal, setAuthModal] = useState({ show: false, mode: "login" });

  const [navbar, setNavbar] =
    useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [productCategories, setProductCategories] = useState([]);

  const [category, setCategory] =
    useState("All Categories");

  const [openDropdown, setOpenDropdown] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const navigate =
    useNavigate();

  const dropdownRef =
    useRef(null);



  /* 🔥 GET USER */
  const user = JSON.parse(
    localStorage.getItem("user")
  );




  /* 🔥 FETCH NAVBAR & CATEGORIES */
  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const [navbarRes, productsRes, manufacturingRes] = await Promise.all([
            fetch(`${API_BASE_URL}/navbar`),
            fetch(`${API_BASE_URL}/products`),
            fetch(`${API_BASE_URL}/manufacturing`)
          ]);

          const navbarData = await navbarRes.json();
          const productsData = await productsRes.json();
          const manufacturingData = await manufacturingRes.json();

          if (navbarRes.ok && navbarData.navbar) {
            setNavbar(navbarData.navbar);
          } else if (navbarRes.ok && navbarData.placeholder) {
            setNavbar(navbarData);
          } else {
            setNavbar(DEFAULT_NAVBAR);
          }

          const seen = new Set();
          const cats = [];

          if (productsData.success) {
            productsData.products.forEach(p => {
              const name = p.category || 'Uncategorized';
              if (!seen.has(name)) {
                seen.add(name);
                cats.push(name);
              }
            });
          }

          if (manufacturingData.success) {
            manufacturingData.manufacturing.forEach(m => {
              const name = m.title || 'Uncategorized';
              if (!seen.has(name)) {
                seen.add(name);
                cats.push(name);
              }
            });
          }

          setProductCategories(cats);

        } catch (err) {
          console.error("Navbar fetch error:", err);
          setNavbar(DEFAULT_NAVBAR);
        } finally {

          setLoading(false);
        }
      };

    fetchData();

  }, []);




  /* 🔥 OUTSIDE CLICK */
  useEffect(() => {

    const handleClickOutside =
      (e) => {

        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            e.target
          )
        ) {

          setOpenDropdown(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);




  /* 🔄 LOADING */
  if (loading) {
    return null;
  }




  const nav = navbar || DEFAULT_NAVBAR;




  /* 🔥 HANDLE SEARCH */
  const handleSearch = () => {
    let url = category !== "All Categories" ? getCategoryUrl(category) : "/all-products";
    if (search.trim()) {
      url += (url.includes("?") ? "&" : "?") + `q=${encodeURIComponent(search)}`;
    }
    navigate(url);
  };

  return (
    <>
      <div className="w-full bg-[#F3F4F6] fixed top-[40px] md:top-[44px] z-[999] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-1.5 md:py-3 flex items-center justify-between gap-3 md:gap-6">
          
          {/* 🔥 LOGO */}
          <div className="flex items-center h-[32px] md:h-[46px] flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
            <img
              src={logo}
              alt="UltraClap Logo"
              className="h-[40px] md:h-[60px] w-auto object-contain"
            />
          </div>

          {/* 🔥 SEARCH (Desktop) */}
          <div className="hidden lg:flex flex-1 items-stretch bg-white border border-gray-300 rounded-full shadow-sm h-[46px]">
            <div ref={dropdownRef} className="relative h-full z-[2000]">
              <div
                onClick={() => setOpenDropdown((prev) => !prev)}
                className="flex items-center gap-2 px-4 bg-gray-100 border-r border-gray-300 cursor-pointer h-full"
              >
                <span className="text-sm text-gray-700 whitespace-nowrap">{category}</span>
                <FaChevronDown className="text-xs text-gray-500" />
              </div>

              {openDropdown && (
                <div className="absolute top-[50px] left-0 bg-white border border-gray-200 rounded-xl shadow-lg w-52 z-[3000]">
                  <div
                    onClick={() => {
                      setCategory("All Categories");
                      setOpenDropdown(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-[#1E3A8A] hover:text-white cursor-pointer transition"
                  >
                    All Categories
                  </div>
                  {productCategories.map((name) => (
                    <div
                      key={name}
                      onClick={() => {
                        setCategory(name);
                        setOpenDropdown(false);
                      }}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-[#1E3A8A] hover:text-white cursor-pointer transition"
                    >
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder={nav.placeholder}
              className="flex-1 px-4 text-sm outline-none text-gray-700 h-full"
            />

            <button
              onClick={handleSearch}
              className="bg-[#1E3A8A] hover:bg-[#1E40AF] w-[60px] h-full flex items-center justify-center text-white rounded-r-full"
            >
              <FaSearch />
            </button>
          </div>

          {/* 🔥 RIGHT (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <div
              onClick={onOpenLocation}
              className="flex items-center gap-2 px-4 h-[46px] bg-white border border-gray-300 rounded-full shadow-sm cursor-pointer hover:bg-gray-50"
            >
              <FaMapMarkerAlt className="text-[#1E3A8A]" />
              <span className="text-sm text-gray-700 whitespace-nowrap">{city || nav.defaultCity}</span>
            </div>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-3 bg-white border border-gray-300 px-4 h-[46px] rounded-full font-medium shadow-sm hover:bg-gray-50 transition-all">
                  <div className="w-8 h-8 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm text-gray-700 max-w-[100px] truncate">{user.name}</span>
                  <FaChevronDown className="text-[10px] text-gray-400" />
                </button>

                <div className="absolute top-[52px] right-0 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[5000] p-2">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                  </div>
                  {(user.role === "partner" || user.role === "admin") && (
                    <button
                      onClick={() => navigate(user.role === "admin" ? "/admin/dashboard" : "/partner/dashboard")}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1E3A8A] rounded-xl transition-all font-bold"
                    >
                      <div className="w-8 h-8 bg-blue-100 text-[#1E3A8A] rounded-lg flex items-center justify-center">
                        <FaThLarge className="text-xs" />
                      </div>
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/my-queries")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all font-medium"
                  >
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <FaSearch className="text-xs" />
                    </div>
                    My Queries
                  </button>
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all font-medium"
                  >
                    <div className="w-8 h-8 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center">
                      <FaUser className="text-xs" />
                    </div>
                    My Profile
                  </button>
                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button
                      onClick={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        window.location.href = "/";
                      }}
                      className="w-full flex items-center gap-4 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold"
                    >
                      <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                        <FaSignOutAlt className="text-xs" />
                      </div>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModal({ show: true, mode: "login" })}
                  className="text-gray-700 hover:text-[#1E3A8A] px-4 h-[46px] rounded-full font-bold text-sm transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthModal({ show: true, mode: "signup" })}
                  className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white px-6 h-[46px] rounded-full font-bold text-sm shadow-sm transition-all active:scale-95"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* 🔥 MOBILE ACTIONS (Location & Hamburger) */}
          <div className="flex lg:hidden items-center gap-2">
            <div
              onClick={onOpenLocation}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-300 rounded-full shadow-sm text-[10px] text-gray-700"
            >
              <FaMapMarkerAlt className="text-[#1E3A8A]" />
              <span className="max-w-[70px] sm:max-w-[120px] truncate">{city || nav.defaultCity}</span>
            </div>
            
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-[#1E3A8A] p-1.5 bg-white rounded-full shadow-sm border border-gray-200"
            >
              <FaBars size={18} />
            </button>
          </div>
        </div>

        {/* 🔥 MOBILE SEARCH BAR (Sticky below Navbar) */}
        <div className="lg:hidden px-4 pb-2">
          <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm h-[36px] overflow-hidden">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim() !== "") {
                  navigate(`/search?q=${search}`);
                }
              }}
              placeholder={nav.placeholder}
              className="flex-1 px-4 text-[11px] outline-none text-gray-700 h-full"
            />
            <button
              onClick={() => {
                if (search.trim() !== "") navigate(`/search?q=${search}`);
              }}
              className="bg-[#1E3A8A] px-4 h-full text-white"
            >
              <FaSearch size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 MOBILE SIDEBAR MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[2000] flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          
          <div className="relative ml-auto w-[80%] max-w-[320px] h-full bg-white shadow-2xl flex flex-col p-6 animate-slide-in-right">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-[#1E3A8A]">Menu</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500">
                <FaTimes size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {user ? (
                <>
                  <div className="p-4 bg-gray-50 rounded-2xl mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center font-bold">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[180px]">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {(user.role === "partner" || user.role === "admin") && (
                    <button
                      onClick={() => { navigate(user.role === "admin" ? "/admin/dashboard" : "/partner/dashboard"); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-4 p-4 text-gray-700 hover:bg-blue-50 rounded-xl font-bold"
                    >
                      <FaThLarge className="text-[#1E3A8A]" /> Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => { navigate("/my-queries"); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-4 p-4 text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    <FaSearch className="text-blue-500" /> My Queries
                  </button>
                  <button
                    onClick={() => { navigate("/profile"); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-4 p-4 text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    <FaUser className="text-gray-500" /> My Profile
                  </button>
                  
                  <div className="pt-4 border-t border-gray-100 mt-4">
                    <button
                      onClick={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        window.location.href = "/";
                      }}
                      className="w-full flex items-center gap-4 p-4 text-red-600 hover:bg-red-50 rounded-xl font-bold"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { setAuthModal({ show: true, mode: "login" }); setIsMenuOpen(false); }}
                    className="w-full bg-gray-100 text-[#1E3A8A] p-4 rounded-xl font-bold shadow-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setAuthModal({ show: true, mode: "signup" }); setIsMenuOpen(false); }}
                    className="w-full bg-[#1E3A8A] text-white p-4 rounded-xl font-bold shadow-lg shadow-blue-900/20"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} Ultraclap</p>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 LOGIN MODAL */}
      {authModal.show && (
        <SignInModal 
          onClose={() => setAuthModal({ ...authModal, show: false })} 
          initialMode={authModal.mode}
        />
      )}
    </>
  );
};

export default Navbar;