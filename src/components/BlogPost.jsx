import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Tag } from "lucide-react";
import { BLOG_POSTS } from "../data/blogPosts";
import "../styles/BlogPost.css";

/* Tiny markdown -> HTML helper for our simple content (## headings, lists, paragraphs, **bold**) */
function renderContent(text) {
  const lines = text.trim().split("\n");
  const blocks = [];
  let currentList = null;

  const inline = (s) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  lines.forEach((raw) => {
    const line = raw.trim();
    if (!line) {
      if (currentList) { blocks.push(currentList); currentList = null; }
      return;
    }
    if (line.startsWith("## ")) {
      if (currentList) { blocks.push(currentList); currentList = null; }
      blocks.push({ type: "h2", text: line.slice(3) });
    } else if (/^\d+\.\s/.test(line)) {
      if (!currentList || currentList.tag !== "ol") {
        if (currentList) blocks.push(currentList);
        currentList = { type: "list", tag: "ol", items: [] };
      }
      currentList.items.push(line.replace(/^\d+\.\s/, ""));
    } else if (line.startsWith("- ")) {
      if (!currentList || currentList.tag !== "ul") {
        if (currentList) blocks.push(currentList);
        currentList = { type: "list", tag: "ul", items: [] };
      }
      currentList.items.push(line.slice(2));
    } else {
      if (currentList) { blocks.push(currentList); currentList = null; }
      blocks.push({ type: "p", text: line });
    }
  });
  if (currentList) blocks.push(currentList);

  return blocks.map((b, i) => {
    if (b.type === "h2")  return <h2 key={i} dangerouslySetInnerHTML={{ __html: inline(b.text) }} />;
    if (b.type === "p")   return <p  key={i} dangerouslySetInnerHTML={{ __html: inline(b.text) }} />;
    if (b.type === "list") {
      const Tag = b.tag;
      return (
        <Tag key={i}>
          {b.items.map((it, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: inline(it) }} />
          ))}
        </Tag>
      );
    }
    return null;
  });
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  // Scroll to top on post change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (!post) return <Navigate to="/blog" replace />;

  const related = BLOG_POSTS
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  // Fall back to most recent posts if no category match
  const moreReads = related.length > 0
    ? related
    : BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="bp-shell">
      {/* Back link */}
      <div className="bp-topnav">
        <Link to="/blog" className="bp-back">
          <ArrowLeft size={16} /> Back to all articles
        </Link>
      </div>

      {/* Hero */}
      <header className="bp-hero">
        <span className="bp-cat">
          <Tag size={12} /> {post.category}
        </span>
        <h1 className="bp-title">{post.title}</h1>
        <p className="bp-excerpt">{post.excerpt}</p>
        <div className="bp-meta">
          <span><User size={14} /> {post.author}</span>
          <span><Calendar size={14} /> {post.date}</span>
          <span><Clock size={14} /> {post.readTime} min read</span>
        </div>
      </header>

      {/* Cover image */}
      <div
        className="bp-cover"
        style={{ backgroundImage: `url(${post.cover})` }}
        role="img"
        aria-label={post.title}
      />

      {/* Body */}
      <div className="bp-content">{renderContent(post.content)}</div>

      {/* Related posts */}
      {moreReads.length > 0 && (
        <section className="bp-related">
          <h2 className="bp-related-title">Continue reading</h2>
          <div className="bp-related-grid">
            {moreReads.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="bp-related-card">
                <div
                  className="bp-related-image"
                  style={{ backgroundImage: `url(${p.cover})` }}
                />
                <div className="bp-related-body">
                  <span className="bp-related-cat">{p.category}</span>
                  <h3>{p.title}</h3>
                  <span className="bp-related-link">
                    Read article <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}