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
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    };

    const register = async (email, password, displayName) => {
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

        return result.user;
    };

    const loginWithGoogle = async () => {
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

        return result.user;
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
