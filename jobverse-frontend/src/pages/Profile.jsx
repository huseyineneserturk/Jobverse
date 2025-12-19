import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { profileApi } from '../services/profileApi.js';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
  });

  const [educationData, setEducationData] = useState({
    school: '',
    department: '',
    degree: '',
    startDate: '',
    endDate: '',
    description: '',
    isOngoing: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEducationLoading, setIsEducationLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Kullanıcı bilgilerini form'a yükle
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
      });
      if (user.profileImage) {
        setProfileImagePreview(user.profileImage);
      }
      // Eğitim bilgilerini yükle
      if (user.education) {
        setEducationData({
          school: user.education.school || '',
          department: user.education.department || '',
          degree: user.education.degree || '',
          startDate: user.education.startDate || '',
          endDate: user.education.endDate || '',
          description: user.education.description || '',
          isOngoing: user.education.isOngoing || false,
        });
      }
    }
  }, [user]);

  // Fotoğraf seçme
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Fotoğraf boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Lütfen geçerli bir resim dosyası seçin.');
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  // Fotoğraf yükleme
  const handleUploadPhoto = async () => {
    if (!profileImage) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await profileApi.uploadProfilePhoto(profileImage);
      
      // Backend'den dönen imageUrl'i user'a kaydet
      const updatedUser = { ...user, profileImage: result.imageUrl };
      setUser(updatedUser);
      
      // localStorage'ı güncelle (AuthContext'teki user güncellenir)
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      
      setProfileImage(null);
      setSuccessMessage('Profil fotoğrafı başarıyla yüklendi.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Fotoğraf yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fotoğraf silme
  const handleDeletePhoto = async () => {
    if (!window.confirm('Profil fotoğrafını silmek istediğinizden emin misiniz?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await profileApi.deleteProfilePhoto();
      
      const updatedUser = { ...user };
      delete updatedUser.profileImage;
      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      
      setProfileImagePreview(null);
      setProfileImage(null);
      setSuccessMessage('Profil fotoğrafı başarıyla silindi.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Fotoğraf silinirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Form güncelleme
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  // Profil güncelleme
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await profileApi.updateProfile(formData);
      
      // Kullanıcı bilgilerini güncelle
      const updatedUser = { ...user, ...result.user };
      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      
      setSuccessMessage('Profil başarıyla güncellendi.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Profil güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Eğitim bilgileri güncelleme
  const handleEducationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEducationData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    setIsEducationLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await profileApi.updateEducation(educationData);
      
      // Kullanıcı bilgilerini güncelle
      const updatedUser = { ...user, education: result.education };
      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      
      setSuccessMessage('Eğitim bilgileri başarıyla güncellendi.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Eğitim bilgileri güncellenirken bir hata oluştu.');
    } finally {
      setIsEducationLoading(false);
    }
  };

  // Şifre değiştirme
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Şifre kontrolü
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Yeni şifreler eşleşmiyor.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    setIsPasswordLoading(true);

    try {
      await profileApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setSuccessMessage('Şifreniz başarıyla değiştirildi.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Şifre değiştirilirken bir hata oluştu.');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // Eğitim formunu sıfırla
  const handleCancelEducation = () => {
    if (user?.education) {
      setEducationData({
        school: user.education.school || '',
        department: user.education.department || '',
        degree: user.education.degree || '',
        startDate: user.education.startDate || '',
        endDate: user.education.endDate || '',
        description: user.education.description || '',
        isOngoing: user.education.isOngoing || false,
      });
    } else {
      setEducationData({
        school: '',
        department: '',
        degree: '',
        startDate: '',
        endDate: '',
        description: '',
        isOngoing: false,
      });
    }
    setError(null);
  };

  // Şifre formunu sıfırla
  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError(null);
  };

  // Avatar için ilk harfi al
  const getInitial = () => {
    return formData.name?.charAt(0)?.toUpperCase() || 'U';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Lütfen giriş yapın.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto">
        {/* Başlık Bölümü */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-1 bg-gradient-to-b from-sky-600 to-sky-500 rounded-full"></div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-200">Profil Bilgileri</h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 ml-4 transition-colors duration-200">
            Kişisel bilgilerinizi ve profil fotoğrafınızı yönetin
          </p>
        </div>

        {/* Hata/Başarı Mesajları */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 shadow-sm p-4 flex items-start gap-3 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-red-700 dark:text-red-400 transition-colors duration-200">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-xl bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 shadow-sm p-4 flex items-start gap-3 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-green-700 dark:text-green-400 transition-colors duration-200">{successMessage}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Profil Fotoğrafı Bölümü */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden transition-colors duration-200">
            <div className="px-8 py-10 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 transition-colors duration-200">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                {profileImagePreview ? (
                  <div className="relative">
                    <img
                      src={profileImagePreview}
                      alt="Profil"
                      className="h-36 w-36 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl ring-4 ring-slate-100 dark:ring-slate-700 transition-colors duration-200"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                ) : (
                  <div className="h-36 w-36 rounded-full bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl ring-4 ring-slate-100 dark:ring-slate-700 transition-colors duration-200">
                    <span className="text-5xl font-bold text-white">{getInitial()}</span>
                  </div>
                )}
                
                {/* Fotoğraf Yükleme Butonu */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="absolute bottom-0 right-0 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white p-3 rounded-full shadow-lg ring-4 ring-white dark:ring-slate-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
                  aria-label="Fotoğraf Yükle"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {/* Fotoğraf Yönetimi Butonları */}
              <div className="flex-1 w-full sm:w-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 transition-colors duration-200">Profil Fotoğrafı</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 transition-colors duration-200">
                      Profesyonel bir fotoğraf kullanarak profilinizi güçlendirin
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {profileImage && (
                      <button
                        type="button"
                        onClick={handleUploadPhoto}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {isLoading ? 'Yükleniyor...' : 'Değişiklikleri Kaydet'}
                      </button>
                    )}

                    {profileImagePreview && !profileImage && (
                      <button
                        type="button"
                        onClick={handleDeletePhoto}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 hover:border-red-400 dark:hover:border-red-500 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Fotoğrafı Kaldır
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors duration-200">
                    <span className="inline-flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Maksimum 5MB boyutunda PNG, JPG veya JPEG formatı
                    </span>
                  </p>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Kişisel Bilgiler Form Bölümü */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden p-8 space-y-7 transition-colors duration-200">
            {/* Başlık */}
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700 transition-colors duration-200">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors duration-200">
                <div className="h-6 w-1 bg-sky-600 rounded-full"></div>
                Kişisel Bilgiler
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 ml-3 transition-colors duration-200">Temel bilgilerinizi güncelleyin</p>
            </div>

            {/* Ad Soyad */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2.5 transition-colors duration-200">
                Ad Soyad <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium transition-all"
                  placeholder="Adınız ve Soyadınız"
                />
              </div>
            </div>

            {/* E-posta */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2.5 transition-colors duration-200">
                E-posta Adresi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium transition-all"
                  placeholder="ornek@mail.com"
                />
              </div>
            </div>

            {/* Telefon */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2.5 transition-colors duration-200">
                Telefon Numarası
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium transition-all"
                  placeholder="+90 555 123 45 67"
                />
              </div>
            </div>

            {/* Hakkında/Biyografi */}
            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2.5 transition-colors duration-200">
                Hakkında
              </label>
              <div className="relative">
                <textarea
                  id="bio"
                  name="bio"
                  rows="5"
                  maxLength={500}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none font-medium transition-all"
                  placeholder="Profesyonel deneyimleriniz, yetenekleriniz ve kariyer hedefleriniz hakkında kısa bir açıklama yazın..."
                />
                <div className="absolute bottom-3 right-3 bg-white dark:bg-slate-700 px-2 py-1 rounded text-xs font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 transition-colors duration-200">
                  {(formData.bio || '').length}/500
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors duration-200">
                Bu bilgi profilinizde görünecektir
              </p>
            </div>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 mt-8 border-t border-slate-200 dark:border-slate-700 transition-colors duration-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm font-medium transition-colors"
              >
                İptal
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>

          {/* Eğitim Bilgileri Bölümü */}
          <form onSubmit={handleEducationSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden p-8 space-y-7 transition-colors duration-200">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700 transition-colors duration-200">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors duration-200">
                <div className="h-6 w-1 bg-sky-600 rounded-full"></div>
                Eğitim Bilgileri
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 ml-3 transition-colors duration-200">Eğitim geçmişinizi güncelleyin</p>
            </div>

            {/* Okul */}
            <div>
              <label htmlFor="school" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2.5 transition-colors duration-200">
                Okul/Üniversite
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={educationData.school}
                  onChange={handleEducationChange}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium transition-all"
                  placeholder="Okul veya Üniversite adı"
                />
              </div>
            </div>

            {/* Bölüm ve Derece */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="department" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2.5 transition-colors duration-200">
                  Bölüm
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={educationData.department}
                  onChange={handleEducationChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium transition-all"
                  placeholder="Bölüm adı"
                />
              </div>

              <div>
                <label htmlFor="degree" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2.5 transition-colors duration-200">
                  Derece
                </label>
                <select
                  id="degree"
                  name="degree"
                  value={educationData.degree}
                  onChange={handleEducationChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium transition-all"
                >
                  <option value="">Seçiniz</option>
                  <option value="Lise">Lise</option>
                  <option value="Ön Lisans">Ön Lisans</option>
                  <option value="Lisans">Lisans</option>
                  <option value="Yüksek Lisans">Yüksek Lisans</option>
                  <option value="Doktora">Doktora</option>
                </select>
              </div>
            </div>

            {/* Tarih Aralığı */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2.5 transition-colors duration-200">
                  Başlangıç Tarihi
                </label>
                <input
                  type="month"
                  id="startDate"
                  name="startDate"
                  value={educationData.startDate}
                  onChange={handleEducationChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium transition-all"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2.5 transition-colors duration-200">
                  Bitiş Tarihi
                </label>
                <input
                  type="month"
                  id="endDate"
                  name="endDate"
                  value={educationData.endDate}
                  onChange={handleEducationChange}
                  disabled={educationData.isOngoing}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium transition-all disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
                />
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="isOngoing"
                    name="isOngoing"
                    checked={educationData.isOngoing}
                    onChange={handleEducationChange}
                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 transition-colors duration-200"
                  />
                  <label htmlFor="isOngoing" className="ml-2 text-sm text-slate-600 dark:text-slate-400 font-medium transition-colors duration-200">
                    Devam ediyor
                  </label>
                </div>
              </div>
            </div>

            {/* Açıklama */}
            <div>
              <label htmlFor="educationDescription" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2.5 transition-colors duration-200">
                Açıklama
              </label>
              <textarea
                id="educationDescription"
                name="description"
                rows="3"
                value={educationData.description}
                onChange={handleEducationChange}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none font-medium transition-all"
                placeholder="Eğitiminiz hakkında ek bilgiler (opsiyonel)"
              />
            </div>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700 transition-colors duration-200">
              <button
                type="button"
                onClick={handleCancelEducation}
                className="px-6 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm font-medium transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isEducationLoading}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isEducationLoading ? 'Kaydediliyor...' : 'Eğitim Bilgilerini Kaydet'}
              </button>
            </div>
          </form>

          {/* Şifre Değiştirme Bölümü */}
          <form onSubmit={handlePasswordSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden p-8 space-y-7 transition-colors duration-200">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700 transition-colors duration-200">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors duration-200">
                <div className="h-6 w-1 bg-sky-600 rounded-full"></div>
                Şifre Değiştir
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 ml-3 transition-colors duration-200">Hesap güvenliğiniz için şifrenizi düzenli olarak güncelleyin</p>
            </div>

            {/* Mevcut Şifre */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2.5 transition-colors duration-200">
                Mevcut Şifre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  required
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium transition-all"
                  placeholder="Mevcut şifrenizi girin"
                />
              </div>
            </div>

            {/* Yeni Şifre */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2.5 transition-colors duration-200">
                Yeni Şifre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  required
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium transition-all"
                  placeholder="Yeni şifrenizi girin (min. 6 karakter)"
                />
              </div>
            </div>

            {/* Şifre Tekrar */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2.5 transition-colors duration-200">
                Yeni Şifre Tekrar <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium transition-all"
                  placeholder="Yeni şifrenizi tekrar girin"
                />
              </div>
            </div>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700 transition-colors duration-200">
              <button
                type="button"
                onClick={handleCancelPassword}
                className="px-6 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm font-medium transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isPasswordLoading}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPasswordLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

