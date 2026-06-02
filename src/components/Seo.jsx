import { Helmet } from "react-helmet-async";

const DEFAULT = {
  title: "SaveFlox — Free Online Video Downloader",
  description:
    "SaveFlox is the fastest online video downloader for YouTube, TikTok, Snapchat, Instagram, Facebook, Pinterest and more. Save videos in MP4 or MP3 instantly.",
  keywords:
    "video downloader, youtube downloader, tiktok downloader, snapchat downloader, instagram downloader, facebook downloader, pinterest downloader, online video downloader, save video, mp3 converter",
  url: "https://www.saveflox.com",
  image: "https://www.saveflox.com/icon-512.png",
  type: "website",
  siteName: "SaveFlox",
  locale: "en_US",
  author: "SaveFlox Team",
  twitterSite: "@SaveFloxApp",
};

const buildBreadcrumbs = (pageUrl, pageTitle) => {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: DEFAULT.url,
    },
  ];

  if (pageUrl !== DEFAULT.url) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: pageTitle.replace(/\s+—\s+SaveFlox$/, ""),
      item: pageUrl,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
};

export default function Seo({
  title,
  description,
  keywords,
  url,
  image,
  type,
  siteName,
  locale,
  canonical,
  noIndex = false,
}) {
  const meta = {
    title: title || DEFAULT.title,
    description: description || DEFAULT.description,
    keywords: keywords || DEFAULT.keywords,
    url: canonical || url || DEFAULT.url,
    image: image || DEFAULT.image,
    type: type || DEFAULT.type,
    siteName: siteName || DEFAULT.siteName,
    locale: locale || DEFAULT.locale,
    author: DEFAULT.author,
    twitterSite: DEFAULT.twitterSite,
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: meta.siteName,
        url: DEFAULT.url,
        description: meta.description,
        publisher: {
          "@type": "Organization",
          name: meta.siteName,
          logo: {
            "@type": "ImageObject",
            url: meta.image,
          },
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${DEFAULT.url}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        name: meta.siteName,
        url: DEFAULT.url,
        logo: {
          "@type": "ImageObject",
          url: meta.image,
        },
      },
      buildBreadcrumbs(meta.url, meta.title),
    ],
  };

  return (
    <Helmet>
      <title>{meta.title}</title>
      <link rel="canonical" href={meta.url} />
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      <meta name="author" content={meta.author} />
      <meta name="publisher" content={meta.siteName} />
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />
      <meta name="theme-color" content="#1d4ed8" />
      <meta name="referrer" content="no-referrer-when-downgrade" />
      <meta name="format-detection" content="telephone=no" />

      <meta property="og:locale" content={meta.locale} />
      <meta property="og:type" content={meta.type} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.url} />
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:image" content={meta.image} />
      <meta
        property="og:image:alt"
        content="SaveFlox video downloader logo and app preview"
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={meta.twitterSite} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />

      <link rel="alternate" href={meta.url} hrefLang="en-US" />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
