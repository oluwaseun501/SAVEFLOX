import { useState, useMemo, useEffect } from "react";
import {
  Plus, Search, Edit3, Trash2, Eye, EyeOff, FileText,
  CheckCircle2, FileEdit, TrendingUp, X, Star, Image as ImageIcon,
  ChevronLeft, ChevronRight, AlertCircle, Loader,
} from "lucide-react";
import { blogAPI } from "../services/api";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../styles/MyBlog.css";

const CATEGORIES = ["Tutorials", "Reviews", "Guides", "News", "Updates"];
const STATUS_OPTIONS = ["All", "published", "draft"];
const PAGE_SIZE = 8;

const emptyPost = {
  title: "", slug: "", category: "Tutorials", author: "", excerpt: "",
  content: "", image: "", status: "draft", featured: false, readTime: 5,
};

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPost);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Load posts from API
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.getAdminPosts();
      if (response?.data?.data?.posts) {
        const formattedPosts = response.data.data.posts.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          category: post.category,
          author: post.author,
          excerpt: post.excerpt,
          content: post.content,
          image: post.image,
          status: post.status,
          featured: post.featured,
          views: post.views || 0,
          readTime: post.readTime || 5,
          date: new Date(post.createdAt * 1000).toISOString().slice(0, 10),
          createdAt: post.createdAt,
        }));
        setPosts(formattedPosts);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

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
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.status === "published").length;
    const drafts = posts.filter((p) => p.status === "draft").length;
    const views = posts.reduce((sum, p) => sum + (p.views || 0), 0);
    return { total, published, drafts, views };
  }, [posts]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyPost);
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (post) => {
    setEditing(post);
    setForm({ ...post });
    setImageFile(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(emptyPost);
    setImageFile(null);
  };

  const handleField = (field, value) => {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === "title" && !editing) next.slug = slugify(value);
      return next;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Image file selected:', file.name, file.size);
      setImageFile(file);
      // Show preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        console.log('Image preview created');
        setForm(f => ({ ...f, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      setError("Title and author are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const finalSlug = form.slug.trim() ? slugify(form.slug) : slugify(form.title);
      
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("slug", finalSlug);
      formData.append("category", form.category);
      formData.append("author", form.author);
      formData.append("excerpt", form.excerpt);
      formData.append("content", form.content);
      formData.append("status", form.status);
      formData.append("featured", form.featured);
      formData.append("read_time", form.readTime);
      
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (form.image && form.image.startsWith("http")) {
        formData.append("image", form.image);
      }

      if (editing) {
        // Use multipart for update if there's a file, otherwise use JSON
        if (imageFile) {
          await blogAPI.updatePost(editing.id, formData);
        } else {
          await blogAPI.updatePost(editing.id, {
            title: form.title,
            slug: finalSlug,
            category: form.category,
            author: form.author,
            excerpt: form.excerpt,
            content: form.content,
            image: form.image,
            status: form.status,
            featured: form.featured,
            read_time: form.readTime,
          });
        }
      } else {
        if (imageFile) {
          await blogAPI.createPost(formData);
        } else {
          await blogAPI.createPost({
            title: form.title,
            slug: finalSlug,
            category: form.category,
            author: form.author,
            excerpt: form.excerpt,
            content: form.content,
            image: form.image,
            status: form.status,
            featured: form.featured,
            read_time: form.readTime,
          });
        }
      }
      
      await fetchPosts();
      closeModal();
    } catch (err) {
      console.error("Failed to save post:", err);
      setError(err.response?.data?.message || "Failed to save blog post");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (id) => {
    try {
      const post = posts.find(p => p.id === id);
      if (!post) return;

      const newStatus = post.status === "published" ? "draft" : "published";
      await blogAPI.updatePost(id, { ...post, status: newStatus });
      await fetchPosts();
    } catch (err) {
      console.error("Failed to update post status:", err);
      setError("Failed to update post status");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    
    try {
      setDeleting(true);
      setError(null);
      await blogAPI.deletePost(confirmDelete.id);
      await fetchPosts();
      setConfirmDelete(null);
    } catch (err) {
      console.error("Failed to delete post:", err);
      setError(err.response?.data?.message || "Failed to delete blog post");
    } finally {
      setDeleting(false);
    }
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
            <button className="ab-create-btn" onClick={openCreate} disabled={loading}>
              <Plus size={16} /> New Post
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="ab-alert ab-alert-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

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

          {/* Loading State */}
          {loading ? (
            <div className="ab-loading">
              <Loader size={32} className="ab-spinner" />
              <p>Loading blog posts...</p>
            </div>
          ) : (
            <>
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
                              <img src={p.image} alt="" className="ab-post-thumb" onError={(e) => e.target.style.display = 'none'} />
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
            </>
          )}
        </div>

        {/* Create / Edit Modal */}
        {modalOpen && (
          <div className="ab-modal-backdrop" onClick={closeModal}>
            <div className="ab-modal" onClick={(e) => e.stopPropagation()}>
              <div className="ab-modal-header">
                <h2>{editing ? "Edit Post" : "New Post"}</h2>
                <button className="ab-modal-close" onClick={closeModal} aria-label="Close" disabled={saving}>
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
                    disabled={saving}
                  />
                </label>

                <div className="ab-form-grid">
                  <label>
                    Category
                    <select
                      value={form.category}
                      onChange={(e) => handleField("category", e.target.value)}
                      disabled={saving}
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
                      disabled={saving}
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
                    disabled={saving}
                  />
                </label>

                <label>
                  Content
                  <textarea
                    rows="6"
                    value={form.content}
                    onChange={(e) => handleField("content", e.target.value)}
                    placeholder="Write the full article here..."
                    disabled={saving}
                  />
                </label>

                <label>
                  Cover Image
                  <div className="ab-image-upload-container">
                    <div className="ab-image-upload-box">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={saving}
                        id="image-input"
                        className="ab-file-input-hidden"
                      />
                      <label htmlFor="image-input" className="ab-file-input-label">
                        <ImageIcon size={32} />
                        <span>Choose Image</span>
                        <small>or drag and drop</small>
                      </label>
                    </div>
                    {form.image && (
                      <div className="ab-image-preview-container">
                        <img 
                          src={form.image} 
                          alt="Preview" 
                          className="ab-image-preview-thumb" 
                          onError={(e) => {
                            console.log('Image load error for:', form.image);
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => console.log('Image loaded successfully:', form.image)}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setForm(f => ({ ...f, image: '' }));
                            setImageFile(null);
                          }}
                          className="ab-image-remove-btn"
                          disabled={saving}
                          title="Remove image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </label>

                <div className="ab-form-grid">
                  <label>
                    Status
                    <select
                      value={form.status}
                      onChange={(e) => handleField("status", e.target.value)}
                      disabled={saving}
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
                      disabled={saving}
                    />
                    <span><Star size={14} /> Featured post</span>
                  </label>
                </div>

                <label>
                  Read Time (minutes)
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={form.readTime}
                    onChange={(e) => handleField("readTime", parseInt(e.target.value))}
                    disabled={saving}
                  />
                </label>

                <div className="ab-form-actions">
                  <button type="button" className="ab-btn-secondary" onClick={closeModal} disabled={saving}>
                    Cancel
                  </button>
                  <button type="submit" className="ab-btn-primary" disabled={saving}>
                    {saving && <Loader size={14} className="ab-btn-spinner" />}
                    {saving ? "Uploading..." : (editing ? "Save Changes" : "Create Post")}
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
                  disabled={deleting}
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
                <button className="ab-btn-secondary" onClick={() => setConfirmDelete(null)} disabled={deleting}>
                  Cancel
                </button>
                <button className="ab-btn-danger" onClick={handleDelete} disabled={deleting}>
                  {deleting ? (
                    <>
                      <Loader size={14} className="ab-btn-spinner" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} /> Delete
                    </>
                  )}
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