import React from "react";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";

const Sidebar = ({
  sidebarOpen,
  menuItems,
  activeMenu,
  setActiveMenu,
  adminProfile,
}) => {
  return (
    <aside
      className={`${
        sidebarOpen ? "w-[210px]" : "w-[70px]"
      } h-screen bg-black border-r border-white/10 flex flex-col overflow-hidden transition-all duration-300`}
    >
      {/* LOGO */}
      <div className="h-[58px] flex items-center px-4 border-b border-white/10 flex-shrink-0">
        <Link to="/" className="hover:opacity-80 transition-opacity flex items-center justify-center w-full">
          {sidebarOpen ? (
            <img src={logo} alt="Logo" className="h-8 w-auto object-contain brightness-100" />
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              UC
            </div>
          )}
        </Link>
      </div>

      {/* MENU */}
      <div className="flex-1 px-2 pt-3 overflow-hidden">
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (item.name === "Logout") {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/sign-in";
                } else {
                  setActiveMenu(item.name);
                }
              }}
              className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-3" : "justify-center px-0"} h-[40px] rounded-xl transition-all duration-300 whitespace-nowrap ${
                activeMenu === item.name
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
              title={!sidebarOpen ? item.name : ""}
            >
              {item.icon}
              {sidebarOpen && (
                <span className="text-[13px] font-medium transition-opacity duration-300">
                  {item.name}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* PROFILE */}
      <div className="p-2 pb-3 flex-shrink-0">
        <div 
          onClick={() => setActiveMenu("Profile")}
          className={`bg-[#0b1220] border border-white/10 rounded-xl ${sidebarOpen ? "px-3" : "px-0 justify-center"} py-3 flex items-center justify-between cursor-pointer hover:border-blue-600/50 transition-colors`}
        >
          <div className="flex items-center gap-2">
            <img
              src="https://i.pravatar.cc/100"
              alt="admin"
              className="w-9 h-9 rounded-full object-cover border border-blue-600"
            />
            {sidebarOpen && (
              <div>
                <h3 className="text-white text-[12px] font-semibold leading-none whitespace-nowrap">
                  {adminProfile.name}
                </h3>
                <p className="text-gray-400 text-[10px] mt-1 whitespace-nowrap uppercase">
                  {adminProfile.role}
                </p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button className="text-gray-400 hover:text-white">
              <Settings size={14} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
