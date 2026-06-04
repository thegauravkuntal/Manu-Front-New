import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { API_BASE_URL, getServerUrl, getLocalFallback } from "../api/config";
import LeadModal from "../components/LeadModal";
import { getProductUrl } from "../utils/urlHelpers";

const locations = ["Patna", "Delhi", "Noida", "Hajipur", "Vaishali", "Nalanda", "Kolkata"];

const SearchResultsPage = ({ city, setCity }) => {
  const locationHook = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(locationHook.search);
  const searchQuery = query.get("q") || "";

  const [search, setSearch] = useState(searchQuery);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const activeLocation = city;

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/products`);
        const data = await res.json();
        if (data.success) {
          setAllProducts(data.products);
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setProducts(allProducts);
      return;
    }

    const words = search.toLowerCase().split(" ");

    const filtered = allProducts.filter((item) =>
      words.some((word) =>
        item.title.toLowerCase().includes(word) ||
        item.category?.toLowerCase().includes(word)
      )
    );

    setProducts(filtered);
  }, [search, allProducts]);

  return (
    <section className="bg-gradient-to-b from-[#f8fafc] to-[#eef2f7] min-h-screen">

      {/* HEADER */}
      <div className="bg-white shadow-md z-10 pt-2 md:pt-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">

          <h2 className="text-lg md:text-3xl font-bold text-gray-800 mb-3 md:mb-5">
            {search || "All Products"} <span className="hidden sm:inline">near</span> 
            <span className="text-[#065f46] ml-2">{activeLocation}</span>
          </h2>

          <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-start lg:items-center justify-between">

            {/* SEARCH */}
            <div className="flex items-center w-full lg:w-[420px] bg-gray-100 rounded-full px-4 md:px-5 py-2 md:py-3 shadow-inner focus-within:ring-2 ring-[#065f46] transition-all">
              <FaSearch className="text-gray-400 text-xs md:text-sm" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search machines..."
                className="ml-2 md:ml-3 w-full bg-transparent outline-none text-[11px] md:text-sm text-gray-700"
              />
            </div>

            {/* LOCATIONS */}
            <div className="flex gap-1.5 md:gap-2 flex-wrap overflow-x-auto pb-1 sm:pb-0 scrollbar-hide w-full lg:w-auto">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setCity(loc)}
                  className={`px-3 md:px-5 py-1 md:py-2 rounded-full text-[10px] md:text-sm font-bold transition-all whitespace-nowrap ${
                    activeLocation === loc
                      ? "bg-[#065f46] text-white shadow-md scale-105"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">

        {loading ? (
          <div className="col-span-full py-16 md:py-20 text-center">
             <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
             <p className="text-gray-500 font-bold text-sm md:text-lg animate-pulse">
               Fetching products from database...
             </p>
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full py-16 md:py-20 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <FaSearch className="text-gray-300 text-xl md:text-2xl" />
            </div>
            <p className="text-gray-500 font-bold text-sm md:text-lg">
              No machines found matching "{search}"
            </p>
          </div>
        ) : (
          products.map((item, i) => (
            <div
              key={i}
              onClick={() => {
                const url = getProductUrl(item);
                navigate(url, { state: item });
              }}
              className="bg-white rounded-xl md:rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-3 md:p-4 border border-gray-100 group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg md:rounded-2xl h-36 md:h-48 mb-3 md:mb-4">
                <img 
                  src={getServerUrl(item.image || item.img) || getLocalFallback(item.title, item.category)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = getLocalFallback(item.title, item.category);
                  }}
                />
              </div>

              <div className="px-1">
                <div className="flex items-center gap-2 text-[#065f46] text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-1">
                  <span>{item.category || "Industrial"}</span>
                </div>
                <h3 className="text-gray-900 font-extrabold text-sm md:text-base mb-1 line-clamp-1 group-hover:text-[#065f46] transition-colors">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between mb-3 md:mb-4 mt-2">
                  <p className="text-sm md:text-base font-black text-gray-900 leading-none">
                    {item.mobileNumber || "Verified Seller"}
                  </p>
                  <p className="text-[9px] md:text-xs text-gray-500 flex items-center gap-1 font-bold">
                    <FaMapMarkerAlt className="text-[#065f46] text-[10px]" /> {item.location || "New Delhi"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                    setSelectedProduct(item);
                  }}
                  className="w-full bg-slate-900 hover:bg-[#065f46] text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold text-[11px] md:text-sm shadow-lg shadow-slate-900/10 hover:shadow-blue-900/20 transition-all active:scale-95 text-center block"
                >
                  Contact Supplier
                </button>
              </div>
            </div>
          ))
        )}

      </div>

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        partnerId={selectedProduct?.partnerId}
      />
    </section>
  );
};

export default SearchResultsPage;