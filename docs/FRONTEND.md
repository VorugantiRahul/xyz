# SkillPulse Frontend Documentation

## 1. Overview
SkillPulse frontend provides a high-performance, polished Web3 user interface for taking skill challenges, receiving AI-driven grading, and recording cryptographic skill proofs on Monad Testnet.

## 2. Local Setup
```bash
# Navigate to project directory
cd skillpulse

# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 3. Environment Variables
Copy `.env.example` to `.env` and set the following configuration variables:
```env
# Smart Contract Address on Monad Testnet
VITE_CONTRACT_ADDRESS=0x9a676E4B1FBEFE93370C157E0e633C1488c0a88A

# Chain ID (10143 for Monad Testnet)
VITE_CHAIN_ID=10143

# SkillPulse Backend API URL
VITE_API_URL=http://localhost:3000

# Monad Testnet Explorer URL
VITE_EXPLORER_URL=https://testnet.monadexplorer.com
```

## 4. Smart Contract Integration
The application interfaces with the SkillPulse contract deployed on Monad Testnet (`Chain ID: 10143`) via `viem` and `wagmi`.

- **Configuration File**: `src/config/contracts.ts`
- **Supported Methods**:
  - `createChallenge(string skill, uint8 level)`: Registers a new challenge request.
  - `submitEvidence(bytes32 challengeId, bytes32 evidenceHash)`: Records the deterministic SHA-256 / Keccak-256 hash of the code submission on-chain.
  - `verifySkill(address user, string skill, uint256 score, bytes32 evidenceHash)`: Commits the verified skill score and timestamp to the user's on-chain passport.
  - `getSkillProof(address user, string skill)`: Fetches current on-chain score, timestamp, verification transaction, and decay status.

## 5. Network Information
- **Network Name**: Monad Testnet
- **Chain ID**: `10143` (Hex: `0x279f`)
- **Currency**: `MON`
- **RPC URL**: `https://testnet-rpc.monad.xyz`
- **Block Explorer**: `https://testnet.monadexplorer.com`

## 6. Production Deployment
- **Recommended Host**: Vercel / Netlify / Cloudflare Pages
- **Build Output Directory**: `dist`
- **Build Command**: `npm run build`
