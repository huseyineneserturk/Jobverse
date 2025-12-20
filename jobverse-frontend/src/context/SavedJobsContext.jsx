import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';

const SavedJobsContext = createContext();

const STORAGE_KEY = 'jobverse_saved_jobs';

export function SavedJobsProvider({ children }) {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Load saved jobs based on auth status
  useEffect(() => {
    const loadSavedJobs = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // If logged in, load from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setSavedJobs(userData.savedJobs || []);
          }
        } else {
          // If not logged in, load from localStorage
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setSavedJobs(JSON.parse(stored));
          }
        }
      } catch (error) {
        console.error('Kaydedilen ilanlar yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedJobs();
  }, [user]);

  // İlanı kaydet
  const saveJob = async (job) => {
    try {
      const jobData = {
        ...job,
        savedAt: new Date().toISOString(),
      };

      // Check if already saved
      if (savedJobs.find((j) => j.id === job.id)) {
        return { success: false, message: 'İlan zaten kayıtlı' };
      }

      const newSavedJobs = [...savedJobs, jobData];
      setSavedJobs(newSavedJobs);

      if (user) {
        // Save to Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          savedJobs: newSavedJobs
        });
      } else {
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSavedJobs));
      }

      return { success: true };
    } catch (error) {
      console.error('İlan kaydedilirken hata:', error);
      return { success: false, message: 'İlan kaydedilemedi' };
    }
  };

  // İlanı kayıtlardan çıkar
  const removeJob = async (jobId) => {
    try {
      const newSavedJobs = savedJobs.filter((job) => job.id !== jobId);
      setSavedJobs(newSavedJobs);

      if (user) {
        // Update in Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          savedJobs: newSavedJobs
        });
      } else {
        // Update in localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSavedJobs));
      }

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
  const clearAllSavedJobs = async () => {
    try {
      setSavedJobs([]);

      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          savedJobs: []
        });
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }

      return { success: true };
    } catch (error) {
      console.error('Tüm kayıtlar silinirken hata:', error);
      return { success: false, message: 'Kayıtlar silinemedi' };
    }
  };

  // Merge localStorage jobs to Firestore when user logs in
  const mergeSavedJobsOnLogin = async () => {
    try {
      if (!user) return;

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const localJobs = JSON.parse(stored);
        if (localJobs.length > 0) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const existingJobs = userDoc.exists() ? (userDoc.data().savedJobs || []) : [];

          // Merge without duplicates
          const mergedJobs = [...existingJobs];
          localJobs.forEach(localJob => {
            if (!mergedJobs.find(j => j.id === localJob.id)) {
              mergedJobs.push(localJob);
            }
          });

          await updateDoc(doc(db, 'users', user.uid), {
            savedJobs: mergedJobs
          });

          setSavedJobs(mergedJobs);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('İlanlar birleştirilirken hata:', error);
    }
  };

  const value = {
    savedJobs,
    isLoading,
    saveJob,
    removeJob,
    isJobSaved,
    clearAllSavedJobs,
    mergeSavedJobsOnLogin,
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
