import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Custom hook for managing SEO meta tags on individual pages
 * @param {Object} config - SEO configuration object
 * @param {string} config.title - Page title
 * @param {string} config.description - Meta description
 * @param {string} config.keywords - Meta keywords
 * @param {string} config.url - Canonical URL
 * @param {string} config.image - OG image URL
 * @param {Object} config.structuredData - JSON-LD structured data
 * @param {Array} config.breadcrumbs - Breadcrumb data for schema
 */
export const useSEO = (config = {}) => {
  const {
    title,
    description,
    keywords,
    url,
    image,
    structuredData,
    breadcrumbs,
    author = "SaveFlox",
    type = "website",
  } = config;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      {title && <title>{title}</title>}
      {title && <meta name="title" content={title} />}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL for SEO */}
      {url && <link rel="canonical" href={url} />}

      {/* Open Graph / Facebook */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {type && <meta property="og:type" content={type} />}
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content="SaveFlox" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
      <meta name="twitter:creator" content="@saveflox" />
      <meta name="twitter:site" content="@saveflox" />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="revisit-after" content="7 days" />
      <meta name="language" content="English" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />

      {/* Structured Data / JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
      
      {/* Breadcrumb Schema */}
      {breadcrumbs && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": crumb.name,
              "item": crumb.url,
            })),
          })}
        </script>
      )}
    </Helmet>
  );
};

/**
 * Generate structured data for a service/product page
 */
export const generateServiceSchema = (name, description, url, image) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": name,
  "description": description,
  "url": url,
  "image": image,
  "provider": {
    "@type": "Organization",
    "name": "SaveFlox",
    "url": "https://saveflox.com"
  },
  "areaServed": "Worldwide",
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": url
  }
});

/**
 * Generate FAQ schema for structured data
 */
export const generateFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

/**
 * Generate Software Application schema
 */
export const generateSoftwareApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SaveFlox",
  "description": "Free online video downloader - Download videos from YouTube, TikTok, Instagram, Facebook, Pinterest, Twitter, and more",
  "url": "https://saveflox.com",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web-based",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "50000"
  }
});

/**
 * Generate Product schema
 */
export const generateProductSchema = (name, description, image, url) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": name,
  "description": description,
  "image": image,
  "url": url,
  "brand": {
    "@type": "Brand",
    "name": "SaveFlox"
  },
  "offers": {
    "@type": "Offer",
    "url": url,
    "priceCurrency": "USD",
    "price": "0",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "10000"
  }
});

/**
 * Generate Article schema
 */
export const generateArticleSchema = (title, description, image, author, datePublished, dateModified, url) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "image": image,
  "author": {
    "@type": "Organization",
    "name": author || "SaveFlox"
  },
  "datePublished": datePublished,
  "dateModified": dateModified || datePublished,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": url
  }
});

/**
 * Generate local business schema
 */
export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "SaveFlox",
  "image": "https://saveflox.com/savefloxLogo.svg",
  "description": "Online video downloader service",
  "url": "https://saveflox.com",
  "telephone": "+1-800-SAVEFLOX",
  "priceRange": "Free",
  "areaServed": "Worldwide",
  "sameAs": [
    "https://twitter.com/saveflox",
    "https://facebook.com/saveflox"
  ]
});
