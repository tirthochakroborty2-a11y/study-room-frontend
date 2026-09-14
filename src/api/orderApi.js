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

    try {
      const userRef = doc(db, 'users', orderData.userId);
      await updateDoc(userRef, { totalOrders: increment(1) });
    } catch (userUpdateError) {
      console.log('User update failed:', userUpdateError.message);
    }

    return { success: true, orderId, docId: docRef.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
};

// ==================== Send Telegram Notification ====================
export const sendTelegramNotification = async (orderData) => {
  const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const CHAT_ID = import.meta.env.VITE_TELEGRAM_ADMIN_CHAT_ID;

  console.log('📱 Telegram Config:', {
    hasToken: !!BOT_TOKEN,
    hasChatId: !!CHAT_ID,
    tokenPreview: BOT_TOKEN ? BOT_TOKEN.substring(0, 15) + '...' : 'missing',
    chatId: CHAT_ID,
  });

  if (!BOT_TOKEN || !CHAT_ID) {
    console.log('⚠️ Telegram config missing');
    return { success: false, error: 'Config missing' };
  }

  const message = `
🔔 <b>নতুন Order এসেছে!</b>
━━━━━━━━━━━━━━━━━
🧾 <b>Order:</b> ${orderData.orderId}
👤 <b>User:</b> ${orderData.userName}
📧 <b>Email:</b> ${orderData.userEmail}
📚 <b>Course:</b> ${orderData.courseName}
💰 <b>Amount:</b> ৳${orderData.finalPrice}${orderData.discount > 0 ? ` (ছাড় ৳${orderData.discount})` : ''}
${orderData.couponCode ? `🎟️ <b>Coupon:</b> ${orderData.couponCode}\n` : ''}━━━━━━━━━━━━━━━━━
🏦 <b>Payment:</b> ${orderData.paymentMethod}
📱 <b>Sender:</b> ${orderData.senderNumber}
🧾 <b>TRX ID:</b> ${orderData.trxId}
📱 <b>Telegram:</b> ${orderData.telegramUsername}
━━━━━━━━━━━━━━━━━
⏳ <b>Status:</b> Pending
`.trim();

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '👁 Admin Panel এ দেখুন',
                  url: 'https://study-room-frontend-bay.vercel.app/admin/orders',
                },
              ],
            ],
          },
        }),
      }
    );

    const data = await response.json();
    console.log('📱 Telegram Response:', data);

    if (data.ok) {
      console.log('✅ Telegram notification sent');
      return { success: true };
    } else {
      console.error('❌ Telegram error:', data.description);
      return { success: false, error: data.description };
    }
  } catch (error) {
    console.error('❌ Telegram fetch error:', error);
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
