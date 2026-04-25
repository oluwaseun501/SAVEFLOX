import { useState, useMemo } from "react";
import {
  Plus, Search, Edit3, Trash2, Eye, EyeOff, FileText,
  CheckCircle2, FileEdit, TrendingUp, X, Star, Image as ImageIcon,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../styles/MyBlog.css";

/* SAMPLE POSTS — replace with your API response when backend is ready */
const SAMPLE_POSTS = [
  { id: 1, title: "How to Download TikTok Videos Without Watermark in 2026", slug: "download-tiktok-no-watermark-2026", category: "Tutorials", author: "Jane Doe", excerpt: "A step-by-step guide to saving clean TikTok videos in HD.", content: "Full article content goes here...", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800", date: "2026-04-22", status: "published", featured: true,  views: 12480 },
  { id: 2, title: "Top 5 YouTube to MP3 Converters Compared",                slug: "best-youtube-to-mp3-converters",       category: "Reviews",   author: "Mike Allen", excerpt: "We tested the most popular tools to find the best one.", content: "Full article content goes here...", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800", date: "2026-04-18", status: "published", featured: false, views: 8924  },
  { id: 3, title: "Instagram Reels: Save Your Favorite Clips Easily",       slug: "save-instagram-reels-easily",          category: "Tutorials", author: "Jane Doe", excerpt: "Learn how to download Reels in original quality.", content: "Full article content goes here...", image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800", date: "2026-04-12", status: "published", featured: false, views: 5612  },
  { id: 4, title: "Why MP4 is Still the King of Video Formats",             slug: "mp4-king-video-formats",               category: "Guides",    author: "Alex Reed", excerpt: "Understanding why MP4 dominates the web.", content: "Full article content goes here...", image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800", date: "2026-04-08", status: "draft",     featured: false, views: 0     },
  { id: 5, title: "Pinterest Video Downloads Made Simple",                  slug: "pinterest-video-downloads-simple",     category: "Tutorials", author: "Mike Allen", excerpt: "Save Pinterest videos in 3 clicks with SaveFlux.", content: "Full article content goes here...", image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800", date: "2026-04-04", status: "published", featured: false, views: 3401  },
  { id: 6, title: "Audio Quality Explained: 128 vs 256 vs 320 kbps",        slug: "audio-quality-128-256-320-kbps",       category: "Guides",    author: "Alex Reed", excerpt: "Which bitrate should you actually pick?", content: "Full article content goes here...", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", date: "2026-03-28", status: "draft",     featured: false, views: 0     },
];

const CATEGORIES = ["Tutorials", "Reviews", "Guides", "News", "Updates"];
const STATUS_OPTIONS = ["All", "published", "draft"];
const PAGE_SIZE = 8;

const emptyPost = {
  title: "", slug: "", category: "Tutorials", author: "", excerpt: "",
  content: "", image: "", status: "draft", featured: false,
};

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

export default function AdminBlog() {
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = create, post object = edit
  const [form, setForm] = useState(emptyPost);
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* -------- Filtered + paginated -------- */
  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (statusFilter !== "All" && p.status !== statusFilter) return false;
      if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.author.toLowerCase().includes(q))
          return false;
      }
      return true;
    });
  }, [posts, query, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* -------- Stats -------- */
  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.status === "published").length;
    const drafts = posts.filter((p) => p.status === "draft").length;
    const views = posts.reduce((sum, p) => sum + (p.views || 0), 0);
    return { total, published, drafts, views };
  }, [posts]);

  /* -------- Modal handlers -------- */
  const openCreate = () => {
    setEditing(null);
    setForm(emptyPost);
    setModalOpen(true);
  };

  const openEdit = (post) => {
    setEditing(post);
    setForm({ ...post });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(emptyPost);
  };

  const handleField = (field, value) => {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === "title" && !editing) next.slug = slugify(value);
      return next;
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) return;
    const finalSlug = form.slug.trim() ? slugify(form.slug) : slugify(form.title);

    if (editing) {
      setPosts((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...form, slug: finalSlug } : p))
      );
    } else {
      const newPost = {
        ...form,
        slug: finalSlug,
        id: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        views: 0,
      };
      setPosts((prev) => [newPost, ...prev]);
    }
    closeModal();
  };

  /* -------- Toggle publish/draft -------- */
  const togglePublish = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "published" ? "draft" : "published" } : p
      )
    );
  };

  /* -------- Delete -------- */
  const handleDelete = () => {
    if (!confirmDelete) return;
    setPosts((prev) => prev.filter((p) => p.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  return (
    <div className="ab-shell">
      <AdminSidebar />

      <main className="ab-main">
        <AdminTopbar email="admin@saveflux.com" />

        <div className="ab-main-inner">
          {/* Header */}
          <div className="ab-header">
            <div>
              <h1 className="ab-title">Blog Posts</h1>
              <p className="ab-subtitle">
                Create, edit and publish articles for the SaveFlux blog.
              </p>
            </div>
            <button className="ab-create-btn" onClick={openCreate}>
              <Plus size={16} /> New Post
            </button>
          </div>

          {/* Stats */}
          <div className="ab-stats">
            <StatCard icon={<FileText size={18} />}     label="Total Posts" value={stats.total}                  tone="blue"  />
            <StatCard icon={<CheckCircle2 size={18} />} label="Published"   value={stats.published}              tone="green" />
            <StatCard icon={<FileEdit size={18} />}     label="Drafts"      value={stats.drafts}                 tone="blue"  />
            <StatCard icon={<TrendingUp size={18} />}   label="Total Views" value={stats.views.toLocaleString()} tone="green" />
          </div>

          {/* Filters */}
          <div className="ab-filters">
            <div className="ab-search">
              <Search size={16} className="ab-search-icon" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              />
            </div>

            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>

            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
              <option value="All">All categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="ab-table-wrap">
            <table className="ab-table">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Date</th>
                  <th className="ab-th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? paginated.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="ab-post-cell">
                        {p.image ? (
                          <img src={p.image} alt="" className="ab-post-thumb" />
                        ) : (
                          <div className="ab-post-thumb ab-post-thumb-empty">
                            <ImageIcon size={14} />
                          </div>
                        )}
                        <div className="ab-post-meta">
                          <span className="ab-post-title">
                            {p.featured && <Star size={12} className="ab-featured-star" />}
                            {p.title}
                          </span>
                          <span className="ab-post-slug">/{p.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="ab-category-tag">{p.category}</span></td>
                    <td>{p.author}</td>
                    <td>
                      <span className={`ab-status ${p.status}`}>
                        {p.status === "published"
                          ? <><CheckCircle2 size={13} /> Published</>
                          : <><FileEdit size={13} /> Draft</>}
                      </span>
                    </td>
                    <td>{p.views.toLocaleString()}</td>
                    <td className="ab-cell-date">{p.date}</td>
                    <td>
                      <div className="ab-actions">
                        <button
                          className="ab-action-btn"
                          onClick={() => togglePublish(p.id)}
                          title={p.status === "published" ? "Unpublish" : "Publish"}
                        >
                          {p.status === "published" ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <button className="ab-action-btn" onClick={() => openEdit(p)} title="Edit">
                          <Edit3 size={15} />
                        </button>
                        <button
                          className="ab-action-btn ab-action-danger"
                          onClick={() => setConfirmDelete(p)}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="ab-empty">No posts match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="ab-pagination">
            <div className="ab-page-info">
              Showing <strong>{paginated.length}</strong> of <strong>{filtered.length}</strong> posts
            </div>
            <div className="ab-page-controls">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="ab-page-current">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Create / Edit Modal */}
        {modalOpen && (
          <div className="ab-modal-backdrop" onClick={closeModal}>
            <div className="ab-modal" onClick={(e) => e.stopPropagation()}>
              <div className="ab-modal-header">
                <h2>{editing ? "Edit Post" : "New Post"}</h2>
                <button className="ab-modal-close" onClick={closeModal} aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <form className="ab-form" onSubmit={handleSave}>
                <label>
                  Title <span className="ab-required">*</span>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleField("title", e.target.value)}
                    placeholder="Enter post title"
                    required
                  />
                </label>

                <label>
                  Slug
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => handleField("slug", e.target.value)}
                    placeholder="auto-generated-from-title"
                  />
                </label>

                <div className="ab-form-grid">
                  <label>
                    Category
                    <select
                      value={form.category}
                      onChange={(e) => handleField("category", e.target.value)}
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </label>

                  <label>
                    Author <span className="ab-required">*</span>
                    <input
                      type="text"
                      value={form.author}
                      onChange={(e) => handleField("author", e.target.value)}
                      placeholder="Author name"
                      required
                    />
                  </label>
                </div>

                <label>
                  Excerpt
                  <textarea
                    rows="2"
                    value={form.excerpt}
                    onChange={(e) => handleField("excerpt", e.target.value)}
                    placeholder="A short summary shown in the blog list"
                  />
                </label>

                <label>
                  Content
                  <textarea
                    rows="6"
                    value={form.content}
                    onChange={(e) => handleField("content", e.target.value)}
                    placeholder="Write the full article here..."
                  />
                </label>

                <label>
                  Cover image URL
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => handleField("image", e.target.value)}
                    placeholder="https://..."
                  />
                </label>

                <div className="ab-form-grid">
                  <label>
                    Status
                    <select
                      value={form.status}
                      onChange={(e) => handleField("status", e.target.value)}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </label>

                  <label className="ab-checkbox">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => handleField("featured", e.target.checked)}
                    />
                    <span><Star size={14} /> Featured post</span>
                  </label>
                </div>

                <div className="ab-form-actions">
                  <button type="button" className="ab-btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="ab-btn-primary">
                    {editing ? "Save Changes" : "Create Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirm Delete Modal */}
        {confirmDelete && (
          <div className="ab-modal-backdrop" onClick={() => setConfirmDelete(null)}>
            <div className="ab-modal ab-confirm" onClick={(e) => e.stopPropagation()}>
              <div className="ab-modal-header">
                <h2>Delete post?</h2>
                <button
                  className="ab-modal-close"
                  onClick={() => setConfirmDelete(null)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="ab-confirm-body">
                <p>
                  Are you sure you want to delete <strong>{confirmDelete.title}</strong>?
                  This action cannot be undone.
                </p>
              </div>

              <div className="ab-form-actions">
                <button className="ab-btn-secondary" onClick={() => setConfirmDelete(null)}>
                  Cancel
                </button>
                <button className="ab-btn-danger" onClick={handleDelete}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, tone = "blue" }) {
  return (
    <div className="ab-stat-card">
      <div className={`ab-stat-icon ${tone}`}>{icon}</div>
      <div className="ab-stat-label">{label}</div>
      <div className="ab-stat-value">{value}</div>
    </div>
  );
}