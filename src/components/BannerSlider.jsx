import {
  useState,
  useEffect,
} from "react";

import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const DEFAULT_SLIDES = [
  {
    _id: "slide-1",
    title: "printing machine",
    highlight: "",
    desc: "Versatile printing machine for all industrial printing needs.",
    image: "/products/packaging-machine.jpg",
  },
  {
    _id: "slide-2",
    title: "welding",
    highlight: "",
    desc: "Industrial welding solutions for precision metal fabrication.",
    image: "/products/steel.jpg",
  },
  {
    _id: "slide-3",
    title: "automatic cup machine",
    highlight: "",
    desc: "High-efficiency cup production with precision forming technology.",
    image: "/products/papercup-machine.jpg",
  },
];

const resolveSlideImage = (src) => {
  if (!src) return DEFAULT_SLIDES[0].image;
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return DEFAULT_SLIDES[0].image;
};

const BannerSlider = () => {

  const [slides, setSlides] =
    useState([]);

  const [current, setCurrent] =
    useState(0);

  const [loading, setLoading] =
    useState(true);



  /* 🔥 USE LOCAL SLIDES */
  useEffect(() => {
    setSlides(DEFAULT_SLIDES);
    setLoading(false);
  }, []);

  const displaySlides =
    slides.length > 0 ? slides : DEFAULT_SLIDES;

  /* 🔥 AUTO SLIDE */
  useEffect(() => {
    if (displaySlides.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % displaySlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [displaySlides.length]);

  /* 🔄 LOADING */
  if (loading) {

    return (
      <section className="py-10 bg-gray-50">

        <div className="max-w-7xl mx-auto px-6">

          <div className="h-[300px] flex items-center justify-center bg-white rounded-2xl shadow">

            <p className="text-gray-500 text-lg animate-pulse">
              Loading banners...
            </p>

          </div>

        </div>

      </section>
    );
  }

  /* 🔥 PREV */
  const prevSlide = () => {
    setCurrent(
      current === 0 ? displaySlides.length - 1 : current - 1
    );
  };

  const nextSlide = () => {
    setCurrent((current + 1) % displaySlides.length);
  };




  return (
    <section className="py-10 bg-gray-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white">

          <div
            className="flex transition-transform duration-700"
            style={{
              transform:
                `translateX(-${current * 100}%)`,
            }}
          >

            {displaySlides.map((slide, index) => (
                <div
                  key={slide._id || index}
                  className="min-w-full flex flex-col md:grid md:grid-cols-2 items-center"
                >

                  {/* 🔥 LEFT */}
                  <div className="p-6 md:p-8 space-y-3 md:space-y-5 order-2 md:order-1 text-center md:text-left">

                    <h2 className="text-2xl md:text-4xl font-bold leading-tight">

                      {slide.title}

                      <br />

                      <span className="text-[#1E3A8A]">
                        {slide.highlight}
                      </span>

                    </h2>

                    <p className="text-gray-500 text-sm md:text-lg">
                      {slide.desc}
                    </p>



                    {/* 🔥 BUTTON */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 pt-2 justify-center md:justify-start">

                      <button className="bg-[#1E3A8A] text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-blue-800 transition text-sm md:text-base font-bold shadow-md">
                        Explore More
                      </button>

                      <p className="text-[10px] md:text-sm text-gray-400">
                        Trusted by 500+ Manufacturers
                      </p>

                    </div>

                  </div>



                  {/* 🔥 IMAGE */}
                  <div className="order-1 md:order-2 w-full">
                    <img
                      src={resolveSlideImage(slide.image)}
                      className="w-full h-[200px] md:h-[350px] object-cover"
                      alt={slide.title}
                      onError={(e) => {
                        e.target.src = DEFAULT_SLIDES[0].image;
                      }}
                    />
                  </div>


                </div>
            ))}

          </div>



          {/* 🔥 LEFT BUTTON */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow w-10 h-10 rounded-full flex items-center justify-center"
          >
            <FaChevronLeft />
          </button>



          {/* 🔥 RIGHT BUTTON */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow w-10 h-10 rounded-full flex items-center justify-center"
          >
            <FaChevronRight />
          </button>

        </div>

      </div>

    </section>
  );
};

export default BannerSlider;