import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { API_BASE_URL } from "../api/config";

const SEOHead = ({ pageSlug, customTitle, customDescription }) => {
  const [seo, setSeo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Agar customTitle ya customDescription diya hai to API call skip karo
    if (customTitle || customDescription) {
      setSeo({
        metaTitle: customTitle || "UltraClap - B2B Manufacturing Marketplace",
        metaDescription: customDescription || "Discover verified manufacturers, bulk suppliers, and industrial partners in India.",
        metaKeywords: "",
        robotsIndex: "index",
        robotsFollow: "follow",
        canonicalUrl: "",
        ogTitle: customTitle || "",
        ogDescription: customDescription || "",
        ogImage: "",
        ogType: "website",
        schemaJson: null,
        headCode: "",      // 🔥 ADDED
        bodyCode: "",      // 🔥 ADDED
      });
      setLoading(false);
      return;
    }

    // Otherwise fetch from API
    const fetchSEO = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/seo/${pageSlug}`);
        const data = await res.json();
        if (data.success) {
          setSeo(data.seo);
        } else {
          // Fallback if no SEO data
          setSeo({
            metaTitle: "UltraClap - B2B Manufacturing Marketplace",
            metaDescription: "Discover verified manufacturers, bulk suppliers, and industrial partners in India.",
            metaKeywords: "",
            robotsIndex: "index",
            robotsFollow: "follow",
            canonicalUrl: "",
            ogTitle: "",
            ogDescription: "",
            ogImage: "",
            ogType: "website",
            schemaJson: null,
            headCode: "",      // 🔥 ADDED
            bodyCode: "",      // 🔥 ADDED
          });
        }
      } catch (error) {
        console.error("Error fetching SEO:", error);
        // Fallback on error
        setSeo({
          metaTitle: "UltraClap - B2B Manufacturing Marketplace",
          metaDescription: "Discover verified manufacturers, bulk suppliers, and industrial partners in India.",
          metaKeywords: "",
          robotsIndex: "index",
          robotsFollow: "follow",
          canonicalUrl: "",
          ogTitle: "",
          ogDescription: "",
          ogImage: "",
          ogType: "website",
          schemaJson: null,
          headCode: "",      // 🔥 ADDED
          bodyCode: "",      // 🔥 ADDED
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSEO();
  }, [pageSlug, customTitle, customDescription]);

  if (loading || !seo) return null;

  return (
    <Helmet>
      <title>{seo.metaTitle}</title>
      <meta name="description" content={seo.metaDescription} />
      {seo.metaKeywords && <meta name="keywords" content={seo.metaKeywords} />}
      <meta name="robots" content={`${seo.robotsIndex}, ${seo.robotsFollow}`} />
      
      {seo.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}
      
      <meta property="og:title" content={seo.ogTitle || seo.metaTitle} />
      <meta property="og:description" content={seo.ogDescription || seo.metaDescription} />
      {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
      <meta property="og:type" content={seo.ogType || "website"} />
      
      {seo.schemaJson && (
        <script type="application/ld+json">
          {typeof seo.schemaJson === "string" ? seo.schemaJson : JSON.stringify(seo.schemaJson)}
        </script>
      )}
      
      {/* 🔥 HEAD CODE INJECTION - ADDED */}
      {seo.headCode && (
        <div dangerouslySetInnerHTML={{ __html: seo.headCode }} />
      )}
    </Helmet>
  );
};

export default SEOHead;