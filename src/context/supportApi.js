import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export const getOrCreateChat = async (userId, userData) => {
  try {
    const q = query(
      collection(db, 'support_chats'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.size > 0) {
      const existing = snapshot.docs[0];
      return { success: true, chat: { docId: existing.id, ...existing.data() } };
    }

    const newChat = {
      userId,
      userName: userData?.name || 'User',
      userPhoto: userData?.photoURL || '',
      userEmail: userData?.email || '',
      lastMessage: '',
      lastMessageAt: serverTimestamp(),
      unreadByAdmin: 0,
      unreadByUser: 0,
      status: 'open',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'support_chats'), newChat);
    return { success: true, chat: { docId: docRef.id, ...newChat } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllChats = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'support_chats'));
    const chats = snapshot.docs.map((d) => ({ docId: d.id, ...d.data() }));
    chats.sort((a, b) => {
      const aT = a.lastMessageAt?.toDate?.() || new Date(0);
      const bT = b.lastMessageAt?.toDate?.() || new Date(0);
      return bT - aT;
    });
    return { success: true, chats };
  } catch (error) {
    return { success: false, error: error.message, chats: [] };
  }
};

export const sendMessage = async (chatId, messageData) => {
  try {
    const newMessage = {
      chatId,
      senderId: messageData.senderId,
      senderName: messageData.senderName,
      senderPhoto: messageData.senderPhoto || '',
      senderRole: messageData.senderRole,
      message: messageData.message.trim(),
      read: false,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'support_messages'), newMessage);

    const chatRef = doc(db, 'support_chats', chatId);
    const chatSnap = await getDoc(chatRef);
    if (chatSnap.exists()) {
      const chatData = chatSnap.data();
      const updates = {
        lastMessage: messageData.message.trim().substring(0, 50),
        lastMessageAt: serverTimestamp(),
      };
      if (messageData.senderRole === 'user') {
        updates.unreadByAdmin = (chatData.unreadByAdmin || 0) + 1;
      } else {
        updates.unreadByUser = (chatData.unreadByUser || 0) + 1;
      }
      await updateDoc(chatRef, updates);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getMessages = async (chatId) => {
  try {
    const q = query(collection(db, 'support_messages'), where('chatId', '==', chatId));
    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map((d) => ({ docId: d.id, ...d.data() }));
    messages.sort((a, b) => {
      const aT = a.createdAt?.toDate?.() || new Date(0);
      const bT = b.createdAt?.toDate?.() || new Date(0);
      return aT - bT;
    });
    return { success: true, messages };
  } catch (error) {
    return { success: false, error: error.message, messages: [] };
  }
};

export const markAsRead = async (chatId, role) => {
  try {
    const updates = role === 'admin' ? { unreadByAdmin: 0 } : { unreadByUser: 0 };
    await updateDoc(doc(db, 'support_chats', chatId), updates);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
