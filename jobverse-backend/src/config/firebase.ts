import * as admin from 'firebase-admin';
import { config } from './environment';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: config.firebase.projectId,
                clientEmail: config.firebase.clientEmail,
                privateKey: config.firebase.privateKey,
            }),
        });
        console.log('✅ Firebase Admin SDK başarıyla başlatıldı');
    } catch (error) {
        console.error('❌ Firebase Admin SDK başlatma hatası:', error);
    }
}

export { admin };
