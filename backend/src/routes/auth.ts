import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { profileService } from '../services/profileService';
import { logger } from '../lib/logger';

export const authRouter = Router();

// 1. GET /api/auth/nonce?address=0x...
authRouter.get('/nonce', (req: Request, res: Response) => {
  const address = req.query.address as string;
  if (!address || !address.startsWith('0x') || address.length !== 42) {
    return res.status(400).json({ error: 'Valid EVM wallet address is required' });
  }

  const nonceData = profileService.generateNonce(address);
  return res.status(200).json({
    nonce: nonceData.nonce,
    message: nonceData.message
  });
});

const verifySchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  message: z.string().min(1, 'Message is required'),
  signature: z.string().min(1, 'Signature is required')
});

// 2. POST /api/auth/verify
authRouter.post('/verify', async (req: Request, res: Response) => {
  try {
    const parseResult = verifySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.errors
      });
    }

    const { address, message, signature } = parseResult.data;
    const isValid = await profileService.verifySignature(address, message, signature);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature. Please try signing in again.' });
    }

    const profile = profileService.getProfile(address);
    const isNewUser = !profile;

    return res.status(200).json({
      verified: true,
      isNewUser,
      user: profile || {
        walletAddress: address,
        name: '',
        role: 'Developer',
        primarySkill: 'Solidity',
        createdAt: new Date().toISOString()
      },
      token: `sp_session_${Buffer.from(`${address}:${Date.now()}`).toString('base64')}`
    });
  } catch (err: any) {
    logger.error('Auth verification error:', err);
    return res.status(500).json({ error: 'Internal server error during verification' });
  }
});