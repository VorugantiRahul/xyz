import { Router, Request, Response, NextFunction } from 'express';
import { challengeRequestSchema } from '../lib/validator';
import { aiService } from '../services/aiService';
import { logger } from '../lib/logger';

export const challengeRouter = Router();

/**
 * POST /api/challenge
 * Generates a practical skill challenge based on skill and level.
 */
challengeRouter.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parseResult = challengeRequestSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
      return;
    }

    const { skill, level } = parseResult.data;
    logger.info(`Received challenge request for skill: ${skill}, level: ${level}`);

    const challenge = await aiService.generateChallenge(skill, level);

    res.status(200).json(challenge);
  } catch (error) {
    next(error);
  }
});
