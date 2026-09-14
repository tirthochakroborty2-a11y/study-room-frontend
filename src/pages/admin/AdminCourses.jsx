import { useState } from 'react';
import {
  Plus, Search, Edit, Trash2, X, Save,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { CATEGORIES, SUB_CATEGORIES } from '../../utils/constants';
import { useCourses } from '../../context/CourseContext';
import { db } from '../../api/firebase';

const EMPTY_FORM = {
  name: '',
  category: 'acs27',
  subCategory: 'physics',
  price: 0,
  originalPrice: 0,
  duration: '',
  instructor: '',
  cycle: '',
  type: 'paid',
  telegramLink: '',
  shortDesc: '',
  fullDesc: '',
  image: '',
};

const AdminCourses = () => {
  const { courses, loading } = useCourses();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const filtered = courses.filter((c) => {
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    if (filterType !== 'all' && c.type !== filterType) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        c.name?.toLowerCase().includes(s) ||
        c.instructor?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const openAdd = () => {
    const nextId = courses.length > 0
      ? Math.max(...courses.map((c) => c.id || 0)) + 1
      : 1;
    setForm({ ...EMPTY_FORM, id: nextId });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (course) => {
    setForm({ ...course });
    setEditingId(course.docId);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Course name দিন');
    if (!form.image.trim()) return toast.error('Image URL দিন');
    if (form.type === 'free' && !form.telegramLink) {
      return toast.error('Free course এ Telegram link দিন');
    }

    setSaving(true);

    try {
      const courseData = {
        id: parseInt(form.id) || 0,
        name: form.name,
        category: form.category,
        subCategory: form.subCategory || null,
        price: parseInt(form.price) || 0,
        originalPrice: parseInt(form.originalPrice) || 0,
        duration: form.duration,
        instructor: form.instructor,
        cycle: form.cycle || null,
        type: form.type,
        telegramLink: form.type === 'free' ? form.telegramLink : null,
        shortDesc: form.shortDesc,
        fullDesc: form.fullDesc,
        image: form.image,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, 'courses', editingId), courseData);
        toast.success('✅ Course Update হয়েছে');
      } else {
        await addDoc(collection(db, 'courses'), {
          ...courseData,
          createdAt: serverTimestamp(),
        });
        toast.success('✅ নতুন Course যোগ হয়েছে');
      }

      setShowModal(false);
    } catch (err) {
      console.error('Save error:', err);
      toast.error('সমস্যা হয়েছে: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (docId, name) => {
    if (!window.confirm(`"${name}" মুছে ফেলতে চান?`)) return;
    try {
      await deleteDoc(doc(db, 'courses', docId));
      toast.success('মুছে ফেলা হয়েছে');
    } catch (err) {
      toast.error('সমস্যা: ' + err.message);
    }
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section style={{ padding: '100px 0 60px', background: '#F8F9FE', minHeight: '100vh' }}>
      <div className="container">
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap',
          gap: '10px', marginBottom: '24px',
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(22px, 4vw, 30px)',
              fontWeight: '800', color: '#2D2D3F', marginBottom: '6px',
            }}>
              📚 কোর্স ম্যানেজমেন্ট
            </h1>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>
              মোট <strong style={{ color: '#6C63FF' }}>{courses.length}</strong> টি কোর্স
            </p>
          </div>

          <button
            onClick={openAdd}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
              color: 'white', border: 'none', borderRadius: '50px',
              fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              boxShadow: '0 8px 25px rgba(108, 99, 255, 0.30)',
            }}
          >
            <Plus size={16} /> নতুন কোর্স
          </button>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px',
        }} className="admin-layout">
          <AdminSidebar />

          <div>
            <div style={{
              background: 'white', borderRadius: '16px',
              padding: '20px', marginBottom: '20px',
              boxShadow: '0 10px 40px rgba(108, 99, 255, 0.08)',
            }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{
                    padding: '10px 16px', border: '2px solid #E5E7EB',
                    borderRadius: '10px', fontSize: '13px',
                    fontWeight: '600', outline: 'none', cursor: 'pointer',
                  }}
                >
                  <option value="all">📂 সব ক্যাটাগরি</option>
                  {Object.entries(CATEGORIES).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{
                    padding: '10px 16px', border: '2px solid #E5E7EB',
                    borderRadius: '10px', fontSize: '13px',
                    fontWeight: '600', outline: 'none', cursor: 'pointer',
                  }}
                >
                  <option value="all">💳 সব টাইপ</option>
                  <option value="paid">💳 পেইড</option>
                  <option value="free">🎁 ফ্রি</option>
                </select>

                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                  <Search size={16} color="#6B7280" style={{
                    position: 'absolute', left: '14px', top: '50%',
                    transform: 'translateY(-50%)',
                  }} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="🔍 কোর্স / শিক্ষক..."
                    style={{
                      width: '100%', padding: '10px 16px 10px 40px',
                      border: '2px solid #E5E7EB', borderRadius: '10px',
                      fontSize: '13px', outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{
                background: 'white', borderRadius: '16px',
                padding: '60px', textAlign: 'center', color: '#6C63FF',
              }}>
                লোড হচ্ছে...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{
                background: 'white', borderRadius: '16px',
                padding: '60px 20px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>📭</div>
                <h3 style={{ fontSize: '18px', color: '#2D2D3F', marginBottom: '8px' }}>
                  কোনো কোর্স নেই
                </h3>
                <button
                  onClick={openAdd}
                  style={{
                    marginTop: '16px', padding: '12px 24px',
                    background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                    color: 'white', border: 'none', borderRadius: '50px',
                    fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                  }}
                >
                  ➕ প্রথম কোর্স যোগ করুন
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px',
              }}>
                {filtered.map((course) => (
                  <div key={course.docId} style={{
                    background: 'white', borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(108, 99, 255, 0.08)',
                  }}>
                    <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                      <img
                        src={course.image}
                        alt={course.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x200/6C63FF/FFFFFF?text=Course';
                        }}
                      />
                      <span style={{
                        position: 'absolute', top: '10px', right: '10px',
                        padding: '3px 10px',
                        background: course.type === 'free' ? '#22c55e' : '#6C63FF',
                        color: 'white', borderRadius: '50px',
                        fontSize: '10px', fontWeight: '700',
                      }}>
                        {course.type === 'free' ? '🎁 ফ্রি' : '💳 পেইড'}
                      </span>
                    </div>

                    <div style={{ padding: '16px' }}>
                      <h3 style={{
                        fontSize: '14px', fontWeight: '700', color: '#2D2D3F',
                        marginBottom: '6px', minHeight: '36px', lineHeight: '1.3',
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>
                        {course.name}
                      </h3>

                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                        <span style={{
                          padding: '2px 8px', background: '#EEF2FF', color: '#6C63FF',
                          borderRadius: '50px', fontSize: '10px', fontWeight: '600',
                        }}>
                          {CATEGORIES[course.category] || course.category}
                        </span>
                      </div>

                      <p style={{
                        fontSize: '16px', fontWeight: '800',
                        color: course.type === 'free' ? '#22c55e' : '#6C63FF',
                        marginBottom: '12px',
                      }}>
                        {course.type === 'free' ? 'ফ্রি' : `৳${course.price}`}
                      </p>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => openEdit(course)}
                          style={{
                            flex: 1, padding: '8px',
                            background: '#EEF2FF', color: '#6C63FF',
                            border: 'none', borderRadius: '8px',
                            fontSize: '12px', fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '4px',
                          }}
                        >
                          <Edit size={12} /> এডিট
                        </button>
                        <button
                          onClick={() => handleDelete(course.docId, course.name)}
                          style={{
                            padding: '8px 12px',
                            background: '#FEE2E2', color: '#991B1B',
                            border: 'none', borderRadius: '8px',
                            fontSize: '12px', fontWeight: '700',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
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

      {showModal && (
        <div
          onClick={() => !saving && setShowModal(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: '16px',
              maxWidth: '640px', width: '100%',
              maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid #E5E7EB',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              position: 'sticky', top: 0, background: 'white', zIndex: 1,
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#2D2D3F' }}>
                {editingId ? '✏️ এডিট কোর্স' : '➕ নতুন কোর্স'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: '#F3F4F6', border: 'none',
                  cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <Field label="কোর্সের নাম *">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="ACS 27 - ফিজিক্স C1"
                    style={inputStyle}
                  />
                </Field>

                <Field label="টাইপ *">
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                      { val: 'paid', label: '💳 পেইড' },
                      { val: 'free', label: '🎁 ফ্রি' },
                    ].map((t) => (
                      <button
                        key={t.val}
                        type="button"
                        onClick={() => updateField('type', t.val)}
                        style={{
                          flex: 1, padding: '10px',
                          background: form.type === t.val
                            ? (t.val === 'free' ? '#22c55e' : '#6C63FF')
                            : '#F8F9FE',
                          color: form.type === t.val ? 'white' : '#6B7280',
                          border: 'none', borderRadius: '10px',
                          fontSize: '13px', fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="ক্যাটাগরি *">
                  <select
                    value={form.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    style={inputStyle}
                  >
                    {Object.entries(CATEGORIES).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </Field>

                <Field label="সাব-ক্যাটাগরি">
                  <select
                    value={form.subCategory || ''}
                    onChange={(e) => updateField('subCategory', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">— কোনটি না —</option>
                    {Object.entries(SUB_CATEGORIES).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </Field>

                {form.type === 'paid' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <Field label="দাম (৳) *">
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) => updateField('price', e.target.value)}
                        style={inputStyle}
                      />
                    </Field>
                    <Field label="আসল দাম (৳)">
                      <input
                        type="number"
                        value={form.originalPrice}
                        onChange={(e) => updateField('originalPrice', e.target.value)}
                        style={inputStyle}
                      />
                    </Field>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Field label="সময়কাল">
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(e) => updateField('duration', e.target.value)}
                      placeholder="৪ মাস"
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="ইন্সট্রাক্টর">
                    <input
                      type="text"
                      value={form.instructor}
                      onChange={(e) => updateField('instructor', e.target.value)}
                      placeholder="অপূর্ব"
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <Field label="সাইকেল">
                  <input
                    type="text"
                    value={form.cycle}
                    onChange={(e) => updateField('cycle', e.target.value)}
                    placeholder="C1"
                    style={inputStyle}
                  />
                </Field>

                {form.type === 'free' && (
                  <Field label="Telegram Link *">
                    <input
                      type="text"
                      value={form.telegramLink}
                      onChange={(e) => updateField('telegramLink', e.target.value)}
                      placeholder="https://t.me/your_channel"
                      style={inputStyle}
                    />
                  </Field>
                )}

                <Field label="Image URL *">
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => updateField('image', e.target.value)}
                    placeholder="https://..."
                    style={inputStyle}
                  />
                  {form.image && (
                    <div style={{
                      marginTop: '8px', borderRadius: '10px',
                      overflow: 'hidden', height: '100px',
                    }}>
                      <img
                        src={form.image}
                        alt="preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </Field>

                <Field label="সংক্ষিপ্ত বর্ণনা *">
                  <textarea
                    value={form.shortDesc}
                    onChange={(e) => updateField('shortDesc', e.target.value)}
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </Field>

                <Field label="বিস্তারিত বর্ণনা">
                  <textarea
                    value={form.fullDesc}
                    onChange={(e) => updateField('fullDesc', e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </Field>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  style={{
                    flex: 1, padding: '14px', background: '#F3F4F6',
                    color: '#2D2D3F', border: 'none', borderRadius: '50px',
                    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  }}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1, padding: '14px',
                    background: saving ? '#9CA3AF'
                      : 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                    color: 'white', border: 'none', borderRadius: '50px',
                    fontSize: '14px', fontWeight: '700',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '6px',
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
      display: 'block', fontSize: '13px', fontWeight: '600',
      color: '#2D2D3F', marginBottom: '6px',
    }}>
      {label}
    </label>
    {children}
  </div>
);

export default AdminCourses;
