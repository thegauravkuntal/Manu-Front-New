import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronRight, FaStoreAlt
} from "react-icons/fa";
import { API_BASE_URL } from "../api/config";
import { getCategoryUrl } from "../utils/urlHelpers";

const Categories = () => {
  const [productCategories, setProductCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* 🔥 FETCH DATA */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        const data = await res.json();
        if (data.success) {
          const seen = new Set();
          const cats = [];
          (data.products || []).forEach(p => {
            const name = p.category || 'Uncategorized';
            if (!seen.has(name)) {
              seen.add(name);
              cats.push(name);
            }
          });
          setProductCategories(cats);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium animate-pulse">Curating top categories...</p>
        </div>
      </section>
    );
  }

  if (!productCategories || productCategories.length === 0) return null;

  return (
    <section className="bg-white py-12 md:py-24 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full blur-2xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* 🔥 HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-6 mb-8 md:mb-16">
          <div>
            <span className="text-[#1E3A8A] font-bold text-[10px] md:text-sm tracking-[0.2em] uppercase mb-1 md:mb-3 block">Marketplace</span>
            <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight">
              Browse By <span className="text-[#1E3A8A]">Categories</span>
            </h2>
          </div>
          <button 
            onClick={() => navigate('/all-products')}
            className="group flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-slate-50 hover:bg-[#1E3A8A] text-slate-700 hover:text-white rounded-xl md:rounded-2xl text-xs md:text-sm font-bold transition-all duration-300"
          >
            View All
            <FaChevronRight className="text-[8px] md:text-[10px] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 🔥 GRID */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-6">
          {productCategories.slice(0, 8).map((name) => (
            <div
              key={name}
              onClick={() => navigate(getCategoryUrl(name))}
              className="group relative flex flex-col items-center justify-center p-4 md:p-8 bg-white border border-slate-100 rounded-2xl md:rounded-[32px] shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* 🔥 ICON CONTAINER */}
              <div className="relative z-10 mb-2 md:mb-5 w-10 h-10 md:w-16 md:h-16 bg-slate-50 group-hover:bg-[#1E3A8A] rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-2xl text-slate-600 group-hover:text-white group-hover:rotate-[360deg] transition-all duration-700 shadow-inner group-hover:shadow-blue-900/20">
                <FaStoreAlt />
              </div>

              {/* 🔥 TEXT */}
              <p className="relative z-10 text-[10px] md:text-sm font-extrabold text-slate-700 group-hover:text-slate-900 text-center leading-tight">
                {name}
              </p>

              {/* Hover indicator */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-[#1E3A8A] group-hover:w-1/2 transition-all duration-500 rounded-t-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;