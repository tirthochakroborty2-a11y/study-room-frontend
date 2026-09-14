import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import CourseFilter from '../components/course/CourseFilter';
import CourseCard from '../components/course/CourseCard';
import { useCourses } from '../context/CourseContext';

const Courses = () => {
  const [searchParams] = useSearchParams();
  const { courses, loading } = useCourses();

  const [currentType, setCurrentType] = useState(
    searchParams.get('type') || 'all'
  );
  const [currentCategory, setCurrentCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [currentSubCategory, setCurrentSubCategory] = useState('all');

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (currentType !== 'all') {
      result = result.filter((c) => c.type === currentType);
    }
    if (currentCategory !== 'all') {
      result = result.filter((c) => c.category === currentCategory);
    }
    if (currentSubCategory !== 'all') {
      result = result.filter((c) => c.subCategory === currentSubCategory);
    }

    return result;
  }, [courses, currentType, currentCategory, currentSubCategory]);

  const availableCategories = useMemo(() => {
    const typeFiltered =
      currentType === 'all'
        ? courses
        : courses.filter((c) => c.type === currentType);

    const uniqueCats = [...new Set(typeFiltered.map((c) => c.category))];
    return uniqueCats.filter((c) => c !== 'free' || currentType === 'free');
  }, [courses, currentType]);

  const availableSubCategories = useMemo(() => {
    if (currentCategory === 'all') return [];

    const catFiltered = courses.filter((c) => c.category === currentCategory);
    const uniqueSubs = [
      ...new Set(catFiltered.map((c) => c.subCategory).filter(Boolean)),
    ];
    return uniqueSubs;
  }, [courses, currentCategory]);

  const handleReset = () => {
    setCurrentType('all');
    setCurrentCategory('all');
    setCurrentSubCategory('all');
  };

  const handleTypeChange = (val) => {
    setCurrentType(val);
    setCurrentCategory('all');
    setCurrentSubCategory('all');
  };

  const handleCategoryChange = (val) => {
    setCurrentCategory(val);
    setCurrentSubCategory('all');
  };

  return (
    <>
      <CourseFilter
        currentType={currentType}
        setCurrentType={handleTypeChange}
        currentCategory={currentCategory}
        setCurrentCategory={handleCategoryChange}
        currentSubCategory={currentSubCategory}
        setCurrentSubCategory={setCurrentSubCategory}
        availableCategories={availableCategories}
        availableSubCategories={availableSubCategories}
        totalCount={filteredCourses.length}
        onReset={handleReset}
      />

      <section style={{ padding: '40px 0 80px', minHeight: '50vh' }}>
        <div className="container">
          {loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '80px 0',
              gap: '16px',
            }}>
              <Loader size={40} color="#6C63FF" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ color: '#6C63FF' }}>কোর্স লোড হচ্ছে...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : courses.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(108, 99, 255, 0.08)',
            }}>
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>📚</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#2D2D3F', marginBottom: '8px' }}>
                এখনো কোনো কোর্স নেই
              </h3>
              <p style={{ color: '#6B7280', fontSize: '14px' }}>
                শীঘ্রই কোর্স যোগ করা হবে
              </p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(108, 99, 255, 0.08)',
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#2D2D3F', marginBottom: '8px' }}>
                কোনো কোর্স পাওয়া যায়নি
              </h3>
              <p style={{ color: '#6B7280', fontSize: '15px' }}>
                অন্য ফিল্টার দিয়ে চেষ্টা করুন
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '30px',
            }}>
              {filteredCourses.map((course) => (
                <CourseCard key={course.docId} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Courses;
