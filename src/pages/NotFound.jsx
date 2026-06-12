import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      {/* 🔥 SEO for 404 Page */}
      <SEOHead 
        pageSlug="404"
        customTitle="Page Not Found | UltraClap"
        customDescription="The page you are looking for does not exist or has been moved. Return to UltraClap homepage to find verified manufacturers and industrial products."
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="text-center max-w-md">
          {/* 404 Number */}
          <div className="relative">
            <h1 className="text-8xl md:text-9xl font-black text-blue-600 tracking-wider">404</h1>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-500 rounded-full opacity-20 blur-2xl"></div>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4 mb-2">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-gray-500 text-sm md:text-base mb-6">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Go Home Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Back Home
          </Link>

          {/* Help Links */}
          <div className="mt-8 text-sm text-gray-400">
            <p>Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact Support</a></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;