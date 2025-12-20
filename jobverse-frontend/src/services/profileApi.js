// Profile API using Firebase Firestore and Storage
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, db, storage } from '../config/firebase';

/**
 * Get current user profile from Firestore
 */
export async function getProfile() {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Kullanıcı oturumu bulunamadı' };
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      return { success: false, error: 'Profil bulunamadı' };
    }

    return {
      success: true,
      data: {
        id: user.uid,
        email: user.email,
        ...userDoc.data()
      }
    };
  } catch (error) {
    console.error('getProfile error:', error);
    return { success: false, error: 'Profil alınırken hata oluştu' };
  }
}

/**
 * Update user profile in Firestore
 */
export async function updateProfile(payload) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Kullanıcı oturumu bulunamadı' };
    }

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      ...payload,
      updatedAt: new Date().toISOString()
    });

    // Get updated data
    const updatedDoc = await getDoc(userRef);

    return {
      success: true,
      data: {
        id: user.uid,
        email: user.email,
        ...updatedDoc.data()
      },
      message: 'Profil başarıyla güncellendi'
    };
  } catch (error) {
    console.error('updateProfile error:', error);
    return { success: false, error: 'Profil güncellenirken hata oluştu' };
  }
}

/**
 * Upload profile photo to Firebase Storage
 */
export async function uploadProfilePhoto(file) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Kullanıcı oturumu bulunamadı' };
    }

    // Create storage reference
    const fileExtension = file.name.split('.').pop();
    const storageRef = ref(storage, `profile-photos/${user.uid}.${fileExtension}`);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Update user document with photo URL
    await updateDoc(doc(db, 'users', user.uid), {
      profilePhotoURL: downloadURL,
      updatedAt: new Date().toISOString()
    });

    return {
      success: true,
      data: { imageUrl: downloadURL },
      message: 'Profil fotoğrafı başarıyla yüklendi'
    };
  } catch (error) {
    console.error('uploadProfilePhoto error:', error);
    return { success: false, error: 'Fotoğraf yüklenirken hata oluştu' };
  }
}

/**
 * Delete profile photo from Firebase Storage
 */
export async function deleteProfilePhoto() {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Kullanıcı oturumu bulunamadı' };
    }

    // Get current photo URL to find the file
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    if (userData?.profilePhotoURL) {
      try {
        // Try to delete the file from storage
        const photoRef = ref(storage, userData.profilePhotoURL);
        await deleteObject(photoRef);
      } catch (deleteError) {
        // File might not exist, continue anyway
        console.warn('Photo delete warning:', deleteError);
      }
    }

    // Remove photo URL from user document
    await updateDoc(doc(db, 'users', user.uid), {
      profilePhotoURL: null,
      updatedAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Profil fotoğrafı silindi'
    };
  } catch (error) {
    console.error('deleteProfilePhoto error:', error);
    return { success: false, error: 'Fotoğraf silinirken hata oluştu' };
  }
}

/**
 * Update education information in Firestore
 */
export async function updateEducation(educationData) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Kullanıcı oturumu bulunamadı' };
    }

    await updateDoc(doc(db, 'users', user.uid), {
      education: educationData,
      updatedAt: new Date().toISOString()
    });

    return {
      success: true,
      data: { education: educationData },
      message: 'Eğitim bilgileri güncellendi'
    };
  } catch (error) {
    console.error('updateEducation error:', error);
    return { success: false, error: 'Eğitim bilgileri güncellenirken hata oluştu' };
  }
}

/**
 * Change user password
 */
export async function changePassword({ currentPassword, newPassword }) {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      return { success: false, error: 'Kullanıcı oturumu bulunamadı' };
    }

    // Re-authenticate user first
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);

    return {
      success: true,
      message: 'Şifre başarıyla değiştirildi'
    };
  } catch (error) {
    console.error('changePassword error:', error);

    if (error.code === 'auth/wrong-password') {
      return { success: false, error: 'Mevcut şifre hatalı' };
    }
    if (error.code === 'auth/weak-password') {
      return { success: false, error: 'Yeni şifre en az 6 karakter olmalıdır' };
    }

    return { success: false, error: 'Şifre değiştirilirken hata oluştu' };
  }
}

/**
 * Upload CV to Firebase Storage
 */
export async function uploadCV(file) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Kullanıcı oturumu bulunamadı' };
    }

    // Create storage reference with original filename
    const storageRef = ref(storage, `cvs/${user.uid}/${file.name}`);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Update user document with CV info
    await updateDoc(doc(db, 'users', user.uid), {
      cv: {
        url: downloadURL,
        fileName: file.name,
        uploadedAt: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    });

    return {
      success: true,
      data: {
        cvUrl: downloadURL,
        fileName: file.name
      },
      message: 'CV başarıyla yüklendi'
    };
  } catch (error) {
    console.error('uploadCV error:', error);
    return { success: false, error: 'CV yüklenirken hata oluştu' };
  }
}

/**
 * Delete CV from Firebase Storage
 */
export async function deleteCV() {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Kullanıcı oturumu bulunamadı' };
    }

    // Get current CV info
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    if (userData?.cv?.url) {
      try {
        const cvRef = ref(storage, userData.cv.url);
        await deleteObject(cvRef);
      } catch (deleteError) {
        console.warn('CV delete warning:', deleteError);
      }
    }

    // Remove CV from user document
    await updateDoc(doc(db, 'users', user.uid), {
      cv: null,
      updatedAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'CV silindi'
    };
  } catch (error) {
    console.error('deleteCV error:', error);
    return { success: false, error: 'CV silinirken hata oluştu' };
  }
}
