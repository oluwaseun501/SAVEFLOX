import { useEffect } from "react";

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
};

const normalizeSelector = (selector) => {
  if (!selector) return selector;
  return selector.replace(/\[([^\]=]+)=([^\]"']+)\]/g, '[$1="$2"]');
};

const updateTag = ({ tag, selector, attr, value, content }) => {
  const query = normalizeSelector(selector) || `${tag}[${attr}="${value}"]`;
  let element = document.head.querySelector(query);
  if (!element) {
    element = document.createElement(tag);
    if (attr) element.setAttribute(attr, value);
    document.head.appendChild(element);
  }
  if (tag === "link") {
    element.href = content;
  } else {
    element.content = content;
  }
};

const updateScript = (id, json) => {
  let script = document.head.querySelector(`script#${id}`);
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(json);
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
  useEffect(() => {
    const meta = {
      title: title || DEFAULT.title,
      description: description || DEFAULT.description,
      keywords: keywords || DEFAULT.keywords,
      url: canonical || url || DEFAULT.url,
      image: image || DEFAULT.image,
      type: type || DEFAULT.type,
      siteName: siteName || DEFAULT.siteName,
      locale: locale || DEFAULT.locale,
    };

    document.title = meta.title;

    updateTag({ tag: "meta", selector: "[name=description]", attr: "name", value: "description", content: meta.description });
    updateTag({ tag: "meta", selector: "[name=keywords]", attr: "name", value: "keywords", content: keywords || DEFAULT.keywords });
    updateTag({ tag: "meta", selector: "[property=og:title]", attr: "property", value: "og:title", content: meta.title });
    updateTag({ tag: "meta", selector: "[property=og:description]", attr: "property", value: "og:description", content: meta.description });
    updateTag({ tag: "meta", selector: "[property=og:type]", attr: "property", value: "og:type", content: meta.type });
    updateTag({ tag: "meta", selector: "[property=og:url]", attr: "property", value: "og:url", content: meta.url });
    updateTag({ tag: "meta", selector: "[property=og:site_name]", attr: "property", value: "og:site_name", content: meta.siteName });
    updateTag({ tag: "meta", selector: "[property=og:image]", attr: "property", value: "og:image", content: meta.image });
    updateTag({ tag: "meta", selector: "[name=twitter:card]", attr: "name", value: "twitter:card", content: "summary_large_image" });
    updateTag({ tag: "meta", selector: "[name=twitter:title]", attr: "name", value: "twitter:title", content: meta.title });
    updateTag({ tag: "meta", selector: "[name=twitter:description]", attr: "name", value: "twitter:description", content: meta.description });
    updateTag({ tag: "meta", selector: "[name=twitter:image]", attr: "name", value: "twitter:image", content: meta.image });
    updateTag({ tag: "link", selector: "[rel=canonical]", attr: "rel", value: "canonical", content: meta.url });
    updateTag({ tag: "meta", selector: "[name=robots]", attr: "name", value: "robots", content: noIndex ? "noindex, nofollow" : "index, follow" });

    updateScript("saveflox-schema", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: meta.siteName,
      url: meta.url,
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
        target: `${meta.url}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    });
  }, [title, description, keywords, url, image, type, siteName, locale, canonical, noIndex]);

  return null;
}
