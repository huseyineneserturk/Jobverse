import mongoose from 'mongoose';
import { config } from './environment';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('✅ MongoDB bağlantısı başarılı');
    } catch (error) {
        console.error('❌ MongoDB bağlantı hatası:', error);
        process.exit(1);
    }
};
