import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhone,
} from "react-icons/fa";

import loginImg from "../assets/signin-img.jpg";
import { API_BASE_URL } from "../api/config";

const SignInModal = ({ onClose, initialMode = "login" }) => {

  const [isLogin, setIsLogin] =
    useState(initialMode === "login");

  /* FORM STATE */
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
    
  /* FORGOT PASSWORD STATE */
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  /* RESET PASSWORD STATE */
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const [loading, setLoading] =
    useState(false);




  /* 🔥 HANDLE INPUT */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  /* 🔥 HANDLE FORGOT PASSWORD */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || "Failed to send reset link ❌");
        return;
      }

      alert(data.msg || "Password reset link sent to your email ✅");
      setIsForgotPassword(false);
      setIsLogin(true); // Switch back to login form
      setFormData({ name: "", email: "", phone: "", password: "" }); // Clear form
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    }
  };




    /* 🔥 SUBMIT */
    const handleSubmit =
      async (e) => {

        e.preventDefault();

        try {

          setLoading(true);

          let url = `${API_BASE_URL}/auth/login`;
          let payload = formData;

          // Handle forgot password submission
          if (isForgotPassword) {
            url = `${API_BASE_URL}/auth/forgot-password`;
            payload = { email: formData.email };
          } 
          // Handle reset password submission
          else if (isResetPassword) {
            url = `${API_BASE_URL}/auth/reset-password/${resetToken}`;
            payload = { password: formData.password };
          } 
          else if (!isLogin) {
            url = `${API_BASE_URL}/auth/register`;
            if (formData.password !== formData.confirmPassword) {
              alert("Passwords do not match ❌");
              setLoading(false);
              return;
            }
            }
          const response =
            await fetch(url, {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                payload
              ),
            });


          const data =
            await response.json();


          /* ❌ ERROR */
          if (!response.ok) {

            alert(data.msg || "An error occurred ❌");

            setLoading(false);

            return;
          }


          /* ✅ SUCCESS */
          if (!isForgotPassword && !isResetPassword) {
            alert(data.msg);

            console.log(
              "USER:",
              data.user
            );


            /* 🔥 SAVE TOKEN */
            if (data.token) {

              localStorage.setItem(
                "token",
                data.token
              );
            }


            /* 🔥 SAVE USER */
            if (data.user) {

              localStorage.setItem(
                "user",
                JSON.stringify(
                  data.user
                )
              );
            }
          } else if (isForgotPassword) {
            alert(data.msg || "Password reset link sent to your email ✅");
            setIsForgotPassword(false);
            setIsLogin(true); // Switch back to login form
            setFormData({ name: "", email: "", phone: "", password: "" }); // Clear form
          } else if (isResetPassword) {
            alert(data.msg || "Password has been reset successfully ✅");
            setIsResetPassword(false);
            setIsLogin(true); // Switch back to login form
            setFormData({ name: "", email: "", phone: "", password: "" }); // Clear form
            setResetToken(""); // Clear token
          }


          setLoading(false);

          if (!isForgotPassword && !isResetPassword) {
            onClose();


            /* 🔥 REFRESH */
            window.location.reload();
          }


        } catch (err) {

          console.error(err);

          alert(
            "Something went wrong ❌"
          );

          setLoading(false);
        }
      };




  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-[9999] p-4">

      {/* 🔥 MODAL */}
      <div className="bg-white w-full max-w-3xl md:h-[520px] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">

        {/* 🔥 CLOSE BUTTON (Global for mobile) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-xl z-50 md:text-gray-400"
        >
          ✕
        </button>

        {/* 🔥 LEFT IMAGE (Hidden on mobile) */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-10">
          <img
            src={loginImg}
            alt="login"
            className="max-h-full max-w-full object-contain drop-shadow-2xl"
          />
        </div>



        {/* 🔥 RIGHT (Form Area) */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">

          {/* 🔥 LOGO */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black tracking-tight">
              <span className="text-[#1E3A8A]">ULTRA</span>CLAP
            </h2>
            <p className="text-gray-500 text-xs mt-1 font-medium uppercase tracking-widest">
              {isLogin
                ? "Sign in to your account"
                : "Create your account"}
            </p>
          </div>



           {/* 🔥 FORM */}
           <form
             onSubmit={
               handleSubmit
             }
             className="space-y-4"
           >

             {/* 🔥 RESET PASSWORD STEP - TOKEN & NEW PASSWORD */}
             {isResetPassword && (
               <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                 <div className="relative">
                   <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-sm" />
                   <input
                     type="password"
                     name="password"
                     required
                     placeholder="Enter new password"
                     value={formData.password}
                     onChange={handleChange}
                     className="w-full pl-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:bg-white transition-all"
                   />
                 </div>
                 <div className="text-xs text-gray-500 mt-2">
                   Password must be at least 6 characters and contain letters & numbers
                 </div>
               </div>
             )}

             {/* 🔥 NAME & PHONE (Registration Only) */}
             {!isLogin && !isForgotPassword && !isResetPassword && (
               <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                 <div className="relative">
                   <FaUser className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-sm" />
                   <input
                     type="text"
                     name="name"
                     required
                     placeholder="Full Name"
                     value={formData.name}
                     onChange={handleChange}
                     className="w-full pl-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:bg-white transition-all"
                   />
                 </div>

                 <div className="relative">
                   <FaPhone className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-sm" />
                   <input
                     type="tel"
                     name="phone"
                     required
                     placeholder="Phone Number"
                     value={formData.phone}
                     onChange={handleChange}
                     className="w-full pl-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:bg-white transition-all"
                   />
                 </div>
               </div>
             )}


             {/* 🔥 EMAIL (Visible for Login, Signup, and Forgot Password) */}
             {!isResetPassword && (
               <div className="relative">
                 <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-sm" />
                 <input
                   type="email"
                   name="email"
                   required
                   placeholder="Email Address"
                   value={formData.email}
                   onChange={handleChange}
                   className="w-full pl-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:bg-white transition-all"
                 />
               </div>
             )}


             {/* 🔥 PASSWORD (Login and Signup Step) */}
             {(isLogin || (!isLogin && !isForgotPassword && !isResetPassword)) && (
               <div className="relative">
                 <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-sm" />
                 <input
                   type="password"
                   name="password"
                   autoComplete={isLogin ? "current-password" : "new-password"}
                   required
                   placeholder={isLogin ? "Password" : "Create Password"}
                   value={formData.password}
                   onChange={handleChange}
                   className="w-full pl-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:bg-white transition-all"
                 />
               </div>
             )}

             {/* 🔥 CONFIRM PASSWORD (Signup Step Only) */}
             {!isLogin && !isForgotPassword && !isResetPassword && (
               <div className="relative">
                 <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-sm" />
                 <input
                   type="password"
                   name="confirmPassword"
                   autoComplete="new-password"
                   required
                   placeholder="Confirm Password"
                   value={formData.confirmPassword || ""}
                   onChange={handleChange}
                   className="w-full pl-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:bg-white transition-all"
                 />
               </div>
             )}

             {/* 🔥 FORGOT PASSWORD LINK (Login Step) */}
             {isLogin && !isForgotPassword && (
               <div className="text-right">
                 <button
                   type="button"
                   onClick={() => setIsForgotPassword(true)}
                   className="text-[10px] text-gray-400 hover:text-[#1E3A8A] font-bold uppercase tracking-wider transition-colors"
                 >
                   Forgot Password?
                 </button>
               </div>
             )}


             {/* 🔥 SUBMIT BUTTON */}
             <button
               type="submit"
               disabled={loading}
               className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/10 transition-all active:scale-95 disabled:opacity-50 mt-4"
             >
               {loading
                 ? "Processing..."
                 : isForgotPassword
                 ? "Send Reset Link"
                 : isResetPassword
                 ? "Reset Password"
                 : isLogin
                 ? "Sign In"
                 : "Create Account"}
             </button>

           </form>



          {/* 🔥 TOGGLE & FORGOT PASSWORD */}
            <div className="text-center mt-8">
              {isForgotPassword ? (
                <>
                  <p className="text-xs text-gray-500 font-medium">
                    Remember your password?{' '}
                    <button
                      onClick={() => {
                        setIsForgotPassword(false);
                        setIsLogin(true);
                      }}
                      className="text-[#1E3A8A] hover:underline ml-1 font-bold"
                    >
                      Sign In
                    </button>
                  </p>
                </>
              ) : isLogin ? (
                <>
                  <p className="text-xs text-gray-500 font-medium">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-[#1E3A8A] hover:underline ml-1.5 font-bold"
                    >
                      Sign Up
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs text-gray-500 font-medium">
                    Already have an account?{' '}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-[#1E3A8A] hover:underline ml-1.5 font-bold"
                    >
                      Login
                    </button>
                  </p>
                </>
              )}
            </div>

        </div>

      </div>

    </div>
  );
};

export default SignInModal;