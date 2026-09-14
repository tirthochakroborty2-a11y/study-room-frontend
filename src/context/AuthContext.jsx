import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../api/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ⚠️ Wait for Auth State to Sync
const waitForAuth = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // ==================== GOOGLE LOGIN ====================
  const loginWithGoogle = async () => {
    if (loginLoading) return { success: false, error: 'Already logging in' };

    try {
      setLoginLoading(true);

      console.log('🔐 Starting Google Login...');
      const result = await signInWithPopup(auth, googleProvider);
      const loggedUser = result.user;
      console.log('✅ Popup Success:', loggedUser.email);

      // ⚠️ CRITICAL: Wait for Auth State to Sync
      const syncedUser = await waitForAuth();
      console.log('🔄 Auth State Synced:', syncedUser?.email);

      // ⚠️ Set User Immediately
      setUser(syncedUser || loggedUser);

      // Firestore User Document Check/Create
      const userRef = doc(db, 'users', loggedUser.uid);
      let userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const newUserData = {
          uid: loggedUser.uid,
          name: loggedUser.displayName,
          email: loggedUser.email,
          photoURL: loggedUser.photoURL,
          role: 'user',
          phone: '',
          isBlocked: false,
          totalOrders: 0,
          totalSpent: 0,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        };
        await setDoc(userRef, newUserData);
        setUserData(newUserData);
        console.log('✅ New User Created');
      } else {
        const existingData = userSnap.data();
        await setDoc(
          userRef,
          { lastLogin: serverTimestamp() },
          { merge: true }
        );
        setUserData({ ...existingData, lastLogin: new Date() });
        console.log('✅ Existing User Updated');
      }

      setLoginModalOpen(false);
      setLoginLoading(false);
      setLoading(false);

      toast.success(
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={loggedUser.photoURL}
            alt="user"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '2px solid #22c55e',
            }}
          />
          <div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#166534' }}>
              লগইন সফল! 🎉
            </div>
            <div style={{ fontSize: '12px', color: '#166534' }}>
              স্বাগতম, {loggedUser.displayName}
            </div>
          </div>
        </div>,
        {
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
            color: '#166534',
            border: '2px solid #22c55e',
            borderRadius: '14px',
            padding: '12px 16px',
            boxShadow: '0 10px 40px rgba(34, 197, 94, 0.25)',
          },
        }
      );

      return { success: true, user: loggedUser };
    } catch (error) {
      console.error('❌ Login error:', error);
      setLoginLoading(false);
      setLoading(false);

      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error(
          <div>
            <div style={{ fontWeight: '700', fontSize: '14px' }}>
              ❌ লগইন ব্যর্থ
            </div>
            <div style={{ fontSize: '12px' }}>
              আবার চেষ্টা করুন
            </div>
          </div>,
          {
            duration: 4000,
            style: {
              background: 'linear-gradient(135deg, #FEE2E2, #FECACA)',
              color: '#991B1B',
              border: '2px solid #ef4444',
              borderRadius: '14px',
              padding: '12px 16px',
            },
          }
        );
      }
      return { success: false, error: error.message };
    }
  };

  // ==================== LOGOUT ====================
  const logout = async () => {
    try {
      const name = user?.displayName;

      // ⚠️ Clear state first
      setUser(null);
      setUserData(null);

      await signOut(auth);

      toast.success(
        <div>
          <div style={{ fontWeight: '700', fontSize: '14px', color: '#6C63FF' }}>
            👋 লগআউট সম্পন্ন
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>
            আবার আসবেন, {name}!
          </div>
        </div>,
        {
          duration: 3500,
          style: {
            background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
            color: '#2D2D3F',
            border: '2px solid #6C63FF',
            borderRadius: '14px',
            padding: '12px 16px',
          },
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // ==================== REQUIRE LOGIN ====================
  const requireLogin = (message = 'এই কাজটি করতে লগইন করুন') => {
    toast.error(
      <div>
        <div style={{ fontWeight: '700', fontSize: '14px', color: '#991B1B' }}>
          🔐 লগইন প্রয়োজন
        </div>
        <div style={{ fontSize: '12px', color: '#991B1B', marginTop: '2px' }}>
          {message}
        </div>
      </div>,
      {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
          color: '#92400e',
          border: '2px solid #FFC857',
          borderRadius: '14px',
          padding: '12px 16px',
        },
      }
    );
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => setLoginModalOpen(false);

  // ==================== AUTH STATE LISTENER ====================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('🔄 Auth State Changed:', currentUser?.email || 'None');
      setUser(currentUser);

      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userData,
    loading,
    loginLoading,
    loginWithGoogle,
    logout,
    requireLogin,
    loginModalOpen,
    closeLoginModal,
    isAdmin: userData?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
