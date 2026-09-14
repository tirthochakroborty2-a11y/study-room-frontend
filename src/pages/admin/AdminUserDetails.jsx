import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Crown,
  Ban,
  CheckCircle2,
  ShoppingBag,
  Eye,
  User as UserIcon,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import {
  getUserById,
  getUserOrders,
  toggleBlockUser,
  changeUserRole,
} from '../../api/adminApi';

const AdminUserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [userRes, ordersRes] = await Promise.all([
      getUserById(id),
      getUserOrders(id),
    ]);
    if (userRes.success) setUser(userRes.user);
    if (ordersRes.success) setOrders(ordersRes.orders);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  const formatDate = (ts) => {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (ts) => {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleToggleBlock = async () => {
    const newStatus = !user.isBlocked;
    const confirm = window.confirm(
      newStatus
        ? `${user.name} কে ব্লক করতে চান?`
        : `${user.name} কে Unblock করতে চান?`
    );
    if (!confirm) return;

    const result = await toggleBlockUser(user.docId, newStatus);
    if (result.success) {
      toast.success(newStatus ? 'ইউজার ব্লক করা হয়েছে' : 'Unblock করা হয়েছে');
      fetchData();
    } else {
      toast.error('সমস্যা হয়েছে');
    }
  };

  const handleRoleChange = async () => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const confirm = window.confirm(
      `${user.name} কে ${newRole === 'admin' ? 'Admin' : 'User'} করতে চান?`
    );
    if (!confirm) return;

    const result = await changeUserRole(user.docId, newRole);
    if (result.success) {
      toast.success(`Role পরিবর্তন হয়েছে → ${newRole}`);
      fetchData();
    } else {
      toast.error('সমস্যা হয়েছে');
    }
  };

  if (loading) {
    return (
      <section style={{
        padding: '120px 20px 60px',
        textAlign: 'center',
        minHeight: '100vh',
      }}>
        <p style={{ color: '#6C63FF', fontSize: '16px' }}>লোড হচ্ছে...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section style={{
        padding: '120px 20px 60px',
        textAlign: 'center',
        minHeight: '100vh',
      }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>😕</div>
        <h2 style={{ color: '#2D2D3F', marginBottom: '20px' }}>
          ইউজার পাওয়া যায়নি
        </h2>
        <Link to="/admin/users" style={{
          color: '#6C63FF',
          textDecoration: 'none',
          fontWeight: '600',
        }}>
          ← ইউজার লিস্টে ফিরুন
        </Link>
      </section>
    );
  }

  const approved = orders.filter((o) => o.status === 'approved').length;
  const pending = orders.filter((o) => o.status === 'pending').length;
  const rejected = orders.filter((o) => o.status === 'rejected').length;
  const totalSpent = orders
    .filter((o) => o.status === 'approved')
    .reduce((s, o) => s + (o.finalPrice || 0), 0);

  return (
    <section style={{
      padding: '100px 0 60px',
      background: '#F8F9FE',
      minHeight: '100vh',
    }}>
      <div className="container">
        <Link to="/admin/users" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#6C63FF',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '20px',
          textDecoration: 'none',
        }}>
          <ArrowLeft size={16} /> ইউজার লিস্টে ফিরুন
        </Link>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: '24px',
        }} className="admin-layout">
          <AdminSidebar />

          <div>
            {/* Profile Card */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '20px',
              boxShadow: '0 10px 40px rgba(108, 99, 255, 0.10)',
              border: user.isBlocked ? '2px solid #ef4444' : 'none',
            }}>
              <div style={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}>
                <img
                  src={user.photoURL || 'https://via.placeholder.com/100/6C63FF/FFFFFF?text=U'}
                  alt={user.name}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    border: user.role === 'admin'
                      ? '4px solid #FF6584'
                      : '4px solid #6C63FF',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100/6C63FF/FFFFFF?text=U';
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                  }}>
                    <h1 style={{
                      fontSize: '24px',
                      fontWeight: '800',
                      color: '#2D2D3F',
                    }}>
                      {user.name || 'Unknown'}
                    </h1>

                    {user.role === 'admin' && (
                      <span style={{
                        padding: '4px 12px',
                        background: '#FCE7F3',
                        color: '#FF6584',
                        borderRadius: '50px',
                        fontSize: '11px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <Crown size={12} /> ADMIN
                      </span>
                    )}

                    {user.isBlocked && (
                      <span style={{
                        padding: '4px 12px',
                        background: '#FEE2E2',
                        color: '#991B1B',
                        borderRadius: '50px',
                        fontSize: '11px',
                        fontWeight: '700',
                      }}>
                        🚫 BLOCKED
                      </span>
                    )}
                  </div>

                  <p style={{
                    fontSize: '14px',
                    color: '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '4px',
                  }}>
                    <Mail size={14} /> {user.email}
                  </p>

                  {user.phone && (
                    <p style={{
                      fontSize: '14px',
                      color: '#6B7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '4px',
                    }}>
                      <Phone size={14} /> {user.phone}
                    </p>
                  )}

                  <p style={{
                    fontSize: '13px',
                    color: '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <Calendar size={14} /> যোগ দিয়েছেন: {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px',
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={handleToggleBlock}
                  style={{
                    padding: '10px 20px',
                    background: user.isBlocked ? '#DCFCE7' : '#FEE2E2',
                    color: user.isBlocked ? '#166534' : '#991B1B',
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
                  {user.isBlocked ? (
                    <><CheckCircle2 size={14} /> Unblock</>
                  ) : (
                    <><Ban size={14} /> Block</>
                  )}
                </button>

                <button
                  onClick={handleRoleChange}
                  style={{
                    padding: '10px 20px',
                    background: '#FEF3C7',
                    color: '#92400e',
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
                  <Crown size={14} />
                  {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px',
              marginBottom: '20px',
            }}>
              <MiniStat
                icon={<ShoppingBag size={14} />}
                label="মোট অর্ডার"
                value={orders.length}
                color="#6C63FF"
                bg="#EEF2FF"
              />
              <MiniStat
                icon={<CheckCircle2 size={14} />}
                label="Approved"
                value={approved}
                color="#22c55e"
                bg="#DCFCE7"
              />
              <MiniStat
                icon={<span style={{ fontSize: '12px' }}>⏳</span>}
                label="Pending"
                value={pending}
                color="#92400e"
                bg="#FEF3C7"
              />
              <MiniStat
                icon={<span style={{ fontSize: '12px' }}>❌</span>}
                label="Rejected"
                value={rejected}
                color="#991B1B"
                bg="#FEE2E2"
              />
              <MiniStat
                icon={<TrendingUp size={14} />}
                label="মোট খরচ"
                value={`৳${totalSpent}`}
                color="#FF6584"
                bg="#FCE7F3"
              />
            </div>

            {/* Orders History */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 10px 40px rgba(108, 99, 255, 0.08)',
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#2D2D3F',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <ShoppingBag size={18} color="#6C63FF" />
                অর্ডার হিস্ট্রি ({orders.length})
              </h2>

              {orders.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#6B7280',
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                  <p style={{ fontSize: '14px' }}>এই ইউজারের কোনো অর্ডার নেই</p>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}>
                  {orders.map((o) => {
                    const st = {
                      pending: { bg: '#FEF3C7', color: '#92400e', label: '⏳' },
                      approved: { bg: '#DCFCE7', color: '#166534', label: '✅' },
                      rejected: { bg: '#FEE2E2', color: '#991B1B', label: '❌' },
                    }[o.status] || { bg: '#F3F4F6', color: '#6B7280', label: '—' };

                    return (
                      <div
                        key={o.docId}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '14px',
                          background: '#F8F9FE',
                          borderRadius: '10px',
                          gap: '10px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: '13px',
                            fontWeight: '700',
                            color: '#6C63FF',
                            marginBottom: '3px',
                          }}>
                            {o.orderId}
                          </p>
                          <p style={{
                            fontSize: '13px',
                            color: '#2D2D3F',
                            fontWeight: '500',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {o.courseName}
                          </p>
                          <p style={{
                            fontSize: '11px',
                            color: '#6B7280',
                            marginTop: '2px',
                          }}>
                            {formatDateTime(o.createdAt)}
                          </p>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '800',
                            color: '#6C63FF',
                          }}>
                            ৳{o.finalPrice}
                          </span>

                          <span style={{
                            padding: '3px 8px',
                            background: st.bg,
                            color: st.color,
                            borderRadius: '50px',
                            fontSize: '11px',
                            fontWeight: '700',
                          }}>
                            {st.label}
                          </span>

                          <Link
                            to={`/order/${o.docId}`}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: 'white',
                              color: '#6C63FF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none',
                            }}
                          >
                            <Eye size={14} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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

// Helper Component
const MiniStat = ({ icon, label, value, color, bg }) => (
  <div style={{
    background: 'white',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 6px 20px rgba(108, 99, 255, 0.06)',
    textAlign: 'center',
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      color: '#6B7280',
      fontSize: '11px',
      fontWeight: '600',
      marginBottom: '6px',
      textTransform: 'uppercase',
    }}>
      {icon} {label}
    </div>
    <p style={{
      fontSize: '22px',
      fontWeight: '800',
      color,
      background: bg,
      padding: '4px 12px',
      borderRadius: '50px',
      display: 'inline-block',
    }}>
      {value}
    </p>
  </div>
);

export default AdminUserDetails;
