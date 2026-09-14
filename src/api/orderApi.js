import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  query,
  where,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { generateOrderId } from '../utils/couponUtils';

// ==================== Create Order ====================
export const createOrder = async (orderData) => {
  try {
    const orderId = generateOrderId();

    const order = {
      orderId,
      userId: orderData.userId,
      userEmail: orderData.userEmail,
      userName: orderData.userName,
      userPhoto: orderData.userPhoto,
      courseId: orderData.courseId,
      courseName: orderData.courseName,
      coursePrice: orderData.coursePrice,
      couponCode: orderData.couponCode || null,
      discount: orderData.discount || 0,
      finalPrice: orderData.finalPrice,
      paymentMethod: orderData.paymentMethod,
      senderNumber: orderData.senderNumber,
      trxId: orderData.trxId,
      telegramUsername: orderData.telegramUsername,
      status: 'pending',
      telegramLink: null,
      rejectReason: null,
      createdAt: serverTimestamp(),
      approvedAt: null,
    };

    const docRef = await addDoc(collection(db, 'orders'), order);

    const userRef = doc(db, 'users', orderData.userId);
    await updateDoc(userRef, { totalOrders: increment(1) });

    return { success: true, orderId, docId: docRef.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
};

// ==================== Get My Orders ====================
export const getMyOrders = async (userId) => {
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
    console.error('Error fetching orders:', error);
    return { success: false, error: error.message, orders: [] };
  }
};

// ==================== Get Single Order ====================
export const getOrderById = async (docId) => {
  try {
    const docRef = doc(db, 'orders', docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: 'Order পাওয়া যায়নি' };
    }

    return {
      success: true,
      order: {
        docId: docSnap.id,
        ...docSnap.data(),
      },
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { success: false, error: error.message };
  }
};

// ==================== Telegram Notification (Placeholder) ====================
export const sendTelegramNotification = async (orderData) => {
  console.log('📱 Telegram notification:', orderData);
  return { success: true };
};
