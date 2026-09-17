import { useState, useEffect, useRef } from 'react';
import { Send, Loader, RefreshCw, Headphones } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  getOrCreateChat, sendMessage, getMessages, markAsRead,
} from '../api/supportApi';

const Support = () => {
  const { user, userData } = useAuth();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    initChat();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!chat) return;
    const interval = setInterval(() => {
      loadMessages(chat.docId);
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [chat]);

  const initChat = async () => {
    setLoading(true);
    const result = await getOrCreateChat(user.uid, userData);
    if (result.success) {
      setChat(result.chat);
      await loadMessages(result.chat.docId);
      await markAsRead(result.chat.docId, 'user');
    } else {
      toast.error('Chat Load করা যায়নি');
    }
    setLoading(false);
  };

  const loadMessages = async (chatId) => {
    const result = await getMessages(chatId);
    if (result.success) setMessages(result.messages);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMessages(chat.docId);
    await markAsRead(chat.docId, 'user');
    setRefreshing(false);
    toast.success('Refresh হয়েছে');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat) return;
    setSending(true);
    const result = await sendMessage(chat.docId, {
      senderId: user.uid,
      senderName: userData?.name || user.displayName,
      senderPhoto: userData?.photoURL || user.photoURL,
      senderRole: 'user',
      message: newMessage,
    });
    if (result.success) {
      setNewMessage('');
      await loadMessages(chat.docId);
    } else {
      toast.error('Message পাঠানো যায়নি');
    }
    setSending(false);
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section style={{ padding: '85px 0 20px', background: '#F8F9FE', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
          borderRadius: '16px 16px 0 0',
          padding: '18px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '10px', boxShadow: '0 10px 30px rgba(108, 99, 255, 0.20)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.20)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
            }}>
              <Headphones size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '16px', fontWeight: '800', color: 'white', marginBottom: '2px' }}>
                🆘 Support
              </h1>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>
                Admin এর সাথে চ্যাট
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              padding: '8px 14px', background: 'rgba(255,255,255,0.20)',
              border: 'none', borderRadius: '50px', color: 'white',
              fontSize: '12px', fontWeight: '700', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
          >
            <RefreshCw size={13} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>

        <div style={{
          background: 'white', padding: '16px',
          minHeight: '400px', maxHeight: 'calc(100vh - 350px)',
          overflowY: 'auto', boxShadow: '0 10px 30px rgba(108, 99, 255, 0.08)',
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6C63FF' }}>
              <Loader size={28} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>💬</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2D2D3F', marginBottom: '8px' }}>
                স্বাগতম!
              </h3>
              <p style={{ fontSize: '13px', lineHeight: '1.7' }}>
                আপনার প্রশ্ন বা সমস্যা নিচে লিখুন।
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map((msg) => {
                const isUser = msg.senderRole === 'user';
                return (
                  <div key={msg.docId} style={{
                    display: 'flex',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    gap: '8px', alignItems: 'flex-end',
                  }}>
                    {!isUser && (
                      <img
                        src={msg.senderPhoto || 'https://via.placeholder.com/32'}
                        alt=""
                        style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          border: '2px solid #FF6584', flexShrink: 0, objectFit: 'cover',
                        }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/32'; }}
                      />
                    )}
                    <div style={{
                      maxWidth: '75%', padding: '10px 14px',
                      background: isUser ? 'linear-gradient(135deg, #6C63FF, #5A52D5)' : '#F8F9FE',
                      color: isUser ? 'white' : '#2D2D3F',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      boxShadow: '0 4px 12px rgba(108, 99, 255, 0.10)',
                    }}>
                      {!isUser && (
                        <div style={{ fontSize: '10px', fontWeight: '800', color: '#FF6584', marginBottom: '4px' }}>
                          👑 Admin
                        </div>
                      )}
                      <p style={{
                        fontSize: '13px', lineHeight: '1.5',
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: '4px',
                      }}>
                        {msg.message}
                      </p>
                      <p style={{
                        fontSize: '10px',
                        color: isUser ? 'rgba(255,255,255,0.75)' : '#9CA3AF',
                        textAlign: 'right',
                      }}>
                        {formatTime(msg.createdAt)}
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
          background: 'white', borderRadius: '0 0 16px 16px',
          padding: '12px 16px', display: 'flex', gap: '8px',
          borderTop: '1px solid #F3F4F6',
          boxShadow: '0 10px 30px rgba(108, 99, 255, 0.08)',
        }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="আপনার Message লিখুন..."
            disabled={sending || !chat}
            style={{
              flex: 1, padding: '11px 16px',
              border: '2px solid #E5E7EB', borderRadius: '50px',
              fontSize: '13px', outline: 'none', minWidth: 0,
            }}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim() || !chat}
            style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: sending || !newMessage.trim() ? '#9CA3AF' : 'linear-gradient(135deg, #6C63FF, #5A52D5)',
              color: 'white', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            {sending ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} />}
          </button>
        </form>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </section>
  );
};

export default Support;
