import { Request, Response, NextFunction } from 'express';
import { admin } from '../config/firebase';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: admin.auth.DecodedIdToken;
        }
    }
}

/**
 * Firebase token verification middleware
 * Use this for protected routes that require authentication
 */
export const verifyFirebaseToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            error: 'Yetkilendirme başlığı eksik veya geçersiz'
        });
        return;
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Token doğrulama hatası:', error);
        res.status(401).json({
            success: false,
            error: 'Geçersiz veya süresi dolmuş token'
        });
    }
};

/**
 * Optional authentication middleware
 * Attaches user to request if valid token exists, but doesn't block
 */
export const optionalAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1];
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            req.user = decodedToken;
        } catch (error) {
            // Token invalid, but we don't block - just continue without user
        }
    }
    next();
};
