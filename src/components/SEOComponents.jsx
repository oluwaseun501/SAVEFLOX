import {
  useSEO,
  generateServiceSchema,
  generateProductSchema,
} from "../utils/seoHooks";

/**
 * SEO Wrapper for TikTok Downloader Page
 */
export const TikTokDownloaderSEO = () => {
  const schema = generateServiceSchema(
    "TikTok Video Downloader",
    "Download TikTok videos without watermarks instantly in HD quality. Free TikTok downloader - no sign-up required.",
    "https://saveflox.com/tiktok-downloader",
    "https://saveflox.com/og-tiktok.png",
  );

  return useSEO({
    title:
      "TikTok Downloader - Download TikTok Videos Without Watermark | SaveFlox",
    description:
      "Download TikTok videos without watermarks instantly with SaveFlox. Free online TikTok video downloader - works on all devices. Save TikTok videos in MP4 or MP3 within seconds. No sign-up required.",
    keywords:
      "tiktok downloader, download tiktok videos, tiktok without watermark, tiktok video saver, free tiktok downloader, online tiktok downloader, tiktok mp4 downloader, best tiktok downloader, fastest tiktok downloader, tiktok video download",
    url: "https://saveflox.com/tiktok-downloader",
    image: "https://saveflox.com/og-tiktok.png",
    structuredData: schema,
    breadcrumbs: [
      { name: "Home", url: "https://saveflox.com" },
      {
        name: "TikTok Downloader",
        url: "https://saveflox.com/tiktok-downloader",
      },
    ],
  });
};

/**
 * SEO Wrapper for YouTube Downloader Page
 */
export const YouTubeDownloaderSEO = () => {
  const schema = generateServiceSchema(
    "YouTube Video Downloader",
    "Download YouTube videos in 4K/HD quality and convert to MP3 instantly. Free YouTube downloader - no sign-up required.",
    "https://saveflox.com/youtube-downloader",
    "https://saveflox.com/og-youtube.png",
  );

  return useSEO({
    title: "YouTube Downloader - Download Videos & Convert to MP3 | SaveFlox",
    description:
      "Download YouTube videos in HD/4K quality and convert to MP3 audio instantly with SaveFlox free YouTube downloader. No sign-up, no ads, completely free. Works on desktop and mobile.",
    keywords:
      "youtube downloader, download youtube videos, youtube to mp3, youtube mp4 downloader, youtube video converter, youtube music downloader, free youtube downloader, online youtube downloader, best youtube downloader, 4k youtube downloader",
    url: "https://saveflox.com/youtube-downloader",
    image: "https://saveflox.com/og-youtube.png",
    structuredData: schema,
    breadcrumbs: [
      { name: "Home", url: "https://saveflox.com" },
      {
        name: "YouTube Downloader",
        url: "https://saveflox.com/youtube-downloader",
      },
    ],
  });
};

/**
 * SEO Wrapper for Instagram Downloader Page
 */
export const InstagramDownloaderSEO = () => {
  const schema = generateServiceSchema(
    "Instagram Video Downloader",
    "Download Instagram videos, reels, stories, and photos instantly. Free Instagram downloader - no sign-up required.",
    "https://saveflox.com/instagram-downloader",
    "https://saveflox.com/og-instagram.png",
  );

  return useSEO({
    title: "Instagram Downloader - Download Videos, Reels & Photos | SaveFlox",
    description:
      "Download Instagram videos, reels, stories, and photos instantly with SaveFlox free Instagram downloader. No sign-up, no watermark, no ads. Works on all devices.",
    keywords:
      "instagram downloader, download instagram videos, instagram reel downloader, instagram post downloader, instagram story downloader, instagram video saver, free instagram downloader, online instagram downloader, instagram photo downloader",
    url: "https://saveflox.com/instagram-downloader",
    image: "https://saveflox.com/og-instagram.png",
    structuredData: schema,
    breadcrumbs: [
      { name: "Home", url: "https://saveflox.com" },
      {
        name: "Instagram Downloader",
        url: "https://saveflox.com/instagram-downloader",
      },
    ],
  });
};

/**
 * SEO Wrapper for Facebook Downloader Page
 */
export const FacebookDownloaderSEO = () => {
  const schema = generateServiceSchema(
    "Facebook Video Downloader",
    "Download Facebook videos and live streams instantly. Free Facebook downloader - no sign-up required.",
    "https://saveflox.com/facebook-downloader",
    "https://saveflox.com/og-facebook.png",
  );

  return useSEO({
    title:
      "Facebook Video Downloader - Download Videos & Live Streams | SaveFlox",
    description:
      "Download Facebook videos, live streams, and stories instantly with SaveFlox free Facebook video downloader. No sign-up, completely free, works on all devices.",
    keywords:
      "facebook downloader, facebook video downloader, download facebook videos, facebook video saver, free facebook downloader, online facebook downloader, facebook live downloader, facebook mp4 downloader",
    url: "https://saveflox.com/facebook-downloader",
    image: "https://saveflox.com/og-facebook.png",
    structuredData: schema,
    breadcrumbs: [
      { name: "Home", url: "https://saveflox.com" },
      {
        name: "Facebook Downloader",
        url: "https://saveflox.com/facebook-downloader",
      },
    ],
  });
};

/**
 * SEO Wrapper for Twitter Downloader Page
 */
