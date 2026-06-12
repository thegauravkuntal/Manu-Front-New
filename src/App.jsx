import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import SearchResultsPage from "./pages/SearchResultsPage";
import AllProductsPage from "./pages/AllProductsPage";
import ProductDetails from "./pages/ProductDetails";
import ResetPassword from "./pages/ResetPassword";

import Navbar from "./components/Navbar";
import TopBar from "./components/Topbar";
import BottomBar from "./components/BottomBar";
import LocationModal from "./components/LocationModel";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import Popup from "./components/Popup";

import Dashboard from "./pages/Admin/Dashboard";
import PartnerDetails from "./pages/Admin/PartnerDetails";
import Profile from "./pages/Profile";
import MyQueries from "./pages/MyQueries";


// 🔥 PARTNER
import PartnerLayout from "./pages/Partner/PartnerLayout";
import PartnerDashboard from "./pages/Partner/PartnerDashboard";
import MyLeads from "./pages/Partner/MyLeads";
import Inventory from "./pages/Partner/Inventory";
import KYCVerification from "./pages/Partner/KYCVerification";
import Settings from "./pages/Partner/Settings";
import NotFound from "./pages/NotFound";

// 🔥 FOR BODY CODE INJECTION
import { API_BASE_URL } from "./api/config";

const App = () => {
  const location = useLocation();
  const [bodyCode, setBodyCode] = useState("");

  const [city, setCity] = useState(() => localStorage.getItem("city") || "");
  const [showLocationModal, setShowLocationModal] = useState(false);
  
  // 🔥 POPUP STATE
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [popupShown, setPopupShown] = useState(() => {
    return localStorage.getItem("offerPopupShown") === "true";
  });

  // 🔥 FETCH BODY CODE FOR CURRENT PAGE
  useEffect(() => {
    const fetchBodyCode = async () => {
      try {
        // Get current page slug based on path
        let pageSlug = "home";
        if (location.pathname === "/") {
          pageSlug = "home";
        } else if (location.pathname === "/all-products") {
          pageSlug = "products";
        } else if (location.pathname.startsWith("/product")) {
          pageSlug = "product-details";
        } else {
          pageSlug = location.pathname.replace(/^\//, "").split("/")[0] || "home";
        }
        
        const res = await fetch(`${API_BASE_URL}/seo/${pageSlug}`);
        const data = await res.json();
        if (data.success && data.seo && data.seo.bodyCode) {
          setBodyCode(data.seo.bodyCode);
        } else {
          setBodyCode("");
        }
      } catch (error) {
        console.error("Error fetching body code:", error);
        setBodyCode("");
      }
    };
    
    fetchBodyCode();
  }, [location.pathname]);

  useEffect(() => {
    if (!localStorage.getItem("city")) {
      setShowLocationModal(true);
    }
  }, []);

  const handleSelectCity = (selectedCity) => {
    setCity(selectedCity);
    localStorage.setItem("city", selectedCity);
    setShowLocationModal(false);
    
    // 🔥 City select hone ke baad, agar popup pehle nahi dikha to dikhao
    if (!popupShown) {
      setTimeout(() => {
        setShowOfferPopup(true);
      }, 500);
    }
  };

  // 🔥 POPUP HANDLERS
  const handlePopupClose = () => {
    setShowOfferPopup(false);
    localStorage.setItem("offerPopupShown", "true");
    setPopupShown(true);
  };

  const handlePopupSubscribe = (email) => {
    console.log("Subscribed email:", email);
    // You can add additional logic here if needed
  };

  // 🔥 CHECK SPECIAL ROUTES
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isPartnerRoute = location.pathname.startsWith("/partner");
  const isSpecialRoute = isAdminRoute || isPartnerRoute;

  return (
    <>
      <ScrollToTop />

      {/* 🔥 BODY CODE INJECTION - ADDED */}
      {bodyCode && (
        <div dangerouslySetInnerHTML={{ __html: bodyCode }} />
      )}

      {/* WEBSITE HEADER ONLY */}
      {!isSpecialRoute && (
        <>
          <TopBar />

          <Navbar
            city={city}
            setCity={setCity}
            onOpenLocation={() => setShowLocationModal(true)}
          />
        </>
      )}

      <div
        className={
          isSpecialRoute
            ? ""
            : "flex flex-col min-h-screen pt-[135px] lg:pt-[110px] pb-16 lg:pb-0"
        }
      >
        <div className="flex-grow">
           <Routes>
             <Route path="/" element={<Home />} />

             <Route
               path="/search"
               element={
                 <SearchResultsPage
                   city={city}
                   setCity={setCity}
                 />
               }
             />
             <Route path="/all-products" element={<AllProductsPage />} />

             <Route path="/product-details/:id" element={<ProductDetails />} />
             <Route path="/product/:slug" element={<ProductDetails />} />
             <Route path="/product-details" element={<ProductDetails />} />

             <Route path="/profile" element={<Profile />} />
             <Route path="/my-queries" element={<MyQueries />} />
             <Route path="/reset-password/:token" element={<ResetPassword />} />

             {/* 🔥 HIERARCHICAL ROUTES */}
             <Route path="/:category" element={<AllProductsPage />} />
             <Route path="/:category/:subcategory" element={<AllProductsPage />} />
             <Route path="/:category/:subcategory/:slug" element={<ProductDetails />} />
             <Route path="*" element={<NotFound />} />

            {/* ADMIN */}
            <Route
              path="/admin/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/admin/partner/:id"
              element={<PartnerDetails />}
            />

            {/* PARTNER */}
            <Route path="/partner" element={<PartnerLayout />}>
              <Route path="dashboard" element={<PartnerDashboard />} />
              <Route path="leads" element={<MyLeads />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="kyc" element={<KYCVerification />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>

        {/* WEBSITE FOOTER ONLY */}
        {!isSpecialRoute && <Footer />}
      </div>

      {!isSpecialRoute && <BottomBar />}

      {/* LOCATION MODAL */}
      {!isSpecialRoute && showLocationModal && (
        <LocationModal
          onSelect={handleSelectCity}
          onClose={() => setShowLocationModal(false)}
        />
      )}

      {/* 🔥 OFFER POPUP - ADDED */}
      {!isSpecialRoute && showOfferPopup && (
        <Popup 
          isOpen={showOfferPopup} 
          onClose={handlePopupClose}
          onSubscribe={handlePopupSubscribe}
        />
      )}
    </>
  );
};

export default App;