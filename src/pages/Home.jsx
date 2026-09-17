import { Link } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, Loader } from 'lucide-react';
import CourseCard from '../components/course/CourseCard';
import { useCourses } from '../context/CourseContext';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { courses, loading } = useCourses();
  const { t, darkMode } = useTheme();
  const popularCourses = courses.slice(0, 8);

  const cardBg = darkMode ? '#1A1A2E' : 'white';
  const textColor = darkMode ? '#F3F4F6' : '#2D2D3F';
  const subTextColor = darkMode ? '#9CA3AF' : '#6B7280';
  const bgGradient = darkMode
    ? 'linear-gradient(135deg, #0F0F1E 0%, #1A1A2E 100%)'
    : 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)';

  return (
    <>
      {/* Hero */}
      <section style={{
        position: 'relative',
        padding: '120px 0 80px',
        background: bgGradient,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108, 99, 255, 0.25), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-100px',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 101, 132, 0.25), transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 16px',
            background: darkMode ? 'rgba(139, 131, 255, 0.15)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${darkMode ? 'rgba(139, 131, 255, 0.3)' : 'rgba(108, 99, 255, 0.2)'}`,
            borderRadius: '50px', fontSize: '13px', fontWeight: '600',
            color: darkMode ? '#8B83FF' : '#6C63FF',
            marginBottom: '24px',
          }}>
            <Sparkles size={14} />
            {t('welcome')}
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 6vw, 48px)', fontWeight: '800',
            lineHeight: '1.2', marginBottom: '20px',
            background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {t('heroTitle1')}<br />{t('heroTitle2')}
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2.5vw, 20px)', color: subTextColor,
            maxWidth: '560px', margin: '0 auto 36px', lineHeight: '1.7',
          }}>
            {t('heroDesc')}
          </p>

          <Link to="/courses" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '16px 42px',
            background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
            color: 'white', borderRadius: '50px',
            fontSize: '16px', fontWeight: '600',
            boxShadow: '0 8px 30px rgba(108, 99, 255, 0.30)',
            textDecoration: 'none',
            transition: 'all 0.3s',
          }}>
            <Search size={18} /> {t('browseCourses')} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Popular Courses */}
      <section style={{ padding: '80px 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: '700',
              color: textColor, marginBottom: '12px',
            }}>
              {t('popularCourses')}
            </h2>
            <p style={{ fontSize: '16px', color: subTextColor, maxWidth: '500px', margin: '0 auto' }}>
              {t('popularDesc')}
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: '16px' }}>
              <Loader size={40} color="#6C63FF" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ color: '#6C63FF' }}>{t('loading')}</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : popularCourses.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '80px 20px',
              background: cardBg, borderRadius: '16px',
              boxShadow: 'var(--card-shadow)',
            }}>
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>📚</div>
              <h3 style={{ fontSize: '20px', color: textColor, marginBottom: '8px' }}>
                {t('noCourses')}
              </h3>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '30px',
            }}>
              {popularCourses.map((course) => (
                <CourseCard key={course.docId} course={course} />
              ))}
            </div>
          )}

          {popularCourses.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <Link to="/courses" style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '14px 40px', background: 'transparent',
                color: '#6C63FF', border: '2px solid #6C63FF',
                borderRadius: '50px', fontSize: '15px', fontWeight: '600',
                textDecoration: 'none',
              }}>
                {t('seeAllCourses')} <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
