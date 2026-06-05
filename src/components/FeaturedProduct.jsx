import {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaCogs,
  FaBox,
  FaIndustry,
  FaTools,
  FaWrench,
  FaCube,
  FaBolt,
  FaHammer,
} from "react-icons/fa";
import LeadModal from "./LeadModal";
import { getServerUrl, getLocalFallback, API_BASE_URL } from "../api/config";
import { getProductUrl } from "../utils/urlHelpers";


const iconMap = {
  cogs: FaCogs,
  box: FaBox,
  industry: FaIndustry,
  tools: FaTools,
  wrench: FaWrench,
  cube: FaCube,
  bolt: FaBolt,
  hammer: FaHammer,
};

const FALLBACK_ICON_KEYS = ["cogs", "industry", "tools", "box", "wrench", "bolt"];

const KEYWORD_ICON_RULES = [
  { test: /weld|torch|arc|fabricat/i, key: "tools" },
  { test: /cup|pack|carton|bag|bottle/i, key: "box" },
  { test: /cnc|lathe|mill|press|machine/i, key: "cogs" },
  { test: /inject|mold|plastic|extru/i, key: "industry" },
  { test: /3d|print/i, key: "cube" },
  { test: /forg|stamp|die/i, key: "hammer" },
  { test: /assembl|robot|automation/i, key: "bolt" },
];

function isIconUrl(value) {
  if (!value || typeof value !== "string") return false;
  const v = value.trim().toLowerCase();
  return v.startsWith("http") || v.startsWith("/") || v.includes("cloudinary");
}

function inferIconKey(item) {
  const text = [
    item.icon,
    item.category,
    item.subcategory,
    item.title,
    item.query,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const named = (item.icon || "").trim().toLowerCase();
  if (iconMap[named]) return named;

  for (const rule of KEYWORD_ICON_RULES) {
    if (rule.test.test(text)) return rule.key;
  }

  const seed = String(item._id || item.title || "product");
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i)) % FALLBACK_ICON_KEYS.length;
  }
  return FALLBACK_ICON_KEYS[hash];
}

function ProductCircleIcon({ item, className = "text-xl md:text-3xl" }) {
  const rawIcon = (item.icon || "").trim();

  if (isIconUrl(rawIcon)) {
    return (
      <img
        src={getServerUrl(rawIcon)}
        alt=""
        className="w-[55%] h-[55%] object-contain"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    );
  }

  const key = inferIconKey(item);
  const Icon = iconMap[key] || FaCogs;
  return <Icon className={className} aria-hidden />;
}




const FeaturedProducts = () => {

  const navigate =
    useNavigate();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);





  /* 🔥 FETCH PRODUCTS */
  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const featuredRes = await fetch(`${API_BASE_URL}/products/featured`);
        const featuredData = await featuredRes.json();
        let list = featuredData.products || [];

        if (!list.length) {
          const allRes = await fetch(`${API_BASE_URL}/products`);
          const allData = await allRes.json();
          if (allData.success) {
            list = (allData.products || []).slice(0, 8);
          }
        }

        setProducts(list);
      } catch (err) {
        console.error("Products fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, []);




  /* 🔄 LOADING */
  if (loading) {

    return (
      <section className="py-16 bg-[#f5f7f6]">

        <p className="text-center text-gray-500 animate-pulse">

          Loading products...

        </p>

      </section>
    );
  }




  /* ❌ NO PRODUCTS */
  if (
    !products ||
    products.length === 0
  ) {
    return null;
  }




  return (
    <section className="py-10 md:py-16 bg-[#f5f7f6]">

      {/* 🔥 TOP */}
      <div className="text-center mb-8 md:mb-12 px-4">

        <p className="text-orange-600 tracking-[2px] text-[10px] md:text-xs font-semibold mb-2 uppercase">
          Marketplace
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-[#1E3A8A]">
          Our Products
        </h2>

      </div>



      {/* 🔥 GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {products.map(
          (item) => (

            <div
              key={item._id}
              onClick={() => {
                const url = getProductUrl(item);
                navigate(url, { state: item });
              }}
              className="group bg-white rounded-2xl md:rounded-[22px] border border-gray-200 shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer flex flex-col"
            >

              {/* 🔥 IMAGE AREA */}
              <div className="relative h-[140px] md:h-[165px] overflow-hidden flex-shrink-0">

                {/* 🔥 IMAGE */}
                <img
                  src={getServerUrl(item.image || item.img) || getLocalFallback(item.title, item.category)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = getLocalFallback(item.title, item.category);
                  }}
                />



                {/* 🔥 CURVE */}
                <div className="absolute bottom-0 left-0 w-[80px] md:w-[110px] h-[60px] md:h-[85px] bg-white rounded-tr-[70px] md:rounded-tr-[90px]"></div>



                {/* 🔥 ICON */}
                <div className="absolute bottom-3 left-3 md:bottom-5 md:left-5 w-[50px] md:w-[74px] h-[50px] md:h-[74px] rounded-full bg-[#2E9635] border-[3px] md:border-[5px] border-white flex items-center justify-center text-white shadow-lg">

                  <ProductCircleIcon item={item} />

                </div>

              </div>



              {/* 🔥 CONTENT */}
              <div className="px-4 md:px-5 pt-3 md:pt-4 pb-4 md:pb-5 flex flex-col flex-1">

                {/* 🔥 TITLE */}
                <h3 className="text-[16px] md:text-[18px] font-extrabold text-[#1E3A8A] uppercase leading-tight md:leading-6">

                  {item.title}

                </h3>



                {/* 🔥 DESC */}
                <p className="text-gray-700 mt-2 md:mt-3 text-[13px] md:text-[15px] leading-relaxed md:leading-7 line-clamp-4">
                  {item.shortDescription || item.desc || "Industrial machinery from verified suppliers."}
                </p>



                {/* 🔥 HOVER LINE */}
                <div className="mt-4 md:mt-5 w-10 md:w-12 group-hover:w-16 md:group-hover:w-24 h-[4px] md:h-[5px] bg-[#1E3A8A] rounded-full transition-all duration-300"></div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                    setSelectedProduct(item);
                  }}
                  className="mt-auto w-full py-2.5 md:py-3 bg-[#1E3A8A] text-white rounded-lg md:rounded-xl font-bold text-xs md:text-sm shadow-md hover:bg-slate-900 transition-all active:scale-95"
                >
                  Contact Supplier
                </button>
              </div>


            </div>
          )
        )}

      </div>



      {/* 🔥 BUTTON */}
      <div className="text-center mt-10 md:mt-12">

        <button
          onClick={() =>
            navigate("/all-products")
          }
          className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-base transition"
        >

          View All Products

        </button>

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


export default FeaturedProducts;