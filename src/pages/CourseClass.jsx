import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, PlayCircle, CheckCircle2, FileText,
  Youtube, ChevronLeft, ChevronRight, Lock, List,
} from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import { getClassesByCourse } from '../api/classApi';

const CourseClass = () => {
  const { courseId } = useParams();
  const { getCourseById, loading: coursesLoading } = useCourses();
  const { user } = useAuth();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedClasses, setCompletedClasses] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const course = getCourseById(courseId);

  useEffect(() => {
    const load = async () => {
      if (!courseId) return;
      setLoading(true);
      const result = await getClassesByCourse(courseId);
      if (result.success) {
        setClasses(result.classes);
      }
      setLoading(false);
    };
    load();
  }, [courseId]);

  // Save progress locally
  useEffect(() => {
    if (!user || !courseId) return;
    const key = `progress_${user.uid}_${courseId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setCompletedClasses(JSON.parse(saved));
      } catch (e) {
        console.error('Parse progress error:', e);
      }
    }
  }, [user, courseId]);

  const saveProgress = (newCompleted) => {
    if (!user || !courseId) return;
    const key = `progress_${user.uid}_${courseId}`;
    localStorage.setItem(key, JSON.stringify(newCompleted));
    setCompletedClasses(newCompleted);
  };

  const markComplete = () => {
    const currentClass = classes[activeIndex];
    if (!currentClass) return;
    const classKey = currentClass.docId;
    if (completedClasses.includes(classKey)) return;
    const newCompleted = [...completedClasses, classKey];
    saveProgress(newCompleted);
  };

  const goToClass = (idx) => {
    setActiveIndex(idx);
    setShowSidebar(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goNext = () => {
    if (activeIndex < classes.length - 1) {
      markComplete();
      setActiveIndex(activeIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (coursesLoading || loading) {
    return (
      <section style={{
        padding: '150px 20px 60px',
        textAlign: 'center',
        minHeight: '100vh',
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px',
          animation: 'pulse 1.5s infinite',
        }}>🎓</div>
        <p style={{ color: '#6C63FF', fontSize: '15px', fontWeight: '600' }}>
          Class লোড হচ্ছে...
        </p>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
          }
        `}</style>
      </section>
    );
  }

  if (!course) {
    return (
      <section style={{
        padding: '120px 20px 60px',
        textAlign: 'center',
        minHeight: '100vh',
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>😕</div>
        <h2 style={{ fontSize: '22px', color: '#2D2D3F', marginBottom: '20px' }}>
          Course পাওয়া যায়নি
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

  if (classes.length === 0) {
    return (
      <section style={{
        padding: '120px 20px 60px',
        textAlign: 'center',
        minHeight: '100vh',
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>📹</div>
        <h2 style={{
          fontSize: '22px',
          color: '#2D2D3F',
          marginBottom: '12px',
          fontWeight: '700',
        }}>
          এখনো কোনো Class যোগ করা হয়নি
        </h2>
        <p style={{ color: '#6B7280', marginBottom: '24px', fontSize: '14px' }}>
          শীঘ্রই Class যোগ করা হবে
        </p>
        <Link to="/my-courses" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '12px 28px',
          background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
          color: 'white',
          borderRadius: '50px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '14px',
        }}>
          ← আমার কোর্সে ফিরুন
        </Link>
      </section>
    );
  }

  const activeClass = classes[activeIndex];
  const progressPercent = classes.length > 0
    ? Math.round((completedClasses.length / classes.length) * 100)
    : 0;

  return (
    <section style={{
      padding: '90px 0 40px',
      background: '#F8F9FE',
      minHeight: '100vh',
    }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}>
          <Link to="/my-courses" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#6C63FF',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
            padding: '8px 14px',
            background: 'white',
            borderRadius: '50px',
            boxShadow: '0 4px 12px rgba(108, 99, 255, 0.08)',
          }}>
            <ArrowLeft size={16} /> আমার কোর্স
          </Link>

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="sidebar-toggle"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(108, 99, 255, 0.25)',
            }}
          >
            <List size={14} /> ক্লাস লিস্ট
          </button>
        </div>

        {/* Progress Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '20px',
          boxShadow: '0 6px 20px rgba(108, 99, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flex: 1,
            minWidth: '220px',
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6C63FF',
              flexShrink: 0,
            }}>
              <PlayCircle size={22} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{
                fontSize: '15px',
                fontWeight: '800',
                color: '#2D2D3F',
                marginBottom: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {course.name}
              </h1>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>
                📚 {classes.length} টি Class
              </p>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontWeight: '700',
              color: '#6B7280',
              marginBottom: '6px',
            }}>
              <span>📊 Progress</span>
              <span style={{ color: '#22c55e' }}>
                {completedClasses.length} / {classes.length} ({progressPercent}%)
              </span>
            </div>
            <div style={{
              height: '8px',
              background: '#F3F4F6',
              borderRadius: '50px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                borderRadius: '50px',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
          gap: '20px',
        }} className="class-layout">
          {/* Left: Video Player */}
          <div>
            <div style={{
              background: 'black',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '16/9',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            }}>
              <iframe
                key={activeClass.docId}
                src={`https://www.youtube.com/embed/${activeClass.youtubeId}?rel=0&modestbranding=1&autoplay=0`}
                title={activeClass.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
              />
            </div>

            {/* Class Info Card */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              marginTop: '16px',
              boxShadow: '0 10px 30px rgba(108, 99, 255, 0.08)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '12px',
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                    color: '#6C63FF',
                    borderRadius: '50px',
                    fontSize: '11px',
                    fontWeight: '700',
                    marginBottom: '8px',
                  }}>
                    <PlayCircle size={12} /> Class {activeIndex + 1}
                  </div>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '800',
                    color: '#2D2D3F',
                    lineHeight: '1.3',
                    marginBottom: '6px',
                  }}>
                    {activeClass.title}
                  </h2>
                  {activeClass.duration && (
                    <p style={{
                      fontSize: '13px',
                      color: '#6B7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flexWrap: 'wrap',
                    }}>
                      ⏱ {activeClass.duration}
                    </p>
                  )}
                </div>

                {/* Mark Complete Button */}
                <button
                  onClick={markComplete}
                  disabled={completedClasses.includes(activeClass.docId)}
                  style={{
                    padding: '10px 18px',
                    background: completedClasses.includes(activeClass.docId)
                      ? '#DCFCE7'
                      : 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: completedClasses.includes(activeClass.docId)
                      ? '#166534'
                      : 'white',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: completedClasses.includes(activeClass.docId)
                      ? 'default'
                      : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: completedClasses.includes(activeClass.docId)
                      ? 'none'
                      : '0 6px 20px rgba(34, 197, 94, 0.30)',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2 size={14} />
                  {completedClasses.includes(activeClass.docId)
                    ? 'সম্পন্ন ✅'
                    : 'Complete'}
                </button>
              </div>

              {activeClass.description && (
                <div style={{
                  padding: '14px',
                  background: '#F8F9FE',
                  borderRadius: '10px',
                  marginTop: '12px',
                }}>
                  <p style={{
                    fontSize: '13px',
                    color: '#4B5563',
                    lineHeight: '1.7',
                  }}>
                    {activeClass.description}
                  </p>
                </div>
              )}

              {/* Resources */}
              {activeClass.notesUrl && (
                <a
                  href={activeClass.notesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '14px',
                    padding: '10px 18px',
                    background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                    color: '#92400e',
                    borderRadius: '50px',
                    fontSize: '13px',
                    fontWeight: '700',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(255, 200, 87, 0.25)',
                  }}
                >
                  <FileText size={14} /> Notes PDF Download
                </a>
              )}

              {/* Navigation */}
              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={goPrev}
                  disabled={activeIndex === 0}
                  style={{
                    padding: '12px 20px',
                    background: activeIndex === 0 ? '#F3F4F6' : 'white',
                    color: activeIndex === 0 ? '#9CA3AF' : '#6C63FF',
                    border: `2px solid ${activeIndex === 0 ? '#F3F4F6' : '#6C63FF'}`,
                    borderRadius: '50px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                <button
                  onClick={goNext}
                  disabled={activeIndex === classes.length - 1}
                  style={{
                    padding: '12px 20px',
                    background: activeIndex === classes.length - 1
                      ? '#F3F4F6'
                      : 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                    color: activeIndex === classes.length - 1
                      ? '#9CA3AF'
                      : 'white',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: activeIndex === classes.length - 1
                      ? 'not-allowed'
                      : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: activeIndex === classes.length - 1
                      ? 'none'
                      : '0 6px 20px rgba(108, 99, 255, 0.25)',
                  }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Class List */}
          <div
            className={`class-sidebar ${showSidebar ? 'show' : ''}`}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 10px 30px rgba(108, 99, 255, 0.08)',
              height: 'fit-content',
              position: 'sticky',
              top: '90px',
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
            }}
          >
            <h3 style={{
              fontSize: '16px',
              fontWeight: '800',
              color: '#2D2D3F',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <PlayCircle size={18} color="#6C63FF" />
              ক্লাস লিস্ট ({classes.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {classes.map((cls, idx) => {
                const isActive = idx === activeIndex;
                const isCompleted = completedClasses.includes(cls.docId);

                return (
                  <button
                    key={cls.docId}
                    onClick={() => goToClass(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: isActive
                        ? 'linear-gradient(135deg, #EEF2FF, #E0E7FF)'
                        : '#F8F9FE',
                      border: `2px solid ${isActive ? '#6C63FF' : 'transparent'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.3s',
                      width: '100%',
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: '60px',
                      height: '40px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: '#000',
                      position: 'relative',
                    }}>
                      <img
                        src={`https://img.youtube.com/vi/${cls.youtubeId}/mqdefault.jpg`}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: isActive ? 1 : 0.7,
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/60x40/6C63FF/FFFFFF?text=YT';
                        }}
                      />
                      {isActive && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(108, 99, 255, 0.5)',
                        }}>
                          <PlayCircle size={18} color="white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '3px',
                      }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          color: isActive ? '#6C63FF' : '#9CA3AF',
                        }}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        {isCompleted && (
                          <CheckCircle2 size={12} color="#22c55e" />
                        )}
                      </div>
                      <p style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: isActive ? '#6C63FF' : '#2D2D3F',
                        marginBottom: '2px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        lineHeight: '1.3',
                      }}>
                        {cls.title}
                      </p>
                      {cls.duration && (
                        <p style={{
                          fontSize: '10px',
                          color: '#6B7280',
                        }}>
                          ⏱ {cls.duration}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 992px) {
            .class-layout {
              grid-template-columns: 1fr !important;
            }
            .sidebar-toggle {
              display: inline-flex !important;
            }
            .class-sidebar {
              display: none;
              position: static !important;
              max-height: none !important;
            }
            .class-sidebar.show {
              display: block;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default CourseClass;
