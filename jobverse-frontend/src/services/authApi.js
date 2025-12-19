// src/services/authApi.js
// Backend entegrasyonuna hazırlık için mock auth servisleri.
// Buradaki fonksiyonlar ileride gerçek fetch/axios istekleriyle kolayca değiştirilebilir.

// Örn: ileride burayı .env'den alabilirsiniz
const API_BASE_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:3000/api';

// Tüm istekler için kullanılacak yapay gecikme (ms)
const API_DELAY = 1000;

// Ortak mock request wrapper
function mockRequest(executor) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = executor();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, API_DELAY);
  });
}

/**
 * Kullanıcı girişi
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{ user: any, token: string }>}
 */
export function login(payload) {
  // İLERİDE:
  // return fetch(`${API_BASE_URL}/auth/login`, { ... })
  //   .then((res) => res.json());

  const { email, password } = payload;

  return mockRequest(() => {
    if (email === 'test@mail.com' && password === '123') {
      const user = {
        id: 1,
        name: 'Test Kullanıcı',
        email: 'test@mail.com',
      };

      const token = 'mock-jwt-token';

      return { user, token };
    }

    const error = new Error('Email veya şifre hatalı.');
    error.status = 401;
    throw error;
  });
}

/**
 * Kayıt olma
 * @param {{ name: string, email: string, password: string }} payload
 * @returns {Promise<{ user: any, token: string }>}
 */
export function register(payload) {
  // İLERİDE:
  // return fetch(`${API_BASE_URL}/auth/register`, { ... })
  //   .then((res) => res.json());

  const { name, email, password } = payload;

  return mockRequest(() => {
    if (!name || !email || !password) {
      const error = new Error('Lütfen tüm alanları doldurun.');
      error.status = 400;
      throw error;
    }

    const user = {
      id: Date.now(),
      name,
      email,
    };

    const token = 'mock-jwt-token';

    return { user, token };
  });
}

/**
 * Çıkış yapma
 * @returns {Promise<{ success: boolean }>}
 */
export function logout() {
  // İLERİDE:
  // return fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' })
  //   .then((res) => res.json());

  return mockRequest(() => ({ success: true }));
}

/**
 * Google ile giriş/kayıt
 * Backend'den OAuth URL'i alır veya direkt OAuth popup'ı açar
 * @param {string} mode - 'signin' | 'signup' (opsiyonel, backend'e gönderilebilir)
 * @returns {Promise<{ user: any, token: string }>}
 */
export function googleLogin(mode = 'signin') {
  // İLERİDE BACKEND ENTEGRASYONU İÇİN:
  // 
  // Yöntem 1: Backend'den OAuth URL alıp redirect
  // return fetch(`${API_BASE_URL}/auth/google/url?mode=${mode}`, { method: 'GET' })
  //   .then((res) => res.json())
  //   .then((data) => {
  //     window.location.href = data.authUrl; // Backend'den gelen Google OAuth URL'i
  //   });
  //
  // Yöntem 2: Popup ile OAuth (daha modern)
  // const popup = window.open(
  //   `${API_BASE_URL}/auth/google/popup?mode=${mode}`,
  //   'google-auth',
  //   'width=500,height=600'
  // );
  // return new Promise((resolve, reject) => {
  //   const checkPopup = setInterval(() => {
  //     if (popup.closed) {
  //       clearInterval(checkPopup);
  //       // OAuth callback'den token al
  //       const token = localStorage.getItem('google_token');
  //       if (token) {
  //         resolve({ user: JSON.parse(localStorage.getItem('google_user')), token });
  //       } else {
  //         reject(new Error('Google girişi iptal edildi.'));
  //       }
  //     }
  //   }, 500);
  // });
  //
  // Yöntem 3: Backend callback URL'i ile (en yaygın)
  // Backend'den gelen URL'e yönlendir, callback'te token döner
  // window.location.href = `${API_BASE_URL}/auth/google?redirect=${encodeURIComponent(window.location.origin + '/auth/callback')}`;

  // ŞİMDİLİK MOCK: Backend hazır olunca yukarıdaki yöntemlerden birini kullan
  return mockRequest(() => {
    // Mock Google kullanıcısı
    const user = {
      id: Date.now(),
      name: 'Google Kullanıcı',
      email: 'google.user@example.com',
      provider: 'google',
    };

    const token = 'mock-google-jwt-token';

    return { user, token };
  });
}

export const authApi = {
  login,
  register,
  logout,
  googleLogin,
};


