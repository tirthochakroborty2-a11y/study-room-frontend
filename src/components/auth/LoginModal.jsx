import { X, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginModal = () => {
  const { loginModalOpen, closeLoginModal, loginWithGoogle } = useAuth();

  if (!loginModalOpen) return null;

  return (
    <div
      onClick={closeLoginModal}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(6px)',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '32px 28px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 30px 80px rgba(0,0,0,0.30)',
          position: 'relative',
          animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          textAlign: 'center',
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: '#F3F4F6',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6B7280',
          }}
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 20px',
          background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          boxShadow: '0 10px 30px rgba(108, 99, 255, 0.20)',
        }}>
          🔐
        </div>

        <h2 style={{
          fontSize: '22px',
          fontWeight: '800',
          color: '#2D2D3F',
          marginBottom: '8px',
        }}>
          লগইন করুন
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          marginBottom: '24px',
          lineHeight: '1.6',
        }}>
          এই কাজটি করতে Google দিয়ে লগইন করুন।
          <br />
          মাত্র ২ সেকেন্ড!
        </p>

        {/* Login Button */}
        <button
          onClick={loginWithGoogle}
          style={{
            width: '100%',
            padding: '15px 24px',
            background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 10px 30px rgba(108, 99, 255, 0.30)',
            transition: 'all 0.3s',
            marginBottom: '12px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(108, 99, 255, 0.40)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(108, 99, 255, 0.30)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#fff" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
          </svg>
          Google দিয়ে লগইন করুন
        </button>

        {/* Cancel */}
        <button
          onClick={closeLoginModal}
          style={{
            width: '100%',
            padding: '12px',
            background: 'transparent',
            color: '#6B7280',
            border: 'none',
            borderRadius: '50px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          পরে করব
        </button>

        <p style={{
          fontSize: '11px',
          color: '#9CA3AF',
          marginTop: '14px',
          lineHeight: '1.5',
        }}>
          লগইন করলে আপনি আমাদের শর্তাবলী মেনে নিচ্ছেন
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default LoginModal;
