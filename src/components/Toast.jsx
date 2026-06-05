import { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 bg-[#0a1628] border border-green-500/30 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-green-900/20">
        <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
        <p className="text-sm font-medium">{message}</p>
        <button onClick={onClose} className="p-0.5 text-gray-400 hover:text-white ml-2">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
