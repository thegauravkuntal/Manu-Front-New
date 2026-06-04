import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaArrowLeft, FaPhoneAlt, FaEnvelope, FaTimes, FaExternalLinkAlt, FaClock, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LeadModal from "../components/LeadModal";
import { API_BASE_URL, getServerUrl, getLocalFallback } from "../api/config";
import { getProductUrl } from "../utils/urlHelpers";

const ProductDetails = () => {
  const { id, slug, category, subcategory } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(state || null);
  const [loadingProduct, setLoadingProduct] = useState(!state && (!!id || !!slug));
  const [productError, setProductError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (state?._id) {
      setProduct(state);
      setLoadingProduct(false);
      return;
    }

    if (!id && !slug) {
      setLoadingProduct(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        setProductError("");
        const identifier = id || slug;
        const res = await fetch(`${API_BASE_URL}/products/${identifier}`);
        const data = await res.json();
        if (res.ok && data.success && data.product) {
          setProduct(data.product);
        } else {
          setProductError(data.msg || "Product not found");
        }
      } catch (err) {
        console.error("Product fetch error:", err);
        setProductError("Could not load product");
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [id, slug, state]);

  useEffect(() => {
    if (!product?._id) {
      setLoadingRelated(false);
      return;
    }

    const fetchRelatedProducts = async () => {
      try {
        setLoadingRelated(true);
        const res = await fetch(`${API_BASE_URL}/products`);
        const data = await res.json();
        if (data.success) {
          const filtered = (data.products || []).filter(
            (item) =>
              item.category === product.category &&
              item._id !== product._id
          );

          if (filtered.length === 0) {
            setRelatedProducts(
              (data.products || [])
                .filter((item) => item._id !== product._id)
                .slice(0, 6)
            );
          } else {
            setRelatedProducts(filtered.slice(0, 6));
          }
        }
      } catch (err) {
        console.error("Related Products Fetch Error:", err);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  if (loadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f6]">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#f5f7f6]">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {productError || "No product data found"}
        </h2>
        <p className="text-slate-500 text-sm mb-6">This listing may have been removed.</p>
        <button
          type="button"
          onClick={() => navigate("/all-products")}
          className="bg-[#1E3A8A] text-white px-6 py-2.5 rounded-lg font-bold"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  const openProduct = (item) => {
    const url = getProductUrl(item);
    navigate(url, { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || product.img];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <section className="bg-[#f5f7f6] min-h-screen py-4 md:py-10 px-4 md:px-6">
      <div className="max-w-6xl mx-auto mb-4 md:mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#1E3A8A] font-bold text-xs md:text-sm transition-colors"
        >
          <FaArrowLeft size={10} /> Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-xl md:rounded-[32px] shadow-sm overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-[250px] sm:h-[350px] md:h-[500px] group">
            <img
              src={getServerUrl(productImages[currentImageIndex]) || getLocalFallback(product.title, product.category)}
              alt={`${product.title} - ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-500"
              onError={(e) => {
                e.target.src = getLocalFallback(product.title, product.category);
              }}
            />
            
            {productImages.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                >
                  <FaChevronRight />
                </button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {productImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-wrap gap-2">
              <span className="bg-white/90 backdrop-blur-md px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-black text-[#1E3A8A] uppercase tracking-widest shadow-lg">
                {product.category || "Industrial"}
              </span>
              {product.subcategory && (
                <span className="bg-[#1E3A8A]/90 text-white px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest shadow-lg">
                  {product.subcategory}
                </span>
              )}
            </div>
          </div>

          <div className="p-5 md:p-10 flex flex-col justify-center">
            <h2 className="text-xl md:text-4xl font-black text-[#1E3A8A] leading-tight mb-3 md:mb-4">
              {product.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="flex items-center gap-1.5 text-gray-500 font-bold text-xs md:text-sm">
                <FaMapMarkerAlt className="text-red-500" /> {product.location || "New Delhi"}, India
              </div>
              <div className="hidden sm:block h-4 w-[1px] bg-gray-200" />
              <div className="text-orange-500 font-bold text-xs md:text-sm">In Stock</div>
            </div>

            <div className="space-y-5 md:space-y-6 mb-6 md:mb-8">
              <div>
                <h3 className="text-[10px] md:text-xs font-black text-[#1E3A8A] uppercase tracking-widest mb-2">
                  Short Description
                </h3>
                <p className="text-gray-600 leading-relaxed text-xs md:text-base">
                  {product.shortDescription ||
                    "Experience top-tier industrial performance with this advanced machinery."}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-slate-100">
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Direct Contact
              </p>
              <div className="flex items-end gap-2">
                <span className="text-xl md:text-3xl font-black text-slate-900 leading-none">
                  {product.mobileNumber || "+91 98765 43210"}
                </span>
                <span className="text-[10px] md:text-sm font-bold text-slate-400 pb-0.5 md:pb-1">
                  Verified Seller
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex-1 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white py-3 md:py-4 rounded-xl font-bold shadow-lg shadow-blue-900/10 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <FaEnvelope /> Contact Supplier
              </button>
              <button
                type="button"
                onClick={() => setIsCallModalOpen(true)}
                className="flex-1 bg-white border-2 border-slate-200 text-slate-800 py-3 md:py-4 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <FaPhoneAlt size={12} className="text-orange-500" /> Call Now
              </button>
            </div>
          </div>
        </div>

        {/* 🔥 LONG DESCRIPTION - MOVED BELOW */}
        <div className="px-5 md:px-10 py-8 md:py-12 border-t border-gray-100 bg-[#fcfdfc]">
            <h3 className="text-xs md:text-sm font-black text-[#1E3A8A] uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="w-6 h-1 bg-[#1E3A8A] rounded-full" /> Detailed Product Description
            </h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-gray-700 leading-relaxed text-sm md:text-lg whitespace-pre-line font-medium">
                {product.longDescription ||
                  "Engineered for precision, high output, and long-term durability in demanding manufacturing environments."}
              </p>
            </div>
        </div>
      </div>

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        partnerId={product.partnerId}
      />

      {isCallModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCallModalOpen(false)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-[#1E3A8A] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider">Contact Supplier</h3>
                <p className="text-xs text-blue-100/70 font-medium">Verify credentials & source directly</p>
              </div>
              <button type="button" onClick={() => setIsCallModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                <FaTimes />
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 text-orange-600 rounded-full flex items-center justify-center text-xl">
                  <FaPhoneAlt />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
                    Direct Line
                  </p>
                  <a
                    href={`tel:${product.mobileNumber || "+919876543210"}`}
                    className="text-lg font-black text-slate-800 hover:text-orange-500 transition-colors flex items-center gap-1"
                  >
                    {product.mobileNumber || "+91 98765 43210"}{" "}
                    <FaExternalLinkAlt className="text-xs text-slate-400" />
                  </a>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                  <FaClock className="text-orange-500" />
                  <span>Available: 9:30 AM to 6:30 PM (Mon-Sat)</span>
                </div>
              </div>
              <a
                href={`tel:${product.mobileNumber || "+919876543210"}`}
                className="w-full py-3 bg-[#1E3A8A] text-white rounded-xl font-bold text-center hover:bg-[#1E40AF] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <FaPhoneAlt size={12} /> Call Now
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto mt-10 md:mt-20">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h3 className="text-lg md:text-2xl font-black text-slate-900">
            Similar <span className="text-[#1E3A8A]">Machinery</span>
          </h3>
          <button
            type="button"
            onClick={() => navigate("/all-products")}
            className="text-[10px] md:text-xs font-black text-[#1E3A8A] hover:underline uppercase tracking-widest"
          >
            View All
          </button>
        </div>

        {loadingRelated ? (
          <div className="text-center py-10">
            <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {relatedProducts.map((item) => (
              <div
                key={item._id}
                onClick={() => openProduct(item)}
                className="group bg-white rounded-xl md:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-2 md:p-4 border border-gray-100 cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg md:rounded-xl h-32 md:h-44 mb-3 md:mb-4">
                  <img
                    src={getServerUrl(item.image || item.img) || getLocalFallback(item.title, item.category)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = getLocalFallback(item.title, item.category);
                    }}
                  />
                </div>
                <h4 className="text-[#1E3A8A] font-extrabold text-[12px] md:text-base mb-1 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[10px] md:text-xs text-slate-500 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-red-500" /> {item.location || "New Delhi"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetails;
