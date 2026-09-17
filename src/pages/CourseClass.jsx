import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, PlayCircle, CheckCircle2, FileText, ChevronDown, ChevronRight,
  BookOpen, Clock, Layers, Award, Lock, AlertCircle,
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../api/firebase';
import { useCourses } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import { getClassesByCourse, getChaptersByCourse } from '../api/classApi';

const CourseClass = () => {
  const { courseId } = useParams();
  const { getCourseById, loading: coursesLoading } = useCourses();
  const { user } = useAuth();

  const [chapters, setChapters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeClass, setActiveClass] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [completedClasses, setCompletedClasses] = useState([]);

  // ⚠️ Access Verification States
  const [hasAccess, setHasAccess] = useState(false);
  const [accessLoading, setAccessLoading] = useState(true);
  const [accessError, setAccessError] = useState('');

  const course = getCourseById(courseId);

  // ==================== ACCESS VERIFICATION ====================
  useEffect(() => {
    const verifyAccess = async () => {
      if (!user || !courseId) {
        setAccessLoading(false);
        return;
      }

      try {
        // Check if user has an approved order for this course
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          where('courseId', '==', parseInt(courseId)),
          where('status', '==', 'approved')
        );
        const snapshot = await getDocs(q);

        if (snapshot.size > 0) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
          setAccessError('no_order');
        }
      } catch (error) {
        console.error('Access verification error:', error);
        setHasAccess(false);
        setAccessError('error');
      } finally {
        setAccessLoading(false);
      }
    };

    verifyAccess();
  }, [user, courseId]);

  // ==================== LOAD CLASSES (only if has access) ====================
  useEffect(() => {
    const load = async () => {
      if (!courseId || !hasAccess) return;
      setLoading(true);
      const [chRes, clRes] = await Promise.all([
        getChaptersByCourse(courseId),
        getClassesByCourse(courseId),
      ]);
      if (chRes.success) {
        setChapters(chRes.chapters);
        if (chRes.chapters.length > 0) {
          setExpandedChapters([chRes.chapters[0].docId]);
        }
      }
      if (clRes.success) {
        setClasses(clRes.classes);
        if (clRes.classes.length > 0) {
          setActiveClass(clRes.classes[0]);
        }
      }
      setLoading(false);
    };
    load();
  }, [courseId, hasAccess]);

  // Load progress
  useEffect(() => {
    if (!user || !courseId) return;
    const key = `progress_${user.uid}_${courseId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setCompletedClasses(JSON.parse(saved));
      } catch (e) {}
    }
  }, [user, courseId]);

  const markComplete = (classId) => {
    if (completedClasses.includes(classId)) return;
    const newCompleted = [...completedClasses, classId];
    const key = `progress_${user.uid}_${courseId}`;
    localStorage.setItem(key, JSON.stringify(newCompleted));
    setCompletedClasses(newCompleted);
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const selectClass = (cls) => {
    setActiveClass(cls);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goNext = () => {
    const currentIdx = classes.findIndex((c) => c.docId === activeClass?.docId);
    if (currentIdx < classes.length - 1) {
      if (activeClass) markComplete(activeClass.docId);
      setActiveClass(classes[currentIdx + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    const currentIdx = classes.findIndex((c) => c.docId === activeClass?.docId);
    if (currentIdx > 0) {
      setActiveClass(classes[currentIdx - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ==================== ACCESS VERIFICATION UI ====================
  if (accessLoading || coursesLoading) {
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
        }}>🔐</div>
        <p style={{ color: '#6C63FF', fontSize: '15px', fontWeight: '600' }}>
          Access যাচাই করা হচ্ছে...
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

  // Course Not Found
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
        <Link to="/courses" style={{
          padding: '12px 28px',
          background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
          color: 'white',
          borderRadius: '50px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '14px',
          display: 'inline-block',
        }}>
          ← সব Course দেখুন
        </Link>
      </section>
    );
  }

  // ⚠️ NO ACCESS — Payment বা Approval নেই
  if (!hasAccess) {
    return (
      <section style={{
        padding: '100px 20px 60px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #F8F9FE 0%, #EEF2FF 100%)',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '50px 30px',
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(108, 99, 255, 0.15)',
          border: '2px solid #FEE2E2',
        }}>
          {/* Lock Icon */}
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FEE2E2, #FECACA)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '40px',
            boxShadow: '0 10px 30px rgba(239, 68, 68, 0.25)',
          }}>
            🔒
          </div>

          <h2 style={{
            fontSize: '22px',
            fontWeight: '800',
            color: '#2D2D3F',
            marginBottom: '10px',
          }}>
            Access Denied
          </h2>

          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            lineHeight: '1.7',
            marginBottom: '24px',
          }}>
            {accessError === 'no_order' ? (
              <>
                এই Course এর Class দেখতে হলে আগে <strong>Course কিনতে হবে</strong>।
                {course.type === 'paid' && (
                  <>
                    <br />
                    <br />
                    <strong>Price: ৳{course.price}</strong>
                  </>
                )}
              </>
            ) : (
              'কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।'
            )}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              to={`/course/${course.id}`}
              style={{
                padding: '14px',
                background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                color: 'white',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '14px',
                boxShadow: '0 8px 25px rgba(108, 99, 255, 0.30)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <PlayCircle size={18} /> Course দেখুন
            </Link>
            <Link
              to="/my-courses"
              style={{
                padding: '12px',
                background: 'white',
                color: '#6C63FF',
                border: '2px solid #6C63FF',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '13px',
              }}
            >
              আমার কোর্স
            </Link>
          </div>

          {/* Info Box */}
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: '#F8F9FE',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            textAlign: 'left',
          }}>
            <AlertCircle size={16} color="#6C63FF" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{
              fontSize: '11px',
              color: '#6B7280',
              lineHeight: '1.6',
            }}>
              Course কিনলে Admin Approve করার পর এই Page এ Access পাবেন।
            </p>
          </div>
        </div>
      </section>
    );
  }

  // No Content
  if (chapters.length === 0 || classes.length === 0) {
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
          marginTop: '20px',
        }}>
          ← আমার কোর্সে ফিরুন
        </Link>
      </section>
    );
  }

  const progressPercent = classes.length > 0
    ? Math.round((completedClasses.length / classes.length) * 100) : 0;

  return (
    <section style={{
      padding: '85px 0 40px',
      background: 'linear-gradient(180deg, #F8F9FE 0%, #EEF2FF 100%)',
      minHeight: '100vh',
    }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}>
          <Link to="/my-courses" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#6C63FF',
            fontSize: '13px',
            fontWeight: '600',
            textDecoration: 'none',
            padding: '8px 14px',
            background: 'white',
            borderRadius: '50px',
            boxShadow: '0 4px 12px rgba(108, 99, 255, 0.08)',
          }}>
            <ArrowLeft size={14} /> আমার কোর্স
          </Link>
        </div>

        {/* Course Hero Card */}
        <div style={{
          background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '20px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(108, 99, 255, 0.25)',
        }}>
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.20), transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-80px', left: '-80px',
            width: '240px', height: '240px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,101,132,0.25), transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'flex', gap: '16px', alignItems: 'center',
            position: 'relative', zIndex: 1, flexWrap: 'wrap',
          }}>
            <div style={{
              width: '70px', height: '70px', borderRadius: '16px',
              overflow: 'hidden', flexShrink: 0,
              border: '3px solid rgba(255,255,255,0.3)',
              background: 'white',
            }}>
              <img
                src={course.image}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/70'; }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '3px 10px',
                background: 'rgba(255,255,255,0.20)',
                borderRadius: '50px', fontSize: '11px',
                fontWeight: '700', color: 'white', marginBottom: '8px',
              }}>
                <Award size={11} /> Premium Course
              </div>
              <h1 style={{
                fontSize: 'clamp(17px, 3vw, 22px)',
                fontWeight: '800', color: 'white',
                marginBottom: '8px', lineHeight: '1.3',
              }}>
                {course.name}
              </h1>
              <div style={{
                display: 'flex', gap: '14px', flexWrap: 'wrap',
                fontSize: '12px', color: 'rgba(255,255,255,0.85)',
                fontWeight: '600',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Layers size={12} /> {chapters.length} Chapter
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <PlayCircle size={12} /> {classes.length} Class
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {course.duration}
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div style={{ marginTop: '20px', position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '12px', color: 'rgba(255,255,255,0.9)',
              fontWeight: '700', marginBottom: '8px',
            }}>
              <span>📊 আপনার Progress</span>
              <span>{completedClasses.length} / {classes.length} ({progressPercent}%)</span>
            </div>
            <div style={{
              height: '10px', background: 'rgba(255,255,255,0.20)',
              borderRadius: '50px', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #FFC857, #FF6584)',
                borderRadius: '50px', transition: 'width 0.5s ease',
                boxShadow: '0 0 20px rgba(255, 200, 87, 0.5)',
              }} />
            </div>
          </div>
        </div>

        {/* Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
          gap: '20px',
        }} className="class-layout">
          {/* LEFT: Video */}
          {activeClass ? (
            <div style={{ minWidth: 0 }}>
              <div style={{
                background: 'black', borderRadius: '16px',
                overflow: 'hidden', position: 'relative',
                aspectRatio: '16/9',
                boxShadow: '0 20px 50px rgba(0,0,0,0.30)',
              }}>
                <iframe
                  key={activeClass.docId}
                  src={`https://www.youtube.com/embed/${activeClass.youtubeId}?rel=0&modestbranding=1`}
                  title={activeClass.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%', border: 0,
                  }}
                />
              </div>

              <div style={{
                background: 'white', borderRadius: '16px',
                padding: '20px', marginTop: '16px',
                boxShadow: '0 10px 30px rgba(108, 99, 255, 0.08)',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  gap: '10px', flexWrap: 'wrap', marginBottom: '14px',
                }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '3px 10px',
                      background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                      color: '#6C63FF', borderRadius: '50px',
                      fontSize: '11px', fontWeight: '700', marginBottom: '8px',
                    }}>
                      <PlayCircle size={11} /> এখন চলছে
                    </div>
                    <h2 style={{
                      fontSize: '18px', fontWeight: '800',
                      color: '#2D2D3F', lineHeight: '1.3', marginBottom: '5px',
                    }}>
                      {activeClass.title}
                    </h2>
                    {activeClass.duration && (
                      <p style={{ fontSize: '12px', color: '#6B7280' }}>
                        ⏱ {activeClass.duration}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => markComplete(activeClass.docId)}
                    disabled={completedClasses.includes(activeClass.docId)}
                    style={{
                      padding: '10px 18px',
                      background: completedClasses.includes(activeClass.docId)
                        ? '#DCFCE7' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: completedClasses.includes(activeClass.docId)
                        ? '#166534' : 'white',
                      border: 'none', borderRadius: '50px',
                      fontSize: '12px', fontWeight: '700',
                      cursor: completedClasses.includes(activeClass.docId)
                        ? 'default' : 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      boxShadow: completedClasses.includes(activeClass.docId)
                        ? 'none' : '0 6px 20px rgba(34, 197, 94, 0.30)',
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle2 size={13} />
                    {completedClasses.includes(activeClass.docId) ? 'সম্পন্ন ✅' : 'Complete'}
                  </button>
                </div>

                {activeClass.description && (
                  <div style={{
                    padding: '14px', background: '#F8F9FE',
                    borderRadius: '10px', marginBottom: '14px',
                  }}>
                    <p style={{
                      fontSize: '13px', color: '#4B5563', lineHeight: '1.7',
                    }}>
                      {activeClass.description}
                    </p>
                  </div>
                )}

                {activeClass.notesUrl && (
                  <a
                    href={activeClass.notesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '10px 18px',
                      background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                      color: '#92400e', borderRadius: '50px',
                      fontSize: '12px', fontWeight: '700',
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(255, 200, 87, 0.25)',
                      marginBottom: '14px',
                    }}
                  >
                    <FileText size={13} /> Notes PDF Download
                  </a>
                )}

                <div style={{
                  display: 'flex', gap: '10px', marginTop: '16px',
                  justifyContent: 'space-between',
                }}>
                  <button
                    onClick={goPrev}
                    disabled={classes.findIndex((c) => c.docId === activeClass.docId) === 0}
                    style={{
                      padding: '11px 20px',
                      background: classes.findIndex((c) => c.docId === activeClass.docId) === 0
                        ? '#F3F4F6' : 'white',
                      color: classes.findIndex((c) => c.docId === activeClass.docId) === 0
                        ? '#9CA3AF' : '#6C63FF',
                      border: `2px solid ${
                        classes.findIndex((c) => c.docId === activeClass.docId) === 0
                          ? '#F3F4F6' : '#6C63FF'
                      }`,
                      borderRadius: '50px', fontSize: '12px', fontWeight: '700',
                      cursor: classes.findIndex((c) => c.docId === activeClass.docId) === 0
                        ? 'not-allowed' : 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={goNext}
                    disabled={
                      classes.findIndex((c) => c.docId === activeClass.docId) ===
                      classes.length - 1
                    }
                    style={{
                      padding: '11px 20px',
                      background:
                        classes.findIndex((c) => c.docId === activeClass.docId) ===
                        classes.length - 1
                          ? '#F3F4F6' : 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                      color:
                        classes.findIndex((c) => c.docId === activeClass.docId) ===
                        classes.length - 1
                          ? '#9CA3AF' : 'white',
                      border: 'none', borderRadius: '50px',
                      fontSize: '12px', fontWeight: '700',
                      cursor:
                        classes.findIndex((c) => c.docId === activeClass.docId) ===
                        classes.length - 1
                          ? 'not-allowed' : 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      boxShadow:
                        classes.findIndex((c) => c.docId === activeClass.docId) ===
                        classes.length - 1
                          ? 'none' : '0 6px 20px rgba(108, 99, 255, 0.25)',
                    }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'white', borderRadius: '16px',
              padding: '80px 20px', textAlign: 'center',
              boxShadow: '0 10px 30px rgba(108, 99, 255, 0.08)',
            }}>
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>📚</div>
              <h3 style={{
                fontSize: '18px', color: '#2D2D3F',
                marginBottom: '8px', fontWeight: '700',
              }}>
                কোন Class Select করুন
              </h3>
              <p style={{ color: '#6B7280', fontSize: '14px' }}>
                ডান দিকে Chapter থেকে Class ক্লিক করুন
              </p>
            </div>
          )}

          {/* RIGHT: Chapter Sidebar */}
          <div
            className="class-sidebar"
            style={{
              background: 'white', borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(108, 99, 255, 0.08)',
              height: 'fit-content', position: 'sticky', top: '85px',
              maxHeight: 'calc(100vh - 110px)',
              overflowY: 'auto', overflowX: 'hidden',
            }}
          >
            <div style={{
              padding: '16px 18px', borderBottom: '2px solid #F3F4F6',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #F8F9FE, #EEF2FF)',
              position: 'sticky', top: 0, zIndex: 10,
            }}>
              <h3 style={{
                fontSize: '14px', fontWeight: '800', color: '#2D2D3F',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <BookOpen size={16} color="#6C63FF" />
                Course Content
              </h3>
              <span style={{
                padding: '3px 10px',
                background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                color: 'white', borderRadius: '50px',
                fontSize: '10px', fontWeight: '800',
              }}>
                {chapters.length} CH
              </span>
            </div>

            <div style={{ padding: '10px' }}>
              {chapters.map((ch, chIdx) => {
                const chClasses = classes.filter((c) => c.chapterId === ch.docId);
                const isExpanded = expandedChapters.includes(ch.docId);
                const completedInChapter = chClasses.filter((c) =>
                  completedClasses.includes(c.docId)
                ).length;
                const chapterProgress = chClasses.length > 0
                  ? Math.round((completedInChapter / chClasses.length) * 100) : 0;

                return (
                  <div
                    key={ch.docId}
                    style={{
                      marginBottom: '8px', borderRadius: '12px',
                      overflow: 'hidden',
                      background: isExpanded ? '#FAFBFF' : 'white',
                      border: `2px solid ${isExpanded ? '#6C63FF' : '#F3F4F6'}`,
                      transition: 'all 0.3s',
                    }}
                  >
                    <button
                      onClick={() => toggleChapter(ch.docId)}
                      style={{
                        width: '100%', padding: '14px', background: 'transparent',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center',
                        gap: '10px', textAlign: 'left',
                      }}
                    >
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '10px',
                        background: isExpanded
                          ? 'linear-gradient(135deg, #6C63FF, #5A52D5)'
                          : chapterProgress === 100
                            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                            : '#F3F4F6',
                        color: isExpanded || chapterProgress === 100 ? 'white' : '#6C63FF',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '14px',
                        fontWeight: '800', flexShrink: 0,
                        boxShadow: isExpanded
                          ? '0 6px 15px rgba(108, 99, 255, 0.30)' : 'none',
                      }}>
                        {chapterProgress === 100 ? (
                          <CheckCircle2 size={18} />
                        ) : (ch.order || chIdx + 1)}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: '13px', fontWeight: '700',
                          color: isExpanded ? '#6C63FF' : '#2D2D3F',
                          marginBottom: '4px', overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {ch.title}
                        </p>
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          gap: '6px', fontSize: '10px',
                          color: '#6B7280', fontWeight: '600',
                        }}>
                          <span>📹 {chClasses.length} Class</span>
                          {completedInChapter > 0 && (
                            <span style={{
                              padding: '1px 6px', background: '#DCFCE7',
                              color: '#166534', borderRadius: '50px',
                              fontSize: '9px', fontWeight: '800',
                            }}>
                              {completedInChapter}/{chClasses.length} ✅
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: isExpanded ? '#6C63FF' : '#F3F4F6',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0,
                      }}>
                        {isExpanded ? (
                          <ChevronDown size={14} color="white" />
                        ) : (
                          <ChevronRight size={14} color="#6B7280" />
                        )}
                      </div>
                    </button>

                    {isExpanded && chClasses.length > 0 && (
                      <div style={{ padding: '0 14px', marginBottom: '8px' }}>
                        <div style={{
                          height: '4px', background: '#F3F4F6',
                          borderRadius: '50px', overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%', width: `${chapterProgress}%`,
                            background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                            borderRadius: '50px', transition: 'width 0.5s',
                          }} />
                        </div>
                      </div>
                    )}

                    {isExpanded && (
                      <div style={{
                        padding: '0 8px 8px',
                        display: 'flex', flexDirection: 'column', gap: '4px',
                        animation: 'slideDown 0.3s ease',
                      }}>
                        {chClasses.length === 0 ? (
                          <div style={{
                            padding: '16px', textAlign: 'center',
                            color: '#9CA3AF', fontSize: '12px',
                          }}>
                            এই Chapter এ কোনো Class নেই
                          </div>
                        ) : (
                          chClasses.map((cls, idx) => {
                            const isActive = activeClass?.docId === cls.docId;
                            const isCompleted = completedClasses.includes(cls.docId);

                            return (
                              <button
                                key={cls.docId}
                                onClick={() => selectClass(cls)}
                                style={{
                                  padding: '10px',
                                  background: isActive
                                    ? 'linear-gradient(135deg, #6C63FF, #5A52D5)'
                                    : 'white',
                                  border: `1px solid ${isActive ? '#6C63FF' : '#F3F4F6'}`,
                                  borderRadius: '10px', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center',
                                  gap: '10px', textAlign: 'left',
                                  transition: 'all 0.2s',
                                  boxShadow: isActive
                                    ? '0 8px 20px rgba(108, 99, 255, 0.25)' : 'none',
                                }}
                              >
                                <div style={{
                                  width: '50px', height: '34px', borderRadius: '6px',
                                  overflow: 'hidden', flexShrink: 0,
                                  background: '#000', position: 'relative',
                                }}>
                                  <img
                                    src={`https://img.youtube.com/vi/${cls.youtubeId}/mqdefault.jpg`}
                                    alt=""
                                    style={{
                                      width: '100%', height: '100%',
                                      objectFit: 'cover',
                                      opacity: isActive ? 1 : 0.7,
                                    }}
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/50x34';
                                    }}
                                  />
                                  {isActive && (
                                    <div style={{
                                      position: 'absolute', inset: 0,
                                      display: 'flex', alignItems: 'center',
                                      justifyContent: 'center',
                                      background: 'rgba(108, 99, 255, 0.5)',
                                    }}>
                                      <PlayCircle size={14} color="white" />
                                    </div>
                                  )}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{
                                    display: 'flex', alignItems: 'center',
                                    gap: '5px', marginBottom: '3px',
                                  }}>
                                    <span style={{
                                      fontSize: '9px', fontWeight: '800',
                                      color: isActive ? 'rgba(255,255,255,0.8)' : '#9CA3AF',
                                    }}>
                                      {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    {isCompleted && (
                                      <CheckCircle2
                                        size={11}
                                        color={isActive ? '#DCFCE7' : '#22c55e'}
                                      />
                                    )}
                                  </div>
                                  <p style={{
                                    fontSize: '12px', fontWeight: '600',
                                    color: isActive ? 'white' : '#2D2D3F',
                                    overflow: 'hidden', textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap', marginBottom: '2px',
                                  }}>
                                    {cls.title}
                                  </p>
                                  {cls.duration && (
                                    <p style={{
                                      fontSize: '10px',
                                      color: isActive ? 'rgba(255,255,255,0.75)' : '#6B7280',
                                    }}>
                                      ⏱ {cls.duration}
                                    </p>
                                  )}
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 992px) {
            .class-layout { grid-template-columns: 1fr !important; }
            .class-sidebar {
              position: static !important;
              max-height: none !important;
            }
          }
          @keyframes slideDown {
            from { opacity: 0; max-height: 0; }
            to { opacity: 1; max-height: 1000px; }
          }
        `}</style>
      </div>
    </section>
  );
};

export default CourseClass;
