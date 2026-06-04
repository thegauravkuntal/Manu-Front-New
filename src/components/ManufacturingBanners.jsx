import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, getServerUrl } from "../api/config";

const DEFAULT_BANNERS = [
  {
    _id: "banner-1",
    title: "Industrial Machinery Deals",
    image:
      "https://res.cloudinary.com/djsxaigna/image/upload/v1778687629/manufacturing_b2b/tiwud4hv6wtvt4cbgozz.jpg",
    link: "/manufacturing",
  },
  {
    _id: "banner-2",
    title: "Packaging Equipment",
    image:
      "https://res.cloudinary.com/djsxaigna/image/upload/v1778687629/manufacturing_b2b/tiwud4hv6wtvt4cbgozz.jpg",
    link: "/packaging",
  },
  {
    _id: "banner-3",
    title: "Verified Suppliers",
    image:
      "https://res.cloudinary.com/djsxaigna/image/upload/v1779526091/manu_uploads/oju73iddjm2mbnw3oxte.jpg",
    link: "/all-products",
  },
  {
    _id: "banner-4",
    title: "Direct Supplier Contact",
    image:
      "https://res.cloudinary.com/djsxaigna/image/upload/v1778687629/manufacturing_b2b/tiwud4hv6wtvt4cbgozz.jpg",
    link: "/all-products",
  },
];

const ManufacturingBanners = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/sliders`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.sliders || [];

        if (list.length > 0) {
          setBanners(
            list.slice(0, 4).map((slide, i) => ({
              _id: slide._id || `slide-${i}`,
              title: slide.title || slide.highlight || "Explore Products",
              image: slide.image,
              link: "/all-products",
            }))
          );
        } else {
          setBanners(DEFAULT_BANNERS);
        }
      } catch (err) {
        console.error("Banner fetch error:", err);
        setBanners(DEFAULT_BANNERS);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const displayBanners = banners.length > 0 ? banners : DEFAULT_BANNERS;

  const resolveImage = (src) => {
    if (!src) return DEFAULT_BANNERS[0].image;
    if (src.startsWith("http") || src.startsWith("/")) return getServerUrl(src) || src;
    return DEFAULT_BANNERS[0].image;
  };

  const handleClick = (link) => {
    navigate(link || "/all-products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <section className="bg-gray-50 py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-36 md:h-44 bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-8 md:py-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayBanners.map((banner) => (
            <button
              key={banner._id}
              type="button"
              onClick={() => handleClick(banner.link)}
              className="group relative w-full overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2"
            >
              <img
                src={resolveImage(banner.image)}
                alt={banner.title}
                className="w-full h-40 sm:h-44 md:h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = DEFAULT_BANNERS[0].image;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <p className="text-white font-bold text-sm md:text-base drop-shadow">
                  {banner.title}
                </p>
                <span className="inline-block mt-1 text-[10px] md:text-xs font-semibold text-orange-200 uppercase tracking-wider group-hover:underline">
                  Shop Now →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManufacturingBanners;
