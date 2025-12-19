import React, { createContext, useContext, useEffect, useState } from 'react';

// Context nesnesi
const AuthContext = createContext(null);

// localStorage'da kullanacağımız key
const STORAGE_KEY = 'authUser';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Uygulama ilk açıldığında localStorage'dan kullanıcıyı oku
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('AuthContext localStorage okuma hatası:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mock login fonksiyonu
  const login = async (email, password) => {
    setError(null);

    // Backend henüz olmadığı için setTimeout ile küçük bir gecikme simüle edelim
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (email === 'test@mail.com' && password === '123') {
      const loggedInUser = {
        id: 1,
        name: 'Test Deneme',
        email: 'test@mail.com',
      };

      setUser(loggedInUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
      return { success: true, user: loggedInUser };
    } else {
      const errMsg = 'Email veya şifre hatalı.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Google OAuth ile giriş (backend'den dönen user ve token ile)
  const loginWithGoogle = (userData, token) => {
    setError(null);
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    // Token'ı da ayrı bir yerde saklayabilirsiniz: localStorage.setItem('authToken', token);
    return { success: true, user: userData };
  };

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    loginWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Context'i kullanmak için custom hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth, AuthProvider içinde kullanılmalıdır.');
  }
  return ctx;
}


