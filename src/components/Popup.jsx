import { useState, useEffect } from "react";
import { X, Mail, Gift, Phone } from "lucide-react";

const Popup = ({ isOpen, onClose, onSubscribe }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Handle escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      // Call API to save subscriber
      const res = await fetch(`${import.meta.env.VITE_API_URL || "https://manu-back-new.onrender.com/api"}/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name: name || undefined }),
      });

      const data = await res.json();
      if (data.success || data.msg) {
        setMessage("🎉 Thank you for subscribing! Check your inbox for offers.");
        setTimeout(() => {
          if (onSubscribe) onSubscribe(email);
          onClose();
        }, 2000);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Popup Content */}
      <div className="relative bg-gradient-to-br from-[#0a1628] to-[#081120] rounded-2xl max-w-md w-full shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
            <Gift size={32} className="text-orange-400" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            Special Offer!
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-center text-sm mb-4">
            Get <span className="text-orange-400 font-bold">20% OFF</span> on your first order
          </p>

          <div className="w-16 h-[2px] bg-orange-500 mx-auto mb-6 rounded-full" />

          {/* Benefits */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Exclusive deals on industrial machinery</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Early access to new products</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Free consultation call</span>
            </div>
          </div>

          {/* Subscription Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-[#0f1724] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
            <input
              type="email"
              placeholder="Email address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#0f1724] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
            
            {message && (
              <p className={`text-xs text-center ${message.includes("🎉") ? "text-green-400" : "text-red-400"}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition-all disabled:bg-orange-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe Now"}
            </button>
          </form>

          {/* No thanks link */}
          <button
            onClick={onClose}
            className="w-full text-center text-gray-500 text-xs mt-4 hover:text-gray-400 transition-colors"
          >
            No thanks, I'm not interested
          </button>

          {/* Small note */}
          <p className="text-gray-600 text-[10px] text-center mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Popup;