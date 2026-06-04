import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { filterProducts } from "../utils/productFilters";
import { getProductUrl } from "../utils/urlHelpers";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaThLarge,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import LeadModal from "../components/LeadModal";
import { API_BASE_URL, getServerUrl, getLocalFallback } from "../api/config";

const AllProductsPage = () => {
  const navigate = useNavigate();
  const { category: categoryParam, subcategory: subcategoryParam } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryFilter = categoryParam || searchParams.get("category");
  const subcategoryFilter = subcategoryParam || searchParams.get("subcategory");
  const queryFromUrl = searchParams.get("q") || "";

  const [search, setSearch] = useState(queryFromUrl);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setSearch(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setFetchError("");
        const res = await fetch(`${API_BASE_URL}/products`);
        const data = await res.json();

        if (data.success) {
          setAllProducts(data.products || []);
        } else {
          setAllProducts([]);
          setFetchError(data.msg || "Could not load products");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setFetchError("Network error loading products");
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const products = useMemo(() => {
    let filtered = filterProducts(allProducts, {
      category: categoryFilter,
      subcategory: subcategoryFilter,
    });

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.longDescription?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [allProducts, categoryFilter, subcategoryFilter, search]);

  const activeFilterLabel = subcategoryFilter || categoryFilter;

  const clearFilters = () => {
    setSearch("");
    if (categoryParam || subcategoryParam) {
      navigate("/all-products");
    } else {
      setSearchParams({});
    }
  };

  const openProduct = (item) => {
    const url = getProductUrl(item);
    navigate(url, { state: item });
  };

  const countLabel =
    activeFilterLabel || search.trim()
      ? `${products.length} of ${allProducts.length}`
      : `${products.length}`;

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="bg-[#1E3A8A] px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-lg md:text-2xl font-black text-white tracking-tight">
            Products <span className="text-orange-400">Marketplace</span>
          </h1>
          <span className="text-white/60 text-[10px] md:text-sm font-bold bg-black/20 backdrop-blur-md px-3 md:px-5 py-1.5 md:py-2 rounded-xl border border-white/10">
            {loading ? "…" : `${countLabel} Products`}
          </span>
        </div>
      </div>

      <div className="sticky top-[72px] md:top-[88px] z-[100] bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
            <div className="flex-1 relative group">
              <FaSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E3A8A] transition-colors text-xs md:text-sm" />
              <input
                type="text"
                placeholder="Search by name, category, description..."
                className="w-full pl-8 md:pl-12 pr-3 py-1.5 md:py-3 bg-slate-100 border-none rounded-lg md:rounded-2xl text-[11px] md:text-sm font-medium focus:ring-2 focus:ring-[#1E3A8A]/20 focus:bg-white transition-all outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {activeFilterLabel && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] md:text-xs font-bold text-[#1E3A8A] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
                  {subcategoryFilter ? "Subcategory" : "Category"}: {activeFilterLabel}
                </span>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[10px] md:text-xs font-bold text-slate-500 hover:text-red-600 px-2 py-1"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {fetchError && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
          <p className="text-sm font-semibold text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {fetchError}
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col lg:flex-row gap-6 md:gap-10">
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-[140px]">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <FaThLarge size={12} className="text-[#1E3A8A]" />
                  Product list
                </h3>
              </div>
              <div className="p-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {products.length > 0 ? (
                  <div className="space-y-1">
                    {products.map((item) => (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => openProduct(item)}
                        className="w-full text-left px-4 py-2.5 rounded-xl text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#1E3A8A] transition-all border border-transparent hover:border-slate-100"
                      >
                        <span className="line-clamp-1 block">{item.title}</span>
                        {item.subcategory && (
                          <span className="text-[9px] text-slate-400 font-medium uppercase">
                            {item.subcategory}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="p-4 text-center text-xs text-slate-400 font-medium italic">
                    No products in this list
                  </p>
                )}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[32px] p-4 h-[380px] animate-pulse border border-slate-100"
                >
                  <div className="w-full h-48 bg-slate-100 rounded-2xl mb-4" />
                  <div className="h-4 bg-slate-100 rounded-full w-2/3 mb-3" />
                  <div className="h-3 bg-slate-100 rounded-full w-full mb-2" />
                  <div className="h-3 bg-slate-100 rounded-full w-4/5" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
              {products.map((item) => (
                <article
                  key={item._id}
                  onClick={() => openProduct(item)}
                  onKeyDown={(e) => e.key === "Enter" && openProduct(item)}
                  role="button"
                  tabIndex={0}
                  className="group bg-white rounded-[32px] md:rounded-[40px] p-3 md:p-4 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer relative outline-none focus:ring-2 focus:ring-[#1E3A8A]/30"
                >
                  <div className="absolute top-6 right-6 md:top-8 md:right-8 z-10 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center gap-1.5 border border-slate-100">
                    <FaCheckCircle className="text-blue-600 text-[8px] md:text-[10px]" />
                    <span className="text-[8px] md:text-[9px] font-black text-slate-800 uppercase tracking-wider">
                      Verified
                    </span>
                  </div>

                  <div className="relative overflow-hidden rounded-[24px] md:rounded-[32px] aspect-[4/3] mb-4 md:mb-6">
                    <img
                      src={
                        getServerUrl(item.image || item.img) ||
                        getLocalFallback(item.title, item.category)
                      }
                      alt={item.title}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = getLocalFallback(item.title, item.category);
                      }}
                    />
                  </div>

                  <div className="px-1 md:px-2 pb-2">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5 md:mb-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                      <span className="text-[#1E3A8A]">{item.category || "Industrial"}</span>
                      {item.subcategory && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-500">{item.subcategory}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-base md:text-lg font-extrabold text-slate-800 mb-1.5 md:mb-2 group-hover:text-[#1E3A8A] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[11px] md:text-xs text-slate-500 line-clamp-2 mb-4 md:mb-6 font-medium leading-relaxed">
                      {item.shortDescription ||
                        "High-performance industrial machinery for your business."}
                    </p>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <FaMapMarkerAlt className="text-slate-400 text-[10px] shrink-0" />
                        <span className="text-[10px] md:text-xs font-bold text-slate-600 truncate">
                          {item.location || "New Delhi"}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Contact
                        </p>
                        <p className="text-xs md:text-sm font-black text-slate-900">
                          {item.mobileNumber || "Verified"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(item);
                        setIsModalOpen(true);
                      }}
                      className="mt-4 md:mt-6 w-full py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl font-bold text-xs md:text-sm shadow-xl hover:bg-[#1E3A8A] transition-all active:scale-95"
                    >
                      Contact Supplier
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center bg-white rounded-[32px] md:rounded-[48px] border border-dashed border-slate-200">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <FaTimes className="text-slate-200 text-3xl" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-2">
                {allProducts.length === 0 ? "No products listed yet" : "No matching products"}
              </h3>
              <p className="text-xs md:text-sm text-slate-500 font-medium max-w-sm mb-6 md:mb-8 px-4">
                {allProducts.length === 0
                  ? "Check back soon — new machines are added by verified suppliers."
                  : "Try clearing filters or adjusting your search."}
              </p>
              {(activeFilterLabel || search.trim()) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-6 md:px-8 py-2.5 md:py-3 bg-[#1E3A8A] text-white rounded-xl md:rounded-2xl font-bold shadow-lg text-xs md:text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        partnerId={selectedProduct?.partnerId}
      />
    </div>
  );
};

export default AllProductsPage;
