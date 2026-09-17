import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle2,
  FileText,
  ChevronDown,
  ChevronRight,
  List,
  BookOpen,
} from 'lucide-react';
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
  const [showSidebar, setShowSidebar] = useState(false);

  const course = getCourseById(courseId);

  useEffect(() => {
    const load = async () => {
      if (!courseId) return;
      setLoading(true);
      const [chRes, clRes] = await Promise.all([
        getChaptersByCourse(courseId),
        getClassesByCourse(courseId),
      ]);
      if (chRes.success) {
        setChapters(chRes.chapters);
        // Auto expand first chapter
        if (chRes.chapters.length > 0) {
          setExpandedChapters([chRes.chapters[0].docId]);
        }
      }
      if (clRes.success) {
        setClasses(clRes.classes);
        // Auto select first class
        if (clRes.classes.length > 0) {
          setActiveClass(clRes.classes[0]);
        }
      }
      setLoading(false);
    };
    load();
  }, [courseId]);

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

  const saveProgress = (newCompleted) => {
    if (!user || !courseId) return;
    const key = `progress_${user.uid}_${courseId}`;
    localStorage.setItem(key, JSON.stringify(newCompleted));
    setCompletedClasses(newCompleted);
  };

  const markComplete = (classId) => {
    if (completedClasses.includes(classId)) return;
    const newCompleted = [...completedClasses, classId];
    saveProgress(newCompleted);
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
    setShowSidebar(false);
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

  // ==================== STATES ====================

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
    ? Math.round((completedClasses.length / classes.length) * 100)
    : 0;

  return (
    <section style={{
      padding: '85px 0 40px',
      background: '#F8F9FE',
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

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="sidebar-toggle"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '5px',
              padding: '9px 14px',
              background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(108, 99, 255, 0.25)',
            }}
          >
            <List size={13} /> ক্লাস লিস্ট
          </button>
        </div>

        {/* Progress */}
        <div style={{
          background: 'white',
          borderRadius: '14px',
          padding: '14px 16px',
          marginBottom: '16px',
          boxShadow: '0 6px 20px rgba(108, 99, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flex: 1,
            minWidth: '200px',
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6C63FF',
              flexShrink: 0,
            }}>
              <PlayCircle size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{
                fontSize: '14px',
                fontWeight: '800',
                color: '#2D2D3F',
                marginBottom: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {course.name}
              </h1>
              <p style={{ fontSize: '11px', color: '#6B7280' }}>
                📖 {chapters.length} Chapter • 📹 {classes.length} Class
              </p>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              fontWeight: '700',
              color: '#6B7280',
              marginBottom: '5px',
            }}>
              <span>📊 Progress</span>
              <span style={{ color: '#22c55e' }}>
                {completedClasses.length} / {classes.length} ({progressPercent}%)
              </span>
            </div>
            <div style={{
              height: '7px',
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

        {/* Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
          gap: '16px',
        }} className="class-layout">
          {/* LEFT: Video */}
          <div style={{ minWidth: 0 }}>
            {activeClass ? (
              <>
                <div style={{
                  background: 'black',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '16/9',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                }}>
                  <iframe
                    key={activeClass.docId}
                    src={`https://www.youtube.com/embed/${activeClass.youtubeId}?rel=0&modestbranding=1`}
                    title={activeClass.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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

                {/* Class Info */}
                <div style={{
                  background: 'white',
                  borderRadius: '14px',
                  padding: '16px',
                  marginTop: '12px',
                  boxShadow: '0 10px 30px rgba(108, 99, 255, 0.08)',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginBottom: '12px',
                  }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h2 style={{
                        fontSize: '17px',
                        fontWeight: '800',
                        color: '#2D2D3F',
                        lineHeight: '1.3',
                        marginBottom: '5px',
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
                        padding: '9px 16px',
                        background: completedClasses.includes(activeClass.docId)
                          ? '#DCFCE7'
                          : 'linear-gradient(135deg, #22c55e, #16a34a)',
                        color: completedClasses.includes(activeClass.docId)
                          ? '#166534'
                          : 'white',
                        border: 'none',
                        borderRadius: '50px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: completedClasses.includes(activeClass.docId)
                          ? 'default'
                          : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: completedClasses.includes(activeClass.docId)
                          ? 'none'
                          : '0 6px 20px rgba(34, 197, 94, 0.30)',
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle2 size={13} />
                      {completedClasses.includes(activeClass.docId)
                        ? 'সম্পন্ন'
                        : 'Complete'}
                    </button>
                  </div>

                  {activeClass.description && (
                    <div style={{
                      padding: '12px',
                      background: '#F8F9FE',
                      borderRadius: '10px',
                      marginBottom: '12px',
                    }}>
                      <p style={{
                        fontSize: '12px',
                        color: '#4B5563',
                        lineHeight: '1.7',
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
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '9px 16px',
                        background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                        color: '#92400e',
                        borderRadius: '50px',
                        fontSize: '12px',
                        fontWeight: '700',
                        textDecoration: 'none',
                        boxShadow: '0 4px 12px rgba(255, 200, 87, 0.25)',
                      }}
                    >
                      <FileText size={13} /> Notes PDF
                    </a>
                  )}

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '16px',
                    justifyContent: 'space-between',
                  }}>
                    <button
                      onClick={goPrev}
                      disabled={classes.findIndex((c) => c.docId === activeClass.docId) === 0}
                      style={{
                        padding: '10px 18px',
                        background: classes.findIndex((c) => c.docId === activeClass.docId) === 0
                          ? '#F3F4F6'
                          : 'white',
                        color: classes.findIndex((c) => c.docId === activeClass.docId) === 0
                          ? '#9CA3AF'
                          : '#6C63FF',
                        border: `2px solid ${
                          classes.findIndex((c) => c.docId === activeClass.docId) === 0
                            ? '#F3F4F6'
                            : '#6C63FF'
                        }`,
                        borderRadius: '50px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: classes.findIndex((c) => c.docId === activeClass.docId) === 0
                          ? 'not-allowed'
                          : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
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
                        padding: '10px 18px',
                        background:
                          classes.findIndex((c) => c.docId === activeClass.docId) ===
                          classes.length - 1
                            ? '#F3F4F6'
                            : 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                        color:
                          classes.findIndex((c) => c.docId === activeClass.docId) ===
                          classes.length - 1
                            ? '#9CA3AF'
                            : 'white',
                        border: 'none',
                        borderRadius: '50px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor:
                          classes.findIndex((c) => c.docId === activeClass.docId) ===
                          classes.length - 1
                            ? 'not-allowed'
                            : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow:
                          classes.findIndex((c) => c.docId === activeClass.docId) ===
                          classes.length - 1
                            ? 'none'
                            : '0 6px 20px rgba(108, 99, 255, 0.25)',
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{
                background: 'white',
                borderRadius: '14px',
                padding: '60px 20px',
                textAlign: 'center',
                color: '#6B7280',
              }}>
                বাম দিক থেকে Class Select করুন
              </div>
            )}
          </div>

          {/* RIGHT: Chapter + Class List */}
          <div
            className={`class-sidebar ${showSidebar ? 'show' : ''}`}
            style={{
              background: 'white',
              borderRadius: '14px',
              padding: '14px',
              boxShadow: '0 10px 30px rgba(108, 99, 255, 0.08)',
              height: 'fit-content',
              position: 'sticky',
              top: '85px',
              maxHeight: 'calc(100vh - 110px)',
              overflowY: 'auto',
            }}
          >
            <h3 style={{
              fontSize: '14px',
              fontWeight: '800',
              color: '#2D2D3F',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <BookOpen size={16} color="#6C63FF" />
              Chapters ({chapters.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chapters.map((ch, chIdx) => {
                const chClasses = classes.filter((c) => c.chapterId === ch.docId);
                const isExpanded = expandedChapters.includes(ch.docId);
                const completedInChapter = chClasses.filter((c) =>
                  completedClasses.includes(c.docId)
                ).length;

                return (
                  <div key={ch.docId} style={{
                    borderRadius: '10px',
                    border: '1px solid #F3F4F6',
                    overflow: 'hidden',
                  }}>
                    {/* Chapter Header */}
                    <button
                      onClick={() => toggleChapter(ch.docId)}
                      style={{
                        width: '100%',
                        padding: '11px 12px',
                        background: isExpanded
                          ? 'linear-gradient(135deg, #EEF2FF, #E0E7FF)'
                          : '#F8F9FE',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: isExpanded
                          ? 'linear-gradient(135deg, #6C63FF, #5A52D5)'
                          : 'white',
                        color: isExpanded ? 'white' : '#6C63FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: '800',
                        flexShrink: 0,
                      }}>
                        {ch.order || chIdx + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: isExpanded ? '#6C63FF' : '#2D2D3F',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginBottom: '2px',
                        }}>
                          {ch.title}
                        </p>
                        <p style={{
                          fontSize: '10px',
                          color: '#6B7280',
                        }}>
                          {completedInChapter}/{chClasses.length} সম্পন্ন
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronDown size={14} color="#6C63FF" />
                      ) : (
                        <ChevronRight size={14} color="#6B7280" />
                      )}
                    </button>

                    {/* Classes in Chapter */}
                    {isExpanded && (
                      <div style={{
                        padding: '6px',
                        background: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}>
                        {chClasses.length === 0 ? (
                          <p style={{
                            fontSize: '11px',
                            color: '#9CA3AF',
                            textAlign: 'center',
                            padding: '10px',
                          }}>
                            কোনো Class নেই
                          </p>
                        ) : (
                          chClasses.map((cls, idx) => {
                            const isActive = activeClass?.docId === cls.docId;
                            const isCompleted = completedClasses.includes(cls.docId);
                            return (
                              <button
                                key={cls.docId}
                                onClick={() => selectClass(cls)}
                                style={{
                                  padding: '8px 10px',
                                  background: isActive
                                    ? 'linear-gradient(135deg, #6C63FF, #5A52D5)'
                                    : 'transparent',
                                  border: 'none',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  textAlign: 'left',
                                  transition: 'all 0.2s',
                                }}
                              >
                                <div style={{
                                  width: '22px',
                                  height: '22px',
                                  borderRadius: '50%',
                                  background: isActive
                                    ? 'rgba(255,255,255,0.25)'
                                    : isCompleted
                                      ? '#DCFCE7'
                                      : '#F3F4F6',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}>
                                  {isCompleted && !isActive ? (
                                    <CheckCircle2 size={12} color="#166534" />
                                  ) : (
                                    <span style={{
                                      fontSize: '9px',
                                      fontWeight: '800',
                                      color: isActive ? 'white' : '#6C63FF',
                                    }}>
                                      {idx + 1}
                                    </span>
                                  )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: isActive ? 'white' : '#2D2D3F',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}>
                                    {cls.title}
                                  </p>
                                  {cls.duration && (
                                    <p style={{
                                      fontSize: '9px',
                                      color: isActive ? 'rgba(255,255,255,0.8)' : '#6B7280',
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
            .sidebar-toggle { display: inline-flex !important; }
            .class-sidebar {
              display: none;
              position: static !important;
              max-height: none !important;
            }
            .class-sidebar.show { display: block; }
          }
        `}</style>
      </div>
    </section>
  );
};

export default CourseClass;
