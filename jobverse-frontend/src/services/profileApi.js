// src/services/profileApi.js
// Profil yönetimi için API servisleri
// Backend entegrasyonuna hazır yapı

const API_BASE_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:3000/api';
const API_DELAY = 1000;

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
 * Profil bilgilerini güncelle
 * @param {{ name?: string, email?: string, phone?: string, bio?: string }} payload
 * @returns {Promise<{ user: any }>}
 */
export function updateProfile(payload) {
  // İLERİDE:
  // const token = localStorage.getItem('authToken');
  // return fetch(`${API_BASE_URL}/user/profile`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   },
  //   body: JSON.stringify(payload)
  // })
  //   .then((res) => {
  //     if (!res.ok) throw new Error('Profil güncellenemedi');
  //     return res.json();
  //   });

  return mockRequest(() => {
    // Mock: Başarılı güncelleme
    const updatedUser = {
      id: 1,
      name: payload.name || 'Test Deneme',
      email: payload.email || 'test@mail.com',
      phone: payload.phone || '+90 555 123 45 67',
      bio: payload.bio || '',
    };

    return { user: updatedUser };
  });
}

/**
 * Profil fotoğrafını yükle
 * @param {File} file
 * @returns {Promise<{ imageUrl: string }>}
 */
export function uploadProfilePhoto(file) {
  // İLERİDE:
  // const token = localStorage.getItem('authToken');
  // const formData = new FormData();
  // formData.append('photo', file);
  //
  // return fetch(`${API_BASE_URL}/user/profile/photo`, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${token}`
  //   },
  //   body: formData
  // })
  //   .then((res) => {
  //     if (!res.ok) throw new Error('Fotoğraf yüklenemedi');
  //     return res.json();
  //   });

  return mockRequest(() => {
    // Mock: File'dan preview URL oluştur
    const imageUrl = URL.createObjectURL(file);
    
    // Gerçek backend'de şöyle bir response döner:
    // { imageUrl: 'https://cdn.example.com/uploads/profile-photos/123.jpg' }
    
    return { imageUrl };
  });
}

/**
 * Profil fotoğrafını sil
 * @returns {Promise<{ success: boolean }>}
 */
export function deleteProfilePhoto() {
  // İLERİDE:
  // const token = localStorage.getItem('authToken');
  // return fetch(`${API_BASE_URL}/user/profile/photo`, {
  //   method: 'DELETE',
  //   headers: {
  //     'Authorization': `Bearer ${token}`
  //   }
  // })
  //   .then((res) => {
  //     if (!res.ok) throw new Error('Fotoğraf silinemedi');
  //     return res.json();
  //   });

  return mockRequest(() => ({ success: true }));
}

/**
 * Eğitim bilgilerini güncelle
 * @param {{ school?: string, department?: string, degree?: string, startDate?: string, endDate?: string, description?: string, isOngoing?: boolean }} payload
 * @returns {Promise<{ education: any }>}
 */
export function updateEducation(payload) {
  // İLERİDE:
  // const token = localStorage.getItem('authToken');
  // return fetch(`${API_BASE_URL}/user/education`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   },
  //   body: JSON.stringify(payload)
  // })
  //   .then((res) => {
  //     if (!res.ok) throw new Error('Eğitim bilgileri güncellenemedi');
  //     return res.json();
  //   });

  return mockRequest(() => {
    // Mock: Eğitim bilgilerini döndür
    const education = {
      school: payload.school || '',
      department: payload.department || '',
      degree: payload.degree || '',
      startDate: payload.startDate || '',
      endDate: payload.endDate || '',
      description: payload.description || '',
      isOngoing: payload.isOngoing || false,
    };

    return { education };
  });
}

/**
 * Şifre değiştir
 * @param {{ currentPassword: string, newPassword: string, confirmPassword?: string }} payload
 * @returns {Promise<{ success: boolean }>}
 */
export function changePassword(payload) {
  // İLERİDE:
  // const token = localStorage.getItem('authToken');
  // return fetch(`${API_BASE_URL}/user/password`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   },
  //   body: JSON.stringify(payload)
  // })
  //   .then((res) => {
  //     if (!res.ok) {
  //       return res.json().then(err => {
  //         throw new Error(err.message || 'Şifre değiştirilemedi');
  //       });
  //     }
  //     return res.json();
  //   });

  return mockRequest(() => {
    if (payload.currentPassword !== '123') {
      const error = new Error('Mevcut şifre hatalı.');
      error.status = 400;
      throw error;
    }

    return { success: true };
  });
}

export const profileApi = {
  updateProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  updateEducation,
  changePassword,
};

