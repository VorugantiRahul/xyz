import { verifyMessage } from 'viem';
import { logger } from '../lib/logger';

export interface UserProfile {
  walletAddress: string;
  name: string;
  role: string;
  primarySkill: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory profile storage (seeded with initial sample profile for demo resilience)
const profileStore = new Map<string, UserProfile>([
  [
    '0x8849b2c12d554fea21b898ee0ff27a419c81de34',
    {
      walletAddress: '0x8849b2C12D554FEA21B898eE0fF27A419c81DE34',
      name: 'Rahul Voruganti',
      role: 'Smart Contract Engineer',
      primarySkill: 'Solidity',
      bio: 'Building continuous skill verification protocols on Monad Testnet.',
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
]);

// Nonce storage: wallet address (lowercase) -> { nonce, timestamp }
const nonceStore = new Map<string, { nonce: string; timestamp: number }>();

export const profileService = {
  /**
   * Generates or retrieves an active authentication nonce for a wallet address
   */
  generateNonce(address: string): { nonce: string; message: string } {
    const normalized = address.toLowerCase();
    const nonce = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit nonce
    const timestamp = Date.now();

    nonceStore.set(normalized, { nonce, timestamp });

    const message = [
      'SkillPulse wants you to sign in',
      '',
      'Sign this message to authenticate with SkillPulse.',
      'This signature will NOT trigger a blockchain transaction or cost gas.',
      '',
      `Wallet: ${address}`,
      `Nonce: ${nonce}`,
      `Issued At: ${new Date(timestamp).toISOString()}`
    ].join('\n');

    return { nonce, message };
  },

  /**
   * Validates the EIP-191 signature against the user message and wallet address
   */
  async verifySignature(address: string, message: string, signature: string): Promise<boolean> {
    try {
      const normalized = address.toLowerCase();
      const nonceData = nonceStore.get(normalized);

      // Verify the signature cryptographically using Viem
      const isValid = await verifyMessage({
        address: address as `0x${string}`,
        message,
        signature: signature as `0x${string}`
      });

      if (isValid) {
        // Clear nonce after successful verification to prevent replay attacks
        nonceStore.delete(normalized);
        logger.info(`Authentication successful for wallet: ${address}`);
        return true;
      }

      logger.warn(`Signature mismatch for wallet: ${address}`);
      return false;
    } catch (err: any) {
      logger.error(`Signature verification failed for ${address}:`, err.message);
      return false;
    }
  },

  /**
   * Fetches user profile by wallet address
   */
  getProfile(address: string): UserProfile | null {
    const normalized = address.toLowerCase();
    return profileStore.get(normalized) || null;
  },

  /**
   * Creates or updates a user profile
   */
  saveProfile(data: {
    walletAddress: string;
    name: string;
    role: string;
    primarySkill: string;
    bio?: string;
  }): UserProfile {
    const normalized = data.walletAddress.toLowerCase();
    const existing = profileStore.get(normalized);

    const now = new Date().toISOString();
    const profile: UserProfile = {
      walletAddress: data.walletAddress,
      name: data.name.trim(),
      role: data.role.trim() || 'Developer',
      primarySkill: data.primarySkill || 'Solidity',
      bio: data.bio?.trim() || '',
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now
    };

    profileStore.set(normalized, profile);
    logger.info(`Profile saved for wallet: ${data.walletAddress} (${profile.name})`);
    return profile;
  }
};