import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export const getAllOrders = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'orders'));
    const orders = snapshot.docs.map((d) => ({ docId: d.id, ...d.data() }));
    orders.sort((a, b) => {
      const aT = a.createdAt?.toDate?.() || new Date(0);
      const bT = b.createdAt?.toDate?.() || new Date(0);
      return bT - aT;
    });
    return { success: true, orders };
  } catch (error) {
    return { success: false, error: error.message, orders: [] };
  }
};

export const approveOrder = async (docId, telegramLink) => {
  try {
    await updateDoc(doc(db, 'orders', docId), {
      status: 'approved',
      telegramLink,
      approvedAt: serverTimestamp(),
      rejectReason: null,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const rejectOrder = async (docId, rejectReason) => {
  try {
    await updateDoc(doc(db, 'orders', docId), {
      status: 'rejected',
      rejectReason,
      approvedAt: null,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteOrder = async (docId) => {
  try {
    await deleteDoc(doc(db, 'orders', docId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    const users = snapshot.docs.map((d) => ({ docId: d.id, ...d.data() }));
    users.sort((a, b) => {
      const aT = a.createdAt?.toDate?.() || new Date(0);
      const bT = b.createdAt?.toDate?.() || new Date(0);
      return bT - aT;
    });
    return { success: true, users };
  } catch (error) {
    return { success: false, error: error.message, users: [] };
  }
};

export const getUserById = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (!docSnap.exists()) return { success: false, error: 'User পাওয়া যায়নি' };
    return { success: true, user: { docId: docSnap.id, ...docSnap.data() } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserOrders = async (userId) => {
  try {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map((d) => ({ docId: d.id, ...d.data() }));
    orders.sort((a, b) => {
      const aT = a.createdAt?.toDate?.() || new Date(0);
      const bT = b.createdAt?.toDate?.() || new Date(0);
      return bT - aT;
    });
    return { success: true, orders };
  } catch (error) {
    return { success: false, error: error.message, orders: [] };
  }
};

export const toggleBlockUser = async (userId, isBlocked) => {
  try {
    await updateDoc(doc(db, 'users', userId), { isBlocked });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const changeUserRole = async (userId, role) => {
  try {
    await updateDoc(doc(db, 'users', userId), { role });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
