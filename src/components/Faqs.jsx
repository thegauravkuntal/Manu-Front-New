import {
  useState,
  useEffect,
} from "react";

import {
  FaChevronDown,
} from "react-icons/fa";

import { API_BASE_URL } from "../api/config";

const FAQ = () => {

  const [faqs, setFaqs] =
    useState([]);

  const [openIndex, setOpenIndex] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* 🔥 FETCH FAQS */
  useEffect(() => {

    const fetchFaqs =
      async () => {

        try {

          const res =
            await fetch(`${API_BASE_URL}/faq`);

          const data =
            await res.json();

          /* 🔥 FIX - Always ensure faqs is an array */
          if (data.success && Array.isArray(data.faqs)) {
            setFaqs(data.faqs);
          } else if (Array.isArray(data)) {
            setFaqs(data);
          } else if (data.faqs && Array.isArray(data.faqs)) {
            setFaqs(data.faqs);
          } else {
            console.error("FAQs data is not an array:", data);
            setFaqs([]);
          }

        } catch (err) {

          console.log("FAQ fetch error:", err);
          setFaqs([]);

        } finally {

          setLoading(false);
        }
      };

    fetchFaqs();

  }, []);

  /* 🔥 TOGGLE */
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  /* 🔄 LOADING */
  if (loading) {
    return (
      <p className="text-center py-10 text-gray-500">
        Loading FAQs...
      </p>
    );
  }

  /* ❌ NO FAQS */
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* 🔥 HEADER */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 mt-2 md:mt-3 text-sm md:text-lg">
            Find answers to common questions
          </p>
        </div>

        {/* 🔥 FAQ LIST */}
        <div className="space-y-4 md:space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={faq._id || index}
              className="bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              {/* 🔥 QUESTION */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between px-5 md:px-7 py-4 md:py-5 text-left"
              >
                <span className="text-base md:text-lg font-semibold text-gray-800 leading-tight">
                  {faq.question}
                </span>
                <FaChevronDown
                  className={`text-[#1E3A8A] text-xs md:text-sm transition-transform duration-300 flex-shrink-0 ml-4 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* 🔥 ANSWER */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 md:px-7 pb-4 md:pb-5 text-gray-600 text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;