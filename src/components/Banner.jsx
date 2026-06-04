import { useEffect, useState } from "react";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import { API_BASE_URL, getServerUrl } from "../api/config";
import appImage from "../../Image.jpeg";

const DEFAULT_APP_BANNER = {
  title: "Get the Ultraclap Mobile App",
  description:
    "Source industrial machinery, contact verified suppliers, and manage B2B leads — all from your phone.",
  image: appImage,
  playStoreLink: "https://play.google.com/store",
  appStoreLink: "https://www.apple.com/app-store/",
};

const AppBanner = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/app-banner`);
        const resData = await res.json();

        if (res.ok && resData.banner) {
          setData(resData.banner);
        } else if (res.ok && resData.title) {
          setData(resData);
        } else {
          setData(DEFAULT_APP_BANNER);
        }
      } catch (err) {
        console.error("App banner fetch error:", err);
        setData(DEFAULT_APP_BANNER);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  const banner = data || DEFAULT_APP_BANNER;

  if (loading) {
    return (
      <section className="bg-white py-6 md:py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="h-48 md:h-60 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-6 md:py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden bg-[#1E3A8A] rounded-2xl shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative flex flex-col lg:flex-row items-center gap-4 lg:gap-8 p-4 md:p-6 lg:p-8">
            {/* App preview image */}
            <div className="w-full lg:w-[40%] flex justify-center shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-400/20 blur-3xl rounded-full scale-110" />
                <div className="relative bg-white/10 backdrop-blur-sm p-2 md:p-3 rounded-[1.5rem] border border-white/20 shadow-xl">
                  <img
                    src={appImage}
                    alt="Ultraclap mobile app"
                    className="w-[140px] sm:w-[170px] md:w-[200px] h-[220px] sm:h-[260px] md:h-[300px] object-cover rounded-[1.2rem] border-4 border-white/30"
                    onError={(e) => {
                      e.target.src = DEFAULT_APP_BANNER.image;
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Text + store buttons */}
            <div className="flex-1 text-center lg:text-left text-white">
              <p className="text-orange-200 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">
                Download Now
              </p>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold leading-tight">
                {banner.title}
              </h2>
              <p className="text-blue-100/90 text-xs md:text-sm mt-2 md:mt-3 max-w-md mx-auto lg:mx-0 leading-relaxed">
                {banner.description}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 md:gap-3 mt-4 md:mt-6">
                <a
                  href={banner.playStoreLink || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-white text-[#1E3A8A] w-full sm:w-auto min-w-[150px] px-4 py-2.5 rounded-lg text-xs font-bold hover:scale-105 transition shadow-md"
                >
                  <FaGooglePlay className="text-base" />
                  Google Play
                </a>
                <a
                  href={banner.appStoreLink || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white w-full sm:w-auto min-w-[150px] px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-white/20 transition"
                >
                  <FaApple className="text-base" />
                  App Store
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppBanner;
