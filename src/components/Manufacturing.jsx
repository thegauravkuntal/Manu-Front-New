import {
  useEffect,
  useState,
} from "react";

import {
  FaStar,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";
import { API_BASE_URL, getServerUrl } from "../api/config";
import { getCategoryUrl } from "../utils/urlHelpers";

const Manufacturing = () => {

  const navigate =
    useNavigate();

  const [
    manufacturingData,
    setManufacturingData,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);




  /* 🔥 FETCH DATA */
  useEffect(() => {

    const fetchManufacturing =
      async () => {

        try {

          const res =
            await fetch(`${API_BASE_URL}/manufacturing`);

          const data =
            await res.json();

          setManufacturingData(
            data.manufacturing ||
            data
          );

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);
        }
      };

    fetchManufacturing();

  }, []);




  /* 🔄 LOADING */
  if (loading) {

    return (
      <section className="bg-white py-16">

        <p className="text-center text-gray-500 animate-pulse">

          Loading manufacturing...

        </p>

      </section>
    );
  }




  /* ❌ NO DATA */
  if (
    !manufacturingData ||
    manufacturingData.length === 0
  ) {
    return null;
  }




  return (
    <section className="bg-white py-8 md:py-16">

      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* 🔥 HEADER */}
        <div className="mb-6 md:mb-10">
          <span className="text-[#1E3A8A] font-bold text-[10px] md:text-sm tracking-[0.2em] uppercase mb-1 md:mb-3 block">Industries</span>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">

            Browse By Main Categories

          </h2>



          <p className="text-gray-500 mt-2 md:mt-3 text-sm md:text-base">

            Explore products across primary industrial sectors

          </p>

        </div>



        {/* 🔥 GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">

          {manufacturingData.map(
            (item) => (

              <div
                key={item._id}
                onClick={() =>
                  navigate(getCategoryUrl(item.title))
                }
                className="cursor-pointer bg-white rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 md:hover:-translate-y-2"
              >

                {/* 🔥 IMAGE */}
                <div className="relative overflow-hidden">

                  <img
                    src={getServerUrl(item.img) || "https://res.cloudinary.com/djsxaigna/image/upload/v1778687629/manufacturing_b2b/tiwud4hv6wtvt4cbgozz.jpg"}
                    alt={item.title}
                    className="w-full h-32 md:h-40 object-cover transition duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "https://res.cloudinary.com/djsxaigna/image/upload/v1778687629/manufacturing_b2b/tiwud4hv6wtvt4cbgozz.jpg";
                    }}
                  />



                  {/* 🔥 TAG */}
                  {item.tag && (
                    <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#1E3A8A] text-white text-[9px] md:text-[11px] px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow">
                      {item.tag}
                    </span>
                  )}

                </div>



                {/* 🔥 CONTENT */}
                <div className="p-3 md:p-4">

                  <h3 className="text-[12px] md:text-[14px] font-semibold text-gray-800 leading-tight md:leading-6 min-h-[40px] md:min-h-[55px] group-hover:text-[#1E3A8A] transition">

                    {item.title}

                  </h3>



                  {/* 🔥 LINE */}
                  <div className="mt-2 md:mt-4 w-6 md:w-10 h-[3px] md:h-[4px] bg-[#1E3A8A] rounded-full group-hover:w-12 md:group-hover:w-20 transition-all duration-300"></div>

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </section>
  );
};

export default Manufacturing;