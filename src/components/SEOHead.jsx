import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { API_BASE_URL } from "../api/config";

const SEOHead = ({ pageSlug }) => {
  const [seo, setSeo] = useState(null);

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/seo/${pageSlug}`);
        const data = await res.json();
        if (data.success) {
          setSeo(data.seo);
        }
      } catch (error) {
        console.error("Error fetching SEO:", error);
      }
    };
    fetchSEO();
  }, [pageSlug]);

  if (!seo) return null;

  return (
    <Helmet>
      <title>{seo.metaTitle}</title>
      <meta name="description" content={seo.metaDescription} />
      <meta name="keywords" content={seo.metaKeywords} />
      <meta name="robots" content={`${seo.robotsIndex}, ${seo.robotsFollow}`} />
      
      {seo.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}
      
      <meta property="og:title" content={seo.ogTitle || seo.metaTitle} />
      <meta property="og:description" content={seo.ogDescription || seo.metaDescription} />
      <meta property="og:image" content={seo.ogImage} />
      <meta property="og:type" content={seo.ogType} />
      
      {seo.schemaJson && (
        <script type="application/ld+json">
          {typeof seo.schemaJson === "string" ? seo.schemaJson : JSON.stringify(seo.schemaJson)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;