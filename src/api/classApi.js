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
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

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

// ==================== CHAPTERS ====================

// Add Chapter
export const addChapter = async (data) => {
  try {
    const newChapter = {
      courseId: parseInt(data.courseId),
      title: data.title,
      description: data.description || '',
      order: parseInt(data.order) || 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'chapters'), newChapter);
    return { success: true, docId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update Chapter
export const updateChapter = async (docId, data) => {
  try {
    await updateDoc(doc(db, 'chapters', docId), {
      courseId: parseInt(data.courseId),
      title: data.title,
      description: data.description || '',
      order: parseInt(data.order) || 1,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete Chapter
export const deleteChapter = async (docId) => {
  try {
    await deleteDoc(doc(db, 'chapters', docId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get Chapters By Course
export const getChaptersByCourse = async (courseId) => {
  try {
    const q = query(
      collection(db, 'chapters'),
      where('courseId', '==', parseInt(courseId))
    );
    const snapshot = await getDocs(q);
    const chapters = snapshot.docs.map((d) => ({
      docId: d.id,
      ...d.data(),
    }));
    chapters.sort((a, b) => (a.order || 0) - (b.order || 0));
    return { success: true, chapters };
  } catch (error) {
    return { success: false, error: error.message, chapters: [] };
  }
};

// ==================== CLASSES ====================

// Add Class
export const addClass = async (classData) => {
  try {
    const youtubeId = extractYouTubeId(classData.youtubeUrl);
    if (!youtubeId) {
      return { success: false, error: 'Invalid YouTube URL' };
    }

    const newClass = {
      courseId: parseInt(classData.courseId),
      chapterId: classData.chapterId,
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
    return { success: false, error: error.message };
  }
};

// Update Class
export const updateClass = async (docId, classData) => {
  try {
    const youtubeId = extractYouTubeId(classData.youtubeUrl);
    if (!youtubeId) {
      return { success: false, error: 'Invalid YouTube URL' };
    }

    await updateDoc(doc(db, 'classes', docId), {
      courseId: parseInt(classData.courseId),
      chapterId: classData.chapterId,
      title: classData.title,
      description: classData.description || '',
      youtubeUrl: classData.youtubeUrl,
      youtubeId: youtubeId,
      duration: classData.duration || '',
      order: parseInt(classData.order) || 1,
      notesUrl: classData.notesUrl || null,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete Class
export const deleteClass = async (docId) => {
  try {
    await deleteDoc(doc(db, 'classes', docId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get Classes By Course
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
    classes.sort((a, b) => (a.order || 0) - (b.order || 0));
    return { success: true, classes };
  } catch (error) {
    return { success: false, error: error.message, classes: [] };
  }
};

// Get Classes By Chapter
export const getClassesByChapter = async (chapterId) => {
  try {
    const q = query(
      collection(db, 'classes'),
      where('chapterId', '==', chapterId)
    );
    const snapshot = await getDocs(q);
    const classes = snapshot.docs.map((d) => ({
      docId: d.id,
      ...d.data(),
    }));
    classes.sort((a, b) => (a.order || 0) - (b.order || 0));
    return { success: true, classes };
  } catch (error) {
    return { success: false, error: error.message, classes: [] };
  }
};

// Get Single Class
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
