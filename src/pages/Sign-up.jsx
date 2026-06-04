// components/auth/SignupForm.jsx
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const SignupForm = () => {
  return (
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border">

      {/* LOGO */}
      <h2 className="text-2xl font-bold text-center mb-2">
        <span className="text-red-600">ULTRA</span>CLAP
      </h2>

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
            className="w-full pl-10 pr-3 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* EMAIL */}
        <div className="relative">
          <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
          <input
            type="email"
            placeholder="Email address"
            className="w-full pl-10 pr-3 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-3 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-gray-400" />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full pl-10 pr-3 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* TERMS */}
        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input type="checkbox" className="mt-1" />
          I agree to the{" "}
          <span className="text-red-600 cursor-pointer">Terms & Conditions</span>
        </label>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition"
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
        <Link to="/login" className="text-red-600 font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;