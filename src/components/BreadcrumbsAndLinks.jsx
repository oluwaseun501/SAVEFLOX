import { ChevronRight, Home, Music } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/RelatedServices.css";

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
      className="w-full max-w-5xl mx-auto px-4 pt-5 pb-1"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
        {breadcrumbItems.map((item, index) => (
          <li
            key={index}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="flex items-center gap-1"
          >
            {index < breadcrumbItems.length - 1 ? (
              <>
                <Link
                  to={item.path}
                  itemProp="item"
                  className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {index === 0 && <Home className="w-3.5 h-3.5" />}
                  <span itemProp="name">{item.label}</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600" />
              </>
            ) : (
              <span
                itemProp="name"
                className="text-gray-800 dark:text-slate-200 font-medium"
              >
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

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

const servicesLinks = [
  {
    name: "TikTok Downloader",
    path: "/tiktok-downloader",
    icon: <TikTokIcon />,
    description: "Download TikTok videos without watermark",
    iconClass: "icon-tiktok",
  },
  {
    name: "Twitter Downloader",
    path: "/twitter-downloader",
    icon: <TwitterIcon />,
    description: "Save Twitter videos and GIFs quickly",
    iconClass: "icon-twitter",
  },
  {
    name: "Instagram Downloader",
    path: "/instagram-downloader",
    icon: <InstagramIcon />,
    description: "Download Reels, photos and videos in HD",
    iconClass: "icon-instagram",
  },
  {
    name: "Facebook Downloader",
    path: "/facebook-downloader",
    icon: <FacebookIcon />,
    description: "Download Facebook videos and stories",
    iconClass: "icon-facebook",
  },
  {
    name: "Pinterest Downloader",
    path: "/pinterest-downloader",
    icon: <PinterestIcon />,
    description: "Save Pinterest pins, videos and images",
    iconClass: "icon-pinterest",
  },
  {
    name: "MP3 Converter",
    path: "/mp3-converter",
    icon: <Music width={18} height={18} />,
    description: "Convert any video to MP3 audio",
    iconClass: "icon-mp3",
  },
];

/**
 * Internal Links Component
 * Displays relevant internal links for better site navigation and SEO
 */
export const RelatedServices = ({ currentPage, excludeServices = [] }) => {
  const filteredLinks = servicesLinks.filter(
    (service) =>
      service.path !== currentPage && !excludeServices.includes(service.path)
  );

  return (
    <section className="related-services" aria-label="Related Services">
      <div className="related-services-inner">
        <div className="related-services-header">
          <h2 className="related-services-title">Our Other Services</h2>
          <p className="related-services-subtitle">
            More free tools to download and convert video &amp; audio from your
            favourite platforms
          </p>
        </div>

        <div className="related-services-grid">
          {filteredLinks.map((service, index) => (
            <Link
              key={index}
              to={service.path}
              title={`Go to ${service.name}`}
              className="related-service-card"
            >
              <span className={`related-service-icon ${service.iconClass}`}>
                {service.icon}
              </span>
              <div className="related-service-text">
                <span className="related-service-name">{service.name}</span>
                <span className="related-service-desc">
                  {service.description}
                </span>
              </div>
              <ChevronRight className="related-service-arrow" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Site-wide Navigation Links for SEO
 */
export const SiteNavigationLinks = () => {
  return [
    { name: "Home", path: "/", rel: "home" },
    { name: "TikTok Downloader", path: "/tiktok-downloader", rel: "service" },
    {
      name: "Instagram Downloader",
      path: "/instagram-downloader",
      rel: "service",
    },
    {
      name: "Facebook Downloader",
      path: "/facebook-downloader",
      rel: "service",
    },
    { name: "Twitter Downloader", path: "/twitter-downloader", rel: "service" },
    {
      name: "Pinterest Downloader",
      path: "/pinterest-downloader",
      rel: "service",
    },
    { name: "MP3 Converter", path: "/mp3-converter", rel: "service" },
    { name: "Blog", path: "/blog", rel: "blog" },
    { name: "Privacy Policy", path: "/privacy", rel: "legal" },
    { name: "Terms of Service", path: "/terms", rel: "legal" },
    { name: "Contact", path: "/contact", rel: "contact" },
  ];
};

/**
 * Internal Link Helper Component
 * Renders a list of internal links for SEO purposes
 */
export const InternalLinksList = ({ title = "Related Links", links = [] }) => {
  if (!links || links.length === 0) return null;

  return (
    <section className="py-6 px-4" aria-label={title}>
      <h3 className="text-base font-semibold text-gray-700 dark:text-slate-300 mb-3">
        {title}
      </h3>
      <ul className="flex flex-wrap gap-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              to={link.path}
              title={link.title || link.text}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
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
