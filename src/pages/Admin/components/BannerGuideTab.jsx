import React from "react";
import { Image, Info, AlertCircle } from "lucide-react";

const BannerGuideTab = () => {
  const bannerPages = [
    { page: "Home", recommendedSize: "1920 x 400px", maxSize: "100KB", format: "JPG, PNG, WebP" },
    { page: "All Products", recommendedSize: "1920 x 400px", maxSize: "100KB", format: "JPG, PNG, WebP" },
    { page: "Product Details", recommendedSize: "1200 x 600px", maxSize: "100KB", format: "JPG, PNG, WebP" },
    { page: "Search Results", recommendedSize: "1920 x 400px", maxSize: "100KB", format: "JPG, PNG, WebP" },
  ];

  return (
    <div className="bg-[#0f1724] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
          <Image size={20} className="text-orange-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Banner Size Guide</h2>
          <p className="text-gray-400 text-sm mt-1">Recommended image sizes for all page banners</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-gray-400 text-xs uppercase">Page</th>
              <th className="text-left py-3 px-4 text-gray-400 text-xs uppercase">Recommended Size</th>
              <th className="text-left py-3 px-4 text-gray-400 text-xs uppercase">Max Size</th>
              <th className="text-left py-3 px-4 text-gray-400 text-xs uppercase">Format</th>
            </tr>
          </thead>
          <tbody>
            {bannerPages.map((banner, idx) => (
              <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-white text-sm">{banner.page}</td>
                <td className="py-3 px-4 text-gray-300 text-sm">{banner.recommendedSize}</td>
                <td className="py-3 px-4 text-gray-300 text-sm">{banner.maxSize}</td>
                <td className="py-3 px-4 text-gray-300 text-sm">{banner.format}</td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
        <p className="text-yellow-400 text-sm">⚠️ All banner images must be less than 100KB</p>
      </div>
    </div>
  );
};

export default BannerGuideTab;