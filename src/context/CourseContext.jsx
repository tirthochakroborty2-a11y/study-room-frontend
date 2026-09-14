import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../api/firebase';

const CourseContext = createContext();

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within CourseProvider');
  }
  return context;
};

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time Listener
  useEffect(() => {
    const q = query(collection(db, 'courses'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          docId: d.id,
          ...d.data(),
        }));

        // Sort by id
        data.sort((a, b) => (a.id || 0) - (b.id || 0));

        setCourses(data);
        setLoading(false);
        console.log('✅ Courses loaded:', data.length);
      },
      (err) => {
        console.error('❌ Courses error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = {
    courses,
    loading,
    error,
    refetch: () => {},
    getCourseById: (id) => courses.find((c) => c.id === parseInt(id)),
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};
