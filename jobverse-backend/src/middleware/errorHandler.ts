import { Request, Response, NextFunction } from 'express';

interface ApiError extends Error {
    statusCode?: number;
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Sunucu hatası oluştu';

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

/**
 * Not found handler - for undefined routes
 */
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    res.status(404).json({
        success: false,
        error: `Route bulunamadı: ${req.method} ${req.originalUrl}`,
    });
};
