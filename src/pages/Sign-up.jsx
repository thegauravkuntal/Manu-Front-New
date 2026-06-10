import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import logo from "../../assets/logo.png"; // 👈 ADJUST PATH ACCORDING TO YOUR FOLDER STRUCTURE

const SignupForm = () => {
  return (
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border">

      {/* LOGO - Text hata kar image lagayi */}
      <div className="text-center mb-4">
        <img
          src={logo}
          alt="UltraClap Logo"
          className="h-12 mx-auto object-contain"
        />
      </div>

      <p className="text-center text-gray-500 mb-6">
        Create your account
      </p>

      {/* FORM */}
      <form className="space-y-5">

        {/* NAME */}
        <div className="relative">
          <FaUser className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Full Name"
            className="w-full pl-10 pr-3 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          />
        </div>

        {/* EMAIL */}
        <div className="relative">
          <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
          <input
            type="email"
            placeholder="Email address"
            className="w-full pl-10 pr-3 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          />
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-3 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-gray-400" />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full pl-10 pr-3 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          />
        </div>

        {/* TERMS */}
        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input type="checkbox" className="mt-1" />
          I agree to the{" "}
          <span className="text-[#1E3A8A] cursor-pointer">Terms & Conditions</span>
        </label>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white py-3 rounded-lg font-medium transition"
        >
          Create Account
        </button>

      </form>

      {/* DIVIDER */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-gray-400 text-sm">OR</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* SOCIAL */}
      <div className="space-y-3">
        <button className="w-full border py-2 rounded-lg hover:bg-gray-50">
          Continue with Google
        </button>
        <button className="w-full border py-2 rounded-lg hover:bg-gray-50">
          Continue with LinkedIn
        </button>
      </div>

      {/* FOOTER */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-[#1E3A8A] font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;