export const TwitterDownloaderSEO = () => {
  const schema = generateServiceSchema(
    "Twitter/X Video Downloader",
    "Download Twitter (X) videos and GIFs instantly. Free Twitter downloader - works on desktop and mobile.",
    "https://saveflox.com/twitter-downloader",
    "https://saveflox.com/og-twitter.png",
  );

  return useSEO({
    title: "Twitter/X Video Downloader - Download Videos & GIFs | SaveFlox",
    description:
      "Download Twitter (X) videos, GIFs, and media instantly with SaveFlox free Twitter video downloader. Fast, easy, and completely free. No sign-up required.",
    keywords:
      "twitter downloader, x downloader, download twitter videos, twitter video saver, tweet downloader, twitter mp4 downloader, free twitter downloader, online twitter downloader, twitter gif downloader",
    url: "https://saveflox.com/twitter-downloader",
    image: "https://saveflox.com/og-twitter.png",
    structuredData: schema,
    breadcrumbs: [
      { name: "Home", url: "https://saveflox.com" },
      {
        name: "Twitter/X Downloader",
        url: "https://saveflox.com/twitter-downloader",
      },
    ],
  });
};

/**
 * SEO Wrapper for Pinterest Downloader Page
 */
export const PinterestDownloaderSEO = () => {
  const schema = generateServiceSchema(
    "Pinterest Video Downloader",
    "Download Pinterest videos and images instantly. Free Pinterest downloader - no account required.",
    "https://saveflox.com/pinterest-downloader",
    "https://saveflox.com/og-pinterest.png",
  );

  return useSEO({
    title: "Pinterest Downloader - Download Videos & Images | SaveFlox",
    description:
      "Download Pinterest videos, images, and pins instantly with SaveFlox free Pinterest downloader. No account needed, completely free, works on all devices.",
    keywords:
      "pinterest downloader, download pinterest videos, pinterest image downloader, save pinterest pins, pinterest video saver, free pinterest downloader, online pinterest downloader, pinterest pin saver",
    url: "https://saveflox.com/pinterest-downloader",
    image: "https://saveflox.com/og-pinterest.png",
    structuredData: schema,
    breadcrumbs: [
      { name: "Home", url: "https://saveflox.com" },
      {
        name: "Pinterest Downloader",
        url: "https://saveflox.com/pinterest-downloader",
      },
    ],
  });
};

/**
 * SEO Wrapper for MP3 Converter Page
 */
export const MP3ConverterSEO = () => {
  const schema = generateServiceSchema(
    "Video to MP3 Converter",
    "Convert YouTube, TikTok, Instagram videos to MP3 instantly. Free MP3 converter - no sign-up required.",
    "https://saveflox.com/mp3-converter",
    "https://saveflox.com/og-mp3.png",
  );

  return useSEO({
    title: "MP3 Converter - Convert Videos to Audio MP3 | SaveFlox",
    description:
      "Convert YouTube, TikTok, Instagram, and other videos to MP3 audio instantly with SaveFlox free MP3 converter. High quality, no sign-up, no ads. Works on all devices.",
    keywords:
      "mp3 converter, video to mp3, youtube to mp3, mp3 downloader, audio converter, extract audio from video, convert video to audio, online mp3 converter, free mp3 converter, music downloader",
    url: "https://saveflox.com/mp3-converter",
    image: "https://saveflox.com/og-mp3.png",
    structuredData: schema,
    breadcrumbs: [
      { name: "Home", url: "https://saveflox.com" },
      { name: "MP3 Converter", url: "https://saveflox.com/mp3-converter" },
    ],
  });
};

/**
 * SEO Wrapper for Blog Page
 */
export const BlogPageSEO = () => {
  const schema = generateProductSchema(
    "SaveFlox Blog",
    "Read articles, tips, and guides about video downloading, social media content saving, and digital tools.",
    "https://saveflox.com/og-blog.png",
    "https://saveflox.com/blog",
  );

  return useSEO({
    title: "Blog - Video Downloader Tips, Guides & Tutorials | SaveFlox",
    description:
      "Read our blog for tips, tutorials, and guides on how to download videos from YouTube, TikTok, Instagram, Facebook, and other platforms. Learn best practices for video downloading.",
    keywords:
      "video downloader blog, video download guide, tiktok tips, youtube tips, instagram tips, download guide, tutorial",
    url: "https://saveflox.com/blog",
    image: "https://saveflox.com/og-blog.png",
    structuredData: schema,
    breadcrumbs: [
      { name: "Home", url: "https://saveflox.com" },
      { name: "Blog", url: "https://saveflox.com/blog" },
    ],
  });
};

/**
 * SEO Wrapper for FAQ Page
 */
export const FAQPageSEO = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is SaveFlox free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! SaveFlox is completely free to use. No sign-up, no hidden fees, no premium upgrades needed. Just paste a link and download.",
        },
      },
      {
        "@type": "Question",
        name: "What platforms does SaveFlox support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SaveFlox supports YouTube, TikTok, Instagram, Facebook, Twitter, Pinterest, Snapchat, and 50+ other video platforms.",
        },
      },
      {
        "@type": "Question",
        name: "Is it safe to use SaveFlox?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, SaveFlox is 100% safe. We use HTTPS encryption for all downloads and never store personal data.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to install an app?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, SaveFlox works directly in your web browser. No app installation needed.",
        },
      },
      {
        "@type": "Question",
        name: "What file formats are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We support MP4, MP3, WebM, and many other formats. Choose quality from 360p to 4K.",
        },
      },
    ],
  };

  return useSEO({
    title: "FAQ - Frequently Asked Questions | SaveFlox Video Downloader",
    description:
      "Find answers to common questions about SaveFlox video downloader. Learn how to download videos, supported formats, safety features, and more.",
    keywords:
      "faq, frequently asked questions, video downloader help, download help, support",
    url: "https://saveflox.com/faq",
    structuredData: faqSchema,
    breadcrumbs: [
      { name: "Home", url: "https://saveflox.com" },
      { name: "FAQ", url: "https://saveflox.com/faq" },
    ],
  });
};
