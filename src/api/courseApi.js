import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== Get All Courses ====================
export const getAllCourses = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'courses'));
    const courses = snapshot.docs.map((d) => ({
      docId: d.id,
      ...d.data(),
    }));
    courses.sort((a, b) => (a.id || 0) - (b.id || 0));
    return { success: true, courses };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message, courses: [] };
  }
};

// ==================== Get Single Course ====================
export const getCourseById = async (docId) => {
  try {
    const snap = await getDoc(doc(db, 'courses', docId));
    if (!snap.exists()) return { success: false, error: 'পাওয়া যায়নি' };
    return { success: true, course: { docId: snap.id, ...snap.data() } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== Add Course ====================
export const addCourse = async (courseData) => {
  try {
    const docRef = await addDoc(collection(db, 'courses'), {
      ...courseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, docId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== Update Course ====================
export const updateCourse = async (docId, courseData) => {
  try {
    await updateDoc(doc(db, 'courses', docId), {
      ...courseData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== Delete Course ====================
export const deleteCourse = async (docId) => {
  try {
    await deleteDoc(doc(db, 'courses', docId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
