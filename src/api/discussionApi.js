import {
  collection,
  addDoc,
  query,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== ADD POST ====================
export const addPost = async (postData) => {
  try {
    const newPost = {
      userId: postData.userId,
      userName: postData.userName,
      userPhoto: postData.userPhoto || '',
      userRole: postData.userRole || 'user',
      title: postData.title.trim(),
      content: postData.content.trim(),
      category: postData.category || 'general',
      likes: 0,
      likedBy: [],
      repliesCount: 0,
      pinned: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'discussions'), newPost);
    return { success: true, docId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== GET ALL POSTS ====================
export const getAllPosts = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'discussions'));
    const posts = snapshot.docs.map((d) => ({
      docId: d.id,
      ...d.data(),
    }));

    // Sort: Pinned first, then newest
    posts.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      const aTime = a.createdAt?.toDate?.() || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(0);
      return bTime - aTime;
    });

    return { success: true, posts };
  } catch (error) {
    return { success: false, error: error.message, posts: [] };
  }
};

// ==================== DELETE POST ====================
export const deletePost = async (docId) => {
  try {
    await deleteDoc(doc(db, 'discussions', docId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== TOGGLE LIKE ====================
export const togglePostLike = async (docId, userId, likedBy) => {
  try {
    const isLiked = likedBy.includes(userId);
    const newLikedBy = isLiked
      ? likedBy.filter((id) => id !== userId)
      : [...likedBy, userId];

    await updateDoc(doc(db, 'discussions', docId), {
      likes: newLikedBy.length,
      likedBy: newLikedBy,
    });

    return { success: true, liked: !isLiked };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== PIN POST (Admin Only) ====================
export const togglePinPost = async (docId, currentPinned) => {
  try {
    await updateDoc(doc(db, 'discussions', docId), {
      pinned: !currentPinned,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== REPLIES ====================

// Add Reply
export const addReply = async (replyData) => {
  try {
    const newReply = {
      postId: replyData.postId,
      userId: replyData.userId,
      userName: replyData.userName,
      userPhoto: replyData.userPhoto || '',
      userRole: replyData.userRole || 'user',
      message: replyData.message.trim(),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'discussion_replies'), newReply);

    // Update reply count
    const postRef = doc(db, 'discussions', replyData.postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      await updateDoc(postRef, {
        repliesCount: (postSnap.data().repliesCount || 0) + 1,
      });
    }

    return { success: true, docId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get Replies By Post
export const getRepliesByPost = async (postId) => {
  try {
    const snapshot = await getDocs(collection(db, 'discussion_replies'));
    const replies = snapshot.docs
      .map((d) => ({ docId: d.id, ...d.data() }))
      .filter((r) => r.postId === postId);

    replies.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(0);
      return aTime - bTime;
    });

    return { success: true, replies };
  } catch (error) {
    return { success: false, error: error.message, replies: [] };
  }
};

// Delete Reply
export const deleteReply = async (docId, postId) => {
  try {
    await deleteDoc(doc(db, 'discussion_replies', docId));

    const postRef = doc(db, 'discussions', postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      await updateDoc(postRef, {
        repliesCount: Math.max(0, (postSnap.data().repliesCount || 1) - 1),
      });
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
