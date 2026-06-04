import {
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  useState,
  useEffect,
} from "react";

import { API_BASE_URL } from "../api/config";

const LocationSection = () => {

  const [cities, setCities] =
    useState([]);

  const [showAll, setShowAll] =
    useState(false);

  const [loading, setLoading] =
    useState(true);




  /* 🔥 FETCH FROM BACKEND */
  useEffect(() => {

    const fetchCities =
      async () => {

        try {

          const res =
            await fetch(`${API_BASE_URL}/cities`);

          const data =
            await res.json();

          setCities(
            data.cities ||
            data
          );

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);
        }
      };

    fetchCities();

  }, []);




  /* 🔥 SHOW DATA */
  const visibleCities =
    showAll
      ? cities
      : cities.slice(0, 20);




  /* 🔄 LOADING */
  if (loading) {

    return (
      <section className="bg-gray-50 py-16 text-center">

        <p className="text-gray-500 animate-pulse">

          Loading cities...

        </p>

      </section>
    );
  }




  /* ❌ NO DATA */
  if (
    !cities ||
    cities.length === 0
  ) {
    return null;
  }




  return (
    <section className="bg-gray-50 py-10 md:py-16">

      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">

        {/* 🔥 TOP TAG */}
        <div className="inline-flex items-center gap-2 bg-blue-100 text-[#1E3A8A] px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm mb-3 md:mb-4">

          <FaMapMarkerAlt />

          Service Locations

        </div>



        {/* 🔥 HEADING */}
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">

          Available in{" "}

          <span className="text-[#1E3A8A]">

            {cities.length}+ Cities

          </span>

        </h2>



        <p className="text-gray-600 text-sm md:text-lg mb-8 md:mb-10">

          Experience our premium home services across India

        </p>



        {/* 🔥 GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-3 md:gap-y-4 gap-x-4 md:gap-x-8 text-left justify-center">

          {visibleCities.map(
            (city) => (

              <div
                key={city._id}
                className="flex items-center gap-2 text-gray-700 text-xs md:text-base"
              >

                <FaMapMarkerAlt className="text-[#1E3A8A] text-[10px] md:text-sm" />

                {city.name}

              </div>
            )
          )}

        </div>



        {/* 🔥 BUTTON */}
        <button
          onClick={() =>
            setShowAll(
              !showAll
            )
          }
          className="mt-8 md:mt-10 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white px-6 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base transition"
        >

          {showAll
            ? "Show Less"
            : `View All ${cities.length} Cities`}

        </button>

      </div>

    </section>
  );
};

export default LocationSection;