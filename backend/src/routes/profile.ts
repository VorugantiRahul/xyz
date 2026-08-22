import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { profileService } from '../services/profileService';
import { logger } from '../lib/logger';

export const profileRouter = Router();

// 1. GET /api/profile/:address
profileRouter.get('/:address', (req: Request, res: Response) => {
  const address = req.params.address;
  if (!address || !address.startsWith('0x')) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  const profile = profileService.getProfile(address);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found', isNewUser: true });
  }

  return res.status(200).json(profile);
});

const profileSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  role: z.string().min(2, 'Role must be at least 2 characters').max(50),
  primarySkill: z.string().min(2, 'Primary skill is required'),
  bio: z.string().max(300).optional()
});

// 2. POST /api/profile
profileRouter.post('/', (req: Request, res: Response) => {
  try {
    const parseResult = profileSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.errors
      });
    }

    const saved = profileService.saveProfile(parseResult.data);
    return res.status(200).json(saved);
  } catch (err: any) {
    logger.error('Error saving profile:', err);
    return res.status(500).json({ error: 'Failed to save profile' });
  }
});