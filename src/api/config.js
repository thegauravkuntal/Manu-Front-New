export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://manu-back-bpob.onrender.com/api";

export const FALLBACK_IMAGE_URL =
  "https://res.cloudinary.com/djsxaigna/image/upload/v1778687629/manufacturing_b2b/tiwud4hv6wtvt4cbgozz.jpg";

export const getServerUrl = (path) => {
  if (!path) return "";

  if (path.includes("via.placeholder.com")) {
    return FALLBACK_IMAGE_URL;
  }

  // If it's already a full URL (Cloudinary, Unsplash, etc.)
  if (path.startsWith("http")) return path;
  
  // If it's a local frontend asset filename (e.g., "papercup.jpg")
  // We moved these to public/products/
  if (!path.startsWith("/") && !path.includes("/")) {
    return `/products/${path}`;
  }

  // If it's a backend upload path (e.g., "/uploads/file.jpg")
  const base = API_BASE_URL.replace("/api", "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const getLocalFallback = (title, category) => {
  const t = (title || "").toLowerCase();
  const c = (category || "").toLowerCase();
  
  if (t.includes("paper cup") || c.includes("paper cup")) return "/products/papercup.jpg";
  if (t.includes("packaging") || c.includes("packaging")) return "/products/packaging.jpg";
  if (t.includes("bag") || c.includes("bag")) return "/products/bagmachine.jpg";
  if (t.includes("plate") || c.includes("plate")) return "/products/paperplate.jpg";
  if (t.includes("machine") || c.includes("machine")) return "/products/machine1.jpg";
  if (t.includes("steel") || c.includes("steel")) return "/products/steel.jpg";
  if (t.includes("plastic") || c.includes("plastic")) return "/products/plastic1.jpg";
  if (t.includes("textile") || c.includes("textile")) return "/products/textile1.jpg";
  if (t.includes("electronics") || c.includes("electronics")) return "/products/electronics1.jpg";
  if (t.includes("furniture") || c.includes("furniture")) return "/products/furniture1.jpg";
  if (t.includes("chemical") || c.includes("chemical")) return "/products/chemical1.jpg";
  if (t.includes("tool") || c.includes("tool")) return "/products/tools1.jpg";
  if (t.includes("auto") || c.includes("auto")) return "/products/auto1.jpg";
  
  return "https://res.cloudinary.com/djsxaigna/image/upload/v1778687629/manufacturing_b2b/tiwud4hv6wtvt4cbgozz.jpg";
};
