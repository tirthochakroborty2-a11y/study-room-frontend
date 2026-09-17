import { useState, useEffect, useRef } from 'react';
import { Send, Loader, RefreshCw, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import {
  getAllChats, sendMessage, getMessages, markAsRead,
} from '../../api/supportApi';

const AdminSupport = () => {
  const { user, userData } = useAuth();
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => { loadChats(); }, []);

  useEffect(() => {
    if (search) {
      const s = search.toLowerCase();
      setFilteredChats(chats.filter((c) =>
        c.userName?.toLowerCase().includes(s) ||
        c.userEmail?.toLowerCase().includes(s) ||
        c.lastMessage?.toLowerCase().includes(s)
      ));
    } else {
      setFilteredChats(chats);
    }
  }, [search, chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!activeChat) return;
    const interval = setInterval(() => {
      loadMessages(activeChat.docId, false);
      loadChats(false);
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [activeChat]);

  const loadChats = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const result = await getAllChats();
    if (result.success) setChats(result.chats);
    if (showLoading) setLoading(false);
  };

  const loadMessages = async (chatId, showLoading = true) => {
    if (showLoading) setLoadingMessages(true);
    const result = await getMessages(chatId);
    if (result.success) setMessages(result.messages);
    if (showLoading) setLoadingMessages(false);
  };

  const handleSelectChat = async (chat) => {
    setActiveChat(chat);
    await loadMessages(chat.docId);
    await markAsRead(chat.docId, 'admin');
    loadChats(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    setSending(true);
    const result = await sendMessage(activeChat.docId, {
      senderId: user.uid,
      senderName: userData?.name || user.displayName,
      senderPhoto: userData?.photoURL || user.photoURL,
      senderRole: 'admin',
      message: newMessage,
    });
    if (result.success) {
      setNewMessage('');
      await loadMessages(activeChat.docId, false);
      loadChats(false);
    }
    setSending(false);
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'এইমাত্র';
    if (diff < 3600) return `${Math.floor(diff / 60)}মি`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}ঘ`;
    return d.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' });
  };

  const totalUnread = chats.reduce((sum, c) => sum + (c.unreadByAdmin || 0), 0);

  return (
    <section style={{ padding: '85px 0 20px', background: '#F8F9FE', minHeight: '100vh' }}>
      <div className="container">
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '16px',
          flexWrap: 'wrap', gap: '10px',
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: '800',
              color: '#2D2D3F', marginBottom: '4px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              🆘 Support Chats
              {totalUnread > 0 && (
                <span style={{
                  padding: '2px 10px', background: '#ef4444',
                  color: 'white', borderRadius: '50px',
                  fontSize: '12px', fontWeight: '800',
                }}>
                  {totalUnread}
                </span>
              )}
            </h1>
            <p style={{ color: '#6B7280', fontSize: '13px' }}>
              User দের Message দেখুন এবং Reply দিন
            </p>
          </div>
          <button
            onClick={() => { loadChats(); if (activeChat) loadMessages(activeChat.docId); }}
            style={{
              padding: '10px 18px', background: 'white', color: '#6C63FF',
              border: '2px solid #6C63FF', borderRadius: '50px',
              fontSize: '13px', fontWeight: '700', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px',
        }} className="admin-layout">
          <AdminSidebar />
          <div style={{ minWidth: 0 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: activeChat ? 'minmax(240px, 320px) 1fr' : '1fr',
              gap: '16px',
              height: 'calc(100vh - 220px)',
              minHeight: '500px',
            }} className="chat-layout">
              {/* Chat List */}
              <div style={{
                background: 'white', borderRadius: '14px',
                overflow: 'hidden', boxShadow: '0 10px 30px rgba(108, 99, 255, 0.08)',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{
                  padding: '14px', borderBottom: '1px solid #F3F4F6',
                  background: 'linear-gradient(135deg, #F8F9FE, #EEF2FF)',
                }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} color="#6B7280" style={{
                      position: 'absolute', left: '12px', top: '50%',
                      transform: 'translateY(-50%)',
                    }} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="🔍 Search..."
                      style={{
                        width: '100%', padding: '9px 12px 9px 34px',
                        border: '2px solid #E5E7EB', borderRadius: '10px',
                        fontSize: '12px', outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6C63FF' }}>
                      <Loader size={22} style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                  ) : filteredChats.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
                      <div style={{ fontSize: '40px', marginBottom: '10px' }}>💬</div>
                      কোনো Chat নেই
                    </div>
                  ) : (
                    filteredChats.map((chat) => (
                      <button
                        key={chat.docId}
                        onClick={() => handleSelectChat(chat)}
                        style={{
                          width: '100%', padding: '12px',
                          background: activeChat?.docId === chat.docId
                            ? 'linear-gradient(135deg, #EEF2FF, #E0E7FF)' : 'white',
                          border: 'none', borderBottom: '1px solid #F3F4F6',
                          cursor: 'pointer', display: 'flex', gap: '10px',
                          textAlign: 'left', alignItems: 'center',
                        }}
                      >
                        <img
                          src={chat.userPhoto || 'https://via.placeholder.com/40'}
                          alt=""
                          style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            border: chat.unreadByAdmin > 0 ? '2px solid #ef4444' : '2px solid #6C63FF',
                            flexShrink: 0, objectFit: 'cover',
                          }}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            gap: '6px', marginBottom: '2px',
                          }}>
                            <span style={{
                              fontSize: '13px', fontWeight: '700', color: '#2D2D3F',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {chat.userName}
                            </span>
                            <span style={{ fontSize: '10px', color: '#9CA3AF', flexShrink: 0 }}>
                              {formatTime(chat.lastMessageAt)}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
                            <span style={{
                              fontSize: '11px', color: '#6B7280',
                              overflow: 'hidden', textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap', flex: 1,
                            }}>
                              {chat.lastMessage || 'No messages'}
                            </span>
                            {chat.unreadByAdmin > 0 && (
                              <span style={{
                                padding: '1px 7px', background: '#ef4444',
                                color: 'white', borderRadius: '50px',
                                fontSize: '9px', fontWeight: '800', flexShrink: 0,
                              }}>
                                {chat.unreadByAdmin}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Chat View */}
              {activeChat ? (
                <div style={{
                  background: 'white', borderRadius: '14px', overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(108, 99, 255, 0.08)',
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{
                    padding: '12px 16px', borderBottom: '1px solid #F3F4F6',
                    background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                    display: 'flex', alignItems: 'center', gap: '12px',
                  }}>
                    <img
                      src={activeChat.userPhoto || 'https://via.placeholder.com/40'}
                      alt=""
                      style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.5)', objectFit: 'cover',
                      }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '14px', fontWeight: '800', color: 'white',
                        marginBottom: '2px', overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {activeChat.userName}
                      </div>
                      <div style={{
                        fontSize: '11px', color: 'rgba(255,255,255,0.85)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {activeChat.userEmail}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    flex: 1, padding: '16px', overflowY: 'auto', background: '#FAFBFF',
                  }}>
                    {loadingMessages ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#6C63FF' }}>
                        <Loader size={22} style={{ animation: 'spin 1s linear infinite' }} />
                      </div>
                    ) : messages.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6B7280', fontSize: '13px' }}>
                        এখনো কোনো Message নেই
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {messages.map((msg) => {
                          const isAdmin = msg.senderRole === 'admin';
                          return (
                            <div key={msg.docId} style={{
                              display: 'flex',
                              justifyContent: isAdmin ? 'flex-end' : 'flex-start',
                            }}>
                              <div style={{
                                maxWidth: '75%', padding: '10px 14px',
                                background: isAdmin ? 'linear-gradient(135deg, #6C63FF, #5A52D5)' : 'white',
                                color: isAdmin ? 'white' : '#2D2D3F',
                                borderRadius: isAdmin ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                boxShadow: '0 4px 12px rgba(108, 99, 255, 0.10)',
                                border: isAdmin ? 'none' : '1px solid #F3F4F6',
                              }}>
                                <p style={{
                                  fontSize: '13px', lineHeight: '1.5',
                                  whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: '4px',
                                }}>
                                  {msg.message}
                                </p>
                                <p style={{
                                  fontSize: '10px',
                                  color: isAdmin ? 'rgba(255,255,255,0.75)' : '#9CA3AF',
                                  textAlign: 'right',
                                }}>
                                  {msg.createdAt?.toDate?.().toLocaleTimeString('bn-BD', {
                                    hour: '2-digit', minute: '2-digit',
                                  }) || ''}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSend} style={{
                    padding: '12px', borderTop: '1px solid #F3F4F6',
                    display: 'flex', gap: '8px', background: 'white',
                  }}>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Reply লিখুন..."
                      disabled={sending}
                      style={{
                        flex: 1, padding: '10px 16px',
                        border: '2px solid #E5E7EB', borderRadius: '50px',
                        fontSize: '13px', outline: 'none', minWidth: 0,
                      }}
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: sending || !newMessage.trim() ? '#9CA3AF' : 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                        color: 'white', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}
                    >
                      {sending ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
                    </button>
                  </form>
                </div>
              ) : (
                <div style={{
                  background: 'white', borderRadius: '14px', padding: '60px 20px',
                  textAlign: 'center', boxShadow: '0 10px 30px rgba(108, 99, 255, 0.08)',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'center', alignItems: 'center',
                }}>
                  <div style={{ fontSize: '60px', marginBottom: '14px' }}>💬</div>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#2D2D3F', marginBottom: '6px' }}>
                    একটি Chat Select করুন
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 992px) {
            .admin-layout { grid-template-columns: 1fr !important; }
            .chat-layout { grid-template-columns: 1fr !important; }
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </section>
  );
};

export default AdminSupport;
