import express from 'express';
import cors from 'cors';
import { config } from './config/environment';
import { connectDB } from './config/database';
import './config/firebase';
import { jobRoutes, analyticsRoutes, aiRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://jobverse.tech',
    'https://www.jobverse.tech',
    config.frontendUrl
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
    await connectDB();

    app.listen(config.port, () => {
        console.log(`🚀 Server çalışıyor: http://localhost:${config.port}`);
        console.log(`📊 Environment: ${config.nodeEnv}`);
        console.log('\nMevcut API Endpoints:');
        console.log('  GET  /api/health          - Health check');
        console.log('  GET  /api/jobs            - İş ilanları listesi');
        console.log('  GET  /api/jobs/:id        - Tek iş ilanı');
        console.log('  GET  /api/jobs/filters    - Filtre seçenekleri');
        console.log('  GET  /api/analytics       - Analiz verileri');
        console.log('  GET  /api/analytics/charts - Grafik verileri');
        console.log('  POST /api/ai/* (auth)     - AI endpoints');
    });
};

startServer();
