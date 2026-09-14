import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Clock,
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatsCard from '../../components/admin/StatsCard';
import { getAllOrders, getAllUsers } from '../../api/adminApi';
import { useCourses } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { userData } = useAuth();
  const { courses } = useCourses();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [ordersRes, usersRes] = await Promise.all([
        getAllOrders(),
        getAllUsers(),
      ]);
      if (ordersRes.success) setOrders(ordersRes.orders);
      if (usersRes.success) setUsers(usersRes.users);
      setLoading(false);
    };
    fetchData();
  }, []);

  const approvedOrders = orders.filter((o) => o.status === 'approved');
  const pendingOrders = orders.filter((o) => o.status === 'pending');

  const totalRevenue = approvedOrders.reduce(
    (sum, o) => sum + (o.finalPrice || 0),
    0
  );

  const stats = [
    {
      icon: <DollarSign size={24} />,
      label: 'মোট আয়',
      value: `৳${totalRevenue.toLocaleString('bn-BD')}`,
      color: '#22c55e',
      bg: '#DCFCE7',
      trend: { positive: true, value: '12%' },
    },
    {
      icon: <ShoppingBag size={24} />,
      label: 'মোট অর্ডার',
      value: orders.length,
      color: '#6C63FF',
      bg: '#EEF2FF',
      trend: { positive: true, value: '8%' },
    },
    {
      icon: <Users size={24} />,
      label: 'মোট ইউজার',
      value: users.length,
      color: '#FF6584',
      bg: '#FCE7F3',
      trend: { positive: true, value: '15%' },
    },
    {
      icon: <BookOpen size={24} />,
      label: 'মোট কোর্স',
      value: courses.length,
      color: '#FFC857',
      bg: '#FEF3C7',
    },
  ];

  return (
    <section style={{
      padding: '100px 0 60px',
      background: '#F8F9FE',
      minHeight: '100vh',
    }}>
      <div className="container">
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{
            fontSize: 'clamp(22px, 4vw, 30px)',
            fontWeight: '800',
            color: '#2D2D3F',
            marginBottom: '6px',
          }}>
            👑 Admin Dashboard
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            স্বাগতম, {userData?.name || 'Admin'}! সব কিছু এক নজরে দেখুন।
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '250px 1fr',
          gap: '24px',
        }} className="admin-layout">
          <AdminSidebar />

          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '24px',
            }}>
              {stats.map((stat, idx) => (
                <StatsCard key={idx} {...stat} />
              ))}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 10px 40px rgba(108, 99, 255, 0.08)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}>
                  <h3 style={{
                    fontSize: '17px',
                    fontWeight: '700',
                    color: '#2D2D3F',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <TrendingUp size={18} color="#6C63FF" /> সাম্প্রতিক অর্ডার
                  </h3>
                  <Link to="/admin/orders" style={{
                    fontSize: '13px',
                    color: '#6C63FF',
                    fontWeight: '600',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    সব দেখুন <ArrowRight size={14} />
                  </Link>
                </div>

                {loading ? (
                  <p style={{ color: '#6B7280', fontSize: '14px' }}>লোড হচ্ছে...</p>
                ) : orders.length === 0 ? (
                  <p style={{ color: '#6B7280', fontSize: '14px' }}>কোনো অর্ডার নেই</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {orders.slice(0, 5).map((order) => (
                      <Link
                        key={order.docId}
                        to={`/order/${order.docId}`}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          background: '#F8F9FE',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#EEF2FF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#F8F9FE';
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#2D2D3F',
                            marginBottom: '3px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {order.courseName}
                          </p>
                          <p style={{
                            fontSize: '11px',
                            color: '#6B7280',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {order.userEmail}
                          </p>
                        </div>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '50px',
                          fontSize: '10px',
                          fontWeight: '700',
                          marginLeft: '8px',
                          whiteSpace: 'nowrap',
                          background:
                            order.status === 'approved' ? '#DCFCE7'
                            : order.status === 'pending' ? '#FEF3C7'
                            : '#FEE2E2',
                          color:
                            order.status === 'approved' ? '#166534'
                            : order.status === 'pending' ? '#92400e'
                            : '#991B1B',
                        }}>
                          {order.status === 'approved' ? '✅' : order.status === 'pending' ? '⏳' : '❌'}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 10px 40px rgba(108, 99, 255, 0.08)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}>
                  <h3 style={{
                    fontSize: '17px',
                    fontWeight: '700',
                    color: '#2D2D3F',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <Clock size={18} color="#FFC857" /> Pending ({pendingOrders.length})
                  </h3>
                  <Link to="/admin/orders" style={{
                    fontSize: '13px',
                    color: '#6C63FF',
                    fontWeight: '600',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    সব দেখুন <ArrowRight size={14} />
                  </Link>
                </div>

                {loading ? (
                  <p style={{ color: '#6B7280', fontSize: '14px' }}>লোড হচ্ছে...</p>
                ) : pendingOrders.length === 0 ? (
                  <p style={{ color: '#6B7280', fontSize: '14px' }}>🎉 সব অর্ডার Processed!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pendingOrders.slice(0, 5).map((order) => (
                      <Link
                        key={order.docId}
                        to={`/order/${order.docId}`}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          background: '#FEF3C7',
                          border: '1px solid #FFC857',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          transition: 'all 0.3s',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#2D2D3F',
                            marginBottom: '3px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {order.courseName}
                          </p>
                          <p style={{
                            fontSize: '11px',
                            color: '#92400e',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            ৳{order.finalPrice} • {order.telegramUsername}
                          </p>
                        </div>
                        <ArrowRight size={16} color="#92400e" style={{ marginLeft: '8px' }} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 992px) {
            .admin-layout {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default AdminDashboard;
