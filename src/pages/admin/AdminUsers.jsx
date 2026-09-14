import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Eye,
  Ban,
  CheckCircle2,
  Crown,
  User as UserIcon,
  Mail,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getAllUsers, toggleBlockUser, changeUserRole } from '../../api/adminApi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | user | admin | blocked

  const fetchUsers = async () => {
    setLoading(true);
    const result = await getAllUsers();
    if (result.success) setUsers(result.users);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    if (filter === 'user' && u.role !== 'user') return false;
    if (filter === 'admin' && u.role !== 'admin') return false;
    if (filter === 'blocked' && !u.isBlocked) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        u.email?.toLowerCase().includes(s) ||
        u.name?.toLowerCase().includes(s) ||
        u.phone?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const counts = {
    all: users.length,
    user: users.filter((u) => u.role === 'user').length,
    admin: users.filter((u) => u.role === 'admin').length,
    blocked: users.filter((u) => u.isBlocked).length,
  };

  const filters = [
    { key: 'all', label: '👥 সব' },
    { key: 'user', label: '👤 ইউজার' },
    { key: 'admin', label: '👑 অ্যাডমিন' },
    { key: 'blocked', label: '🚫 ব্লকড' },
  ];

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleToggleBlock = async (user) => {
    const newStatus = !user.isBlocked;
    const confirm = window.confirm(
      newStatus
        ? `${user.name} কে ব্লক করতে চান?`
        : `${user.name} কে Unblock করতে চান?`
    );
    if (!confirm) return;

    const result = await toggleBlockUser(user.docId, newStatus);
    if (result.success) {
      toast.success(newStatus ? 'ইউজার ব্লক করা হয়েছে' : 'ইউজার Unblock করা হয়েছে');
      fetchUsers();
    } else {
      toast.error('সমস্যা হয়েছে');
    }
  };

  const handleRoleChange = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const confirm = window.confirm(
      `${user.name} কে ${newRole === 'admin' ? 'Admin' : 'User'} করতে চান?`
    );
    if (!confirm) return;

    const result = await changeUserRole(user.docId, newRole);
    if (result.success) {
      toast.success(`Role পরিবর্তন হয়েছে → ${newRole}`);
      fetchUsers();
    } else {
      toast.error('সমস্যা হয়েছে');
    }
  };

  return (
    <section style={{
      padding: '100px 0 60px',
      background: '#F8F9FE',
      minHeight: '100vh',
    }}>
      <div className="container">
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: 'clamp(22px, 4vw, 30px)',
            fontWeight: '800',
            color: '#2D2D3F',
            marginBottom: '6px',
          }}>
            👥 ইউজার ম্যানেজমেন্ট
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            সব ইউজার দেখুন, খুঁজুন, এবং ম্যানেজ করুন
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: '24px',
        }} className="admin-layout">
          <AdminSidebar />

          <div>
            {/* Filter Bar */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 10px 40px rgba(108, 99, 255, 0.08)',
            }}>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '16px',
              }}>
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    style={{
                      padding: '8px 16px',
                      background: filter === f.key ? '#6C63FF' : '#F8F9FE',
                      color: filter === f.key ? 'white' : '#6B7280',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.3s',
                    }}
                  >
                    {f.label}
                    <span style={{
                      background: filter === f.key ? 'rgba(255,255,255,0.3)' : '#E5E7EB',
                      color: filter === f.key ? 'white' : '#6B7280',
                      padding: '2px 8px',
                      borderRadius: '50px',
                      fontSize: '11px',
                      fontWeight: '700',
                    }}>
                      {counts[f.key]}
                    </span>
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative' }}>
                <Search
                  size={18}
                  color="#6B7280"
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="🔍 নাম / ইমেইল / ফোন দিয়ে খুঁজুন..."
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6C63FF';
                    e.target.style.boxShadow = '0 0 0 4px rgba(108,99,255,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Users List */}
            {loading ? (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '60px',
                textAlign: 'center',
                color: '#6C63FF',
              }}>
                লোড হচ্ছে...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '60px 20px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>👤</div>
                <h3 style={{ fontSize: '18px', color: '#2D2D3F', marginBottom: '8px' }}>
                  কোনো ইউজার নেই
                </h3>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>
                  এই Filter এ কোনো ইউজার পাওয়া যায়নি
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '16px',
              }}>
                {filteredUsers.map((user) => (
                  <div
                    key={user.docId}
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '20px',
                      boxShadow: '0 10px 40px rgba(108, 99, 255, 0.08)',
                      transition: 'all 0.3s',
                      border: user.isBlocked ? '2px solid #ef4444' : '2px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(108, 99, 255, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(108, 99, 255, 0.08)';
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                      <img
                        src={user.photoURL || 'https://via.placeholder.com/60/6C63FF/FFFFFF?text=U'}
                        alt={user.name}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          border: user.role === 'admin' ? '3px solid #FF6584' : '3px solid #6C63FF',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/60/6C63FF/FFFFFF?text=U';
                        }}
                      />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '4px',
                        }}>
                          <h3 style={{
                            fontSize: '15px',
                            fontWeight: '700',
                            color: '#2D2D3F',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {user.name || 'Unknown'}
                          </h3>
                          {user.role === 'admin' && (
                            <Crown size={14} color="#FF6584" />
                          )}
                        </div>
                        <p style={{
                          fontSize: '12px',
                          color: '#6B7280',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}>
                          <Mail size={11} /> {user.email}
                        </p>
                        {user.phone && (
                          <p style={{
                            fontSize: '12px',
                            color: '#6B7280',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '2px',
                          }}>
                            📱 {user.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Badges */}
                    <div style={{
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap',
                      marginBottom: '14px',
                    }}>
                      <span style={{
                        padding: '3px 10px',
                        background: user.role === 'admin' ? '#FCE7F3' : '#EEF2FF',
                        color: user.role === 'admin' ? '#FF6584' : '#6C63FF',
                        borderRadius: '50px',
                        fontSize: '10px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}>
                        {user.role === 'admin' ? <><Crown size={10} /> Admin</> : <><UserIcon size={10} /> User</>}
                      </span>
                      {user.isBlocked && (
                        <span style={{
                          padding: '3px 10px',
                          background: '#FEE2E2',
                          color: '#991B1B',
                          borderRadius: '50px',
                          fontSize: '10px',
                          fontWeight: '700',
                        }}>
                          🚫 Blocked
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '8px',
                      marginBottom: '14px',
                      padding: '12px',
                      background: '#F8F9FE',
                      borderRadius: '10px',
                    }}>
                      <StatMini
                        icon={<TrendingUp size={12} />}
                        label="Orders"
                        value={user.totalOrders || 0}
                      />
                      <StatMini
                        icon={<span style={{ fontSize: '11px' }}>৳</span>}
                        label="Spent"
                        value={user.totalSpent || 0}
                      />
                      <StatMini
                        icon={<Calendar size={12} />}
                        label="Joined"
                        value={formatDate(user.createdAt)}
                        small
                      />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Link
                        to={`/admin/users/${user.docId}`}
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                          color: 'white',
                          borderRadius: '50px',
                          fontSize: '12px',
                          fontWeight: '700',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          boxShadow: '0 6px 20px rgba(108, 99, 255, 0.25)',
                        }}
                      >
                        <Eye size={14} /> দেখুন
                      </Link>

                      <button
                        onClick={() => handleToggleBlock(user)}
                        title={user.isBlocked ? 'Unblock' : 'Block'}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: user.isBlocked ? '#DCFCE7' : '#FEE2E2',
                          color: user.isBlocked ? '#166534' : '#991B1B',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {user.isBlocked ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                      </button>

                      <button
                        onClick={() => handleRoleChange(user)}
                        title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: user.role === 'admin' ? '#FEF3C7' : '#FCE7F3',
                          color: user.role === 'admin' ? '#92400e' : '#FF6584',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Crown size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <style>{`
          @media (max-width: 992px) {
            .admin-layout { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
};

// Helper
const StatMini = ({ icon, label, value, small }) => (
  <div style={{ textAlign: 'center', minWidth: 0 }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '3px',
      color: '#6B7280',
      fontSize: '10px',
      marginBottom: '2px',
    }}>
      {icon} {label}
    </div>
    <div style={{
      fontSize: small ? '11px' : '14px',
      fontWeight: '700',
      color: '#2D2D3F',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}>
      {value}
    </div>
  </div>
);

export default AdminUsers;
