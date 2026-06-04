import { Briefcase, ShoppingCart, ShieldCheck } from "lucide-react";

const NotificationsDropdown = ({
  isOpen,
  onClose,
  notifications = [],
  setNotifications,
  setActiveMenu
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      <div className="absolute right-0 mt-2 w-[340px] bg-slate-950/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-3 duration-200">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-white">Notifications</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-orange-400 text-[9px] font-black uppercase">
                {unreadCount} New
              </span>
            )}
          </div>
          <button 
            onClick={() => {
              setNotifications(notifications.map(n => ({ ...n, read: true })));
            }}
            className="text-[9px] font-black text-orange-400 hover:text-orange-300 uppercase tracking-wider"
          >
            Mark all as read
          </button>
        </div>

        <div className="max-h-[280px] overflow-y-auto divide-y divide-white/5 custom-scrollbar">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => {
                  setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
                  setActiveMenu(notif.type);
                  onClose();
                }}
                className={`p-3.5 hover:bg-white/5 transition-all duration-300 cursor-pointer flex gap-3 items-start relative ${
                  !notif.read ? "bg-blue-600/[0.02]" : ""
                }`}
              >
                {!notif.read && (
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-600" />
                )}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0 ${
                  notif.type === "Leads" ? "bg-blue-600/10 text-orange-400 border border-blue-600/20" :
                  notif.type === "Orders" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                  "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                }`}>
                  {notif.type === "Leads" ? <Briefcase size={12} /> :
                   notif.type === "Orders" ? <ShoppingCart size={12} /> :
                   <ShieldCheck size={12} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-bold text-white leading-tight">{notif.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-snug line-clamp-2">{notif.message}</p>
                  <span className="text-[9px] text-gray-500 mt-1 block font-medium">{notif.time}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500 text-[11px]">
              No notifications found.
            </div>
          )}
        </div>

        <div className="p-2 bg-white/[0.02] border-t border-white/5 text-center">
          <button 
            onClick={() => setNotifications([])}
            className="text-[9px] font-black text-gray-400 hover:text-white uppercase tracking-wider block w-full py-1.5"
          >
            Clear All Notifications
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationsDropdown;
