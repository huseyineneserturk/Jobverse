// Authentication API using Firebase
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';

// Backend API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Login with email and password
 */
export async function login({ email, password }) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};

    return {
      success: true,
      data: {
        user: {
          id: user.uid,
          email: user.email,
          name: userData.name || user.displayName || '',
          profilePhoto: userData.profilePhotoURL || user.photoURL || '',
          ...userData
        },
        token
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
}

/**
 * Register new user with email and password
 */
export async function register({ name, email, password }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase Auth profile
    await updateProfile(user, { displayName: name });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      createdAt: new Date().toISOString(),
      savedJobs: []
    });

    const token = await user.getIdToken();

    return {
      success: true,
      data: {
        user: {
          id: user.uid,
          email: user.email,
          name: name
        },
        token
      }
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
}

/**
 * Login with Google
 */
export async function googleLogin() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();

    // Check if user document exists, if not create it
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        name: user.displayName || '',
        email: user.email,
        profilePhotoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        savedJobs: []
      });
    }

    const userData = userDoc.exists() ? userDoc.data() : {};

    return {
      success: true,
      data: {
        user: {
          id: user.uid,
          email: user.email,
          name: user.displayName || userData.name || '',
          profilePhoto: user.photoURL || userData.profilePhotoURL || '',
          ...userData
        },
        token
      }
    };
  } catch (error) {
    console.error('Google login error:', error);
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
}

/**
 * Logout current user
 */
export async function logout() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'Çıkış yapılırken bir hata oluştu'
    };
  }
}

/**
 * Get current user token for API requests
 */
export async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

/**
 * Helper function to make authenticated API requests
 */
export async function authenticatedFetch(url, options = {}) {
  const token = await getAuthToken();

  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  });
}

/**
 * Convert Firebase error codes to Turkish messages
 */
function getErrorMessage(code) {
  const messages = {
    'auth/user-not-found': 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı',
    'auth/wrong-password': 'Hatalı şifre',
    'auth/email-already-in-use': 'Bu e-posta adresi zaten kullanılıyor',
    'auth/weak-password': 'Şifre en az 6 karakter olmalıdır',
    'auth/invalid-email': 'Geçersiz e-posta adresi',
    'auth/too-many-requests': 'Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin',
    'auth/popup-closed-by-user': 'Giriş işlemi iptal edildi',
    'auth/invalid-credential': 'E-posta veya şifre hatalı'
  };

  return messages[code] || 'Bir hata oluştu. Lütfen tekrar deneyin.';
}
