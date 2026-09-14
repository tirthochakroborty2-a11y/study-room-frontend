import { Link } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, Loader } from 'lucide-react';
import CourseCard from '../components/course/CourseCard';
import { useCourses } from '../context/CourseContext';

const Home = () => {
  const { courses, loading } = useCourses();
  const popularCourses = courses.slice(0, 8);

  return (
    <>
      {/* ==================== HERO SECTION ==================== */}
      <section style={{
        position: 'relative',
        padding: '120px 0 80px',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108, 99, 255, 0.25), transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 101, 132, 0.25), transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(108, 99, 255, 0.2)',
            borderRadius: '50px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#6C63FF',
            marginBottom: '24px',
          }}>
            <Sparkles size={14} />
            স্বাগতম স্টাডি রুমে
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 6vw, 48px)',
            fontWeight: '800',
            lineHeight: '1.2',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            আপনার স্বপ্ন পূরণের<br />যাত্রা শুরু হোক আজই
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2.5vw, 20px)',
            color: '#6B7280',
            maxWidth: '560px',
            margin: '0 auto 36px',
            lineHeight: '1.7',
          }}>
            আমাদের কোর্সের মাধ্যমে সহজে শিখুন, দক্ষ হোন, সফল হোন।
            ACS 27, ACS 28, এডমিশন সহ আরো অনেক কোর্স।
          </p>

          <Link
            to="/courses"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 42px',
              background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
              color: 'white',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 8px 30px rgba(108, 99, 255, 0.30)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 45px rgba(108, 99, 255, 0.40)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(108, 99, 255, 0.30)';
            }}
          >
            <Search size={18} />
            ব্রাউজ কোর্স
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ==================== POPULAR COURSES SECTION ==================== */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: '700',
              color: '#2D2D3F',
              marginBottom: '12px',
            }}>
              🔥 জনপ্রিয় কোর্স
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6B7280',
              maxWidth: '500px',
              margin: '0 auto',
            }}>
              শিক্ষার্থীদের সবচেয়ে পছন্দের কোর্সগুলো
            </p>
          </div>

          {loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '60px 0',
              gap: '16px',
            }}>
              <Loader size={40} color="#6C63FF" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ color: '#6C63FF', fontSize: '15px' }}>কোর্স লোড হচ্ছে...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : popularCourses.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(108, 99, 255, 0.08)',
            }}>
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>📚</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#2D2D3F', marginBottom: '8px' }}>
                এখনো কোনো কোর্স যোগ করা হয়নি
              </h3>
              <p style={{ color: '#6B7280', fontSize: '14px' }}>
                Admin Panel থেকে কোর্স যোগ করুন
              </p>
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
              <Link
                to="/courses"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 40px',
                  background: 'transparent',
                  color: '#6C63FF',
                  border: '2px solid #6C63FF',
                  borderRadius: '50px',
                  fontSize: '15px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#6C63FF';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(108, 99, 255, 0.30)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#6C63FF';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                সব কোর্স দেখুন
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
