import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Search, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BLOG_POSTS } from "../data/blogPosts";
import "../styles/Blog.css";

const CATEGORIES = ["All", "TikTok", "Instagram", "Facebook", "MP3", "Tips", "Legal"];

export default function Blog() {
  const { t } = useTranslation();
  const [activeCat, setActiveCat] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return BLOG_POSTS.filter((p) => {
      const matchCat = activeCat === "All" || p.category === activeCat;
      const matchQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [activeCat, query]);

  const featured = BLOG_POSTS.find((p) => p.featured);
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
            <Link key={post.id} to={`/blog/${post.slug}`} className="blog-card">
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