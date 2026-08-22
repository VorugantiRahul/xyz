import { Router, Request, Response, NextFunction } from 'express';
import { evaluateRequestSchema } from '../lib/validator';
import { aiService } from '../services/aiService';
import { logger } from '../lib/logger';

export const evaluateRouter = Router();

/**
 * POST /api/evaluate
 * Evaluates candidate code/text submission against challenge criteria.
 */
evaluateRouter.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parseResult = evaluateRequestSchema.safeParse(req.body);

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

    const { challenge, submission } = parseResult.data;
    logger.info(`Received evaluation request. Submission length: ${submission.length} chars`);

    const evaluation = await aiService.evaluateSubmission(challenge, submission);

    res.status(200).json(evaluation);
  } catch (error) {
    next(error);
  }
});
