import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // MongoDB
    mongoUri: process.env.MONGO_URI || '',

    // Firebase Admin SDK
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID || '',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    },

    // Gemini AI
    geminiApiKey: process.env.GEMINI_API_KEY || '',

    // CORS
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
