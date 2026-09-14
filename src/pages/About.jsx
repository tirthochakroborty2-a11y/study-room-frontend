import { Link } from 'react-router-dom';
import {
  Target,
  CheckCircle2,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Heart,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const About = () => {
  const features = [
    'মানসম্মত শিক্ষা',
    'সহজ লার্নিং মেথড',
    'ক্যারিয়ার গঠনে সহায়তা',
    'নিয়মিত কনটেন্ট আপডেট',
  ];

  const stats = [
    {
      icon: <BookOpen size={28} />,
      value: '৫০+',
      label: 'কোর্স',
      color: '#6C63FF',
      bg: '#EEF2FF',
    },
    {
      icon: <Users size={28} />,
      value: '২০০০+',
      label: 'শিক্ষার্থী',
      color: '#FF6584',
      bg: '#FCE7F3',
    },
    {
      icon: <Award size={28} />,
      value: '১৫+',
      label: 'ইন্সট্রাক্টর',
      color: '#FFC857',
      bg: '#FEF3C7',
    },
    {
      icon: <TrendingUp size={28} />,
      value: '৯৮%',
      label: 'সন্তুষ্টি',
      color: '#22c55e',
      bg: '#DCFCE7',
    },
  ];

  const values = [
    {
      icon: <Heart size={24} />,
      title: 'শিক্ষার্থী-প্রথম',
      desc: 'প্রতিটি শিক্ষার্থীর সাফল্যই আমাদের মূল লক্ষ্য',
      color: '#FF6584',
      bg: '#FCE7F3',
    },
    {
      icon: <Sparkles size={24} />,
      title: 'মানসম্মত কনটেন্ট',
      desc: 'প্রতিটি কোর্স বিশেষজ্ঞ দ্বারা যাচাই করা',
      color: '#6C63FF',
      bg: '#EEF2FF',
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'সহজ শেখার পদ্ধতি',
      desc: 'কঠিন টপিকও সহজে বুঝতে পারবেন',
      color: '#22c55e',
      bg: '#DCFCE7',
    },
    {
      icon: <Award size={24} />,
      title: 'সার্টিফিকেট',
      desc: 'কোর্স সম্পন্ন করলে পাবেন সার্টিফিকেট',
      color: '#FFC857',
      bg: '#FEF3C7',
    },
  ];

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section style={{
        position: 'relative',
        padding: '120px 0 60px',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108, 99, 255, 0.25), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '300px',
          height: '300px',
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
            আমাদের সম্পর্কে
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 6vw, 44px)',
            fontWeight: '800',
            lineHeight: '1.2',
            marginBottom: '18px',
            background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            স্টাডি রুমের যাত্রা
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2.5vw, 18px)',
            color: '#6B7280',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: '1.7',
          }}>
            আমরা বিশ্বাস করি শিক্ষা সবার অধিকার। তাই আমরা সহজ ও মানসম্মত শিক্ষা
            পৌঁছে দিচ্ছি প্রতিটি ঘরে।
          </p>
        </div>
      </section>

      {/* ==================== ABOUT CONTENT ==================== */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '50px',
            alignItems: 'center',
          }} className="about-grid">
            <div>
              <h2 style={{
                fontSize: 'clamp(24px, 4vw, 32px)',
                fontWeight: '800',
                color: '#2D2D3F',
                marginBottom: '18px',
                lineHeight: '1.3',
              }}>
                স্টাডি রুম কী? 🎓
              </h2>

              <p style={{
                fontSize: '15px',
                color: '#6B7280',
                lineHeight: '1.8',
                marginBottom: '16px',
              }}>
                স্টাডি রুম একটি অনলাইন শিক্ষা প্ল্যাটফর্ম যেখানে শিক্ষার্থীরা
                ঘরে বসেই মানসম্মত কোর্স করতে পারে। আমরা ACS 27, ACS 28,
                এডমিশন, ইঞ্জিনিয়ারিং, মেডিকেল সহ আরো অনেক প্রস্তুতিমূলক
                কোর্স অফার করি।
              </p>

              <p style={{
                fontSize: '15px',
                color: '#6B7280',
                lineHeight: '1.8',
                marginBottom: '24px',
              }}>
                আমাদের লক্ষ্য হলো প্রতিটি শিক্ষার্থীকে সঠিক দিক নির্দেশনা
                দিয়ে তার স্বপ্ন পূরণে সাহায্য করা। অভিজ্ঞ ইন্সট্রাক্টরদের
                তত্ত্বাবধানে আমরা সাজিয়েছি প্রতিটি কোর্স।
              </p>

              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#2D2D3F',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <Target size={22} color="#6C63FF" /> আমাদের লক্ষ্য
              </h3>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                {features.map((feature, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 0',
                      fontSize: '15px',
                      color: '#2D2D3F',
                      fontWeight: '500',
                    }}
                  >
                    <CheckCircle2 size={18} color="#22c55e" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                alt="Study Room"
                style={{
                  width: '100%',
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(108, 99, 255, 0.20)',
                  display: 'block',
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400/6C63FF/FFFFFF?text=Study+Room';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
          }}>
            {stats.map((stat, idx) => (
              <div
                key={idx}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '30px 20px',
                  boxShadow: '0 10px 40px rgba(108, 99, 255, 0.08)',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(108, 99, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(108, 99, 255, 0.08)';
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 14px',
                  borderRadius: '50%',
                  background: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color,
                }}>
                  {stat.icon}
                </div>
                <h3 style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#2D2D3F',
                  marginBottom: '6px',
                  lineHeight: '1.2',
                }}>
                  {stat.value}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  fontWeight: '500',
                }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== VALUES ==================== */}
      <section style={{ padding: '20px 0 80px' }}>
        <div className="container">
          <div style={{
            textAlign: 'center',
            marginBottom: '50px',
          }}>
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: '800',
              color: '#2D2D3F',
              marginBottom: '10px',
            }}>
              🎯 আমাদের মূল্যবোধ
            </h2>
            <p style={{
              fontSize: '15px',
              color: '#6B7280',
              maxWidth: '500px',
              margin: '0 auto',
            }}>
              যে বিষয়গুলো আমাদের আলাদা করে তোলে
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}>
            {values.map((value, idx) => (
              <div
                key={idx}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '26px 22px',
                  boxShadow: '0 10px 40px rgba(108, 99, 255, 0.08)',
                  transition: 'all 0.3s',
                  borderTop: `4px solid ${value.color}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(108, 99, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(108, 99, 255, 0.08)';
                }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: value.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: value.color,
                  marginBottom: '16px',
                }}>
                  {value.icon}
                </div>
                <h3 style={{
                  fontSize: '17px',
                  fontWeight: '700',
                  color: '#2D2D3F',
                  marginBottom: '8px',
                }}>
                  {value.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  lineHeight: '1.6',
                }}>
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
            borderRadius: '24px',
            padding: '50px 30px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(108, 99, 255, 0.30)',
          }}>
            <div style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-80px',
              left: '-80px',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: 'clamp(22px, 4vw, 30px)',
                fontWeight: '800',
                color: 'white',
                marginBottom: '14px',
                lineHeight: '1.3',
              }}>
                আজই শুরু করুন আপনার যাত্রা 🚀
              </h2>
              <p style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '500px',
                margin: '0 auto 28px',
                lineHeight: '1.7',
              }}>
                আমাদের কোর্সের মাধ্যমে নিজেকে আরো দক্ষ করে তুলুন
              </p>

              <Link
                to="/courses"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 40px',
                  background: 'white',
                  color: '#6C63FF',
                  borderRadius: '50px',
                  fontSize: '15px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                }}
              >
                কোর্স ব্রাউজ করুন
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            gap: 30px !important;
          }
        }
      `}</style>
    </>
  );
};

export default About;
