import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import logo from "../../assets/logo.png";
import { 
  FaThLarge, 
  FaUsers, 
  FaBox, 
  FaCog, 
  FaSignOutAlt, 
  FaChartBar, 
  FaHandshake,
  FaBars,
  FaTimes,
  FaShieldAlt,
  FaUserPlus
} from 'react-icons/fa';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PartnerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/partner/dashboard', icon: FaThLarge },
    { name: 'My Leads', path: '/partner/leads', icon: FaUsers },
    { name: 'Inventory', path: '/partner/inventory', icon: FaBox },
    { name: 'KYC Verification', path: '/partner/kyc', icon: FaShieldAlt },
    { name: 'Account Settings', path: '/partner/settings', icon: FaCog },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-[1000] p-3 bg-[#1E3A8A] text-white rounded-xl shadow-lg"
      >
        {mobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[999] bg-[#0B1C2C] text-white transition-all duration-300
        ${sidebarOpen ? 'w-60' : 'w-[70px]'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        <div className="h-full flex flex-col overflow-hidden">
          
          {/* Logo + Toggle */}
          <div className="h-[60px] flex items-center gap-2 px-4 border-b border-white/5 flex-shrink-0">
            <Link to="/" className={`flex items-center hover:opacity-80 transition-opacity ${sidebarOpen ? 'flex-1 justify-center' : ''}`}>
              {sidebarOpen ? (
                <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                  UC
                </div>
              )}
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex items-center justify-center w-7 h-7 text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 pt-3 overflow-hidden">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`
                      flex items-center ${sidebarOpen ? 'gap-3 px-3' : 'justify-center px-0'} h-[42px] rounded-xl transition-all whitespace-nowrap
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-lg shadow-blue-900/20' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                    `}
                    title={!sidebarOpen ? item.name : ''}
                  >
                    <Icon className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'} ${sidebarOpen ? '' : 'text-lg'}`} />
                    {sidebarOpen && (
                      <span className="text-sm font-bold transition-opacity duration-300">
                        {item.name}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Profile / Logout */}
          <div className={`p-2 pb-3 flex-shrink-0 border-t border-white/5`}>
            <div className={`${sidebarOpen ? 'px-3' : 'px-0 justify-center'} py-3 flex items-center gap-2 rounded-xl bg-white/[0.02]`}>
              <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center text-sm font-bold border-2 border-blue-600/30 flex-shrink-0">
                UP
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">Ultra Partner</p>
                  <p className="text-[10px] text-slate-500 truncate">Pro Manufacturer</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-3' : 'justify-center px-0'} h-[40px] mt-2 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all`}
              title={!sidebarOpen ? 'Logout' : ''}
            >
              <FaSignOutAlt className="flex-shrink-0" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>

        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 min-w-0 overflow-auto transition-all duration-300 p-6 lg:p-8`}>
        <Outlet />
      </main>

    </div>
  );
};

export default PartnerLayout;
