import {
  useEffect,
  useState,
} from "react";

import { API_BASE_URL } from "../api/config";

const LocationModal = ({
  onSelect,
  onClose,
}) => {

  const [show, setShow] =
    useState(false);

  const [cities, setCities] =
    useState([]);

  const [
    selectedState,
    setSelectedState,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);




  /* 🔥 FETCH DATABASE */
  useEffect(() => {

    const fetchCities =
      async () => {

        try {

          const res =
            await fetch(`${API_BASE_URL}/location-cities`);

          const data =
            await res.json();

          setCities(
            data.cities || data
          );

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);
        }
      };

    fetchCities();

  }, []);




  /* 🔥 OPEN */
  useEffect(() => {

    const timer =
      setTimeout(
        () => setShow(true),
        50
      );

    return () =>
      clearTimeout(timer);

  }, []);




  /* 🔥 CLOSE */
  const handleClose = () => {

    setShow(false);

    setTimeout(
      () => onClose(),
      400
    );
  };

  /* 🔥 ESC CLOSE */
  useEffect(() => {

    const handleEsc = (
      e
    ) => {

      if (
        e.key === "Escape"
      ) {
        handleClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleEsc
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleEsc
      );

  }, []);




  /* 🔥 UNIQUE STATES */
  const states = [
    ...new Set(
      cities.map(
        (item) =>
          item.state
      )
    ),
  ];




  /* 🔥 FILTER CITY */
  const filteredCities =
    selectedState
      ? cities.filter(
          (item) =>
            item.state ===
            selectedState
        )
      : [];




  /* 🔄 LOADING */
  if (loading) {

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">

        <p className="text-white text-lg animate-pulse">

          Loading cities...

        </p>

      </div>
    );
  }




  return (
    <div
      className={`fixed inset-0 z-[9999] flex justify-center items-center transition-all duration-500
      ${
        show
          ? "bg-black/60 backdrop-blur-sm opacity-100"
          : "opacity-0 bg-black/0"
      }`}
    >

      {/* 🔥 MODAL */}
      <div
        className={`bg-white w-[800px] max-w-[95%] rounded-2xl shadow-2xl overflow-hidden
        transform transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          show
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-24 scale-95 opacity-0"
        }`}
      >

        {/* 🔥 HEADER */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] text-white px-6 py-4 flex justify-between items-center">

          <h2 className="text-lg font-semibold">

            Choose your{" "}

            <span className="font-bold">
              State & City
            </span>

          </h2>



          <button
            onClick={handleClose}
            className="text-xl hover:scale-110 transition"
          >
            ✕
          </button>

        </div>



        {/* 🔥 BODY */}
        <div className="p-6">

          {/* 🔥 TITLE */}
          <p className="text-center text-gray-600 mb-6">

            Choose Popular City

          </p>



          {/* 🔥 CITY GRID */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 text-center">

            {cities
              .slice(0, 6)
              .map((city) => (

                <div
                  key={city._id}
                  onClick={() =>
                    onSelect(
                      city.name
                    )
                  }
                  className="cursor-pointer group"
                >

                  <img
                    src={city.img}
                    alt={city.name}
                    className="w-14 h-14 mx-auto mb-2 transition duration-300 group-hover:scale-110"
                    style={{
                      filter:
                        "invert(27%) sepia(91%) saturate(400%) hue-rotate(90deg) brightness(85%)",
                    }}
                  />



                  <p className="text-sm text-gray-700 group-hover:text-[#1E3A8A] transition">

                    {city.name}

                  </p>

                </div>
              ))}

          </div>



          {/* 🔥 OTHER CITY */}
          <p className="text-center text-gray-600 mt-8 mb-4">

            Choose other city

          </p>



          <div className="flex gap-4">

            {/* 🔥 STATE */}
            <select
              value={selectedState}
              onChange={(e) =>
                setSelectedState(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none"
            >

              <option value="">
                Select State
              </option>



              {states.map(
                (state) => (

                  <option
                    key={state}
                    value={state}
                  >

                    {state}

                  </option>
                )
              )}

            </select>



            {/* 🔥 CITY */}
            <select
              onChange={(e) =>
                onSelect(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none"
            >

              <option value="">
                Select City
              </option>



              {filteredCities.map(
                (city) => (

                  <option
                    key={city._id}
                    value={city.name}
                  >

                    {city.name}

                  </option>
                )
              )}

            </select>

          </div>



          {/* 🔥 BUTTON */}
          <div className="flex justify-end mt-6">

            <button
              onClick={handleClose}
              className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white px-6 py-2 rounded-full font-medium transition shadow-md"
            >

              Close

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default LocationModal;