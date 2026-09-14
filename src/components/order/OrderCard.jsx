import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, Send, Calendar } from 'lucide-react';
import { useCourses } from '../../context/CourseContext';

const OrderCard = ({ order }) => {
  const { getCourseById } = useCourses();
  const course = getCourseById(order.courseId);

  const statusConfig = {
    pending: { label: '⏳ পেন্ডিং', color: '#92400e', bg: '#FEF3C7', border: '#FFC857', icon: <Clock size={14} /> },
    approved: { label: '✅ অ্যাপ্রুভড', color: '#166534', bg: '#DCFCE7', border: '#22c55e', icon: <CheckCircle2 size={14} /> },
    rejected: { label: '❌ রিজেক্টেড', color: '#991B1B', bg: '#FEE2E2', border: '#ef4444', icon: <XCircle size={14} /> },
  };

  const status = statusConfig[order.status] || statusConfig.pending;

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div style={{
      background: 'white', borderRadius: '16px', overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(108, 99, 255, 0.10)',
      borderTop: `4px solid ${status.border}`,
      display: 'flex', flexDirection: 'column', height: '100%',
      transition: 'all 0.3s',
    }}>
      <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
        <img
          src={course?.image}
          alt={order.courseName}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x200/6C63FF/FFFFFF?text=Study+Room';
          }}
        />
        <span style={{
          position: 'absolute', top: '12px', right: '12px',
          padding: '5px 12px', background: status.bg, color: status.color,
          borderRadius: '50px', fontSize: '11px', fontWeight: '700',
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          {status.icon} {status.label}
        </span>
      </div>

      <div style={{
        padding: '20px', display: 'flex', flexDirection: 'column',
        flex: 1, gap: '12px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2D2D3F', lineHeight: '1.3' }}>
          {order.courseName}
        </h3>

        <div style={{
          fontSize: '12px', color: '#6B7280', padding: '6px 10px',
          background: '#F8F9FE', borderRadius: '8px',
          display: 'inline-block', width: 'fit-content', fontWeight: '600',
        }}>
          🧾 {order.orderId}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#6B7280' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>💰 দাম:</span>
            <span style={{ fontWeight: '700', color: '#6C63FF' }}>৳{order.finalPrice}</span>
          </div>
          {order.couponCode && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🎟️ কুপন:</span>
              <span style={{ fontWeight: '600', color: '#22c55e' }}>{order.couponCode}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} /> তারিখ:
            </span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
        </div>

        <div style={{
          padding: '12px', background: status.bg, borderRadius: '10px',
          fontSize: '12px', color: status.color, lineHeight: '1.5', marginTop: 'auto',
        }}>
          {order.status === 'pending' && <>⏳ অ্যাডমিন আপনার পেমেন্ট যাচাই করছেন। অপেক্ষা করুন।</>}
          {order.status === 'approved' && <>✅ অ্যাক্সেস চালু হয়েছে! টেলিগ্রামে জয়েন করুন।</>}
          {order.status === 'rejected' && <>❌ কারণ: {order.rejectReason || 'অ্যাডমিন জানাননি'}</>}
        </div>

        {order.status === 'approved' && order.telegramLink ? (
          <a
            href={order.telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white', borderRadius: '50px', fontSize: '13px',
              fontWeight: '700', textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              boxShadow: '0 6px 20px rgba(34, 197, 94, 0.25)',
            }}
          >
            <Send size={14} /> টেলিগ্রামে জয়েন করুন
          </a>
        ) : (
          <Link
            to={`/order/${order.docId}`}
            style={{
              padding: '10px', background: '#F8F9FE', color: '#6C63FF',
              border: '2px solid #6C63FF', borderRadius: '50px',
              fontSize: '13px', fontWeight: '600',
              textDecoration: 'none', textAlign: 'center',
            }}
          >
            📖 বিস্তারিত দেখুন
          </Link>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
