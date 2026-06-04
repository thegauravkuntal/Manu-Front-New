import React from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import NotificationsDropdown from "./NotificationsDropdown";

const AdminHeader = ({
  setSidebarOpen,
  sidebarOpen,
  setShowGlobalSearch,
  showNotifications,
  setShowNotifications,
  notifications,
  setNotifications,
  setActiveMenu,
  adminProfile,
}) => {
  return (
    <header className="h-[58px] bg-black border-b border-white/10 flex items-center justify-between px-4 flex-shrink-0">
      {/* LEFT */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="text-white"
      >
        <Menu size={20} />
      </button>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setShowGlobalSearch(true)}
          className="text-gray-300 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
        >
          <Search size={17} />
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-gray-300 hover:text-white relative p-1.5 rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
          >
            <Bell size={17} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 text-white text-[7px] font-semibold flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          {/* NOTIFICATIONS DROPDOWN PANEL */}
          <NotificationsDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
            setNotifications={setNotifications}
            setActiveMenu={setActiveMenu}
          />
        </div>

        <div 
          onClick={() => setActiveMenu("Profile")}
          className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded-xl transition-colors"
        >
          <img
            src="https://i.pravatar.cc/100"
            alt="admin"
            className="w-8 h-8 rounded-full object-cover border border-blue-600"
          />
          <div className="leading-tight">
            <h3 className="text-white text-[12px] font-semibold">
              {adminProfile.name}
            </h3>
            <p className="text-gray-400 text-[10px] uppercase">
              {adminProfile.role}
            </p>
          </div>
          <ChevronDown
            size={14}
            className="text-gray-400"
          />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
