'use client'
import { useEffect, useState } from 'react'
import { getDb } from '@/lib/firebase'
import toast from 'react-hot-toast'

interface BlogPost {
  id: string
  title: string
  slug: string
  category: string
  content: string
  publishDate: string
  status: 'published' | 'draft'
  createdAt?: unknown
}

const CATEGORIES = ['Maintenance', 'Diagnostics', 'DIY Guides', 'News', 'Tips', 'OBD2', 'MOT', 'Electric Vehicles']

const emptyPost = (): Omit<BlogPost, 'id'> => ({
  title: '',
  slug: '',
  category: 'Maintenance',
  content: '',
  publishDate: new Date().toISOString().split('T')[0],
  status: 'draft',
})

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyPost())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    setLoading(true)
    try {
      const db = getDb()
      if (!db) { setLoading(false); return }
      const { getDocs, collection, query, orderBy } = await import('firebase/firestore')
      const snap = await getDocs(query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc')))
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost)))
    } catch (e) {
      console.warn('Load posts error:', e)
    } finally {
      setLoading(false)
    }
  }

  function generateSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function handleTitleChange(title: string) {
    setForm(prev => ({ ...prev, title, slug: generating ? generateSlug(title) : prev.slug }))
  }

  let generating = true

  async function savePost() {
    if (!form.title.trim()) { toast.error('Enter a title'); return }
    if (!form.slug.trim()) { toast.error('Enter a slug'); return }
    setSaving(true)
    try {
      const db = getDb()
      if (!db) { toast.error('Firebase not configured'); return }
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
      const id = editing?.id || `post_${Date.now()}`
      await setDoc(doc(db, 'blog_posts', id), {
        ...form,
        createdAt: editing?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      toast.success(editing ? 'Post updated' : 'Post created')
      setEditing(null)
      setCreating(false)
      setForm(emptyPost())
      await loadPosts()
    } catch (e) {
      toast.error('Save failed')
      console.warn(e)
    } finally {
      setSaving(false) }
  }

  async function deletePost(id: string) {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    try {
      const db = getDb()
      if (!db) return
      const { doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc(db, 'blog_posts', id))
      setPosts(prev => prev.filter(p => p.id !== id))
      toast.success('Post deleted')
    } catch (e) {
      toast.error('Delete failed')
      console.warn(e)
    }
  }

  function startEdit(post: BlogPost) {
    generating = false
    setEditing(post)
    setCreating(false)
    setForm({
      title: post.title,
      slug: post.slug,
      category: post.category,
      content: post.content,
      publishDate: post.publishDate,
      status: post.status,
    })
  }

  function startCreate() {
    generating = true
    setCreating(true)
    setEditing(null)
    setForm(emptyPost())
  }

  const showForm = editing || creating

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-orbitron text-xl font-bold" style={{ color: 'var(--text)' }}>Blog</h1>
        <button onClick={startCreate} className="btn-cyan px-4 py-2 text-sm rounded-lg">+ New Post</button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card rounded-xl p-5 space-y-4">
          <h2 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--cyan)' }}>
            {editing ? 'Edit Post' : 'New Post'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--muted)' }}>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Post title..."
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--muted)' }}>Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={e => { generating = false; setForm(prev => ({ ...prev, slug: e.target.value })) }}
                placeholder="post-url-slug"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none font-mono"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--muted)' }}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--muted)' }}>Publish Date</label>
              <input
                type="date"
                value={form.publishDate}
                onChange={e => setForm(prev => ({ ...prev, publishDate: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--muted)' }}>Status</label>
              <select
                value={form.status}
                onChange={e => setForm(prev => ({ ...prev, status: e.target.value as 'published' | 'draft' }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--muted)' }}>Content (Markdown)</label>
              <textarea
                value={form.content}
                onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your post content in markdown..."
                rows={12}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none font-mono resize-y"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={savePost} disabled={saving} className="btn-cyan px-6 py-2.5 text-sm disabled:opacity-40">
              {saving ? 'Saving...' : (editing ? 'Update Post' : 'Create Post')}
            </button>
            <button
              onClick={() => { setEditing(null); setCreating(false) }}
              className="px-6 py-2.5 text-sm rounded-lg"
              style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Posts List */}
      {loading ? (
        <div className="card rounded-xl p-8 text-center">
          <div className="w-8 h-8 rounded-full border-2 animate-spin mx-auto mb-3" style={{ borderColor: 'var(--cyan)', borderTopColor: 'transparent' }} />
        </div>
      ) : posts.length === 0 ? (
        <div className="card rounded-xl p-8 text-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>No blog posts yet. Create your first post above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="card rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-rajdhani font-bold" style={{ color: 'var(--text)' }}>{post.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded font-bold" style={{
                    background: post.status === 'published' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                    color: post.status === 'published' ? '#22c55e' : 'var(--muted)',
                  }}>
                    {post.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{post.category}</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>/blog/{post.slug}</span>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{post.publishDate}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(post)}
                  className="text-xs px-3 py-1.5 rounded-lg font-bold"
                  style={{ background: 'rgba(0,220,240,0.1)', color: 'var(--cyan)', cursor: 'pointer' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-xs px-3 py-1.5 rounded-lg font-bold"
                  style={{ background: 'rgba(255,36,41,0.1)', color: '#ff2429', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
