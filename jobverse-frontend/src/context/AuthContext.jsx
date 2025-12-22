import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    const userData = userDoc.exists() ? userDoc.data() : {};

                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName || userData.displayName || '',
                        photoURL: firebaseUser.photoURL || userData.photoURL || '',
                        ...userData
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName || '',
                        photoURL: firebaseUser.photoURL || ''
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: result.user };
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Giriş yapılırken bir hata oluştu.';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Şifre hatalı.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Geçersiz e-posta adresi.';
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'E-posta veya şifre hatalı.';
            }
            return { success: false, error: errorMessage };
        }
    };

    const register = async (email, password, displayName) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            if (displayName) {
                await updateProfile(result.user, { displayName });
            }

            await setDoc(doc(db, 'users', result.user.uid), {
                email,
                displayName: displayName || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            return { success: true, user: result.user };
        } catch (error) {
            console.error('Register error:', error);
            let errorMessage = 'Kayıt olurken bir hata oluştu.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Bu e-posta adresi zaten kullanılıyor.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Şifre çok zayıf. En az 6 karakter kullanın.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Geçersiz e-posta adresi.';
            }
            return { success: false, error: errorMessage };
        }
    };

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            const userDoc = await getDoc(doc(db, 'users', result.user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', result.user.uid), {
                    email: result.user.email,
                    displayName: result.user.displayName || '',
                    photoURL: result.user.photoURL || '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }

            return { success: true, user: result.user };
        } catch (error) {
            console.error('Google login error:', error);
            let errorMessage = 'Google ile giriş yapılırken bir hata oluştu.';
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Giriş penceresi kapatıldı.';
            } else if (error.code === 'auth/cancelled-popup-request') {
                errorMessage = 'Giriş işlemi iptal edildi.';
            }
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    const value = {
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
