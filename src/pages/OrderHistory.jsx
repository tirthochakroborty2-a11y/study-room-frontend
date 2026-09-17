import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ShoppingBag, Clock, CheckCircle2, XCircle, ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../api/orderApi';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    loadOrders();
    // eslint-disable-next-line
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    const result = await getMyOrders(user.uid);
    if (result.success) setOrders(result.orders);
    setLoading(false);
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    approved: orders.filter((o) => o.status === 'approved').length,
    rejected: orders.filter((o) => o.status === 'rejected').length,
  };

  const filters = [
    { key: 'all', label: '📚 সব', color: '#6C63FF' },
    { key: 'pending', label: '⏳ পেন্ডিং', color: '#FFC857' },
    { key: 'approved', label: '✅ Approved', color: '#22c55e' },
    { key: 'rejected', label: '❌ Rejected', color: '#ef4444' },
  ];

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('bn-BD', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const statusConfig = {
    pending: { color: '#92400e', bg: '#FEF3C7', label: '⏳ পেন্ডিং', icon: <Clock size={14} /> },
    approved: { color: '#166534', bg: '#DCFCE7', label: '✅ Approved', icon: <CheckCircle2 size={14} /> },
    rejected: { color: '#991B1B', bg: '#FEE2E2', label: '❌ Rejected', icon: <XCircle size={14} /> },
  };

  return (
    <section style={{ padding: '90px 0 60px', background: '#F8F9FE', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: '800',
            color: '#2D2D3F', marginBottom: '6px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            📦 Order History
          </h1>
          <p style={{ color: '#6B7280', fontSize: '13px' }}>
            আপনার সব Order এক জায়গায়
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex', gap: '8px', flexWrap: 'wrap',
          marginBottom: '20px',
        }}>
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '10px 18px',
                background: filter === f.key
                  ? 'linear-gradient(135deg, #6C63FF, #5A52D5)' : 'white',
                color: filter === f.key ? 'white' : '#6B7280',
                border: `2px solid ${filter === f.key ? '#6C63FF' : '#E5E7EB'}`,
                borderRadius: '50px',
                fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              {f.label}
              <span style={{
                padding: '2px 8px',
                background: filter === f.key ? 'rgba(255,255,255,0.3)' : '#F3F4F6',
                color: filter === f.key ? 'white' : '#6B7280',
                borderRadius: '50px', fontSize: '11px', fontWeight: '800',
              }}>
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ background: 'white', borderRadius: '14px', padding: '60px', textAlign: 'center', color: '#6C63FF' }}>
            লোড হচ্ছে...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: '16px',
            padding: '60px 20px', textAlign: 'center',
          }}>
            <Package size={60} color="#6C63FF" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '18px', color: '#2D2D3F', marginBottom: '8px', fontWeight: '700' }}>
              কোনো Order নেই
            </h3>
            <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '20px' }}>
              Course কিনলে এখানে দেখা যাবে
            </p>
            <Link to="/courses" style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
              color: 'white', borderRadius: '50px',
              textDecoration: 'none', fontSize: '13px', fontWeight: '700',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}>
              📚 Course দেখুন <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              return (
                <Link
                  key={order.docId}
                  to={`/order/${order.docId}`}
                  style={{
                    background: 'white', borderRadius: '14px', padding: '16px',
                    textDecoration: 'none',
                    borderLeft: `4px solid ${status.color}`,
                    boxShadow: '0 6px 20px rgba(108, 99, 255, 0.06)',
                    display: 'flex', flexDirection: 'column', gap: '10px',
                  }}
                >
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        marginBottom: '4px', flexWrap: 'wrap',
                      }}>
                        <span style={{
                          fontSize: '11px', fontWeight: '800', color: '#6C63FF',
                          padding: '2px 8px', background: '#EEF2FF', borderRadius: '50px',
                        }}>
                          {order.orderId}
                        </span>
                        <span style={{
                          padding: '2px 10px', background: status.bg, color: status.color,
                          borderRadius: '50px', fontSize: '10px', fontWeight: '800',
                          display: 'inline-flex', alignItems: 'center', gap: '3px',
                        }}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <h3 style={{
                        fontSize: '15px', fontWeight: '700', color: '#2D2D3F',
                        lineHeight: '1.3', marginBottom: '4px',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        display: '-webkit-box', WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {order.courseName}
                      </h3>
                      <p style={{ fontSize: '11px', color: '#6B7280' }}>
                        📅 {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '20px', fontWeight: '800', color: '#6C63FF',
                        marginBottom: '2px',
                      }}>
                        ৳{order.finalPrice}
                      </div>
                      {order.discount > 0 && (
                        <div style={{
                          fontSize: '10px', color: '#22c55e', fontWeight: '700',
                        }}>
                          ছাড় ৳{order.discount}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', paddingTop: '10px',
                    borderTop: '1px solid #F3F4F6',
                    fontSize: '12px', color: '#6B7280',
                  }}>
                    <span>
                      {order.paymentMethod} • {order.trxId}
                    </span>
                    <span style={{
                      color: '#6C63FF', fontWeight: '700',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      বিস্তারিত <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderHistory;
