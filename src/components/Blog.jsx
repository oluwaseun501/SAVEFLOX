import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Search, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/Blog.css";

/* ------------------------------------------------------------------ */
/*  SAMPLE BLOG POSTS                                                  */
/*  Replace this array with your API response from the admin dashboard */
/*  e.g. const { data: posts } = useFetch("/api/posts");               */
/* ------------------------------------------------------------------ */
const SAMPLE_POSTS = [
  {
    id: 1,
    slug: "download-tiktok-without-watermark",
    title: "How to Download TikTok Videos Without Watermark in 2026",
    excerpt:
      "Learn the safest, fastest way to save TikTok videos in HD without the logo — no app install required.",
    category: "TikTok",
    date: "April 22, 2026",
    readTime: 5,
    cover:
      "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=1200&q=70",
    featured: true,
  },
  {
    id: 2,
    slug: "youtube-to-mp3-guide",
    title: "Convert YouTube to MP3: The Complete Quality Guide",
    excerpt:
      "320 kbps vs 128 kbps, when each makes sense, and how to extract clean audio from any video link.",
    category: "MP3",
    date: "April 18, 2026",
    readTime: 7,
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=70",
  },
  {
    id: 3,
    slug: "instagram-reels-downloader",
    title: "Instagram Reels Downloader: Save Reels, Stories & Posts",
    excerpt:
      "A step-by-step walkthrough for downloading Reels in HD on desktop and mobile — no Instagram login needed.",
    category: "Instagram",
    date: "April 14, 2026",
    readTime: 4,
    cover:
      "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800&q=70",
  },
  {
    id: 4,
    slug: "best-video-quality-settings",
    title: "4K, 1080p or 720p? Picking the Right Download Quality",
    excerpt:
      "When to choose ultra-HD, when 1080p is the sweet spot, and how quality affects file size on mobile.",
    category: "Tips",
    date: "April 10, 2026",
    readTime: 6,
    cover:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=70",
  },
  {
    id: 5,
    slug: "is-downloading-videos-legal",
    title: "Is It Legal to Download Social Media Videos?",
    excerpt:
      "What you can and can't do with downloaded content — fair use, personal use, and creator rights explained.",
    category: "Legal",
    date: "April 5, 2026",
    readTime: 8,
    cover:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=70",
  },
  {
    id: 6,
    slug: "facebook-video-downloader-tips",
    title: "Facebook Video Downloader: 5 Tips for HD Downloads",
    excerpt:
      "Get higher-quality Facebook downloads, batch save Reels, and avoid the most common errors.",
    category: "Facebook",
    date: "April 1, 2026",
    readTime: 5,
    cover:
      "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&q=70",
  },
];

const CATEGORIES = ["All", "TikTok", "Instagram", "Facebook", "MP3", "Tips", "Legal"];

export default function Blog() {
  const { t } = useTranslation();
  const [activeCat, setActiveCat] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return SAMPLE_POSTS.filter((p) => {
      const matchCat = activeCat === "All" || p.category === activeCat;
      const matchQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [activeCat, query]);

  const featured = SAMPLE_POSTS.find((p) => p.featured);
  const others = filtered.filter((p) => !p.featured);

  return (
    <section className="blog">
      {/* Header */}
      <div className="blog-header">
        <span className="blog-eyebrow">
          <Tag size={14} /> {t("blog_eyebrow")}
        </span>
        <h1 className="blog-title">
          {t("blog_title")} <span>{t("blog_title_highlight")}</span>
        </h1>
        <p className="blog-subtitle">{t("blog_subtitle")}</p>

        {/* Search */}
        <div className="blog-search">
          <Search size={18} className="blog-search-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("blog_search_placeholder")}
          />
        </div>

        {/* Categories */}
        <div className="blog-cats">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`blog-cat-pill ${activeCat === cat ? "active" : ""}`}
            >
              {cat === "All" ? t("blog_cat_all") : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured post */}
      {featured && activeCat === "All" && !query && (
        <Link to={`/blog/${featured.slug}`} className="blog-featured">
          <div
            className="blog-featured-image"
            style={{ backgroundImage: `url(${featured.cover})` }}
          >
            <span className="blog-featured-badge">{t("blog_featured")}</span>
          </div>
          <div className="blog-featured-body">
            <span className="blog-card-cat">{featured.category}</span>
            <h2 className="blog-featured-title">{featured.title}</h2>
            <p className="blog-featured-excerpt">{featured.excerpt}</p>
            <div className="blog-card-meta">
              <span><Calendar size={14} /> {featured.date}</span>
              <span><Clock size={14} /> {featured.readTime} {t("blog_min_read")}</span>
            </div>
            <span className="blog-read-more">
              {t("blog_read_more")} <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      )}

      {/* Grid */}
      {others.length > 0 ? (
        <div className="blog-grid">
          {others.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="blog-card"
            >
              <div
                className="blog-card-image"
                style={{ backgroundImage: `url(${post.cover})` }}
              />
              <div className="blog-card-body">
                <span className="blog-card-cat">{post.category}</span>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-meta">
                  <span><Calendar size={14} /> {post.date}</span>
                  <span><Clock size={14} /> {post.readTime} {t("blog_min_read")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="blog-empty">
          <p>{t("blog_empty")}</p>
        </div>
      )}
    </section>
  );
}