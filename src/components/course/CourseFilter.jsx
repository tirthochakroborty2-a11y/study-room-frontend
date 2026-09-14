import { X } from 'lucide-react';
import { CATEGORIES, SUB_CATEGORIES } from '../../utils/constants';

const CourseFilter = ({
  currentType,
  setCurrentType,
  currentCategory,
  setCurrentCategory,
  currentSubCategory,
  setCurrentSubCategory,
  availableCategories,
  availableSubCategories,
  totalCount,
  onReset,
}) => {
  const typeOptions = [
    { value: 'all', label: '📚 সব' },
    { value: 'paid', label: '💳 পেইড' },
    { value: 'free', label: '🎁 ফ্রি' },
  ];

  return (
    <section style={{
      padding: '20px 0 16px',
      background: 'white',
      borderBottom: '2px solid #E5E7EB',
      marginTop: '70px',
      zIndex: 50,
      boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
    }}>
      <div className="container">
        {/* Type Filter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '12px',
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#2D2D3F',
            minWidth: '90px',
          }}>
            📌 টাইপ:
          </span>
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                setCurrentType(currentType === opt.value ? 'all' : opt.value)
              }
              style={{
                padding: '8px 20px',
                border: '2px solid',
                borderColor: currentType === opt.value ? '#6C63FF' : '#E5E7EB',
                background:
                  currentType === opt.value
                    ? opt.value === 'free'
                      ? '#22c55e'
                      : '#6C63FF'
                    : 'white',
                color:
                  currentType === opt.value
                    ? 'white'
                    : '#6B7280',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow:
                  currentType === opt.value
                    ? '0 4px 15px rgba(108, 99, 255, 0.25)'
                    : 'none',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        {availableCategories.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: currentSubCategory || availableSubCategories.length > 0 ? '12px' : '12px',
          }}>
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#2D2D3F',
              minWidth: '90px',
            }}>
              📂 ক্যাটাগরি:
            </span>
            <button
              onClick={() => setCurrentCategory('all')}
              style={{
                padding: '8px 20px',
                border: '2px solid',
                borderColor: currentCategory === 'all' ? '#6C63FF' : '#E5E7EB',
                background: currentCategory === 'all' ? '#6C63FF' : 'white',
                color: currentCategory === 'all' ? 'white' : '#6B7280',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              📂 সব
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setCurrentCategory(currentCategory === cat ? 'all' : cat)
                }
                style={{
                  padding: '8px 20px',
                  border: '2px solid',
                  borderColor: currentCategory === cat ? '#6C63FF' : '#E5E7EB',
                  background: currentCategory === cat ? '#6C63FF' : 'white',
                  color: currentCategory === cat ? 'white' : '#6B7280',
                  borderRadius: '50px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                {CATEGORIES[cat] || cat}
              </button>
            ))}
          </div>
        )}

        {/* Sub-Category Filter */}
        {currentCategory !== 'all' && availableSubCategories.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            borderTop: '1px dashed #E5E7EB',
            paddingTop: '12px',
            marginTop: '12px',
          }}>
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#2D2D3F',
              minWidth: '90px',
            }}>
              📖 সাবজেক্ট:
            </span>
            <button
              onClick={() => setCurrentSubCategory('all')}
              style={{
                padding: '8px 20px',
                border: '2px solid',
                borderColor:
                  currentSubCategory === 'all' ? '#FF6584' : '#E5E7EB',
                background:
                  currentSubCategory === 'all' ? '#FF6584' : 'white',
                color: currentSubCategory === 'all' ? 'white' : '#6B7280',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              📖 সব
            </button>
            {availableSubCategories.map((sub) => (
              <button
                key={sub}
                onClick={() =>
                  setCurrentSubCategory(currentSubCategory === sub ? 'all' : sub)
                }
                style={{
                  padding: '8px 20px',
                  border: '2px solid',
                  borderColor:
                    currentSubCategory === sub ? '#FF6584' : '#E5E7EB',
                  background:
                    currentSubCategory === sub ? '#FF6584' : 'white',
                  color: currentSubCategory === sub ? 'white' : '#6B7280',
                  borderRadius: '50px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                {SUB_CATEGORIES[sub] || sub}
              </button>
            ))}
          </div>
        )}

        {/* Status Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          marginTop: '12px',
          borderTop: '1px solid #E5E7EB',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            <span style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#6C63FF',
            }}>
              {totalCount}
            </span>{' '}
            টি কোর্স পাওয়া গেছে
          </p>

          {(currentType !== 'all' ||
            currentCategory !== 'all' ||
            currentSubCategory !== 'all') && (
            <button
              onClick={onReset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                background: '#FEE2E2',
                color: '#ef4444',
                borderRadius: '50px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.3s',
              }}
            >
              <X size={14} />
              ফিল্টার রিসেট
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CourseFilter;
