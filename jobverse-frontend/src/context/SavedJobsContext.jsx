import { createContext, useContext, useState, useEffect } from 'react';

const SavedJobsContext = createContext();

const STORAGE_KEY = 'jobverse_saved_jobs';

export function SavedJobsProvider({ children }) {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // localStorage'dan kaydedilen ilanları yükle
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedJobs(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Kaydedilen ilanlar yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // İlanı kaydet
  const saveJob = (job) => {
    try {
      const newSavedJobs = [...savedJobs];
      // Aynı ilan zaten kayıtlı mı kontrol et
      if (!newSavedJobs.find((j) => j.id === job.id)) {
        newSavedJobs.push({
          ...job,
          savedAt: new Date().toISOString(), // Kaydetme zamanı
        });
        setSavedJobs(newSavedJobs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSavedJobs));
        return { success: true };
      }
      return { success: false, message: 'İlan zaten kayıtlı' };
    } catch (error) {
      console.error('İlan kaydedilirken hata:', error);
      return { success: false, message: 'İlan kaydedilemedi' };
    }
  };

  // İlanı kayıtlardan çıkar
  const removeJob = (jobId) => {
    try {
      const newSavedJobs = savedJobs.filter((job) => job.id !== jobId);
      setSavedJobs(newSavedJobs);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSavedJobs));
      return { success: true };
    } catch (error) {
      console.error('İlan silinirken hata:', error);
      return { success: false, message: 'İlan silinemedi' };
    }
  };

  // İlan kayıtlı mı kontrol et
  const isJobSaved = (jobId) => {
    return savedJobs.some((job) => job.id === jobId);
  };

  // Tüm kayıtlı ilanları temizle
  const clearAllSavedJobs = () => {
    try {
      setSavedJobs([]);
      localStorage.removeItem(STORAGE_KEY);
      return { success: true };
    } catch (error) {
      console.error('Tüm kayıtlar silinirken hata:', error);
      return { success: false, message: 'Kayıtlar silinemedi' };
    }
  };

  const value = {
    savedJobs,
    isLoading,
    saveJob,
    removeJob,
    isJobSaved,
    clearAllSavedJobs,
  };

  return (
    <SavedJobsContext.Provider value={value}>
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error('useSavedJobs must be used within a SavedJobsProvider');
  }
  return context;
}

