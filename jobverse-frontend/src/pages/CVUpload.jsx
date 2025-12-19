import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const CVUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [cvFile, setCvFile] = useState(null);
  const [cvPreview, setCvPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 text-lg">Lütfen giriş yapın.</p>
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

    try {
      // Mock API çağrısı - Backend entegrasyonu için hazır
      // const formData = new FormData();
      // formData.append('cv', cvFile);
      // const response = await fetch('/api/cv/upload', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      
      // Şimdilik mock response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage('CV başarıyla yüklendi.');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.message || 'CV yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('CV dosyasını silmek istediğinizden emin misiniz?')) {
      setCvFile(null);
      setCvPreview(null);
      setError(null);
      setSuccessMessage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
            CV dosyanızı yükleyerek iş başvurularınızı kolaylaştırın
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

        {/* CV Yükleme Kartı */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden transition-colors duration-200">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2 transition-colors duration-200">
                <div className="h-6 w-1 bg-sky-600 rounded-full"></div>
                CV Dosyası Yükle
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 ml-3 transition-colors duration-200">
                PDF, DOC veya DOCX formatında CV dosyanızı yükleyin (Maksimum 10MB)
              </p>
            </div>

            {/* Dosya Seçme Alanı */}
            <div className="mb-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-12 text-center cursor-pointer hover:border-sky-400 dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
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
                    <li>CV dosyanız güvenli bir şekilde saklanır</li>
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
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Yükleniyor...' : 'CV Yükle'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVUpload;

