import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { challengeRouter } from './routes/challenge';
import { evaluateRouter } from './routes/evaluate';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';
import { profileRouter } from './routes/profile';
import { logger } from './lib/logger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) or matching frontend
      if (!origin || origin === FRONTEND_URL || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for hackathon development
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '1mb' }));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Primary API Routes
app.use('/api/challenge', challengeRouter);
app.use('/api/evaluate', evaluateRouter);
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);

// Root Index
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'SkillPulse AI & Backend API',
    tagline: 'Skills change. Proof should stay alive.',
    endpoints: {
      challenge: 'POST /api/challenge',
      evaluate: 'POST /api/evaluate',
      health: 'GET /api/health',
      authNonce: 'GET /api/auth/nonce',
      authVerify: 'POST /api/auth/verify',
      profile: 'GET /api/profile/:address, POST /api/profile'
    }
  });
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Centralized Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

// Server Initialization
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`SkillPulse Backend running on port ${PORT}`);
    logger.info(`Ready for Developer 2 (Frontend) integration at: http://localhost:${PORT}`);
  });
}

export default app;