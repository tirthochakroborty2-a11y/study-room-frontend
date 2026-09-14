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

// ==================== ORDERS ====================

// Get All Orders
export const getAllOrders = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'orders'));
    const orders = snapshot.docs.map((d) => ({
      docId: d.id,
      ...d.data(),
    }));
    orders.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(0);
      return bTime - aTime;
    });
    return { success: true, orders };
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return { success: false, error: error.message, orders: [] };
  }
};

// Approve Order
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
    console.error('Error approving order:', error);
    return { success: false, error: error.message };
  }
};

// Reject Order
export const rejectOrder = async (docId, rejectReason) => {
  try {
    await updateDoc(doc(db, 'orders', docId), {
      status: 'rejected',
      rejectReason,
      approvedAt: null,
    });
    return { success: true };
  } catch (error) {
    console.error('Error rejecting order:', error);
    return { success: false, error: error.message };
  }
};

// Delete Order
export const deleteOrder = async (docId) => {
  try {
    await deleteDoc(doc(db, 'orders', docId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting order:', error);
    return { success: false, error: error.message };
  }
};

// ==================== USERS ====================

// Get All Users
export const getAllUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    const users = snapshot.docs.map((d) => ({
      docId: d.id,
      ...d.data(),
    }));
    users.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(0);
      return bTime - aTime;
    });
    return { success: true, users };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: error.message, users: [] };
  }
};

// Get Single User
export const getUserById = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (!docSnap.exists()) {
      return { success: false, error: 'User পাওয়া যায়নি' };
    }
    return {
      success: true,
      user: { docId: docSnap.id, ...docSnap.data() },
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: error.message };
  }
};

// Get User Orders
export const getUserOrders = async (userId) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map((d) => ({
      docId: d.id,
      ...d.data(),
    }));
    orders.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(0);
      return bTime - aTime;
    });
    return { success: true, orders };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return { success: false, error: error.message, orders: [] };
  }
};

// Toggle Block User
export const toggleBlockUser = async (userId, isBlocked) => {
  try {
    await updateDoc(doc(db, 'users', userId), { isBlocked });
    return { success: true };
  } catch (error) {
    console.error('Error toggling block:', error);
    return { success: false, error: error.message };
  }
};

// Change User Role
export const changeUserRole = async (userId, role) => {
  try {
    await updateDoc(doc(db, 'users', userId), { role });
    return { success: true };
  } catch (error) {
    console.error('Error changing role:', error);
    return { success: false, error: error.message };
  }
};
