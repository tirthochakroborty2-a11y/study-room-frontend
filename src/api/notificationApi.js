import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== CREATE NOTIFICATION ====================
export const createNotification = async (data) => {
  try {
    const newNotif = {
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || 'info', // info | success | warning | order
      link: data.link || null,
      read: false,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'notifications'), newNotif);
    return { success: true, docId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== GET USER NOTIFICATIONS ====================
export const getUserNotifications = async (userId) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const notifications = snapshot.docs.map((d) => ({
      docId: d.id,
      ...d.data(),
    }));

    notifications.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(0);
      return bTime - aTime;
    });

    return { success: true, notifications };
  } catch (error) {
    return { success: false, error: error.message, notifications: [] };
  }
};

// ==================== MARK AS READ ====================
export const markNotificationRead = async (docId) => {
  try {
    await updateDoc(doc(db, 'notifications', docId), { read: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== MARK ALL READ ====================
export const markAllRead = async (notifications) => {
  try {
    for (const notif of notifications) {
      if (!notif.read) {
        await updateDoc(doc(db, 'notifications', notif.docId), { read: true });
      }
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== DELETE NOTIFICATION ====================
export const deleteNotification = async (docId) => {
  try {
    await deleteDoc(doc(db, 'notifications', docId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== SEND TO ALL USERS ====================
export const sendToAllUsers = async (title, message, type = 'info') => {
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    let count = 0;
    for (const userDoc of usersSnap.docs) {
      await addDoc(collection(db, 'notifications'), {
        userId: userDoc.id,
        title,
        message,
        type,
        link: null,
        read: false,
        createdAt: serverTimestamp(),
      });
      count++;
    }
    return { success: true, count };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
