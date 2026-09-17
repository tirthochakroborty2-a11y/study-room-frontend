import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== YOUTUBE ID EXTRACT ====================
export const extractYouTubeId = (url) => {
  if (!url) return null;

  // Already an ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }

  return null;
};

// ==================== ADD CLASS ====================
export const addClass = async (classData) => {
  try {
    const youtubeId = extractYouTubeId(classData.youtubeUrl);
    if (!youtubeId) {
      return { success: false, error: 'Invalid YouTube URL' };
    }

    const newClass = {
      courseId: parseInt(classData.courseId),
      title: classData.title,
      description: classData.description || '',
      youtubeUrl: classData.youtubeUrl,
      youtubeId: youtubeId,
      duration: classData.duration || '',
      order: parseInt(classData.order) || 1,
      notesUrl: classData.notesUrl || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'classes'), newClass);
    return { success: true, docId: docRef.id };
  } catch (error) {
    console.error('Add class error:', error);
    return { success: false, error: error.message };
  }
};

// ==================== UPDATE CLASS ====================
export const updateClass = async (docId, classData) => {
  try {
    const youtubeId = extractYouTubeId(classData.youtubeUrl);
    if (!youtubeId) {
      return { success: false, error: 'Invalid YouTube URL' };
    }

    const updateData = {
      courseId: parseInt(classData.courseId),
      title: classData.title,
      description: classData.description || '',
      youtubeUrl: classData.youtubeUrl,
      youtubeId: youtubeId,
      duration: classData.duration || '',
      order: parseInt(classData.order) || 1,
      notesUrl: classData.notesUrl || null,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(doc(db, 'classes', docId), updateData);
    return { success: true };
  } catch (error) {
    console.error('Update class error:', error);
    return { success: false, error: error.message };
  }
};

// ==================== DELETE CLASS ====================
export const deleteClass = async (docId) => {
  try {
    await deleteDoc(doc(db, 'classes', docId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== GET CLASSES BY COURSE ====================
export const getClassesByCourse = async (courseId) => {
  try {
    const q = query(
      collection(db, 'classes'),
      where('courseId', '==', parseInt(courseId))
    );
    const snapshot = await getDocs(q);
    const classes = snapshot.docs.map((d) => ({
      docId: d.id,
      ...d.data(),
    }));

    // Sort by order
    classes.sort((a, b) => (a.order || 0) - (b.order || 0));

    return { success: true, classes };
  } catch (error) {
    console.error('Get classes error:', error);
    return { success: false, error: error.message, classes: [] };
  }
};

// ==================== GET SINGLE CLASS ====================
export const getClassById = async (docId) => {
  try {
    const docSnap = await getDoc(doc(db, 'classes', docId));
    if (!docSnap.exists()) {
      return { success: false, error: 'Class পাওয়া যায়নি' };
    }
    return {
      success: true,
      classData: { docId: docSnap.id, ...docSnap.data() },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== UPDATE COURSE CLASS COUNT ====================
export const updateCourseClassCount = async (courseId) => {
  try {
    const q = query(
      collection(db, 'classes'),
      where('courseId', '==', parseInt(courseId))
    );
    const snapshot = await getDocs(q);
    const count = snapshot.size;

    await updateDoc(doc(db, 'courses', String(courseId)), {
      totalClasses: count,
      hasClasses: count > 0,
    });

    return { success: true, count };
  } catch (error) {
    console.error('Update count error:', error);
    return { success: false, error: error.message };
  }
};
