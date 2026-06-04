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

const PartnerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-[1000] p-3 bg-[#1E3A8A] text-white rounded-xl shadow-lg"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[999] w-72 bg-[#0B1C2C] text-white transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:block
      `}>
        <div className="h-full flex flex-col p-6">
          
          {/* Logo Area */}
          <Link to="/" className="flex items-center gap-3 mb-12 px-2 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
            <div>
              <h2 className="text-lg font-extrabold tracking-tighter">ULTRA CLAP</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[2px]">Partner Portal</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-grow space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-lg shadow-blue-900/20' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  <item.icon className={`${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Logout */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-sm font-bold border-2 border-blue-600/30">
                UP
              </div>
              <div>
                <p className="text-xs font-bold text-white">Ultra Partner</p>
                <p className="text-[10px] text-slate-500">Pro Manufacturer</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>

        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-hidden">
        <Outlet />
      </main>

    </div>
  );
};

export default PartnerLayout;
