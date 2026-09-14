import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import OrderCard from '../components/order/OrderCard';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../api/orderApi';

const MyCourses = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      const result = await getMyOrders(user.uid);
      if (result.success) setOrders(result.orders);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((o) => o.status === filter);

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    approved: orders.filter((o) => o.status === 'approved').length,
    rejected: orders.filter((o) => o.status === 'rejected').length,
  };

  const filters = [
    { key: 'all', label: '📚 সব' },
    { key: 'pending', label: '⏳ পেন্ডিং' },
    { key: 'approved', label: '✅ অ্যাপ্রুভড' },
    { key: 'rejected', label: '❌ রিজেক্টেড' },
  ];

  return (
    <section style={{
      padding: '100px 0 80px',
      background: '#F8F9FE',
      minHeight: '100vh',
    }}>
      <div className="container">
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: '800',
            color: '#2D2D3F',
            marginBottom: '8px',
          }}>
            📚 আমার কোর্সসমূহ
          </h1>
          <p style={{ color: '#6B7280', fontSize: '15px' }}>
            আপনার সব কোর্স এবং অর্ডারের তালিকা
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '30px',
        }}>
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '10px 20px',
                background: filter === f.key ? '#6C63FF' : 'white',
                color: filter === f.key ? 'white' : '#6B7280',
                border: `2px solid ${filter === f.key ? '#6C63FF' : '#E5E7EB'}`,
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: filter === f.key ? '0 6px 20px rgba(108, 99, 255, 0.25)' : 'none',
              }}
            >
              {f.label}
              {counts[f.key] > 0 && (
                <span style={{
                  background: filter === f.key ? 'rgba(255,255,255,0.3)' : '#F8F9FE',
                  color: filter === f.key ? 'white' : '#6C63FF',
                  padding: '2px 8px',
                  borderRadius: '50px',
                  fontSize: '11px',
                  fontWeight: '700',
                }}>
                  {counts[f.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#6C63FF', fontSize: '16px' }}>লোড হচ্ছে...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(108, 99, 255, 0.08)',
          }}>
            <Package size={80} color="#6C63FF" style={{ margin: '0 auto 20px' }} />
            <h3 style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#2D2D3F',
              marginBottom: '10px',
            }}>
              {filter === 'all' ? 'এখনো কোনো কোর্স কেনা হয়নি' : 'এই ক্যাটাগরিতে কিছু নেই'}
            </h3>
            <p style={{ color: '#6B7280', marginBottom: '30px', fontSize: '15px' }}>
              কোর্স কিনে আপনার যাত্রা শুরু করুন
            </p>
            <Link
              to="/courses"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 36px',
                background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                color: 'white',
                borderRadius: '50px',
                fontSize: '15px',
                fontWeight: '600',
                textDecoration: 'none',
                boxShadow: '0 8px 30px rgba(108, 99, 255, 0.30)',
              }}
            >
              📚 কোর্স ব্রাউজ করুন <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {filteredOrders.map((order) => (
              <OrderCard key={order.docId} order={order} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyCourses;
