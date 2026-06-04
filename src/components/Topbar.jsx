import {
  FaTag,
} from "react-icons/fa";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import PartnerLoginModal from "./PartnerLoginModal";

const Topbar = () => {

  const [partnerModal, setPartnerModal] = useState({ isOpen: false, mode: 'login' });

  const marqueeRef =
    useRef(null);


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

      <div className="max-w-7xl mx-auto h-[40px] md:h-[44px] px-4 flex items-center justify-between md:justify-start gap-4 md:gap-6 overflow-hidden">

        {/* 🔥 LEFT OFFER */}
        <div className="flex items-center gap-2 md:gap-3 whitespace-nowrap flex-shrink-0">
          <div className="bg-blue-500/20 p-1 md:p-1.5 rounded-full animate-pulse">
            <FaTag className="text-blue-400 text-[10px] md:text-xs" />
          </div>

          <p className="text-[10px] md:text-[12px] tracking-wide">
            <span className="font-extrabold text-blue-400">PROMO:</span> <span className="hidden sm:inline">Get </span><span className="text-white font-bold underline decoration-blue-500/50 underline-offset-2">20% OFF</span><span className="hidden sm:inline"> on premium leads!</span>
          </p>
        </div>



        {/* 🔥 MARQUEE - Hidden on Mobile */}
        <div className="hidden lg:flex flex-1 overflow-hidden relative">
          {/* Subtle fade edges for marquee */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#0F2A43] to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#0F2A43] to-transparent z-10"></div>
          
          <div
            ref={marqueeRef}
            className="flex whitespace-nowrap text-[#FFC107] font-bold text-[12px] drop-shadow-[0_0_8px_rgba(255,193,7,0.3)]"
          >

            <span className="mr-20">
              PAPER CUP MACHINE MANUFACTURERS • CONNECT WITH TRUSTED INDUSTRIAL SUPPLIERS • GET BEST DEALS ON DISPOSABLE PRODUCT MACHINES • GROW YOUR MANUFACTURING BUSINESS FASTER • 100% VERIFIED LEADS • BULK ORDERS • OEM SERVICES AVAILABLE •
            </span>

            <span>
              PAPER CUP MACHINE MANUFACTURERS • CONNECT WITH TRUSTED INDUSTRIAL SUPPLIERS • GET BEST DEALS ON DISPOSABLE PRODUCT MACHINES • GROW YOUR MANUFACTURING BUSINESS FASTER • 100% VERIFIED LEADS • BULK ORDERS • OEM SERVICES AVAILABLE •
            </span>

          </div>

        </div>



        {/* 🔥 RIGHT BUTTONS */}
        <div className="flex-shrink-0 flex items-center gap-3 md:gap-5">
          <button 
            onClick={() => setPartnerModal({ isOpen: true, mode: 'signup' })}
            className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-orange-500 hover:to-blue-600 text-white text-[9px] md:text-[12px] font-bold px-3 md:px-6 py-[6px] md:py-[8px] rounded-full transition-all shadow-md shadow-blue-900/20 active:scale-95 uppercase tracking-wider"
          >
            Partner Join
          </button>
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