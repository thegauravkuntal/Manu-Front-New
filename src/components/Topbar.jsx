import {
  FaTag,
  FaThLarge,
  FaUser,
} from "react-icons/fa";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import { useNavigate } from "react-router-dom";

import PartnerLoginModal from "./PartnerLoginModal";

const Topbar = () => {

  const [partnerModal, setPartnerModal] = useState({ isOpen: false, mode: 'login' });

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const marqueeRef = useRef(null);

  /* 🔥 MARQUEE */
  useEffect(() => {
    let position = 0;
    let speed = 0.5;
    let animationFrame;

    const animate = () => {
      if (marqueeRef.current) {
        position -= speed;
        const width = marqueeRef.current.scrollWidth / 2;
        if (Math.abs(position) >= width) {
          position = 0;
        }
        marqueeRef.current.style.transform = `translateX(${position}px)`;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-[#0B1C2C] via-[#0F2A43] to-[#0B1C2C] text-white fixed top-0 z-[1000] shadow-lg border-b border-white/5">

      <div className="max-w-7xl mx-auto h-[40px] md:h-[44px] px-4 flex items-center justify-between gap-2 md:gap-6 overflow-hidden">

        {/* 🔥 LEFT OFFER - Mobile mein chhota */}
        <div className="flex items-center gap-1 md:gap-3 whitespace-nowrap flex-shrink-0">
          <div className="bg-blue-500/20 p-0.5 md:p-1.5 rounded-full">
            <FaTag className="text-blue-400 text-[8px] md:text-xs" />
          </div>
          <p className="text-[8px] md:text-[12px] tracking-wide">
            <span className="font-extrabold text-blue-400">PROMO:</span>
            <span className="text-white font-bold underline decoration-blue-500/50 underline-offset-2 ml-0.5 md:ml-1">20% OFF</span>
          </p>
        </div>

        {/* 🔥 MARQUEE - Ab mobile mein bhi dikhega (flex, hidden nahi) */}
        <div className="flex-1 overflow-hidden relative">
          {/* Subtle fade edges */}
          <div className="absolute inset-y-0 left-0 w-4 md:w-8 bg-gradient-to-r from-[#0F2A43] to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-4 md:w-8 bg-gradient-to-l from-[#0F2A43] to-transparent z-10"></div>
          
          <div
            ref={marqueeRef}
            className="flex whitespace-nowrap text-[#FFC107] font-bold text-[8px] md:text-[12px] drop-shadow-[0_0_8px_rgba(255,193,7,0.3)]"
          >
            <span className="mr-10 md:mr-20">
              PAPER CUP MACHINE MANUFACTURERS • CONNECT WITH TRUSTED INDUSTRIAL SUPPLIERS • GET BEST DEALS ON DISPOSABLE PRODUCT MACHINES • GROW YOUR MANUFACTURING BUSINESS FASTER •
            </span>
            <span>
              PAPER CUP MACHINE MANUFACTURERS • CONNECT WITH TRUSTED INDUSTRIAL SUPPLIERS • GET BEST DEALS ON DISPOSABLE PRODUCT MACHINES • GROW YOUR MANUFACTURING BUSINESS FASTER •
            </span>
          </div>
        </div>

        {/* 🔥 RIGHT BUTTON - Mobile mein chhota */}
        <div className="flex-shrink-0">
          {user ? (
            <button 
              onClick={() => navigate(user.role === "admin" ? "/admin/dashboard" : "/partner/dashboard")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white text-[7px] md:text-[12px] font-bold px-2 md:px-6 py-1 md:py-[8px] rounded-full transition-all shadow-md shadow-green-900/20 active:scale-95 uppercase tracking-wider whitespace-nowrap flex items-center gap-1 md:gap-2"
            >
              {user.role === "partner" || user.role === "admin" ? (
                <><FaThLarge className="text-[6px] md:text-[10px]" /> Profile</>
              ) : (
                <><FaUser className="text-[6px] md:text-[10px]" /> My Account</>
              )}
            </button>
          ) : (
            <button 
              onClick={() => setPartnerModal({ isOpen: true, mode: 'signup' })}
              className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-orange-500 hover:to-blue-600 text-white text-[7px] md:text-[12px] font-bold px-2 md:px-6 py-1 md:py-[8px] rounded-full transition-all shadow-md shadow-blue-900/20 active:scale-95 uppercase tracking-wider whitespace-nowrap"
            >
              Partner Join
            </button>
          )}
        </div>

      </div>

      <PartnerLoginModal 
        isOpen={partnerModal.isOpen} 
        initialMode={partnerModal.mode}
        onClose={() => setPartnerModal({ ...partnerModal, isOpen: false })} 
      />

    </div>
  );
};

export default Topbar;