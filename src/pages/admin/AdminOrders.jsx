import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Check,
  X,
  Eye,
  Trash2,
  Copy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getAllOrders, approveOrder, rejectOrder, deleteOrder } from '../../api/adminApi';
import { useCourses } from '../../context/CourseContext';

const AdminOrders = () => {
  const { getCourseById } = useCourses();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('view');
  const [rejectReason, setRejectReason] = useState('');
  const [telegramLink, setTelegramLink] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await getAllOrders();
    if (result.success) setOrders(result.orders);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        o.orderId?.toLowerCase().includes(s) ||
        o.userEmail?.toLowerCase().includes(s) ||
        o.userName?.toLowerCase().includes(s) ||
        o.trxId?.toLowerCase().includes(s) ||
        o.telegramUsername?.toLowerCase().includes(s) ||
        o.courseName?.toLowerCase().includes(s)
      );
    }
    return true;
  });

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

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const openModal = (order, type = 'view') => {
    setSelectedOrder(order);
    setActionType(type);
    setRejectReason('');
    const course = getCourseById(order.courseId);
    setTelegramLink(course?.telegramLink || 'https://t.me/studyroom');
    setShowModal(true);
  };

  const handleApprove = async () => {
    setProcessing(true);
    const result = await approveOrder(selectedOrder.docId, telegramLink);
    if (result.success) {
      toast.success('✅ Order Approve হয়েছে!');
      setShowModal(false);
      fetchOrders();
    } else {
      toast.error('সমস্যা হয়েছে');
    }
    setProcessing(false);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('কারণ লিখুন');
      return;
    }
    setProcessing(true);
    const result = await rejectOrder(selectedOrder.docId, rejectReason);
    if (result.success) {
      toast.success('❌ Order Reject হয়েছে');
      setShowModal(false);
      fetchOrders();
    } else {
      toast.error('সমস্যা হয়েছে');
    }
    setProcessing(false);
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('এই Order টি মুছে ফেলতে চান?')) return;
    const result = await deleteOrder(docId);
    if (result.success) {
      toast.success('Order মুছে ফেলা হয়েছে');
      fetchOrders();
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('কপি হয়েছে!');
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
            📦 অর্ডার ম্যানেজমেন্ট
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            সব অর্ডার দেখুন, approve/reject করুন
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: '24px',
        }} className="admin-layout">
          <AdminSidebar />

          <div>
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
                  placeholder="🔍 Order ID / Email / TRX / Telegram..."
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
            ) : filteredOrders.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '60px 20px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>📭</div>
                <h3 style={{ fontSize: '18px', color: '#2D2D3F', marginBottom: '8px' }}>
                  কোনো Order নেই
                </h3>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>
                  এই Filter এ কোনো Order পাওয়া যায়নি
                </p>
              </div>
            ) : (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(108, 99, 255, 0.08)',
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 100px 130px 160px',
                  padding: '14px 20px',
                  background: '#F8F9FE',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  gap: '12px',
                }} className="table-header">
                  <span>Order / User</span>
                  <span>Course</span>
                  <span>দাম</span>
                  <span>তারিখ</span>
                  <span>Action</span>
                </div>

                {filteredOrders.map((order) => {
                  const statusStyle = {
                    pending: { bg: '#FEF3C7', color: '#92400e', label: '⏳ পেন্ডিং' },
                    approved: { bg: '#DCFCE7', color: '#166534', label: '✅ অ্যাপ্রুভড' },
                    rejected: { bg: '#FEE2E2', color: '#991B1B', label: '❌ রিজেক্টেড' },
                  }[order.status] || { bg: '#F3F4F6', color: '#6B7280', label: '—' };

                  return (
                    <div
                      key={order.docId}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 100px 130px 160px',
                        padding: '16px 20px',
                        borderBottom: '1px solid #F3F4F6',
                        alignItems: 'center',
                        fontSize: '13px',
                        gap: '12px',
                      }}
                      className="table-row"
                    >
                      <div>
                        <p style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#6C63FF',
                          marginBottom: '3px',
                        }}>
                          {order.orderId}
                        </p>
                        <p style={{
                          fontSize: '12px',
                          color: '#6B7280',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {order.userEmail}
                        </p>
                        <span style={{
                          display: 'inline-block',
                          marginTop: '4px',
                          padding: '2px 8px',
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          borderRadius: '50px',
                          fontSize: '10px',
                          fontWeight: '700',
                        }}>
                          {statusStyle.label}
                        </span>
                      </div>

                      <div style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#2D2D3F',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {order.courseName}
                      </div>

                      <div>
                        <p style={{
                          fontSize: '15px',
                          fontWeight: '800',
                          color: '#6C63FF',
                        }}>
                          ৳{order.finalPrice}
                        </p>
                        {order.discount > 0 && (
                          <p style={{
                            fontSize: '11px',
                            color: '#22c55e',
                            fontWeight: '600',
                          }}>
                            -৳{order.discount}
                          </p>
                        )}
                      </div>

                      <div style={{
                        fontSize: '12px',
                        color: '#6B7280',
                      }}>
                        {formatDate(order.createdAt)}
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        {order.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => openModal(order, 'approve')}
                              title="Approve"
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: '#DCFCE7',
                                color: '#166534',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => openModal(order, 'reject')}
                              title="Reject"
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: '#FEE2E2',
                                color: '#991B1B',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => openModal(order, 'view')}
                            title="View"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: '#EEF2FF',
                              color: '#6C63FF',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(order.docId)}
                          title="Delete"
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: '#F3F4F6',
                            color: '#ef4444',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <style>{`
          @media (max-width: 992px) {
            .admin-layout { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 768px) {
            .table-header { display: none !important; }
            .table-row {
              grid-template-columns: 1fr !important;
              gap: 8px !important;
              padding: 16px !important;
            }
          }
        `}</style>
      </div>

      {showModal && selectedOrder && (
        <div
          onClick={() => setShowModal(false)}
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
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#2D2D3F' }}>
                {actionType === 'view' && '👁️ Order Details'}
                {actionType === 'approve' && '✅ Approve Order'}
                {actionType === 'reject' && '❌ Reject Order'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#F3F4F6',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{
                background: '#F8F9FE',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
              }}>
                <InfoRow label="Order ID" value={selectedOrder.orderId} onCopy={() => copyText(selectedOrder.orderId)} />
                <InfoRow label="User" value={`${selectedOrder.userName} (${selectedOrder.userEmail})`} />
                <InfoRow label="Course" value={selectedOrder.courseName} />
                <InfoRow
                  label="Price"
                  value={`৳${selectedOrder.finalPrice}${selectedOrder.discount > 0 ? ` (ছাড় ৳${selectedOrder.discount})` : ''}`}
                />
              </div>

              <div style={{
                background: '#F8F9FE',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
              }}>
                <InfoRow label="Payment" value={selectedOrder.paymentMethod} />
                <InfoRow label="Sender" value={selectedOrder.senderNumber} onCopy={() => copyText(selectedOrder.senderNumber)} />
                <InfoRow label="TRX ID" value={selectedOrder.trxId} onCopy={() => copyText(selectedOrder.trxId)} />
                <InfoRow label="Telegram" value={selectedOrder.telegramUsername} />
              </div>

              {actionType === 'approve' && (
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#2D2D3F',
                    marginBottom: '8px',
                  }}>
                    📱 Telegram Channel Link
                  </label>
                  <input
                    type="text"
                    value={telegramLink}
                    onChange={(e) => setTelegramLink(e.target.value)}
                    placeholder="https://t.me/your_channel"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #22c55e',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      marginBottom: '16px',
                    }}
                  />
                </div>
              )}

              {actionType === 'reject' && (
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#2D2D3F',
                    marginBottom: '8px',
                  }}>
                    ❌ রিজেক্টের কারণ
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="যেমন: TRX ID সঠিক নয়..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #ef4444',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              )}

              {actionType !== 'view' && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: '#F3F4F6',
                      color: '#2D2D3F',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    বাতিল
                  </button>
                  <button
                    onClick={actionType === 'approve' ? handleApprove : handleReject}
                    disabled={processing}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: processing
                        ? '#9CA3AF'
                        : actionType === 'approve'
                          ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                          : 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: processing ? 'not-allowed' : 'pointer',
                      boxShadow: processing ? 'none' : '0 8px 20px rgba(0,0,0,0.15)',
                    }}
                  >
                    {processing ? '⏳...' : actionType === 'approve' ? '✅ Approve' : '❌ Reject'}
                  </button>
                </div>
              )}

              {actionType === 'view' && (
                <Link
                  to={`/order/${selectedOrder.docId}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                    color: 'white',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '700',
                    textDecoration: 'none',
                    marginTop: '10px',
                    boxShadow: '0 8px 20px rgba(108, 99, 255, 0.25)',
                  }}
                >
                  📖 Full Details দেখুন
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const InfoRow = ({ label, value, onCopy }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    fontSize: '13px',
    gap: '10px',
  }}>
    <span style={{ color: '#6B7280', minWidth: '80px' }}>{label}</span>
    <span style={{
      fontWeight: '600',
      color: '#2D2D3F',
      textAlign: 'right',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      wordBreak: 'break-word',
    }}>
      {value}
      {onCopy && (
        <button
          onClick={onCopy}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#6C63FF',
            padding: 0,
            display: 'flex',
          }}
        >
          <Copy size={13} />
        </button>
      )}
    </span>
  </div>
);

export default AdminOrders;
