import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Compass } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 20px 40px',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
      overflow: 'hidden',
    }}>
      {/* বেগুনি বৃত্ত - উপরে ডানে */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        right: '-120px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108, 99, 255, 0.25), transparent 70%)',
        pointerEvents: 'none',
        animation: 'float 6s ease-in-out infinite',
      }} />

      {/* গোলাপি বৃত্ত - নিচে বামে */}
      <div style={{
        position: 'absolute',
        bottom: '-120px',
        left: '-120px',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 101, 132, 0.25), transparent 70%)',
        pointerEvents: 'none',
        animation: 'float 8s ease-in-out infinite reverse',
      }} />

      {/* হলুদ বৃত্ত - মাঝে */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 200, 87, 0.20), transparent 70%)',
        pointerEvents: 'none',
        animation: 'float 7s ease-in-out infinite',
      }} />

      <div className="container" style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '700px',
        textAlign: 'center',
      }}>
        {/* Big 404 */}
        <div style={{
          position: 'relative',
          marginBottom: '20px',
        }}>
          <h1 style={{
            fontSize: 'clamp(120px, 22vw, 200px)',
            fontWeight: '900',
            lineHeight: '1',
            background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-4px',
            margin: 0,
            animation: 'pulse 3s ease-in-out infinite',
          }}>
            404
          </h1>

          {/* Floating Icon */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '60px',
            animation: 'bounce 2s ease-in-out infinite',
            pointerEvents: 'none',
          }}>
            🔍
          </div>
        </div>

        {/* Badge */}
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
          marginBottom: '20px',
        }}>
          <Compass size={14} />
          পথ হারিয়ে ফেলেছেন?
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 'clamp(22px, 4vw, 32px)',
          fontWeight: '800',
          color: '#2D2D3F',
          marginBottom: '14px',
          lineHeight: '1.3',
        }}>
          পেজটি খুঁজে পাওয়া যায়নি 😕
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(14px, 2vw, 16px)',
          color: '#6B7280',
          lineHeight: '1.7',
          maxWidth: '500px',
          margin: '0 auto 36px',
        }}>
          আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে,
          অথবা কখনোই ছিল না। নিচের বাটনগুলো ব্যবহার করে চালিয়ে যান।
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '40px',
        }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
              color: 'white',
              borderRadius: '50px',
              fontSize: '15px',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 10px 30px rgba(108, 99, 255, 0.30)',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(108, 99, 255, 0.40)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(108, 99, 255, 0.30)';
            }}
          >
            <Home size={18} />
            হোমে ফিরুন
          </Link>

          <Link
            to="/courses"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              background: 'white',
              color: '#6C63FF',
              border: '2px solid #6C63FF',
              borderRadius: '50px',
              fontSize: '15px',
              fontWeight: '700',
              textDecoration: 'none',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#6C63FF';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(108, 99, 255, 0.30)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#6C63FF';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Search size={18} />
            কোর্স ব্রাউজ করুন
          </Link>
        </div>

        {/* Go Back */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            border: 'none',
            color: '#6B7280',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '8px 16px',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#6C63FF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#6B7280';
          }}
        >
          <ArrowLeft size={16} />
          আগের পেজে ফিরে যান
        </button>

        {/* Help Text */}
        <div style={{
          marginTop: '40px',
          padding: '16px 20px',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '14px',
          border: '1px solid rgba(108, 99, 255, 0.1)',
          maxWidth: '450px',
          margin: '40px auto 0',
        }}>
          <p style={{
            fontSize: '13px',
            color: '#6B7280',
            lineHeight: '1.6',
          }}>
            💡 <strong style={{ color: '#2D2D3F' }}>সাহায্য দরকার?</strong> উপরের বাটনগুলো
            ব্যবহার করে সাইটের যেকোনো অংশে যেতে পারবেন।
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-15px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  );
};

export default NotFound;
