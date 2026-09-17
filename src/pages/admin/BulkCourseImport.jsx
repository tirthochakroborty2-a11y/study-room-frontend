import { useState } from 'react';
import {
  Upload, FileText, CheckCircle2, AlertCircle, Loader,
  Download, Clipboard, Trash2, ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { bulkAddCourses, parseCSV, parseJSON } from '../../api/bulkCourseApi';

const SAMPLE_CSV = `id,name,category,subCategory,price,originalPrice,duration,instructor,cycle,type,telegramLink,shortDesc,fullDesc,image
1,ACS 27 - ফিজিক্স C1,acs27,physics,70,100,৪ মাস,অপূর্ব,C1,paid,,ACS 27 ফিজিক্স C1,সব ফিজিক্স টপিক,https://example.com/image1.jpg
2,ACS 27 - কেমিস্ট্রি C1,acs27,chemistry,70,100,৪ মাস,মাশরুর,C1,paid,,ACS 27 কেমিস্ট্রি C1,রসায়নের সব টপিক,https://example.com/image2.jpg
3,ফ্রি - ফিজিক্স বেসিক,free,physics,0,0,১ মাস,অপূর্ব,,free,https://t.me/channel,ফ্রি ফিজিক্স,বেসিক ফিজিক্স,https://example.com/image3.jpg`;

const BulkCourseImport = () => {
  const [inputText, setInputText] = useState('');
  const [format, setFormat] = useState('csv');
  const [parsedCourses, setParsedCourses] = useState([]);
  const [parseErrors, setParseErrors] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);

  const handleParse = () => {
    if (!inputText.trim()) {
      toast.error('কিছু Paste করুন বা Upload করুন');
      return;
    }

    let result;
    if (format === 'csv') {
      result = parseCSV(inputText);
    } else {
      result = parseJSON(inputText);
    }

    setParsedCourses(result.courses);
    setParseErrors(result.errors);

    if (result.courses.length > 0) {
      toast.success(`${result.courses.length} টি Course পাওয়া গেছে`);
    } else {
      toast.error('কোনো Valid Course পাওয়া যায়নি');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setInputText(text);

      if (file.name.endsWith('.json')) setFormat('json');
      else if (file.name.endsWith('.csv')) setFormat('csv');

      toast.success('File লোড হয়েছে');
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (parsedCourses.length === 0) {
      toast.error('প্রথমে Parse করুন');
      return;
    }

    if (!window.confirm(`${parsedCourses.length} টি Course Import করতে চান?`)) {
      return;
    }

    setImporting(true);
    const result = await bulkAddCourses(parsedCourses);
    setImportResults(result);
    setImporting(false);

    if (result.success > 0) {
      toast.success(`✅ ${result.success} টি Course Import হয়েছে!`);
    }
    if (result.failed > 0) {
      toast.error(`❌ ${result.failed} টি Fail হয়েছে`);
    }
  };

  const handleClear = () => {
    setInputText('');
    setParsedCourses([]);
    setParseErrors([]);
    setImportResults(null);
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample-courses.csv';
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success('Sample Downloaded');
  };

  return (
    <section style={{
      padding: '90px 0 60px',
      background: '#F8F9FE',
      minHeight: '100vh',
    }}>
      <div className="container">
        <Link to="/admin/courses" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#6C63FF',
          fontSize: '13px',
          fontWeight: '600',
          textDecoration: 'none',
          marginBottom: '16px',
        }}>
          <ArrowLeft size={14} /> Courses Page
        </Link>

        <div style={{ marginBottom: '20px' }}>
          <h1 style={{
            fontSize: 'clamp(20px, 4vw, 26px)',
            fontWeight: '800',
            color: '#2D2D3F',
            marginBottom: '4px',
          }}>
            📥 Bulk Course Import
          </h1>
          <p style={{ color: '#6B7280', fontSize: '13px' }}>
            CSV / JSON দিয়ে একসাথে অনেক Course যোগ করুন
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: '20px',
        }} className="admin-layout">
          <AdminSidebar />

          <div style={{ minWidth: 0 }}>
            {!importResults && (
              <>
                <div style={{
                  background: 'white',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '14px',
                  boxShadow: '0 6px 20px rgba(108, 99, 255, 0.06)',
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '14px',
                    flexWrap: 'wrap',
                  }}>
                    <button
                      onClick={() => setFormat('csv')}
                      style={{
                        flex: 1,
                        minWidth: '120px',
                        padding: '12px',
                        background: format === 'csv'
                          ? 'linear-gradient(135deg, #6C63FF, #5A52D5)'
                          : '#F8F9FE',
                        color: format === 'csv' ? 'white' : '#6B7280',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <FileText size={14} /> CSV Format
                    </button>
                    <button
                      onClick={() => setFormat('json')}
                      style={{
                        flex: 1,
                        minWidth: '120px',
                        padding: '12px',
                        background: format === 'json'
                          ? 'linear-gradient(135deg, #6C63FF, #5A52D5)'
                          : '#F8F9FE',
                        color: format === 'json' ? 'white' : '#6B7280',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Clipboard size={14} /> JSON Format
                    </button>
                  </div>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                    border: '2px dashed #6C63FF',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6C63FF',
                    cursor: 'pointer',
                    marginBottom: '12px',
                  }}>
                    <Upload size={16} />
                    <span>File Upload (.csv / .json)</span>
                    <input
                      type="file"
                      accept=".csv,.json"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </label>

                  <div style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#6B7280',
                    marginBottom: '12px',
                  }}>
                    — অথবা নিচে Paste করুন —
                  </div>

                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      format === 'csv'
                        ? 'CSV Format:\nid,name,category,subCategory,price,...'
                        : '[\n  {\n    "id": 1,\n    "name": "Physics"\n  }\n]'
                    }
                    rows={10}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      outline: 'none',
                      resize: 'vertical',
                      background: '#FAFBFF',
                      boxSizing: 'border-box',
                    }}
                  />

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '12px',
                    flexWrap: 'wrap',
                  }}>
                    <button
                      onClick={handleParse}
                      style={{
                        flex: 1,
                        minWidth: '120px',
                        padding: '12px',
                        background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      🔍 Parse করুন
                    </button>
                    <button
                      onClick={downloadSample}
                      style={{
                        padding: '12px 16px',
                        background: '#F8F9FE',
                        color: '#6C63FF',
                        border: '2px solid #6C63FF',
                        borderRadius: '50px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <Download size={14} /> Sample
                    </button>
                    <button
                      onClick={handleClear}
                      style={{
                        padding: '12px 16px',
                        background: '#FEE2E2',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '50px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {parseErrors.length > 0 && (
                  <div style={{
                    background: '#FEE2E2',
                    border: '2px solid #ef4444',
                    borderRadius: '14px',
                    padding: '14px',
                    marginBottom: '14px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '8px',
                    }}>
                      <AlertCircle size={16} color="#991B1B" />
                      <h3 style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#991B1B',
                      }}>
                        Errors ({parseErrors.length})
                      </h3>
                    </div>
                    <div style={{
                      maxHeight: '150px',
                      overflowY: 'auto',
                      fontSize: '12px',
                      color: '#991B1B',
                      lineHeight: '1.6',
                    }}>
                      {parseErrors.map((err, idx) => (
                        <div key={idx}>• {err}</div>
                      ))}
                    </div>
                  </div>
                )}

                {parsedCourses.length > 0 && (
                  <div style={{
                    background: 'white',
                    borderRadius: '14px',
                    padding: '16px',
                    boxShadow: '0 6px 20px rgba(108, 99, 255, 0.06)',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '800',
                        color: '#2D2D3F',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}>
                        <CheckCircle2 size={16} color="#22c55e" />
                        Preview ({parsedCourses.length})
                      </h3>
                      <button
                        onClick={handleImport}
                        disabled={importing}
                        style={{
                          padding: '12px 24px',
                          background: importing
                            ? '#9CA3AF'
                            : 'linear-gradient(135deg, #22c55e, #16a34a)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50px',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: importing ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: importing
                            ? 'none'
                            : '0 8px 25px rgba(34, 197, 94, 0.30)',
                        }}
                      >
                        {importing ? (
                          <>
                            <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                            Import হচ্ছে...
                          </>
                        ) : (
                          <>📥 {parsedCourses.length} Course Import</>
                        )}
                      </button>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                      gap: '10px',
                      maxHeight: '400px',
                      overflowY: 'auto',
                    }}>
                      {parsedCourses.slice(0, 20).map((c, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '10px',
                            background: '#F8F9FE',
                            borderRadius: '10px',
                            border: '1px solid #F3F4F6',
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginBottom: '6px',
                          }}>
                            <span style={{
                              padding: '2px 8px',
                              background: '#6C63FF',
                              color: 'white',
                              borderRadius: '50px',
                              fontSize: '10px',
                              fontWeight: '800',
                            }}>
                              #{c.id}
                            </span>
                            <span style={{
                              padding: '2px 8px',
                              background: c.type === 'free' ? '#22c55e' : '#FFC857',
                              color: 'white',
                              borderRadius: '50px',
                              fontSize: '9px',
                              fontWeight: '700',
                            }}>
                              {c.type === 'free' ? 'ফ্রি' : `৳${c.price}`}
                            </span>
                          </div>
                          <p style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#2D2D3F',
                            marginBottom: '2px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {c.name}
                          </p>
                          <p style={{ fontSize: '10px', color: '#6B7280' }}>
                            {c.category}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {importResults && (
              <div style={{
                background: 'white',
                borderRadius: '14px',
                padding: '24px',
                boxShadow: '0 10px 30px rgba(108, 99, 255, 0.08)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '60px', marginBottom: '14px' }}>
                  {importResults.success > 0 ? '🎉' : '😕'}
                </div>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#2D2D3F',
                  marginBottom: '20px',
                }}>
                  Import Complete
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '10px',
                  marginBottom: '20px',
                }}>
                  <div style={{
                    padding: '14px',
                    background: '#DCFCE7',
                    borderRadius: '10px',
                  }}>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#166534' }}>
                      {importResults.success}
                    </div>
                    <div style={{ fontSize: '11px', color: '#166534', fontWeight: '600' }}>
                      ✅ Success
                    </div>
                  </div>
                  <div style={{
                    padding: '14px',
                    background: '#FEE2E2',
                    borderRadius: '10px',
                  }}>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#991B1B' }}>
                      {importResults.failed}
                    </div>
                    <div style={{ fontSize: '11px', color: '#991B1B', fontWeight: '600' }}>
                      ❌ Failed
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}>
                  <Link
                    to="/admin/courses"
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                      color: 'white',
                      borderRadius: '50px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '700',
                      boxShadow: '0 8px 25px rgba(108, 99, 255, 0.30)',
                    }}
                  >
                    📚 Courses দেখুন
                  </Link>
                  <button
                    onClick={handleClear}
                    style={{
                      padding: '12px 24px',
                      background: 'white',
                      color: '#6C63FF',
                      border: '2px solid #6C63FF',
                      borderRadius: '50px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    🔄 আরো Import
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <style>{`
          @media (max-width: 992px) {
            .admin-layout { grid-template-columns: 1fr !important; }
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </section>
  );
};

export default BulkCourseImport;
