import { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, X, Save, PlayCircle, ExternalLink,
  BookOpen, ChevronDown, ChevronRight, Folder, FolderOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useCourses } from '../../context/CourseContext';
import {
  addChapter, updateChapter, deleteChapter, getChaptersByCourse,
  addClass, updateClass, deleteClass, getClassesByCourse,
  extractYouTubeId,
} from '../../api/classApi';

const EMPTY_CHAPTER = {
  courseId: '',
  title: '',
  description: '',
  order: 1,
};

const EMPTY_CLASS = {
  courseId: '',
  chapterId: '',
  title: '',
  description: '',
  youtubeUrl: '',
  duration: '',
  order: 1,
  notesUrl: '',
};

const AdminClasses = () => {
  const { courses } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [chapters, setChapters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [loading, setLoading] = useState(false);

  // Chapter Modal
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [chapterForm, setChapterForm] = useState(EMPTY_CHAPTER);

  // Class Modal
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [classForm, setClassForm] = useState(EMPTY_CLASS);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedCourse) {
      loadData();
    } else {
      setChapters([]);
      setClasses([]);
    }
    // eslint-disable-next-line
  }, [selectedCourse]);

  const loadData = async () => {
    setLoading(true);
    const [chRes, clRes] = await Promise.all([
      getChaptersByCourse(selectedCourse),
      getClassesByCourse(selectedCourse),
    ]);
    if (chRes.success) {
      setChapters(chRes.chapters);
      // Auto expand all chapters
      setExpandedChapters(chRes.chapters.map((c) => c.docId));
    }
    if (clRes.success) setClasses(clRes.classes);
    setLoading(false);
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  // ==================== CHAPTERS ====================

  const openAddChapter = () => {
    if (!selectedCourse) return toast.error('আগে Course Select করুন');
    const nextOrder = chapters.length > 0
      ? Math.max(...chapters.map((c) => c.order || 0)) + 1
      : 1;
    setChapterForm({
      ...EMPTY_CHAPTER,
      courseId: selectedCourse,
      order: nextOrder,
    });
    setEditingChapterId(null);
    setShowChapterModal(true);
  };

  const openEditChapter = (ch) => {
    setChapterForm({
      courseId: ch.courseId,
      title: ch.title,
      description: ch.description || '',
      order: ch.order || 1,
    });
    setEditingChapterId(ch.docId);
    setShowChapterModal(true);
  };

  const handleSaveChapter = async (e) => {
    e.preventDefault();
    if (!chapterForm.title.trim()) return toast.error('Chapter Title দিন');

    setSaving(true);
    let result;
    if (editingChapterId) {
      result = await updateChapter(editingChapterId, chapterForm);
    } else {
      result = await addChapter(chapterForm);
    }

    if (result.success) {
      toast.success(editingChapterId ? '✅ Chapter Update' : '✅ নতুন Chapter');
      setShowChapterModal(false);
      loadData();
    } else {
      toast.error(result.error || 'সমস্যা');
    }
    setSaving(false);
  };

  const handleDeleteChapter = async (ch) => {
    const chClasses = classes.filter((c) => c.chapterId === ch.docId);
    const msg = chClasses.length > 0
      ? `"${ch.title}" Chapter এবং এর ${chClasses.length} টি Class মুছে ফেলতে চান?`
      : `"${ch.title}" Chapter মুছে ফেলতে চান?`;

    if (!window.confirm(msg)) return;

    // Delete all classes in this chapter
    for (const cls of chClasses) {
      await deleteClass(cls.docId);
    }
    // Delete chapter
    const result = await deleteChapter(ch.docId);
    if (result.success) {
      toast.success('Chapter এবং Classes মুছে ফেলা হয়েছে');
      loadData();
    }
  };

  // ==================== CLASSES ====================

  const openAddClass = (chapterId = '') => {
    if (!selectedCourse) return toast.error('আগে Course Select করুন');
    if (!chapterId) return toast.error('আগে Chapter Select করুন');

    const chClasses = classes.filter((c) => c.chapterId === chapterId);
    const nextOrder = chClasses.length > 0
      ? Math.max(...chClasses.map((c) => c.order || 0)) + 1
      : 1;

    setClassForm({
      ...EMPTY_CLASS,
      courseId: selectedCourse,
      chapterId: chapterId,
      order: nextOrder,
    });
    setEditingClassId(null);
    setShowClassModal(true);
  };

  const openEditClass = (cls) => {
    setClassForm({
      courseId: cls.courseId,
      chapterId: cls.chapterId,
      title: cls.title,
      description: cls.description || '',
      youtubeUrl: cls.youtubeUrl,
      duration: cls.duration || '',
      order: cls.order || 1,
      notesUrl: cls.notesUrl || '',
    });
    setEditingClassId(cls.docId);
    setShowClassModal(true);
  };

  const handleSaveClass = async (e) => {
    e.preventDefault();
    if (!classForm.title.trim()) return toast.error('Class Title দিন');
    if (!classForm.youtubeUrl.trim()) return toast.error('YouTube Link দিন');

    const ytId = extractYouTubeId(classForm.youtubeUrl);
    if (!ytId) return toast.error('সঠিক YouTube Link দিন');

    setSaving(true);
    let result;
    if (editingClassId) {
      result = await updateClass(editingClassId, classForm);
    } else {
      result = await addClass(classForm);
    }

    if (result.success) {
      toast.success(editingClassId ? '✅ Class Update' : '✅ নতুন Class');
      setShowClassModal(false);
      loadData();
    } else {
      toast.error(result.error || 'সমস্যা');
    }
    setSaving(false);
  };

  const handleDeleteClass = async (docId, title) => {
    if (!window.confirm(`"${title}" Class মুছে ফেলতে চান?`)) return;
    const result = await deleteClass(docId);
    if (result.success) {
      toast.success('Class মুছে ফেলা হয়েছে');
      loadData();
    }
  };

  const selectedCourseData = courses.find((c) => c.id === parseInt(selectedCourse));
  const ytPreviewId = extractYouTubeId(classForm.youtubeUrl);
  const totalClasses = classes.length;

  return (
    <section style={{
      padding: '90px 0 60px',
      background: '#F8F9FE',
      minHeight: '100vh',
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(20px, 4vw, 26px)',
              fontWeight: '800',
              color: '#2D2D3F',
              marginBottom: '4px',
            }}>
              🎓 ক্লাস ম্যানেজমেন্ট
            </h1>
            <p style={{ color: '#6B7280', fontSize: '13px' }}>
              Chapter + Class Structure
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: '20px',
        }} className="admin-layout">
          <AdminSidebar />

          <div style={{ minWidth: 0 }}>
            {/* Course Selector */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px',
              boxShadow: '0 8px 30px rgba(108, 99, 255, 0.08)',
            }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '700',
                color: '#2D2D3F',
                marginBottom: '8px',
              }}>
                📚 Course Select করুন
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: 'white',
                }}
              >
                <option value="">— Course Select করুন —</option>
                {courses.map((c) => (
                  <option key={c.docId} value={c.id}>
                    {c.name} {c.type === 'free' ? '(ফ্রি)' : `(৳${c.price})`}
                  </option>
                ))}
              </select>

              {selectedCourseData && (
                <div style={{
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  background: '#EEF2FF',
                  borderRadius: '10px',
                  flexWrap: 'wrap',
                }}>
                  <img
                    src={selectedCourseData.image}
                    alt=""
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#2D2D3F',
                      marginBottom: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {selectedCourseData.name}
                    </p>
                    <p style={{ fontSize: '11px', color: '#6C63FF', fontWeight: '600' }}>
                      📖 {chapters.length} Chapter • 📹 {totalClasses} Class
                    </p>
                  </div>
                  <button
                    onClick={openAddChapter}
                    style={{
                      padding: '10px 16px',
                      background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 6px 20px rgba(108, 99, 255, 0.25)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Plus size={14} /> Chapter
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            {!selectedCourse ? (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '60px 20px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>📚</div>
                <h3 style={{ fontSize: '17px', color: '#2D2D3F', marginBottom: '8px' }}>
                  Course Select করুন
                </h3>
              </div>
            ) : loading ? (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '60px',
                textAlign: 'center',
                color: '#6C63FF',
              }}>
                লোড হচ্ছে...
              </div>
            ) : chapters.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '60px 20px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>📖</div>
                <h3 style={{ fontSize: '17px', color: '#2D2D3F', marginBottom: '8px' }}>
                  এখনো Chapter যোগ করা হয়নি
                </h3>
                <button
                  onClick={openAddChapter}
                  style={{
                    marginTop: '16px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  ➕ প্রথম Chapter যোগ করুন
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {chapters.map((ch, chIdx) => {
                  const chClasses = classes.filter((c) => c.chapterId === ch.docId);
                  const isExpanded = expandedChapters.includes(ch.docId);

                  return (
                    <div
                      key={ch.docId}
                      style={{
                        background: 'white',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        boxShadow: '0 6px 20px rgba(108, 99, 255, 0.06)',
                        border: '2px solid #F3F4F6',
                      }}
                    >
                      {/* Chapter Header */}
                      <div
                        style={{
                          padding: '14px 16px',
                          background: isExpanded
                            ? 'linear-gradient(135deg, #EEF2FF, #E0E7FF)'
                            : 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          flexWrap: 'wrap',
                        }}
                        onClick={() => toggleChapter(ch.docId)}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: isExpanded
                            ? 'linear-gradient(135deg, #6C63FF, #5A52D5)'
                            : '#F3F4F6',
                          color: isExpanded ? 'white' : '#6C63FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontWeight: '800',
                          fontSize: '15px',
                        }}>
                          {ch.order || chIdx + 1}
                        </div>

                        <div style={{ flex: 1, minWidth: '150px' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginBottom: '3px',
                          }}>
                            {isExpanded ? (
                              <ChevronDown size={16} color="#6C63FF" />
                            ) : (
                              <ChevronRight size={16} color="#6B7280" />
                            )}
                            <h3 style={{
                              fontSize: '15px',
                              fontWeight: '700',
                              color: isExpanded ? '#6C63FF' : '#2D2D3F',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {ch.title}
                            </h3>
                          </div>
                          <p style={{
                            fontSize: '11px',
                            color: '#6B7280',
                            paddingLeft: '22px',
                          }}>
                            📹 {chClasses.length} টি Class
                          </p>
                        </div>

                        <div
                          style={{ display: 'flex', gap: '5px' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => openAddClass(ch.docId)}
                            title="Class Add"
                            style={{
                              padding: '7px 10px',
                              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Plus size={12} /> Class
                          </button>
                          <button
                            onClick={() => openEditChapter(ch)}
                            title="Edit"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: '#EEF2FF',
                              color: '#6C63FF',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteChapter(ch)}
                            title="Delete"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: '#FEE2E2',
                              color: '#ef4444',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Chapter Classes */}
                      {isExpanded && (
                        <div style={{
                          padding: '12px 16px',
                          background: '#FAFBFF',
                          borderTop: '1px solid #F3F4F6',
                        }}>
                          {chClasses.length === 0 ? (
                            <div style={{
                              padding: '20px',
                              textAlign: 'center',
                              color: '#9CA3AF',
                              fontSize: '13px',
                            }}>
                              এই Chapter এ কোনো Class নেই —{' '}
                              <span
                                onClick={() => openAddClass(ch.docId)}
                                style={{
                                  color: '#6C63FF',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  textDecoration: 'underline',
                                }}
                              >
                                Class যোগ করুন
                              </span>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {chClasses.map((cls, idx) => (
                                <div
                                  key={cls.docId}
                                  style={{
                                    background: 'white',
                                    borderRadius: '10px',
                                    padding: '10px 12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    border: '1px solid #F3F4F6',
                                  }}
                                >
                                  <span style={{
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    color: '#6C63FF',
                                    minWidth: '22px',
                                  }}>
                                    {String(idx + 1).padStart(2, '0')}
                                  </span>

                                  <div style={{
                                    width: '60px',
                                    height: '38px',
                                    borderRadius: '6px',
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
                                      }}
                                      onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/60x38';
                                      }}
                                    />
                                  </div>

                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                      fontSize: '13px',
                                      fontWeight: '700',
                                      color: '#2D2D3F',
                                      marginBottom: '2px',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}>
                                      {cls.title}
                                    </p>
                                    {cls.duration && (
                                      <p style={{ fontSize: '10px', color: '#6B7280' }}>
                                        ⏱ {cls.duration}
                                      </p>
                                    )}
                                  </div>

                                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                    <a
                                      href={`https://www.youtube.com/watch?v=${cls.youtubeId}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="YouTube"
                                      style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '6px',
                                        background: '#FEE2E2',
                                        color: '#991B1B',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textDecoration: 'none',
                                      }}
                                    >
                                      <ExternalLink size={12} />
                                    </a>
                                    <button
                                      onClick={() => openEditClass(cls)}
                                      title="Edit"
                                      style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '6px',
                                        background: '#EEF2FF',
                                        color: '#6C63FF',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <Edit size={12} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClass(cls.docId, cls.title)}
                                      title="Delete"
                                      style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '6px',
                                        background: '#FEE2E2',
                                        color: '#ef4444',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <style>{`
          @media (max-width: 992px) {
            .admin-layout { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 480px) {
            .admin-layout { gap: 12px !important; }
          }
        `}</style>
      </div>

      {/* ==================== CHAPTER MODAL ==================== */}
      {showChapterModal && (
        <div
          onClick={() => !saving && setShowChapterModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{
              padding: '18px 20px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#2D2D3F',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <BookOpen size={18} color="#6C63FF" />
                {editingChapterId ? 'Chapter Edit' : 'নতুন Chapter'}
              </h2>
              <button
                onClick={() => setShowChapterModal(false)}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: '#F3F4F6',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveChapter} style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gap: '14px' }}>
                <Field label="Chapter Title *">
                  <input
                    type="text"
                    value={chapterForm.title}
                    onChange={(e) =>
                      setChapterForm({ ...chapterForm, title: e.target.value })
                    }
                    placeholder="যেমন: Vector, গতিবিদ্যা"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Description (Optional)">
                  <textarea
                    value={chapterForm.description}
                    onChange={(e) =>
                      setChapterForm({ ...chapterForm, description: e.target.value })
                    }
                    placeholder="এই Chapter এ যা যা থাকবে..."
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </Field>

                <Field label="Order">
                  <input
                    type="number"
                    value={chapterForm.order}
                    onChange={(e) =>
                      setChapterForm({ ...chapterForm, order: e.target.value })
                    }
                    style={inputStyle}
                  />
                </Field>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowChapterModal(false)}
                  style={cancelBtnStyle}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    ...primaryBtnStyle,
                    background: saving
                      ? '#9CA3AF'
                      : 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                  }}
                >
                  {saving ? '⏳...' : (
                    <>
                      <Save size={14} /> {editingChapterId ? 'Update' : 'যোগ করুন'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CLASS MODAL ==================== */}
      {showClassModal && (
        <div
          onClick={() => !saving && setShowClassModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{
              padding: '18px 20px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#2D2D3F',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <PlayCircle size={18} color="#6C63FF" />
                {editingClassId ? 'Class Edit' : 'নতুন Class'}
              </h2>
              <button
                onClick={() => setShowClassModal(false)}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: '#F3F4F6',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveClass} style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gap: '14px' }}>
                <Field label="Class Title *">
                  <input
                    type="text"
                    value={classForm.title}
                    onChange={(e) =>
                      setClassForm({ ...classForm, title: e.target.value })
                    }
                    placeholder="যেমন: Introduction to Vector"
                    style={inputStyle}
                  />
                </Field>

                <Field label="YouTube Video Link *">
                  <input
                    type="text"
                    value={classForm.youtubeUrl}
                    onChange={(e) =>
                      setClassForm({ ...classForm, youtubeUrl: e.target.value })
                    }
                    placeholder="https://www.youtube.com/watch?v=xxxxx"
                    style={inputStyle}
                  />
                  {ytPreviewId && (
                    <div style={{
                      marginTop: '10px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      position: 'relative',
                      aspectRatio: '16/9',
                      background: '#000',
                    }}>
                      <img
                        src={`https://img.youtube.com/vi/${ytPreviewId}/hqdefault.jpg`}
                        alt="Preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: 0.85,
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: '6px',
                        left: '6px',
                        padding: '3px 8px',
                        background: 'rgba(0,0,0,0.75)',
                        color: 'white',
                        borderRadius: '50px',
                        fontSize: '10px',
                        fontWeight: '700',
                      }}>
                        ID: {ytPreviewId}
                      </div>
                    </div>
                  )}
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <Field label="Duration">
                    <input
                      type="text"
                      value={classForm.duration}
                      onChange={(e) =>
                        setClassForm({ ...classForm, duration: e.target.value })
                      }
                      placeholder="45 min"
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Order">
                    <input
                      type="number"
                      value={classForm.order}
                      onChange={(e) =>
                        setClassForm({ ...classForm, order: e.target.value })
                      }
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <Field label="Description (Optional)">
                  <textarea
                    value={classForm.description}
                    onChange={(e) =>
                      setClassForm({ ...classForm, description: e.target.value })
                    }
                    placeholder="এই Class এ..."
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </Field>

                <Field label="Notes PDF (Optional)">
                  <input
                    type="text"
                    value={classForm.notesUrl}
                    onChange={(e) =>
                      setClassForm({ ...classForm, notesUrl: e.target.value })
                    }
                    placeholder="https://drive.google.com/..."
                    style={inputStyle}
                  />
                </Field>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  style={cancelBtnStyle}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    ...primaryBtnStyle,
                    background: saving
                      ? '#9CA3AF'
                      : 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                  }}
                >
                  {saving ? '⏳...' : (
                    <>
                      <Save size={14} /> {editingClassId ? 'Update' : 'যোগ করুন'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  border: '2px solid #E5E7EB',
  borderRadius: '10px',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
  background: 'white',
  boxSizing: 'border-box',
};

const cancelBtnStyle = {
  flex: 1,
  padding: '12px',
  background: '#F3F4F6',
  color: '#2D2D3F',
  border: 'none',
  borderRadius: '50px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
};

const primaryBtnStyle = {
  flex: 1,
  padding: '12px',
  color: 'white',
  border: 'none',
  borderRadius: '50px',
  fontSize: '13px',
  fontWeight: '700',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
};

const Field = ({ label, children }) => (
  <div>
    <label style={{
      display: 'block',
      fontSize: '12px',
      fontWeight: '600',
      color: '#2D2D3F',
      marginBottom: '6px',
    }}>
      {label}
    </label>
    {children}
  </div>
);

export default AdminClasses;
