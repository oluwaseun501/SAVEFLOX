import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Breadcrumb Navigation Component for SEO
 * Helps with site navigation and provides schema.org structured data
 */
export const Breadcrumbs = ({ items = [] }) => {
  const defaultItems = [{ label: "Home", path: "/" }];

  const breadcrumbItems = [...defaultItems, ...items];

  return (
    <nav
      aria-label="Breadcrumb"
      className="breadcrumbs-container"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="breadcrumbs-list">
        {breadcrumbItems.map((item, index) => (
          <li
            key={index}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="breadcrumb-item"
          >
            {index < breadcrumbItems.length - 1 ? (
              <>
                <Link to={item.path} itemProp="item">
                  <span itemProp="name">{item.label}</span>
                </Link>
                <ChevronRight className="breadcrumb-separator" size={16} />
              </>
            ) : (
              <span itemProp="name" className="breadcrumb-current">
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
};

/**
 * Internal Links Component
 * Displays relevant internal links for better site navigation and SEO
 */
export const RelatedServices = ({ currentPage, excludeServices = [] }) => {
  const servicesLinks = [
    {
      name: "TikTok Downloader",
      path: "/tiktok",
      icon: "tiktok",
      description: "Download TikTok videos without watermark",
    },
    {
      name: "YouTube Downloader",
      path: "/youtube",
      icon: "youtube",
      description: "Download YouTube videos in 4K",
    },
    {
      name: "Instagram Downloader",
      path: "/instagram",
      icon: "instagram",
      description: "Download Instagram videos and photos",
    },
    {
      name: "Facebook Downloader",
      path: "/facebook",
      icon: "facebook",
      description: "Download Facebook videos and streams",
    },
    {
      name: "Twitter Downloader",
      path: "/twitter",
      icon: "twitter",
      description: "Download Twitter videos and GIFs",
    },
    {
      name: "Pinterest Downloader",
      path: "/pinterest",
      icon: "pinterest",
      description: "Download Pinterest videos and images",
    },
    {
      name: "MP3 Converter",
      path: "/mp3",
      icon: "mp3",
      description: "Convert videos to MP3 audio",
    },
  ];

  const filteredLinks = servicesLinks.filter(
    (service) =>
      service.path !== currentPage && !excludeServices.includes(service.path),
  );

  return (
    <section className="related-services-section" aria-label="Related Services">
      <h2>Our Other Services</h2>
      <div className="related-services-grid">
        {filteredLinks.map((service, index) => (
          <Link
            key={index}
            to={service.path}
            className="related-service-card"
            title={`Go to ${service.name}`}
          >
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

/**
 * Site-wide Navigation Links for SEO
 */
export const SiteNavigationLinks = () => {
  const navigationLinks = [
    { name: "Home", path: "/", rel: "home" },
    { name: "TikTok Downloader", path: "/tiktok", rel: "service" },
    { name: "YouTube Downloader", path: "/youtube", rel: "service" },
    { name: "Instagram Downloader", path: "/instagram", rel: "service" },
    { name: "Facebook Downloader", path: "/facebook", rel: "service" },
    { name: "Twitter Downloader", path: "/twitter", rel: "service" },
    { name: "Pinterest Downloader", path: "/pinterest", rel: "service" },
    { name: "MP3 Converter", path: "/mp3", rel: "service" },
    { name: "Blog", path: "/blog", rel: "blog" },
    { name: "FAQ", path: "/faq", rel: "help" },
    { name: "Privacy Policy", path: "/privacy", rel: "legal" },
    { name: "Terms of Service", path: "/terms", rel: "legal" },
    { name: "Contact", path: "/contact", rel: "contact" },
  ];

  return navigationLinks;
};

/**
 * Internal Link Helper Component
 * Renders a list of internal links for SEO purposes
 */
export const InternalLinksList = ({ title = "Related Links", links = [] }) => {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <section className="internal-links-section" aria-label={title}>
      <h3>{title}</h3>
      <ul className="internal-links-list">
        {links.map((link, index) => (
          <li key={index}>
            <Link to={link.path} title={link.title || link.text}>
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

/**
 * Schema.org Aggregate Rating Component
 * Shows ratings for the service
 */
export const AggregateRatingComponent = ({
  ratingValue = 4.8,
  reviewCount = 50000,
}) => {
  return (
    <div
      className="aggregate-rating"
      itemScope
      itemType="https://schema.org/AggregateRating"
    >
      <div className="rating-display">
        <span className="rating-value" itemProp="ratingValue">
          {ratingValue}
        </span>
        <span className="rating-scale">/ 5</span>
      </div>
      <div className="rating-count">
        Based on{" "}
        <span itemProp="reviewCount">{reviewCount.toLocaleString()}</span>{" "}
        reviews
      </div>
      <meta itemProp="bestRating" content="5" />
      <meta itemProp="worstRating" content="1" />
    </div>
  );
};

/**
 * Rich Result for Local Business
 */
export const LocalBusinessSchema = () => {
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "SaveFlox",
        image: "https://saveflox.com/savefloxLogo.svg",
        description: "Online video downloader service",
        url: "https://saveflox.com",
        telephone: "+1-800-SAVEFLOX",
        priceRange: "Free",
        areaServed: "Worldwide",
        sameAs: [
          "https://twitter.com/saveflox",
          "https://facebook.com/saveflox",
          "https://instagram.com/saveflox",
        ],
      })}
    </script>
  );
};
