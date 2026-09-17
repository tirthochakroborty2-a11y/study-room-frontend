import { Link, useNavigate } from 'react-router-dom';
import { Clock, ShoppingCart, Send } from 'lucide-react';
import { CATEGORIES, SUB_CATEGORIES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user, requireLogin } = useAuth();
  const { t, darkMode } = useTheme();
  const isFree = course.type === 'free';

  const cardBg = darkMode ? '#1A1A2E' : 'white';
  const textColor = darkMode ? '#F3F4F6' : '#2D2D3F';
  const subTextColor = darkMode ? '#9CA3AF' : '#6B7280';
  const badgeBg = darkMode ? '#252540' : '#F8F9FE';

  const handleBuy = (e) => {
    e.stopPropagation();
    if (!user) { requireLogin('কোর্স কিনতে লগইন করুন'); return; }
    navigate(`/payment?id=${course.id}`);
  };

  const handleJoinFree = (e) => {
    e.stopPropagation();
    if (!user) { requireLogin('জয়েন করতে লগইন করুন'); return; }
    window.open(course.telegramLink, '_blank');
  };

  return (
    <div
      onClick={() => navigate(`/course/${course.id}`)}
      style={{
        background: cardBg,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'var(--card-shadow)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--card-shadow)';
      }}
    >
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img
          src={course.image}
          alt={course.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x200/6C63FF/FFFFFF?text=Study+Room';
          }}
        />
        <span style={{
          position: 'absolute', top: '12px', right: '12px',
          padding: '5px 12px', borderRadius: '50px',
          fontSize: '12px', fontWeight: '600', color: 'white',
          background: isFree
            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
            : 'linear-gradient(135deg, #6C63FF, #5A52D5)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {isFree ? '🎁 ' + t('free').replace('🎁 ', '') : t('paid')}
        </span>
      </div>

      <div style={{
        padding: '20px', display: 'flex', flexDirection: 'column',
        flex: 1, gap: '10px',
      }}>
        <h3 style={{
          fontSize: '17px', fontWeight: '700', color: textColor,
          lineHeight: '1.3',
        }}>
          {course.name}
        </h3>

        <p style={{
          fontSize: '13px', color: subTextColor, lineHeight: '1.5',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {course.shortDesc}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {course.category && CATEGORIES[course.category] && (
            <span style={{
              padding: '3px 10px',
              background: darkMode ? '#2D2D4A' : '#EEF2FF',
              color: darkMode ? '#8B83FF' : '#6C63FF',
              borderRadius: '50px', fontSize: '11px', fontWeight: '600',
            }}>
              {CATEGORIES[course.category]}
            </span>
          )}
          {course.subCategory && SUB_CATEGORIES[course.subCategory] && (
            <span style={{
              padding: '3px 10px',
              background: darkMode ? '#3D2535' : '#FCE7F3',
              color: darkMode ? '#FF8FA3' : '#FF6584',
              borderRadius: '50px', fontSize: '11px', fontWeight: '600',
            }}>
              {SUB_CATEGORIES[course.subCategory]}
            </span>
          )}
          {course.cycle && (
            <span style={{
              padding: '3px 10px',
              background: darkMode ? '#3D3520' : '#FEF3C7',
              color: darkMode ? '#FBBF24' : '#92400e',
              borderRadius: '50px', fontSize: '11px', fontWeight: '600',
            }}>
              🔄 {course.cycle}
            </span>
          )}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          fontSize: '13px', color: subTextColor,
        }}>
          <Clock size={14} /> {course.duration}
        </div>

        <div style={{
          fontSize: '22px', fontWeight: '800',
          color: isFree ? '#22c55e' : '#6C63FF',
          marginTop: 'auto',
        }}>
          {isFree ? t('free') : `৳${course.price}`}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <Link
            to={`/course/${course.id}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1, padding: '10px 14px',
              background: darkMode ? '#252540' : '#F8F9FE',
              color: '#6C63FF',
              border: '2px solid #6C63FF',
              borderRadius: '50px', fontSize: '13px', fontWeight: '600',
              textAlign: 'center', textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            }}
          >
            {t('details')}
          </Link>

          {isFree ? (
            <button
              onClick={handleJoinFree}
              style={{
                flex: 1, padding: '10px 14px',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white', borderRadius: '50px', fontSize: '13px',
                fontWeight: '600', cursor: 'pointer', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              }}
            >
              <Send size={14} /> {t('joinNow').replace('📢 ', '')}
            </button>
          ) : (
            <button
              onClick={handleBuy}
              style={{
                flex: 1, padding: '10px 14px',
                background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                color: 'white', borderRadius: '50px', fontSize: '13px',
                fontWeight: '600', cursor: 'pointer', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                boxShadow: '0 6px 20px rgba(108, 99, 255, 0.25)',
              }}
            >
              <ShoppingCart size={14} /> {t('buyNow').replace('🛒 ', '')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
