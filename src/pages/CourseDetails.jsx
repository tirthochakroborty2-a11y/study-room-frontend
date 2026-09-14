import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock, User, RefreshCw, FolderOpen, ShoppingCart, Send,
  ArrowLeft, PlayCircle, FileText, NotebookPen, MessageCircle,
  Infinity as InfinityIcon, Archive, Loader,
} from 'lucide-react';
import { CATEGORIES, SUB_CATEGORIES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, requireLogin } = useAuth();
  const { getCourseById, loading } = useCourses();

  const course = getCourseById(id);

  if (loading) {
    return (
      <section style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
      }}>
        <Loader size={40} color="#6C63FF" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#6C63FF' }}>লোড হচ্ছে...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </section>
    );
  }

  if (!course) {
    return (
      <section style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>😕</div>
        <h2 style={{
          fontSize: '26px',
          fontWeight: '700',
          color: '#2D2D3F',
          marginBottom: '12px',
        }}>
          কোর্সটি খুঁজে পাওয়া যায়নি
        </h2>
        <p style={{ color: '#6B7280', marginBottom: '30px' }}>
          অনুরোধ করা কোর্সটি আর নেই বা সরিয়ে ফেলা হয়েছে
        </p>
        <Link to="/courses" style={{
          padding: '14px 40px',
          background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
          color: 'white',
          borderRadius: '50px',
          fontSize: '15px',
          fontWeight: '600',
          textDecoration: 'none',
          boxShadow: '0 8px 30px rgba(108, 99, 255, 0.30)',
        }}>
          ← সব কোর্স দেখুন
        </Link>
      </section>
    );
  }

  const isFree = course.type === 'free';

  const handleBuy = () => {
    if (!user) {
      requireLogin('কোর্স কিনতে লগইন করুন');
      return;
    }
    navigate(`/payment?id=${course.id}`);
  };

  const handleJoin = () => {
    if (!user) {
      requireLogin('জয়েন করতে লগইন করুন');
      return;
    }
    window.open(course.telegramLink, '_blank');
  };

  const services = [
    { icon: <PlayCircle size={22} />, text: 'YouTube + Telegram Live Class' },
    { icon: <FileText size={22} />, text: 'Lecture Slides (PDF)' },
    { icon: <NotebookPen size={22} />, text: 'Practice Sheets + Solutions' },
    { icon: <MessageCircle size={22} />, text: '24/7 Support' },
    { icon: <InfinityIcon size={22} />, text: 'Lifetime Access' },
    { icon: <Archive size={22} />, text: 'Archive Classes' },
  ];

  return (
    <section style={{
      padding: '40px 0 60px',
      background: '#F8F9FE',
      minHeight: '100vh',
    }}>
      <div className="container">
        <Link to="/courses" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#6C63FF',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '20px',
          textDecoration: 'none',
        }}>
          <ArrowLeft size={16} /> সব কোর্সে ফিরুন
        </Link>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(108, 99, 255, 0.12)',
            height: 'fit-content',
          }}>
            <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
              <img
                src={course.image}
                alt={course.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x300/6C63FF/FFFFFF?text=Study+Room';
                }}
              />
              <span style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                padding: '6px 16px',
                borderRadius: '50px',
                fontSize: '12px',
                fontWeight: '700',
                color: 'white',
                background: isFree
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}>
                {isFree ? '🎁 ফ্রি' : '💳 পেইড'}
              </span>
            </div>

            <div style={{ padding: '28px' }}>
              <p style={{
                fontSize: '13px',
                color: '#6C63FF',
                fontWeight: '600',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {CATEGORIES[course.category]}
                {course.subCategory && ` • ${SUB_CATEGORIES[course.subCategory]}`}
              </p>

              <h1 style={{
                fontSize: 'clamp(20px, 3vw, 26px)',
                fontWeight: '700',
                color: '#2D2D3F',
                lineHeight: '1.3',
                marginBottom: '16px',
              }}>
                {course.name}
              </h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '5px 14px', background: '#F8F9FE', borderRadius: '50px',
                  fontSize: '12px', color: '#2D2D3F', fontWeight: '500',
                }}>
                  <Clock size={13} /> {course.duration}
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '5px 14px', background: '#F8F9FE', borderRadius: '50px',
                  fontSize: '12px', color: '#2D2D3F', fontWeight: '500',
                }}>
                  <User size={13} /> {course.instructor}
                </span>
                {course.cycle && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '5px 14px', background: '#FEF3C7', borderRadius: '50px',
                    fontSize: '12px', color: '#92400e', fontWeight: '600',
                  }}>
                    <RefreshCw size={13} /> {course.cycle}
                  </span>
                )}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '5px 14px', background: '#EEF2FF', borderRadius: '50px',
                  fontSize: '12px', color: '#6C63FF', fontWeight: '600',
                }}>
                  <FolderOpen size={13} /> {CATEGORIES[course.category]}
                </span>
              </div>

              <div style={{
                padding: '16px 20px',
                background: isFree
                  ? 'linear-gradient(135deg, #DCFCE7, #BBF7D0)'
                  : 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                borderRadius: '12px',
                marginBottom: '20px',
              }}>
                {isFree ? (
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#22c55e' }}>
                    সম্পূর্ণ ফ্রি 🎉
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '30px', fontWeight: '800', color: '#6C63FF' }}>
                      ৳{course.price}
                    </span>
                    {course.originalPrice > course.price && (
                      <>
                        <span style={{ fontSize: '16px', color: '#6B7280', textDecoration: 'line-through' }}>
                          ৳{course.originalPrice}
                        </span>
                        <span style={{
                          padding: '3px 10px', background: '#22c55e', color: 'white',
                          borderRadius: '50px', fontSize: '11px', fontWeight: '700',
                        }}>
                          {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% ছাড়
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2D2D3F', marginBottom: '8px' }}>
                  📄 বিস্তারিত বর্ণনা
                </h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.7' }}>
                  {course.fullDesc}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {isFree ? (
                  <button
                    onClick={handleJoin}
                    style={{
                      flex: 1, minWidth: '180px', padding: '14px 24px',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: 'white', borderRadius: '50px', fontSize: '15px',
                      fontWeight: '700', cursor: 'pointer', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      boxShadow: '0 8px 25px rgba(34, 197, 94, 0.30)',
                    }}
                  >
                    <Send size={18} /> জয়েন করুন (ফ্রি)
                  </button>
                ) : (
                  <button
                    onClick={handleBuy}
                    style={{
                      flex: 1, minWidth: '180px', padding: '14px 24px',
                      background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                      color: 'white', borderRadius: '50px', fontSize: '15px',
                      fontWeight: '700', cursor: 'pointer', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      boxShadow: '0 8px 25px rgba(108, 99, 255, 0.30)',
                    }}
                  >
                    <ShoppingCart size={18} /> এখনই কিনুন
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
            <div style={{
              background: 'white', borderRadius: '16px', padding: '28px',
              boxShadow: '0 10px 40px rgba(108, 99, 255, 0.12)',
            }}>
              <h3 style={{
                fontSize: '20px', fontWeight: '700', color: '#2D2D3F',
                marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                📋 কোর্সে যা যা পাবেন
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {services.map((service, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 18px', background: '#F8F9FE',
                      borderLeft: '4px solid #6C63FF', borderRadius: '10px',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(6px)';
                      e.currentTarget.style.background = '#EEF2FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.background = '#F8F9FE';
                    }}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: 'white', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: '#6C63FF', boxShadow: '0 4px 12px rgba(108, 99, 255, 0.15)',
                      flexShrink: 0,
                    }}>
                      {service.icon}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#2D2D3F' }}>
                      {service.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetails;
