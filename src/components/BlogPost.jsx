import { useEffect, useState, useRef } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Tag } from "lucide-react";
import { blogAPI } from "../services/api";
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
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const viewIncrementedRef = useRef(false); // Track if we've already incremented view for this post

  // Fetch post from backend API
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        viewIncrementedRef.current = false; // Reset when changing posts
        const response = await blogAPI.getPublicPost(slug);
        if (response?.data?.data) {
          const postData = response.data.data;
          setPost({
            id: postData.id,
            title: postData.title,
            slug: postData.slug,
            category: postData.category,
            excerpt: postData.excerpt,
            content: postData.content,
            cover: postData.image,
            author: postData.author || 'Admin',
            date: new Date(postData.createdAt * 1000).toLocaleDateString(),
            readTime: postData.read_time || 5,
            views: postData.views || 0,
          });
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Increment view count only once per post visit
  useEffect(() => {
    if (post && !viewIncrementedRef.current) {
      viewIncrementedRef.current = true;
      // Call separate endpoint to increment view (fire and forget)
      blogAPI.incrementPostView(post.id).catch(() => {
        // Silently fail if increment doesn't work
      });
    }
  }, [post?.id]);

  // Scroll to top on post change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (loading) return <div className="bp-loading"><p>Loading...</p></div>;
  if (error || !post) return <Navigate to="/blog" replace />;

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
      {post.cover && (
        <div
          className="bp-cover"
          style={{ backgroundImage: `url(${post.cover})` }}
          role="img"
          aria-label={post.title}
        />
      )}

      {/* Body */}
      <div className="bp-content">{renderContent(post.content)}</div>

      {/* Views count */}
      {/* <div className="bp-views">
        <p>📊 {post.views} {post.views === 1 ? 'view' : 'views'}</p>
      </div> */}
    </article>
  );
}