import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/config";

// Color mapping for display
const colorMap = {
  "orange": "bg-orange-500",
  "red": "bg-red-500",
  "blue": "bg-blue-500",
  "green": "bg-green-500",
  "purple": "bg-purple-500",
  "yellow": "bg-yellow-500",
  "pink": "bg-pink-500",
  "cyan": "bg-cyan-500",
  "indigo": "bg-indigo-500",
  "teal": "bg-teal-500",
  "": "bg-orange-500",
};

const textColorMap = {
  "bg-orange-500": "text-orange-600",
  "bg-red-500": "text-red-600",
  "bg-blue-500": "text-blue-700",
  "bg-green-500": "text-green-700",
  "bg-purple-500": "text-purple-700",
  "bg-yellow-500": "text-yellow-600",
  "bg-pink-500": "text-pink-600",
  "bg-cyan-500": "text-cyan-700",
  "bg-indigo-500": "text-indigo-700",
  "bg-teal-500": "text-teal-700",
};

const IndustriesCards = () => {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/industries`);
        const result = await res.json();
        
        // Dynamic data from database
        if (result.success && result.industries && result.industries.length > 0) {
          setIndustries(result.industries);
        } else {
          // Agar database empty hai to empty array, kuch show nahi hoga
          setIndustries([]);
        }
      } catch (err) {
        console.error("Industries fetch error:", err);
        setIndustries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-[#f7f7f7]">
        <p className="text-center text-gray-500 animate-pulse">
          Loading industries...
        </p>
      </section>
    );
  }

  // Agar koi industry nahi hai to section mat dikhao
  if (industries.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-[#1E3A8A]">
            Industries We Serve
          </h2>
          <p className="text-gray-500 mt-2 md:mt-3 text-sm md:text-lg">
            Providing smart industrial solutions across multiple sectors
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-7 pt-6 md:pt-0">
          {industries.map((item, index) => {
            // Get color class from database color field
            const bgColor = colorMap[item.color] || "bg-orange-500";
            const textColor = textColorMap[bgColor] || "text-orange-600";
            
            return (
              <div
                key={item._id}
                className="relative bg-white rounded-[24px] md:rounded-[34px] border-[2px] md:border-[3px] border-gray-200 px-5 md:px-6 pt-16 md:pt-20 pb-10 md:pb-12 min-h-[300px] md:min-h-[360px] shadow-sm hover:shadow-xl transition duration-300"
              >
                {/* Icon - Dynamic from database */}
                <div
                  className={`absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full ${bgColor} flex items-center justify-center text-white text-3xl md:text-4xl border-[4px] md:border-[5px] border-white shadow-md`}
                >
                  {item.icon || "🏭"}
                </div>

                {/* Title - Dynamic from database */}
                <h3 className={`text-center font-extrabold text-[18px] md:text-[20px] leading-tight md:leading-7 mt-2 md:mt-3 ${textColor}`}>
                  {item.title}
                </h3>

                {/* Description - Dynamic from database */}
                <p className="text-center text-gray-700 text-[14px] md:text-[16px] leading-relaxed md:leading-8 mt-4 md:mt-6">
                  {item.desc}
                </p>

                {/* Number - Dynamic based on order or index */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <div className={`${bgColor} text-white px-5 md:px-7 py-1.5 md:py-2 rounded-t-[10px] md:rounded-t-[14px] text-xs md:text-sm font-bold tracking-[2px] md:tracking-[3px] shadow`}>
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IndustriesCards;