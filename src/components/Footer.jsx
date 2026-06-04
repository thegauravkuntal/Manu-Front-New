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
} from "react-icons/fa";
import { API_BASE_URL } from "../api/config";

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
  manufacturingHeading: "Manufacturing",
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

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/footer`);
        const data = await res.json();

        if (res.ok && data.success && data.footer) {
          setFooter(data.footer);
        } else {
          setFooter(DEFAULT_FOOTER);
        }
      } catch (err) {
        console.error("Footer fetch error:", err);
        setFooter(DEFAULT_FOOTER);
      } finally {
        setLoading(false);
      }
    };

    fetchFooter();
  }, []);

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

  const socialLinks = [
    { href: footer?.facebook, icon: FaFacebookF, label: "Facebook" },
    { href: footer?.instagram, icon: FaInstagram, label: "Instagram" },
    { href: footer?.linkedin, icon: FaLinkedinIn, label: "LinkedIn" },
    { href: footer?.youtube, icon: FaYoutube, label: "YouTube" },
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
    <footer className="bg-[#f5f5f5] mt-16 pb-20 lg:pb-0">
      <div className="h-1 bg-[#1E3A8A] w-full" />

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-center md:text-left">
        <div className="lg:col-span-2 flex flex-col items-center md:items-start">
          <h2 className="text-3xl font-bold mb-5">
            <span className="text-[#1E3A8A]">ULTRA</span>CLAP
          </h2>

          <p className="text-gray-600 text-[15px] leading-8 max-w-md">{footer.about}</p>

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4 mt-7">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-[#1E3A8A] hover:text-white transition"
                >
                  <Icon />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-bold text-xl mb-5 text-gray-900">
            {footer.manufacturingHeading}
          </h3>
          <ul className="space-y-3 text-gray-600 text-sm">
            {footer.manufacturingLinks?.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleLinkClick(item)}
                  className="hover:text-[#1E3A8A] transition text-left w-full md:w-auto"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-5 text-gray-900">
            {footer.projectHeading}
          </h3>
          <ul className="space-y-3 text-gray-600 text-sm">
            {footer.projectLinks?.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleLinkClick(item)}
                  className="hover:text-[#1E3A8A] transition text-left w-full md:w-auto"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-bold text-xl mb-5 text-gray-900">Contact Us</h3>

          <div className="space-y-4 text-gray-600 text-sm">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <FaClock className="text-[#1E3A8A] shrink-0" />
              <span>{footer.timing}</span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <FaPhoneAlt className="text-[#1E3A8A] shrink-0" />
              <a
                href={`tel:${footer.phone?.replace(/\s/g, "")}`}
                className="hover:text-[#1E3A8A] transition"
              >
                {footer.phone}
              </a>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <FaEnvelope className="text-[#1E3A8A] shrink-0" />
              <a
                href={`mailto:${footer.email}`}
                className="hover:text-[#1E3A8A] transition break-all"
              >
                {footer.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm pb-6 border-t border-gray-200 pt-5 mx-6">
        © {new Date().getFullYear()} Ultraclap. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
