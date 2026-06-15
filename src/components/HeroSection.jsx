import { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaShieldAlt,
  FaBolt,
  FaPhoneAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  FaWhatsapp,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa";

import { API_BASE_URL } from "../api/config";

// 🔥 TRACKING FUNCTION (Direct - No Import Needed)
const trackClick = async (buttonName) => {
  try {
    await fetch("http://localhost:5001/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ button: buttonName }),
    });
    console.log("✅ " + buttonName + " tracked");
  } catch (error) {
    console.error("Analytics error:", error);
  }
};

// 🔥 FALLBACK IMAGES
import img1 from "../assets/manufacturing.jpg";
import img2 from "../assets/services.jpg";
import img3 from "../assets/papercup.jpg";
import img4 from "../assets/doctor.jpg";

const FALLBACK_SLIDES = [
  {
    img: img1,
    subtitle: " ",
    title: "Manufacturing Success",
    desc: "Discover verified manufacturers, bulk suppliers, industrial partners, and trusted exporters. Expand your production capabilities and grow your business faster with reliable B2B connections.",
  },
  {
    img: img2,
    subtitle: " ",
    title: "Expert Services",
    desc: "Connect with experienced service providers, consultants, and professionals. From logistics to digital services, streamline your operations and maximize efficiency.",
  },
  {
    img: img3,
    subtitle: " ",
    title: "Paper Cup Machines",
    desc: "Explore high-performance paper cup machines and automatic production units. Get the best deals and boost your manufacturing output efficiently.",
  },
  {
    img: img4,
    subtitle: " ",
    title: "Doctor & Medical Services",
    desc: "Find trusted doctors, clinics, and healthcare professionals. Access reliable medical services and expert consultations easily.",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [step, setStep] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [slides, setSlides] = useState(FALLBACK_SLIDES);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  /* 🔥 FETCH SLIDES FROM API */
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/hero`);
        const data = await res.json();
        if (data.success && data.slides && data.slides.length > 0) {
          setSlides(
            data.slides.map((s) => ({
              img: s.image,
              subtitle: s.subtitle || " ",
              title: s.title,
              desc: s.desc,
            }))
          );
        }
      } catch {
        // use fallback
      }
    };
    fetchSlides();
  }, []);
  // 🔥 AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [current]);

  // 🔥 TEXT ANIMATION (SLOW)
  useEffect(() => {
    setStep(0);

    const t1 = setTimeout(() => setStep(1), 400);
    const t2 = setTimeout(() => setStep(2), 900);
    const t3 = setTimeout(() => setStep(3), 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [current]);

  // 🔥 PULSE ICON
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulse((p) => !p);
    }, 1000);
    return () => clearInterval(pulseInterval);
  }, []);

  // 🔥 SOCIAL ICONS
  const socials = [
    { icon: <FaInstagram />, name: "Instagram", color: "text-pink-500", buttonName: "instagram" },
    { icon: <FaYoutube />, name: "YouTube", color: "text-red-600", buttonName: "youtube" },
    { icon: <FaLinkedin />, name: "LinkedIn", color: "text-blue-600", buttonName: "linkedin" },
    { icon: <FaFacebook />, name: "Facebook", color: "text-blue-600", buttonName: "facebook" },
  ];

  return (
    <section className="relative h-[55vh] md:h-[90vh] w-full overflow-hidden">

      {/* 🔥 SLIDES */}
      {slides.map((slide, i) => (
        slide.img ? (
          <img
            key={i}
            src={slide.img}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div
            key={i}
            className={`absolute w-full h-full bg-gradient-to-br from-[#0B1C2C] via-[#0F2A43] to-[#1E3A8A] transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        )
      ))}

      {/* 🔥 OVERLAY */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* 🔥 ARROWS (Hidden on very small screens) */}
      <button
        onClick={prevSlide}
        className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white backdrop-blur-sm transition-all active:scale-90"
      >
        <FaChevronLeft size={20} />
      </button>

      <button
        onClick={nextSlide}
        className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white backdrop-blur-sm transition-all active:scale-90"
      >
        <FaChevronRight size={20} />
      </button>

      {/* 🔥 MOBILE NAVIGATION DOTS */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 flex gap-2 lg:hidden">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-blue-600 w-6" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* 🔥 FLOATING ACTION BUTTONS */}
      <div className="fixed right-6 bottom-20 sm:bottom-10 z-[1000] flex flex-col gap-4 animate-in slide-in-from-right-10 duration-700">

        <div className="relative group">
          <div className={`absolute inset-0 bg-blue-500 opacity-20 rounded-full ${pulse ? "scale-[1.8]" : "scale-100"} transition-all duration-1000`} />
          <a 
            href="tel:+910000000000"
            onClick={() => trackClick("call")}
            className="relative bg-blue-600 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white cursor-pointer shadow-2xl hover:scale-110 transition-all active:scale-90"
          >
            <FaPhoneAlt size={18} />
          </a>
        </div>

        <div className="relative group">
          <div className={`absolute inset-0 bg-blue-600 opacity-20 rounded-full ${pulse ? "scale-[1.8]" : "scale-100"} transition-all duration-1000`} />
          <a 
            href="https://wa.me/910000000000"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackClick("whatsapp")}
            className="relative bg-green-500 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white cursor-pointer shadow-2xl hover:scale-110 transition-all active:scale-90"
          >
            <FaWhatsapp size={22} />
          </a>
        </div>

      </div>

      {/* 🔥 RIGHT ICONS - Hidden on mobile */}
      <div className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">

        {socials.map((s, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="relative flex items-center"
          >
            {hovered === i && (
              <span className="absolute right-12 bg-[#1E3A8A] text-white px-3 py-1 rounded-md text-sm">
                {s.name}
              </span>
            )}

            <div 
              onClick={() => trackClick(s.buttonName)}
              className="bg-white p-3 rounded-full shadow-lg cursor-pointer hover:scale-110 transition"
            >
              <span className={`text-xl ${s.color}`}>{s.icon}</span>
            </div>
          </div>
        ))}

      </div>

      {/* 🔥 CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-center">

        <div className="max-w-3xl text-white text-center space-y-2 md:space-y-6">

          {/* STEP 1 */}
          <p className={`text-orange-400 text-[10px] md:text-base font-semibold transition-all duration-700 ${
            step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            {slides[current].subtitle}
          </p>

          {/* STEP 2 */}
          <h1 className={`text-xl md:text-5xl lg:text-6xl font-bold transition-all duration-700 leading-tight px-2 ${
            step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            Your Trusted Partner in <br className="hidden md:block" />
            <span className="text-blue-600">{slides[current].title}</span>
          </h1>

          {/* STEP 3 */}
          <p className={`text-gray-200 text-[9px] md:text-base lg:text-lg transition-all duration-700 max-w-2xl mx-auto px-3 line-clamp-2 md:line-clamp-none ${
            step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            {slides[current].desc}
          </p>

          {/* 🔥 BADGES */}
          <div className="flex flex-wrap gap-2 md:gap-8 justify-center pt-1 md:pt-4 text-[8px] md:text-sm font-medium">

            <div className="flex items-center gap-1 md:gap-2">
              <FaShieldAlt className="text-blue-600 text-[10px] md:text-lg" />
              <span>Verified Manufacturers</span>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              <FaBoxOpen className="text-blue-600 text-[10px] md:text-lg" />
              <span>Best Industry Prices</span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <FaBolt className="text-blue-600 text-lg" />
              <span>Fast Lead Response</span>
            </div>

          </div>

          {/* 🔥 SUPPORTED BY */}
          <div className="flex items-center justify-center gap-2 mt-1 md:mt-8 scale-[0.6] md:scale-100">
            <div className="h-[1px] w-8 md:w-20 bg-orange-400"></div>
            <div className="bg-[#1E3A8A] text-white px-3 py-0.5 md:px-5 md:py-1.5 rounded-full tracking-[2px] md:tracking-[5px] text-[7px] md:text-[10px] font-bold whitespace-nowrap">
              SUPPORTED BY
            </div>
            <div className="h-[1px] w-8 md:w-20 bg-orange-400"></div>
          </div>

        </div>
      </div>
  
    </section>
  );
};

export default Hero;