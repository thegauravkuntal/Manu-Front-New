import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import Categories from "../components/Categories";
import BannerSlider from "../components/BannerSlider";
import Stats from "../components/Stats";
import Manufacturing from "../components/Manufacturing";
import SubCategories from "../components/SubCategories";
import AppBanner from "../components/Banner";
import LocationSection from "../components/LocationSection";
import Faqs from "../components/Faqs"; // ✅ सही नाम
import FeaturedProducts from "../components/FeaturedProduct";
import Industry from "../components/Industry";
import Testimonials from "../components/Testimoniols";
import TopMarqueeBar from "../components/TopMarqueeBar";
import PartnerLogin from "../components/PartnerLogin";
import { API_BASE_URL } from "../api/config";

const Home = () => {
  const [showManufacturing, setShowManufacturing] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/navbar`);
        const data = await res.json();
        if (data.success && data.navbar) {
          setShowManufacturing(data.navbar.showMainCategory !== false);
        } else if (data.showMainCategory !== undefined) {
          setShowManufacturing(data.showMainCategory !== false);
        }
      } catch (err) {
        console.error("Error fetching home settings:", err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div>
      <HeroSection />

      {showManufacturing && <Manufacturing />}

      {/* 🔥 NEW SLIDER BANNER */}
      <BannerSlider />

      <SubCategories />

      <AppBanner />

      <FeaturedProducts />

      <Stats />

      <TopMarqueeBar />

      <PartnerLogin />

      <Faqs />

      <LocationSection />

      <Industry />

      <Testimonials/>

    </div>
  );
};

export default Home;