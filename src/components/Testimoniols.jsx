import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/config";

const DEFAULT_TESTIMONIALS = [
  {
    _id: "default-1",
    name: "Rajesh Kumar",
    text: "Ultraclap helped us source a paper cup machine within days. Direct supplier contact saved us weeks of back-and-forth with brokers.",
    location: "Bhiwadi, Rajasthan",
    color: "green",
  },
  {
    _id: "default-2",
    name: "Priya Sharma",
    text: "We listed our packaging machinery and started receiving qualified leads immediately. The partner dashboard makes follow-ups very easy.",
    location: "Ahmedabad, Gujarat",
    color: "purple",
  },
  {
    _id: "default-3",
    name: "Amit Patel",
    text: "Found a verified steel fabrication supplier for our plant expansion. Pricing was transparent and the seller responded within hours.",
    location: "Pune, Maharashtra",
    color: "green",
  },
  {
    _id: "default-4",
    name: "Suresh Reddy",
    text: "Excellent B2B marketplace for industrial equipment. From inquiry to delivery coordination, the entire process felt professional.",
    location: "Hyderabad, Telangana",
    color: "purple",
  },
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/testimonials`);
        const data = await res.json();

        if (res.ok && data.success && data.testimonials?.length > 0) {
          setTestimonials(data.testimonials.slice(0, 4));
        } else {
          setTestimonials(DEFAULT_TESTIMONIALS);
        }
      } catch (err) {
        console.error("Testimonials fetch error:", err);
        setTestimonials(DEFAULT_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const displayList =
    testimonials.length > 0 ? testimonials.slice(0, 4) : DEFAULT_TESTIMONIALS;

  if (loading) {
    return (
      <section className="py-14 bg-[#f5f7f6]">
        <p className="text-center text-gray-500 animate-pulse">Loading testimonials...</p>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-14 bg-[#f5f7f6]">
      <div className="text-center mb-8 md:mb-10 px-4">
        <p className="text-orange-600 tracking-[2px] md:tracking-[3px] text-[10px] md:text-xs font-semibold mb-1 md:mb-2">
          TESTIMONIALS
        </p>

        <h2 className="text-2xl md:text-5xl font-extrabold leading-tight">
          Testimonials{" "}
          <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
            Real Voices.
          </span>
        </h2>

        <div className="w-12 md:w-16 h-[2px] md:h-[3px] bg-orange-500 mx-auto mt-3 md:mt-4 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayList.map((item) => (
            <div
              key={item._id}
              className="relative bg-white rounded-2xl md:rounded-[26px] p-5 md:p-6 shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition duration-300 min-h-[260px] md:min-h-[300px]"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] md:border-[4px] border-teal-500 flex items-center justify-center mb-3 md:mb-4">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-teal-500 rounded-full" />
              </div>

              <div
                className={`absolute top-4 right-5 text-xl md:text-2xl font-bold ${
                  item.color === "green" ? "text-orange-300" : "text-purple-300"
                }`}
              >
                ❝
              </div>

              <p className="text-gray-700 text-[13px] md:text-[14px] leading-relaxed md:leading-7 mb-3 md:mb-4 italic">
                &ldquo;{item.text}&rdquo;
              </p>

              <div className="flex gap-1.5 md:gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <span
                    key={dot}
                    className="w-2 h-2 md:w-2.5 md:h-2.5 bg-amber-400 rounded-full"
                  />
                ))}
              </div>

              <h3
                className={`text-[15px] md:text-[16px] font-bold leading-tight ${
                  item.color === "green" ? "text-orange-600" : "text-purple-700"
                }`}
              >
                {item.name}
              </h3>

              <p className="text-gray-600 text-[12px] md:text-[14px] mt-1">
                📍 {item.location}
              </p>

              <div
                className={`absolute bottom-0 right-0 w-16 h-16 md:w-24 md:h-24 rounded-tl-full ${
                  item.color === "green" ? "bg-orange-600" : "bg-purple-700"
                }`}
              />

              <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 text-white text-lg md:text-xl font-bold">
                ❞
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
