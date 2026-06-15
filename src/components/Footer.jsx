import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaChevronRight,
} from "react-icons/fa";
import { API_BASE_URL } from "../api/config";
import { trackClick } from "../components/analytics";
import logo from "../assets/logo.png";

const DEFAULT_FOOTER = {
  about:
    "Ultraclap connects buyers with verified manufacturing suppliers across India. Source machinery, packaging equipment, and industrial products with direct supplier contact.",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  linkedin: "https://linkedin.com",
  youtube: "https://youtube.com",
  phone: "+91 98765 43210",
  email: "support@ultraclap.com",
  timing: "Mon – Sat: 9:00 AM – 7:00 PM",
  manufacturingHeading: "Categories",
  manufacturingLinks: [
    "Paper Cup Machines",
    "Packaging Machinery",
    "Bag Making Machines",
    "Steel Fabrication",
    "Plastic Processing",
  ],
  projectHeading: "Quick Links",
  projectLinks: [
    "Browse All Products",
    "Featured Suppliers",
    "Partner Login",
    "My Queries",
    "Contact Support",
  ],
};

const QUICK_LINK_ROUTES = {
  "Browse All Products": "/all-products",
  "Featured Suppliers": "/all-products",
  "Partner Login": "/profile",
  "My Queries": "/my-queries",
  "Contact Support": "/profile",
};

const Footer = () => {
  const navigate = useNavigate();
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const [footerRes, catRes] = await Promise.all([
          fetch(`${API_BASE_URL}/footer`),
          fetch(`${API_BASE_URL}/categories`),
        ]);

        const footerData = await footerRes.json();
        const catData = await catRes.json();

        if (footerRes.ok && footerData.success && footerData.footer) {
          setFooter(footerData.footer);
          localStorage.setItem("footerData", JSON.stringify(footerData.footer));
        } else {
          const saved = localStorage.getItem("footerData");
          if (saved) {
            try {
              setFooter(JSON.parse(saved));
            } catch {
              setFooter(DEFAULT_FOOTER);
            }
          } else {
            setFooter(DEFAULT_FOOTER);
          }
        }

        if (catData.success) {
          setSubCategories(catData.categories || []);
        }
      } catch (err) {
        console.error("Footer fetch error:", err);
        const saved = localStorage.getItem("footerData");
        if (saved) {
          try {
            setFooter(JSON.parse(saved));
          } catch {
            setFooter(DEFAULT_FOOTER);
          }
        } else {
          setFooter(DEFAULT_FOOTER);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFooter();
  }, []);

  const manufacturingSubs = subCategories.filter(
    (c) => c.parentCategory?.title === "Manufacturing"
  );
  const hasMoreSubs = manufacturingSubs.length > 5;
  const visibleSubs = manufacturingSubs.slice(0, 5);

  const handleLinkClick = (label) => {
    const route = QUICK_LINK_ROUTES[label];
    if (route) {
      navigate(route);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate(`/all-products?category=${encodeURIComponent(label)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔥 Handle social media click with analytics tracking
  const handleSocialClick = (platform, url) => {
    trackClick(platform);
    window.open(url, "_blank", "noopener noreferrer");
  };

  // 🔥 Handle phone click with analytics tracking
  const handlePhoneClick = (phone) => {
    trackClick("call");
    window.location.href = `tel:${phone?.replace(/\s/g, "")}`;
  };

  // 🔥 Handle email click with analytics tracking
  const handleEmailClick = (email) => {
    trackClick("email");
    window.location.href = `mailto:${email}`;
  };

  const socialLinks = [
    { href: footer?.facebook, icon: FaFacebookF, label: "facebook", platform: "facebook" },
    { href: footer?.instagram, icon: FaInstagram, label: "instagram", platform: "instagram" },
    { href: footer?.linkedin, icon: FaLinkedinIn, label: "linkedin", platform: "linkedin" },
    { href: footer?.youtube, icon: FaYoutube, label: "youtube", platform: "youtube" },
  ].filter((s) => s.href && s.href.trim() !== "");

  if (loading) {
    return (
      <footer className="bg-[#f5f5f5] py-10 text-center">
        <p className="text-gray-500 animate-pulse">Loading footer...</p>
      </footer>
    );
  }

  if (!footer) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-b from-[#081426] via-[#0B1F3A] to-[#07101F] mt-16 pb-20 lg:pb-0">     
      <div className="h-[2px] bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#F97316] w-full" />
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-center md:text-left">
        <div className="lg:col-span-2 flex flex-col items-center md:items-start">
          <div className="mb-5">
            <img
              src={logo}
              alt="UltraClap Logo"
              className="h-[50px] md:h-[65px] w-auto object-contain"
            />
          </div>
          <p className="text-gray-300 text-[15px] leading-8 max-w-md">{footer.about}</p>

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4 mt-7">
              {socialLinks.map(({ href, icon: Icon, platform }) => (
                <button
                  key={platform}
                  onClick={() => handleSocialClick(platform, href)}
                  aria-label={platform}
                  className="w-10 h-10 bg-[#13294B] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#2563EB] transition cursor-pointer"
                >
                  <Icon />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-bold text-xl mb-5 text-white">
            Categories
          </h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            {(visibleSubs.length > 0 ? visibleSubs : footer.manufacturingLinks)?.map((item, index) => {
              const label = typeof item === "string" ? item : item.name;
              return (
                <li key={typeof item === "string" ? index : item._id}>
                  <button
                    type="button"
                    onClick={() => handleLinkClick(label)}
                    className="hover:text-[#4F7CFF] transition text-center w-full md:w-auto"
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
          {hasMoreSubs && (
            <button
              type="button"
              onClick={() => { navigate('/all-products'); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="mt-3 flex items-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300 transition"
            >
              View All Subcategories <FaChevronRight className="text-[10px]" />
            </button>
          )}
        </div>

        <div>
          <h3 className="font-bold text-xl mb-5 text-white opacity-100">
            {footer.projectHeading}
          </h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            {footer.projectLinks?.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleLinkClick(item)}
                  className="hover:text-[#4F7CFF] transition text-center w-full md:w-auto"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-bold text-xl mb-5 text-gray-100">Contact Us</h3>

          <div className="space-y-4 text-gray-300 text-sm">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <FaClock className="text-[#4F7CFF] shrink-0" />
              <span>{footer.timing}</span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <FaPhoneAlt className="text-[#4F7CFF] shrink-0" />
              <button
                onClick={() => handlePhoneClick(footer.phone)}
                className="text-gray-300 hover:text-white transition cursor-pointer"
              >
                {footer.phone}
              </button>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <FaEnvelope className="text-[#4F7CFF] shrink-0" />
              <button
                onClick={() => handleEmailClick(footer.email)}
                className="hover:text-[#4F7CFF] transition break-all cursor-pointer"
              >
                {footer.email}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm pb-6 border-t border-white/10 pt-5 mx-6">
        © {new Date().getFullYear()} Ultraclap. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;