import { Router, Request, Response } from 'express';
import { aiService } from '../services/aiService';

export const healthRouter = Router();

/**
 * GET /api/health
 * Health check endpoint for container / server monitoring
 */
healthRouter.get('/', (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'healthy',
    service: 'skillpulse-backend',
    version: '1.0.0',
    aiConfigured: aiService.isConfigured(),
    timestamp: new Date().toISOString()
  });
});
