import React from "react";
import { 
  FaHome, 
  FaThLarge, 
  FaSearch, 
  FaUser,
  FaFileAlt
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Home",
      icon: <FaHome />,
      path: "/",
    },
    {
      name: "Explore",
      icon: <FaThLarge />,
      path: "/all-products",
    },
    {
      name: "Search",
      icon: <FaSearch />,
      path: "/search",
    },
    {
      name: "Queries",
      icon: <FaFileAlt />,
      path: "/my-queries",
    },
    {
      name: "Profile",
      icon: <FaUser />,
      path: "/profile",
    },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-[1000] pb-safe">
      <div className="flex items-center justify-around h-16">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all ${
              isActive(item.path)
                ? "text-[#1E3A8A]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className={`text-lg ${isActive(item.path) ? "scale-110" : "scale-100"} transition-transform`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              {item.name}
            </span>
            
            {isActive(item.path) && (
              <div className="w-1 h-1 bg-[#1E3A8A] rounded-full mt-0.5" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomBar;
