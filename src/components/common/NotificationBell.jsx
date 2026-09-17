import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getUserNotifications, markNotificationRead, markAllRead, deleteNotification,
} from '../../api/notificationApi';

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) loadNotifications();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    const handleClick = () => setOpen(false);
    if (open) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [open]);

  const loadNotifications = async () => {
    const result = await getUserNotifications(user.uid);
    if (result.success) setNotifications(result.notifications);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (docId, e) => {
    e.stopPropagation();
    await markNotificationRead(docId);
    loadNotifications();
  };

  const handleDelete = async (docId, e) => {
    e.stopPropagation();
    await deleteNotification(docId);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllRead(notifications);
    loadNotifications();
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

  const typeColor = (type) => {
    if (type === 'success') return '#22c55e';
    if (type === 'warning') return '#FFC857';
    if (type === 'order') return '#6C63FF';
    return '#6C63FF';
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        style={{
          position: 'relative',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: unreadCount > 0 ? '#EEF2FF' : '#F8F9FE',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Bell size={18} color="#6C63FF" />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            minWidth: '18px',
            height: '18px',
            padding: '0 5px',
            background: '#ef4444',
            color: 'white',
            borderRadius: '50px',
            fontSize: '10px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '48px',
            right: 0,
            background: 'white',
            borderRadius: '14px',
            boxShadow: '0 10px 40px rgba(108, 99, 255, 0.20)',
            width: '340px',
            maxWidth: 'calc(100vw - 40px)',
            maxHeight: '480px',
            overflowY: 'auto',
            zIndex: 1002,
          }}
        >
          {/* Header */}
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            background: 'white',
            zIndex: 1,
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#2D2D3F' }}>
              🔔 Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#6C63FF',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                সব Read করুন
              </button>
            )}
          </div>

          {/* List */}
          {notifications.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#6B7280',
            }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔔</div>
              <p style={{ fontSize: '13px' }}>কোনো Notification নেই</p>
            </div>
          ) : (
            <div>
              {notifications.map((notif) => (
                <div
                  key={notif.docId}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #F3F4F6',
                    background: notif.read ? 'white' : '#EEF2FF',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: typeColor(notif.type),
                    marginTop: '6px',
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '6px',
                      marginBottom: '4px',
                    }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#2D2D3F',
                      }}>
                        {notif.title}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        color: '#9CA3AF',
                        flexShrink: 0,
                      }}>
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '12px',
                      color: '#6B7280',
                      lineHeight: '1.5',
                      marginBottom: '6px',
                      wordBreak: 'break-word',
                    }}>
                      {notif.message}
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!notif.read && (
                        <button
                          onClick={(e) => handleMarkRead(notif.docId, e)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#6C63FF',
                            fontSize: '10px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            padding: 0,
                          }}
                        >
                          <Check size={10} /> Read
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(notif.docId, e)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: '10px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: 0,
                        }}
                      >
                        <Trash2 size={10} /> Delete
                      </button>
                      {notif.link && (
                        <Link
                          to={notif.link}
                          onClick={() => setOpen(false)}
                          style={{
                            color: '#6C63FF',
                            fontSize: '10px',
                            fontWeight: '700',
                            textDecoration: 'none',
                          }}
                        >
                          দেখুন →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
