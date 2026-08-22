import { defineChain, keccak256, toHex, getAddress } from 'viem';

// Monad Testnet Chain Definition
export const monadTestnet = defineChain({
  id: Number(import.meta.env.VITE_CHAIN_ID || 10143),
  name: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MonadExplorer',
      url: import.meta.env.VITE_EXPLORER_URL || 'https://testnet.monadexplorer.com',
    },
  },
  testnet: true,
});

// Central Contract Address with robust EIP-55 normalization
const rawContractAddress = (import.meta.env.VITE_CONTRACT_ADDRESS || '0x26496924B17BF32d5b8C2AF41a69e5C3d49265c7').trim();
export const SKILLPULSE_CONTRACT_ADDRESS: `0x${string}` = (() => {
  try {
    return getAddress(rawContractAddress);
  } catch {
    return '0x26496924B17BF32d5b8C2AF41a69e5C3d49265c7' as `0x${string}`;
  }
})();

export const MONAD_EXPLORER_URL = import.meta.env.VITE_EXPLORER_URL || 'https://testnet.monadexplorer.com';

// SkillPulse Contract ABI
export const SKILLPULSE_ABI = [
  {
    type: 'function',
    name: 'createChallenge',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'skill', type: 'string' },
      { name: 'level', type: 'uint8' },
    ],
    outputs: [{ name: 'challengeId', type: 'bytes32' }],
  },
  {
    type: 'function',
    name: 'submitEvidence',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'challengeId', type: 'bytes32' },
      { name: 'evidenceHash', type: 'bytes32' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'verifySkill',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'skill', type: 'string' },
      { name: 'score', type: 'uint256' },
      { name: 'evidenceHash', type: 'bytes32' },
    ],
    outputs: [{ name: 'verified', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'getSkillProof',
    stateMutability: 'view',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'skill', type: 'string' },
    ],
    outputs: [
      {
        name: 'proof',
        type: 'tuple',
        components: [
          { name: 'user', type: 'address' },
          { name: 'skill', type: 'string' },
          { name: 'score', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'evidenceHash', type: 'bytes32' },
          { name: 'isValid', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'event',
    name: 'ChallengeCreated',
    inputs: [
      { name: 'challengeId', type: 'bytes32', indexed: true },
      { name: 'user', type: 'address', indexed: true },
      { name: 'skill', type: 'string', indexed: false },
      { name: 'level', type: 'uint8', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'EvidenceSubmitted',
    inputs: [
      { name: 'challengeId', type: 'bytes32', indexed: true },
      { name: 'evidenceHash', type: 'bytes32', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'SkillVerified',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'skill', type: 'string', indexed: false },
      { name: 'score', type: 'uint256', indexed: false },
      { name: 'evidenceHash', type: 'bytes32', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const;

/**
 * Creates a deterministic keccak256 hash of a code/text submission.
 * Ensures that large code payloads are represented compactly and immutably on-chain.
 */
export function hashEvidence(content: string): `0x${string}` {
  const normalized = content.trim();
  return keccak256(toHex(normalized));
}

/**
 * Creates a deterministic challengeId hash based on user, skill, and timestamp.
 */
export function generateChallengeId(user: string, skill: string): `0x${string}` {
  const payload = `${user.toLowerCase()}-${skill.toLowerCase()}-${Date.now()}`;
  return keccak256(toHex(payload));
}

/**
 * Helper to construct Monad explorer link for a transaction or address.
 */
export function getExplorerUrl(type: 'tx' | 'address', value: string): string {
  const baseUrl = MONAD_EXPLORER_URL.replace(/\/+$/, '');
  return `${baseUrl}/${type}/${value}`;
}