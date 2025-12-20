import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { storage, db } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const CVUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [cvFile, setCvFile] = useState(null);
  const [cvPreview, setCvPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [existingCV, setExistingCV] = useState(null);
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);

  // Mevcut CV'yi yükle
  useEffect(() => {
    const loadExistingCV = async () => {
      if (!user) {
        setIsLoadingExisting(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // cv objesi veya eski cvUrl alanını kontrol et
          if (userData.cv?.url || userData.cvUrl) {
            setExistingCV({
              url: userData.cv?.url || userData.cvUrl,
              fileName: userData.cv?.fileName || userData.cvFileName || 'CV.pdf',
              uploadedAt: userData.cv?.uploadedAt || userData.cvUploadedAt || null,
            });
          }
        }
      } catch (err) {
        console.error('Mevcut CV yüklenirken hata:', err);
      } finally {
        setIsLoadingExisting(false);
      }
    };

    loadExistingCV();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">CV yüklemek için giriş yapmalısınız.</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dosya tipi kontrolü (PDF, DOC, DOCX)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Lütfen PDF, DOC veya DOCX formatında bir dosya seçin.');
        return;
      }

      // Dosya boyutu kontrolü (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Dosya boyutu 10MB\'dan küçük olmalıdır.');
        return;
      }

      setCvFile(file);
      setError(null);

      // PDF önizleme için
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCvPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setCvPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!cvFile) {
      setError('Lütfen bir CV dosyası seçin.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setUploadProgress(0);

    try {
      // Firebase Storage'a yükle
      const fileExtension = cvFile.name.split('.').pop();
      const fileName = `cv_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `cvs/${user.uid}/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, cvFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (uploadError) => {
          console.error('Upload error:', uploadError);
          setError('Dosya yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
          setIsLoading(false);
        },
        async () => {
          // Yükleme tamamlandı, URL al
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Eski CV'yi sil (varsa)
          if (existingCV?.url) {
            try {
              // URL'den path'i çıkar
              const oldPath = existingCV.url.split('/o/')[1]?.split('?')[0];
              if (oldPath) {
                const decodedPath = decodeURIComponent(oldPath);
                const oldRef = ref(storage, decodedPath);
                await deleteObject(oldRef);
              }
            } catch (deleteErr) {
              console.log('Eski CV silinirken hata (devam ediliyor):', deleteErr);
            }
          }

          // Firestore'a kaydet (profileApi.js ile tutarlı cv objesi yapısı)
          await updateDoc(doc(db, 'users', user.uid), {
            cv: {
              url: downloadURL,
              fileName: cvFile.name,
              uploadedAt: new Date().toISOString(),
            },
            updatedAt: new Date().toISOString(),
          });

          setExistingCV({
            url: downloadURL,
            fileName: cvFile.name,
            uploadedAt: new Date().toISOString(),
          });

          setSuccessMessage('CV başarıyla yüklendi!');
          setCvFile(null);
          setCvPreview(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }

          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);

          setIsLoading(false);
        }
      );
    } catch (err) {
      console.error('CV yükleme hatası:', err);
      setError(err.message || 'CV yüklenirken bir hata oluştu.');
      setIsLoading(false);
    }
  };

  const handleDeleteExisting = async () => {
    if (!existingCV || !window.confirm('Mevcut CV\'nizi silmek istediğinizden emin misiniz?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Storage'dan sil
      const oldPath = existingCV.url.split('/o/')[1]?.split('?')[0];
      if (oldPath) {
        const decodedPath = decodeURIComponent(oldPath);
        const oldRef = ref(storage, decodedPath);
        await deleteObject(oldRef);
      }

      // Firestore'dan kaldır
      await updateDoc(doc(db, 'users', user.uid), {
        cv: null,
        updatedAt: new Date().toISOString(),
      });

      setExistingCV(null);
      setSuccessMessage('CV başarıyla silindi.');

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('CV silme hatası:', err);
      setError('CV silinirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    setCvFile(null);
    setCvPreview(null);
    setError(null);
    setSuccessMessage(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoadingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Başlık Bölümü */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-1 bg-gradient-to-b from-sky-600 to-sky-500 rounded-full"></div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-200">CV Yükleme</h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 ml-4 transition-colors duration-200">
            CV dosyanızı yükleyerek iş ilanlarıyla uyumluluğunuzu analiz edin
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

        {/* Mevcut CV Kartı */}
        {existingCV && (
          <div className="mb-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden transition-colors duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white transition-colors duration-200">Mevcut CV</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-200">{existingCV.fileName}</p>
                    {existingCV.uploadedAt && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        Yüklenme: {formatDate(existingCV.uploadedAt)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={existingCV.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg text-sm font-medium transition-colors"
                  >
                    Görüntüle
                  </a>
                  <button
                    onClick={handleDeleteExisting}
                    disabled={isLoading}
                    className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CV Yükleme Kartı */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden transition-colors duration-200">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2 transition-colors duration-200">
                <div className="h-6 w-1 bg-sky-600 rounded-full"></div>
                {existingCV ? 'CV Güncelle' : 'CV Dosyası Yükle'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 ml-3 transition-colors duration-200">
                PDF, DOC veya DOCX formatında CV dosyanızı yükleyin (Maksimum 10MB)
              </p>
            </div>

            {/* Dosya Seçme Alanı */}
            <div className="mb-6">
              <div
                onClick={() => !isLoading && fileInputRef.current?.click()}
                className={`border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-12 text-center cursor-pointer hover:border-sky-400 dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {cvFile ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors duration-200">{cvFile.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-200">
                        {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    >
                      Dosyayı Kaldır
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors duration-200">
                        CV dosyanızı seçin veya sürükleyip bırakın
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-200">
                        PDF, DOC, DOCX (Maksimum 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Yükleme İlerleme Çubuğu */}
            {isLoading && uploadProgress > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Yükleniyor...</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-sky-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* PDF Önizleme */}
            {cvPreview && cvFile?.type === 'application/pdf' && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 transition-colors duration-200">Önizleme</h3>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <iframe
                    src={cvPreview}
                    className="w-full h-96"
                    title="CV Önizleme"
                  />
                </div>
              </div>
            )}

            {/* Bilgilendirme */}
            <div className="mb-6 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 p-4">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-sky-700 dark:text-sky-300">
                  <p className="font-semibold mb-1">CV Yükleme Hakkında</p>
                  <ul className="list-disc list-inside space-y-1 text-sky-600 dark:text-sky-400">
                    <li>CV dosyanız Firebase'de güvenli bir şekilde saklanır</li>
                    <li>İş ilanlarıyla uyumluluğunuz otomatik analiz edilir</li>
                    <li>İstediğiniz zaman güncelleyebilir veya silebilirsiniz</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700 transition-colors duration-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm font-medium transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={!cvFile || isLoading}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Yükleniyor...
                  </>
                ) : existingCV ? 'CV Güncelle' : 'CV Yükle'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVUpload;
