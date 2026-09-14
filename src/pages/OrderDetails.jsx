import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  Copy,
  User,
  Phone,
  FileText,
  CreditCard,
  Calendar,
  Loader,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getOrderById } from '../api/orderApi';
import { CATEGORIES } from '../utils/constants';
import { useCourses } from '../context/CourseContext';

const OrderDetails = () => {
  const { docId } = useParams();
  const { getCourseById } = useCourses();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const result = await getOrderById(docId);
      if (result.success) {
        setOrder(result.order);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [docId]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyText = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} কপি হয়েছে!`);
  };

  if (loading) {
    return (
      <section style={{
        padding: '120px 20px 60px',
        minHeight: '100vh',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}>
        <Loader size={40} color="#6C63FF" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#6C63FF', fontSize: '15px' }}>লোড হচ্ছে...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </section>
    );
  }

  if (!order) {
    return (
      <section style={{
        padding: '120px 20px 60px',
        minHeight: '100vh',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>😕</div>
        <h2 style={{ fontSize: '22px', color: '#2D2D3F', marginBottom: '20px' }}>
          Order পাওয়া যায়নি
        </h2>
        <Link to="/my-courses" style={{
          color: '#6C63FF',
          textDecoration: 'none',
          fontWeight: '600',
        }}>
          ← আমার কোর্সে ফিরুন
        </Link>
      </section>
    );
  }

  const course = getCourseById(order.courseId);

  const statusConfig = {
    pending: {
      label: '⏳ পেন্ডিং',
      color: '#92400e',
      bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
      border: '#FFC857',
      icon: <Clock size={48} />,
      message: 'অ্যাডমিন আপনার পেমেন্ট যাচাই করছেন। অনুগ্রহ করে অপেক্ষা করুন।',
    },
    approved: {
      label: '✅ অ্যাপ্রুভড',
      color: '#166534',
      bg: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
      border: '#22c55e',
      icon: <CheckCircle2 size={48} />,
      message: 'আপনার কোর্স অ্যাক্সেস চালু হয়েছে! টেলিগ্রামে জয়েন করুন।',
    },
    rejected: {
      label: '❌ রিজেক্টেড',
      color: '#991B1B',
      bg: 'linear-gradient(135deg, #FEE2E2, #FECACA)',
      border: '#ef4444',
      icon: <XCircle size={48} />,
      message: order.rejectReason || 'আপনার অর্ডারটি গ্রহণ করা হয়নি।',
    },
  };

  const status = statusConfig[order.status] || statusConfig.pending;

  return (
    <section style={{
      padding: '100px 0 60px',
      background: '#F8F9FE',
      minHeight: '100vh',
    }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <Link to="/my-courses" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#6C63FF',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '20px',
          textDecoration: 'none',
        }}>
          <ArrowLeft size={16} /> আমার কোর্সে ফিরুন
        </Link>

        <div style={{
          background: status.bg,
          borderRadius: '16px',
          padding: '30px',
          textAlign: 'center',
          marginBottom: '24px',
          border: `2px solid ${status.border}`,
        }}>
          <div style={{ color: status.color, marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
            {status.icon}
          </div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: status.color,
            marginBottom: '8px',
          }}>
            {status.label}
          </h2>
          <p style={{
            fontSize: '14px',
            color: status.color,
            lineHeight: '1.6',
          }}>
            {status.message}
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 10px 40px rgba(108, 99, 255, 0.10)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          <div>
            <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
              Order ID
            </p>
            <p style={{
              fontSize: '18px',
              fontWeight: '800',
              color: '#6C63FF',
              letterSpacing: '0.5px',
            }}>
              {order.orderId}
            </p>
          </div>
          <button
            onClick={() => copyText(order.orderId, 'Order ID')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: '#EEF2FF',
              color: '#6C63FF',
              border: 'none',
              borderRadius: '50px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <Copy size={14} /> কপি
          </button>
        </div>

        {course && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '20px',
            boxShadow: '0 10px 40px rgba(108, 99, 255, 0.10)',
          }}>
            <div style={{ height: '180px', overflow: 'hidden' }}>
              <img
                src={course.image}
                alt={course.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x300/6C63FF/FFFFFF?text=Study+Room';
                }}
              />
            </div>
            <div style={{ padding: '20px' }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                background: '#EEF2FF',
                color: '#6C63FF',
                borderRadius: '50px',
                fontSize: '11px',
                fontWeight: '700',
                marginBottom: '10px',
              }}>
                {CATEGORIES[course.category]}
              </span>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#2D2D3F',
                marginBottom: '10px',
                lineHeight: '1.3',
              }}>
                {order.courseName}
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280' }}>
                👨‍🏫 {course.instructor} • ⏱ {course.duration}
              </p>
            </div>
          </div>
        )}

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 10px 40px rgba(108, 99, 255, 0.10)',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#2D2D3F',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            💳 পেমেন্ট তথ্য
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              padding: '16px',
              background: '#F8F9FE',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#6B7280' }}>আসল দাম:</span>
                <span style={{ color: '#2D2D3F', fontWeight: '600' }}>
                  ৳{order.coursePrice}
                </span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#6B7280' }}>
                    🎟️ কুপন ({order.couponCode}):
                  </span>
                  <span style={{ color: '#22c55e', fontWeight: '600' }}>
                    -৳{order.discount}
                  </span>
                </div>
              )}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: '800',
                paddingTop: '10px',
                borderTop: '1px dashed #6C63FF',
              }}>
                <span style={{ color: '#2D2D3F' }}>সর্বমোট:</span>
                <span style={{ color: '#6C63FF' }}>৳{order.finalPrice}</span>
              </div>
            </div>

            <DetailRow
              icon={<CreditCard size={16} />}
              label="পেমেন্ট মেথড"
              value={order.paymentMethod}
            />
            <DetailRow
              icon={<Phone size={16} />}
              label="সেন্ডার নম্বর"
              value={order.senderNumber}
              onCopy={() => copyText(order.senderNumber, 'নম্বর')}
            />
            <DetailRow
              icon={<FileText size={16} />}
              label="ট্রানজেকশন ID"
              value={order.trxId}
              onCopy={() => copyText(order.trxId, 'TRX ID')}
            />
            <DetailRow
              icon={<Send size={16} />}
              label="টেলিগ্রাম"
              value={order.telegramUsername}
            />
            <DetailRow
              icon={<User size={16} />}
              label="নাম"
              value={order.userName}
            />
            <DetailRow
              icon={<Calendar size={16} />}
              label="তারিখ"
              value={formatDate(order.createdAt)}
            />
            {order.approvedAt && (
              <DetailRow
                icon={<CheckCircle2 size={16} />}
                label="অ্যাপ্রুভড"
                value={formatDate(order.approvedAt)}
              />
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {order.status === 'approved' && order.telegramLink && (
            <a
              href={order.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '16px',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                borderRadius: '50px',
                fontSize: '15px',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 25px rgba(34, 197, 94, 0.30)',
              }}
            >
              <Send size={18} /> টেলিগ্রামে জয়েন করুন
            </a>
          )}

          {order.status === 'rejected' && (
            <Link
              to={`/course/${order.courseId}`}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '16px',
                background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                color: 'white',
                borderRadius: '50px',
                fontSize: '15px',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 25px rgba(108, 99, 255, 0.30)',
              }}
            >
              🔁 আবার চেষ্টা করুন
            </Link>
          )}

          <Link
            to="/my-courses"
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '16px',
              background: 'white',
              color: '#6C63FF',
              border: '2px solid #6C63FF',
              borderRadius: '50px',
              fontSize: '15px',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            ← সব কোর্স
          </Link>
        </div>
      </div>
    </section>
  );
};

const DetailRow = ({ icon, label, value, onCopy }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #F3F4F6',
    fontSize: '14px',
    gap: '10px',
  }}>
    <span style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#6B7280',
    }}>
      <span style={{ color: '#6C63FF' }}>{icon}</span>
      {label}
    </span>
    <span style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '600',
      color: '#2D2D3F',
      textAlign: 'right',
      wordBreak: 'break-all',
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
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Copy size={14} />
        </button>
      )}
    </span>
  </div>
);

export default OrderDetails;
