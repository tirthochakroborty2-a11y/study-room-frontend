import { useState, useEffect } from 'react';
import {
  MessageCircle, Plus, X, Send, Heart, Trash2, Pin,
  ArrowLeft, Search, Loader, Hash,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  addPost, getAllPosts, deletePost, togglePostLike, togglePinPost,
  addReply, getRepliesByPost, deleteReply,
} from '../api/discussionApi';

const CATEGORIES = [
  { key: 'general', label: '💬 সাধারণ' },
  { key: 'help', label: '🆘 সাহায্য' },
  { key: 'course', label: '📚 কোর্স' },
  { key: 'exam', label: '📝 পরীক্ষা' },
  { key: 'tips', label: '💡 টিপস' },
];

const Discussion = () => {
  const { user, userData, isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // New Post Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [posting, setPosting] = useState(false);

  // Selected Post
  const [activePost, setActivePost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loadingReplies, setLoadingReplies] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const result = await getAllPosts();
    if (result.success) setPosts(result.posts);
    setLoading(false);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error('Title আর Content দিন');
      return;
    }

    setPosting(true);
    const result = await addPost({
      userId: user.uid,
      userName: userData?.name || user.displayName,
      userPhoto: userData?.photoURL || user.photoURL,
      userRole: isAdmin ? 'admin' : 'user',
      title: newTitle,
      content: newContent,
      category: newCategory,
    });

    if (result.success) {
      toast.success('Post সফল!');
      setShowNewModal(false);
      setNewTitle('');
      setNewContent('');
      setNewCategory('general');
      loadPosts();
    } else {
      toast.error('সমস্যা হয়েছে');
    }
    setPosting(false);
  };

  const handleDeletePost = async (docId) => {
    if (!window.confirm('Post মুছে ফেলতে চান?')) return;
    const result = await deletePost(docId);
    if (result.success) {
      toast.success('মুছে ফেলা হয়েছে');
      if (activePost?.docId === docId) setActivePost(null);
      loadPosts();
    }
  };

  const handleLike = async (post, e) => {
    if (e) e.stopPropagation();
    const result = await togglePostLike(
      post.docId,
      user.uid,
      post.likedBy || []
    );
    if (result.success) {
      loadPosts();
      if (activePost?.docId === post.docId) {
        // update activePost
        const updated = posts.find((p) => p.docId === post.docId);
        if (updated) setActivePost(updated);
      }
    }
  };

  const handlePin = async (post, e) => {
    if (e) e.stopPropagation();
    const result = await togglePinPost(post.docId, post.pinned);
    if (result.success) {
      toast.success(post.pinned ? 'Unpinned' : '📌 Pinned');
      loadPosts();
    }
  };

  const openPost = async (post) => {
    setActivePost(post);
    setLoadingReplies(true);
    const result = await getRepliesByPost(post.docId);
    if (result.success) setReplies(result.replies);
    setLoadingReplies(false);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const result = await addReply({
      postId: activePost.docId,
      userId: user.uid,
      userName: userData?.name || user.displayName,
      userPhoto: userData?.photoURL || user.photoURL,
      userRole: isAdmin ? 'admin' : 'user',
      message: replyText,
    });

    if (result.success) {
      setReplyText('');
      const res = await getRepliesByPost(activePost.docId);
      if (res.success) setReplies(res.replies);
      loadPosts();
    }
  };

  const handleDeleteReply = async (docId) => {
    if (!window.confirm('Reply মুছে ফেলতে চান?')) return;
    const result = await deleteReply(docId, activePost.docId);
    if (result.success) {
      toast.success('মুছে ফেলা হয়েছে');
      const res = await getRepliesByPost(activePost.docId);
      if (res.success) setReplies(res.replies);
      loadPosts();
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'এইমাত্র';
    if (diff < 3600) return `${Math.floor(diff / 60)} মিনিট আগে`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ঘণ্টা আগে`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} দিন আগে`;
    return d.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredPosts = posts.filter((p) => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return (
        p.title?.toLowerCase().includes(s) ||
        p.content?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  // ==================== SINGLE POST VIEW ====================
  if (activePost) {
    const isLiked = activePost.likedBy?.includes(user.uid);
    const canDelete = user.uid === activePost.userId || isAdmin;

    return (
      <section style={{
        padding: '90px 0 40px',
        background: '#F8F9FE',
        minHeight: '100vh',
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <button
            onClick={() => setActivePost(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#6C63FF',
              fontSize: '13px',
              fontWeight: '600',
              background: 'white',
              padding: '8px 14px',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(108, 99, 255, 0.08)',
            }}
          >
            <ArrowLeft size={14} /> সব Post
          </button>

          {/* Post Card */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '16px',
            boxShadow: '0 10px 30px rgba(108, 99, 255, 0.08)',
          }}>
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '14px',
            }}>
              <img
                src={activePost.userPhoto || 'https://via.placeholder.com/44'}
                alt=""
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: activePost.userRole === 'admin'
                    ? '2px solid #FF6584'
                    : '2px solid #6C63FF',
                  flexShrink: 0,
                  objectFit: 'cover',
                }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/44'; }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexWrap: 'wrap',
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#2D2D3F',
                  }}>
                    {activePost.userName}
                  </span>
                  {activePost.userRole === 'admin' && (
                    <span style={{
                      padding: '2px 8px',
                      background: '#FCE7F3',
                      color: '#FF6584',
                      borderRadius: '50px',
                      fontSize: '9px',
                      fontWeight: '800',
                    }}>
                      👑 ADMIN
                    </span>
                  )}
                  <span style={{
                    fontSize: '11px',
                    color: '#6B7280',
                  }}>
                    • {formatTime(activePost.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <h1 style={{
              fontSize: '20px',
              fontWeight: '800',
              color: '#2D2D3F',
              marginBottom: '12px',
              lineHeight: '1.3',
            }}>
              {activePost.title}
            </h1>

            <p style={{
              fontSize: '14px',
              color: '#4B5563',
              lineHeight: '1.7',
              whiteSpace: 'pre-wrap',
              marginBottom: '16px',
            }}>
              {activePost.content}
            </p>

            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              paddingTop: '12px',
              borderTop: '1px solid #F3F4F6',
            }}>
              <button
                onClick={(e) => handleLike(activePost, e)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: isLiked ? '#FF6584' : '#6B7280',
                  fontSize: '12px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: 0,
                }}
              >
                <Heart size={14} fill={isLiked ? '#FF6584' : 'none'} />
                {activePost.likes || 0}
              </button>
              <span style={{
                fontSize: '12px',
                color: '#6B7280',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}>
                <MessageCircle size={14} />
                {activePost.repliesCount || 0} Reply
              </span>
              {isAdmin && (
                <button
                  onClick={(e) => handlePin(activePost, e)}
                  style={{
                    marginLeft: 'auto',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: activePost.pinned ? '#6C63FF' : '#9CA3AF',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                  }}
                >
                  <Pin size={14} fill={activePost.pinned ? '#6C63FF' : 'none'} />
                  {activePost.pinned ? 'Pinned' : 'Pin'}
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => handleDeletePost(activePost.docId)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#ef4444',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                    marginLeft: isAdmin ? 0 : 'auto',
                  }}
                >
                  <Trash2 size={13} /> Delete
                </button>
              )}
            </div>
          </div>

          {/* Reply Form */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 10px 30px rgba(108, 99, 255, 0.08)',
          }}>
            <h3 style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#2D2D3F',
              marginBottom: '10px',
            }}>
              💬 আপনার Reply
            </h3>
            <form onSubmit={handleReply}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Reply লিখুন..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  marginBottom: '10px',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#6C63FF'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                style={{
                  padding: '10px 20px',
                  background: !replyText.trim()
                    ? '#9CA3AF'
                    : 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: !replyText.trim() ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Send size={14} /> Reply দিন
              </button>
            </form>
          </div>

          {/* Replies */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 10px 30px rgba(108, 99, 255, 0.08)',
          }}>
            <h3 style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#2D2D3F',
              marginBottom: '14px',
            }}>
              {replies.length} টি Reply
            </h3>

            {loadingReplies ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6C63FF' }}>
                <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : replies.length === 0 ? (
              <p style={{
                textAlign: 'center',
                padding: '20px',
                color: '#6B7280',
                fontSize: '13px',
              }}>
                এখনো কোনো Reply নেই
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {replies.map((reply) => {
                  const canDel = user.uid === reply.userId || isAdmin;
                  return (
                    <div key={reply.docId} style={{
                      padding: '12px',
                      background: '#F8F9FE',
                      borderRadius: '10px',
                      display: 'flex',
                      gap: '10px',
                    }}>
                      <img
                        src={reply.userPhoto || 'https://via.placeholder.com/34'}
                        alt=""
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          flexShrink: 0,
                          border: reply.userRole === 'admin'
                            ? '2px solid #FF6584'
                            : '2px solid #6C63FF',
                          objectFit: 'cover',
                        }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/34'; }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          marginBottom: '4px',
                          flexWrap: 'wrap',
                        }}>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#2D2D3F',
                          }}>
                            {reply.userName}
                          </span>
                          {reply.userRole === 'admin' && (
                            <span style={{
                              padding: '1px 6px',
                              background: '#FCE7F3',
                              color: '#FF6584',
                              borderRadius: '50px',
                              fontSize: '8px',
                              fontWeight: '800',
                            }}>
                              ADMIN
                            </span>
                          )}
                          <span style={{ fontSize: '10px', color: '#6B7280' }}>
                            {formatTime(reply.createdAt)}
                          </span>
                        </div>
                        <p style={{
                          fontSize: '13px',
                          color: '#4B5563',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}>
                          {reply.message}
                        </p>
                        {canDel && (
                          <button
                            onClick={() => handleDeleteReply(reply.docId)}
                            style={{
                              marginTop: '6px',
                              background: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              fontSize: '10px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              padding: 0,
                            }}
                          >
                            <Trash2 size={10} /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </section>
    );
  }

  // ==================== POSTS LIST ====================
  return (
    <section style={{
      padding: '90px 0 40px',
      background: '#F8F9FE',
      minHeight: '100vh',
    }}>
      <div className="container">
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '20px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(108, 99, 255, 0.25)',
        }}>
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.2), transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', flexShrink: 0,
                backdropFilter: 'blur(10px)',
              }}>
                <MessageCircle size={24} />
              </div>
              <div>
                <h1 style={{
                  fontSize: 'clamp(18px, 4vw, 24px)',
                  fontWeight: '800',
                  color: 'white',
                  marginBottom: '2px',
                }}>
                  💬 Discussion
                </h1>
                <p style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: '600',
                }}>
                  সবাই একসাথে কথা বলুন, প্রশ্ন করুন, সাহায্য নিন
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowNewModal(true)}
              style={{
                padding: '12px 20px',
                background: 'white',
                color: '#6C63FF',
                border: 'none',
                borderRadius: '50px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              }}
            >
              <Plus size={16} /> নতুন Post
            </button>
          </div>
        </div>

        {/* Search + Filter */}
        <div style={{
          background: 'white',
          borderRadius: '14px',
          padding: '14px',
          marginBottom: '16px',
          boxShadow: '0 6px 20px rgba(108, 99, 255, 0.06)',
        }}>
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search size={16} color="#6B7280" style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)',
            }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Post খুঁজুন..."
              style={{
                width: '100%',
                padding: '11px 14px 11px 40px',
                border: '2px solid #E5E7EB',
                borderRadius: '10px',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = '#6C63FF'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}>
            <button
              onClick={() => setFilterCategory('all')}
              style={{
                padding: '7px 14px',
                background: filterCategory === 'all'
                  ? 'linear-gradient(135deg, #6C63FF, #5A52D5)'
                  : '#F8F9FE',
                color: filterCategory === 'all' ? 'white' : '#6B7280',
                border: 'none',
                borderRadius: '50px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              🌐 সব
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilterCategory(cat.key)}
                style={{
                  padding: '7px 14px',
                  background: filterCategory === cat.key
                    ? 'linear-gradient(135deg, #6C63FF, #5A52D5)'
                    : '#F8F9FE',
                  color: filterCategory === cat.key ? 'white' : '#6B7280',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div style={{
            background: 'white', borderRadius: '16px',
            padding: '60px', textAlign: 'center',
          }}>
            <Loader size={24} color="#6C63FF" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: '16px',
            padding: '60px 20px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '60px', marginBottom: '14px' }}>💭</div>
            <h3 style={{ fontSize: '17px', color: '#2D2D3F', marginBottom: '8px', fontWeight: '700' }}>
              কোনো Post নেই
            </h3>
            <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '16px' }}>
              প্রথম Post করুন!
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              style={{
                padding: '11px 22px',
                background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={15} /> নতুন Post
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredPosts.map((post) => {
              const isLiked = post.likedBy?.includes(user.uid);
              const category = CATEGORIES.find((c) => c.key === post.category);
              const canDelete = user.uid === post.userId || isAdmin;

              return (
                <div
                  key={post.docId}
                  onClick={() => openPost(post)}
                  style={{
                    background: 'white',
                    borderRadius: '14px',
                    padding: '16px',
                    boxShadow: post.pinned
                      ? '0 10px 30px rgba(108, 99, 255, 0.15)'
                      : '0 6px 20px rgba(108, 99, 255, 0.06)',
                    border: post.pinned ? '2px solid #6C63FF' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(108, 99, 255, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = post.pinned
                      ? '0 10px 30px rgba(108, 99, 255, 0.15)'
                      : '0 6px 20px rgba(108, 99, 255, 0.06)';
                  }}
                >
                  {post.pinned && (
                    <div style={{
                      position: 'absolute',
                      top: '-1px', right: '16px',
                      padding: '3px 10px',
                      background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                      color: 'white',
                      borderBottomLeftRadius: '8px',
                      borderBottomRightRadius: '8px',
                      fontSize: '9px',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}>
                      <Pin size={9} fill="white" /> PINNED
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <img
                      src={post.userPhoto || 'https://via.placeholder.com/40'}
                      alt=""
                      style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        border: post.userRole === 'admin'
                          ? '2px solid #FF6584' : '2px solid #6C63FF',
                        flexShrink: 0,
                        objectFit: 'cover',
                      }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        flexWrap: 'wrap',
                        marginBottom: '3px',
                      }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#2D2D3F',
                        }}>
                          {post.userName}
                        </span>
                        {post.userRole === 'admin' && (
                          <span style={{
                            padding: '1px 6px',
                            background: '#FCE7F3',
                            color: '#FF6584',
                            borderRadius: '50px',
                            fontSize: '8px',
                            fontWeight: '800',
                          }}>
                            👑 ADMIN
                          </span>
                        )}
                        <span style={{ fontSize: '10px', color: '#6B7280' }}>
                          • {formatTime(post.createdAt)}
                        </span>
                      </div>
                      {category && (
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          background: '#EEF2FF',
                          color: '#6C63FF',
                          borderRadius: '50px',
                          fontSize: '9px',
                          fontWeight: '700',
                        }}>
                          {category.label}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: '800',
                    color: '#2D2D3F',
                    marginBottom: '6px',
                    lineHeight: '1.3',
                  }}>
                    {post.title}
                  </h3>

                  <p style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    lineHeight: '1.6',
                    marginBottom: '12px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {post.content}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    paddingTop: '10px',
                    borderTop: '1px solid #F3F4F6',
                  }}>
                    <button
                      onClick={(e) => handleLike(post, e)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: isLiked ? '#FF6584' : '#6B7280',
                        fontSize: '11px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: 0,
                      }}
                    >
                      <Heart size={13} fill={isLiked ? '#FF6584' : 'none'} />
                      {post.likes || 0}
                    </button>
                    <span style={{
                      fontSize: '11px',
                      color: '#6B7280',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <MessageCircle size={13} />
                      {post.repliesCount || 0}
                    </span>
                    {canDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePost(post.docId);
                        }}
                        style={{
                          marginLeft: 'auto',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#ef4444',
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: 0,
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Post Modal */}
      {showNewModal && (
        <div
          onClick={() => !posting && setShowNewModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '800',
                color: '#2D2D3F',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <Plus size={18} color="#6C63FF" /> নতুন Post
              </h2>
              <button
                onClick={() => setShowNewModal(false)}
                style={{
                  width: '30px', height: '30px',
                  borderRadius: '50%',
                  background: '#F3F4F6',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} style={{ padding: '20px' }}>
              <label style={labelStyle}>Category</label>
              <div style={{
                display: 'flex',
                gap: '6px',
                marginBottom: '16px',
                flexWrap: 'wrap',
              }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setNewCategory(cat.key)}
                    style={{
                      padding: '7px 14px',
                      background: newCategory === cat.key
                        ? 'linear-gradient(135deg, #6C63FF, #5A52D5)'
                        : '#F8F9FE',
                      color: newCategory === cat.key ? 'white' : '#6B7280',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <label style={labelStyle}>Title *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title লিখুন..."
                style={inputStyle}
                maxLength={100}
              />

              <label style={labelStyle}>Content *</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="বিস্তারিত লিখুন..."
                rows={6}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />

              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px',
              }}>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  disabled={posting}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#F3F4F6',
                    color: '#2D2D3F',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={posting || !newTitle.trim() || !newContent.trim()}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: posting || !newTitle.trim() || !newContent.trim()
                      ? '#9CA3AF'
                      : 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: posting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {posting ? (
                    <>
                      <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                      পোস্ট হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Post করুন
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '700',
  color: '#2D2D3F',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  border: '2px solid #E5E7EB',
  borderRadius: '10px',
  fontSize: '13px',
  outline: 'none',
  fontFamily: 'inherit',
  marginBottom: '16px',
  boxSizing: 'border-box',
};

export default Discussion;
