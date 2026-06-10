import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { API_BASE_URL } from "../api/config";

const BannerSlider = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/sliders`);
        const result = await res.json();
        
        if (result.success && result.sliders && result.sliders.length > 0) {
          setSlides(result.sliders);
        } else {
          setSlides([]);
        }
      } catch (err) {
        console.error("Slides fetch error:", err);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Auto slide
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (loading) {
    return (
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-[300px] flex items-center justify-center bg-white rounded-2xl shadow">
            <p className="text-gray-500 text-lg animate-pulse">Loading banners...</p>
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent((current + 1) % slides.length);
  };

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white">
          <div
            className="flex transition-transform duration-700"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={slide._id || index} className="min-w-full flex flex-col md:grid md:grid-cols-2 items-center">
                {/* Left - Text Content */}
                <div className="p-6 md:p-8 space-y-3 md:space-y-5 order-2 md:order-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                    {slide.title}
                    {slide.highlight && (
                      <>
                        <br />
                        <span className="text-[#1E3A8A]">{slide.highlight}</span>
                      </>
                    )}
                  </h2>
                  <p className="text-gray-500 text-sm md:text-lg">{slide.desc}</p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 pt-2 justify-center md:justify-start">
                    <a
                      href="/contact"
                      className="bg-[#1E3A8A] text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-blue-800 transition text-sm md:text-base font-bold shadow-md"
                    >
                      Explore More
                    </a>
                    <p className="text-[10px] md:text-sm text-gray-400">
                      Trusted by 500+ Manufacturers
                    </p>
                  </div>
                </div>

                {/* Right - Image */}
                <div className="order-1 md:order-2 w-full">
                  <img
                    src={slide.image}
                    className="w-full h-[200px] md:h-[350px] object-cover"
                    alt={slide.title}
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default BannerSlider;