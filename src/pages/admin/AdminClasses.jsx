import { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, X, Save, Youtube, Eye, ExternalLink, Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useCourses } from '../../context/CourseContext';
import {
  addClass, updateClass, deleteClass, getClassesByCourse,
  extractYouTubeId,
} from '../../api/classApi';

const EMPTY_FORM = {
  courseId: '',
  title: '',
  description: '',
  youtubeUrl: '',
  duration: '',
  order: 1,
  notesUrl: '',
};

const AdminClasses = () => {
  const { courses, loading: coursesLoading } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [previewId, setPreviewId] = useState(null);

  // Load classes when course changes
  useEffect(() => {
    if (selectedCourse) {
      loadClasses();
    } else {
      setClasses([]);
    }
    // eslint-disable-next-line
  }, [selectedCourse]);

  const loadClasses = async () => {
    setLoading(true);
    const result = await getClassesByCourse(selectedCourse);
    if (result.success) setClasses(result.classes);
    setLoading(false);
  };

  const openAdd = () => {
    if (!selectedCourse) {
      toast.error('আগে Course Select করুন');
      return;
    }
    const nextOrder = classes.length > 0
      ? Math.max(...classes.map((c) => c.order || 0)) + 1
      : 1;

    setForm({
      ...EMPTY_FORM,
      courseId: selectedCourse,
      order: nextOrder,
    });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (cls) => {
    setForm({
      courseId: cls.courseId,
      title: cls.title,
      description: cls.description || '',
      youtubeUrl: cls.youtubeUrl,
      duration: cls.duration || '',
      order: cls.order || 1,
      notesUrl: cls.notesUrl || '',
    });
    setEditingId(cls.docId);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Class Title দিন');
    if (!form.youtubeUrl.trim()) return toast.error('YouTube Link দিন');

    const ytId = extractYouTubeId(form.youtubeUrl);
    if (!ytId) return toast.error('সঠিক YouTube Link দিন');

    setSaving(true);

    let result;
    if (editingId) {
      result = await updateClass(editingId, form);
    } else {
      result = await addClass(form);
    }

    if (result.success) {
      toast.success(editingId ? '✅ Class Update হয়েছে' : '✅ নতুন Class যোগ হয়েছে');
      setShowModal(false);
      loadClasses();
    } else {
      toast.error(result.error || 'সমস্যা হয়েছে');
    }

    setSaving(false);
  };

  const handleDelete = async (docId, title) => {
    if (!window.confirm(`"${title}" Class মুছে ফেলতে চান?`)) return;
    const result = await deleteClass(docId);
    if (result.success) {
      toast.success('Class মুছে ফেলা হয়েছে');
      loadClasses();
    } else {
      toast.error('সমস্যা হয়েছে');
    }
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectedCourseData = courses.find((c) => c.id === parseInt(selectedCourse));
  const ytPreviewId = extractYouTubeId(form.youtubeUrl);

  return (
    <section style={{
      padding: '100px 0 60px',
      background: '#F8F9FE',
      minHeight: '100vh',
    }}>
      <div className="container">
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: 'clamp(22px, 4vw, 30px)',
            fontWeight: '800',
            color: '#2D2D3F',
            marginBottom: '6px',
          }}>
            🎓 ক্লাস ম্যানেজমেন্ট
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Course এর Class যোগ করুন (YouTube Link দিয়ে)
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: '24px',
        }} className="admin-layout">
          <AdminSidebar />

          <div>
            {/* Course Selector */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 10px 40px rgba(108, 99, 255, 0.08)',
            }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
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
                  padding: '12px 16px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
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
                  marginTop: '16px',
                  padding: '12px',
                  background: '#EEF2FF',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}>
                  <img
                    src={selectedCourseData.image}
                    alt=""
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#2D2D3F',
                      marginBottom: '2px',
                    }}>
                      {selectedCourseData.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6C63FF', fontWeight: '600' }}>
                      📹 {classes.length} টি Class
                    </p>
                  </div>
                  <button
                    onClick={openAdd}
                    style={{
                      padding: '10px 18px',
                      background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 6px 20px rgba(108, 99, 255, 0.25)',
                    }}
                  >
                    <Plus size={14} /> নতুন Class
                  </button>
                </div>
              )}
            </div>

            {/* Classes List */}
            {!selectedCourse ? (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '80px 20px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>🎓</div>
                <h3 style={{ fontSize: '18px', color: '#2D2D3F', marginBottom: '8px' }}>
                  Course Select করুন
                </h3>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>
                  উপরে থেকে Course Select করলে Class List দেখা যাবে
                </p>
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
            ) : classes.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '60px 20px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>📹</div>
                <h3 style={{ fontSize: '18px', color: '#2D2D3F', marginBottom: '8px' }}>
                  এই Course এ কোনো Class নেই
                </h3>
                <button
                  onClick={openAdd}
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
                  ➕ প্রথম Class যোগ করুন
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {classes.map((cls, idx) => (
                  <div
                    key={cls.docId}
                    style={{
                      background: 'white',
                      borderRadius: '14px',
                      padding: '16px',
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'center',
                      boxShadow: '0 6px 20px rgba(108, 99, 255, 0.06)',
                      border: '2px solid #F3F4F6',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#6C63FF';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(108, 99, 255, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#F3F4F6';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(108, 99, 255, 0.06)';
                    }}
                  >
                    {/* Order Badge */}
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: '800',
                      flexShrink: 0,
                      boxShadow: '0 6px 15px rgba(108, 99, 255, 0.30)',
                    }}>
                      {cls.order || idx + 1}
                    </div>

                    {/* Thumbnail */}
                    <div style={{
                      width: '120px',
                      height: '70px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: '#F3F4F6',
                      position: 'relative',
                    }}>
                      <img
                        src={`https://img.youtube.com/vi/${cls.youtubeId}/mqdefault.jpg`}
                        alt={cls.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/120x70/6C63FF/FFFFFF?text=YT';
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.3)',
                      }}>
                        <Youtube size={24} color="white" />
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#2D2D3F',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {cls.title}
                      </h3>
                      {cls.duration && (
                        <p style={{
                          fontSize: '12px',
                          color: '#6B7280',
                          marginBottom: '2px',
                        }}>
                          ⏱ {cls.duration}
                        </p>
                      )}
                      <p style={{
                        fontSize: '11px',
                        color: '#9CA3AF',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        🎬 {cls.youtubeId}
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <a
                        href={`https://www.youtube.com/watch?v=${cls.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="YouTube এ দেখুন"
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: '#FEE2E2',
                          color: '#991B1B',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none',
                        }}
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => openEdit(cls)}
                        title="Edit"
                        style={{
                          width: '36px',
                          height: '36px',
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
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cls.docId, cls.title)}
                        title="Delete"
                        style={{
                          width: '36px',
                          height: '36px',
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
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <style>{`
          @media (max-width: 992px) {
            .admin-layout { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          onClick={() => !saving && setShowModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#2D2D3F' }}>
                {editingId ? '✏️ Class Edit' : '➕ নতুন Class'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#F3F4F6',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <Field label="Class Title *">
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="যেমন: Introduction to Physics"
                    style={inputStyle}
                  />
                </Field>

                <Field label="YouTube Video Link *">
                  <input
                    type="text"
                    value={form.youtubeUrl}
                    onChange={(e) => updateField('youtubeUrl', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=xxxxx"
                    style={inputStyle}
                  />
                  <p style={{
                    fontSize: '11px',
                    color: '#6B7280',
                    marginTop: '4px',
                  }}>
                    💡 youtube.com/watch, youtu.be, embed সব Format কাজ করবে
                  </p>

                  {/* YouTube Preview */}
                  {ytPreviewId && (
                    <div style={{
                      marginTop: '12px',
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
                        bottom: '8px',
                        left: '8px',
                        padding: '4px 10px',
                        background: 'rgba(0,0,0,0.75)',
                        color: 'white',
                        borderRadius: '50px',
                        fontSize: '11px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <Youtube size={12} /> Video ID: {ytPreviewId}
                      </div>
                    </div>
                  )}
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Field label="Duration">
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(e) => updateField('duration', e.target.value)}
                      placeholder="45 min"
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Class Order">
                    <input
                      type="number"
                      value={form.order}
                      onChange={(e) => updateField('order', e.target.value)}
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <Field label="Description (Optional)">
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="এই Class এ যা যা থাকবে..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </Field>

                <Field label="Notes PDF Link (Optional)">
                  <input
                    type="text"
                    value={form.notesUrl}
                    onChange={(e) => updateField('notesUrl', e.target.value)}
                    placeholder="https://drive.google.com/..."
                    style={inputStyle}
                  />
                </Field>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: '#F3F4F6',
                    color: '#2D2D3F',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: saving
                      ? '#9CA3AF'
                      : 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {saving ? '⏳ সেভ হচ্ছে...' : (
                    <>
                      <Save size={16} /> {editingId ? 'Update' : 'যোগ করুন'}
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
};

const Field = ({ label, children }) => (
  <div>
    <label style={{
      display: 'block',
      fontSize: '13px',
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
