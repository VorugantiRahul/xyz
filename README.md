# SkillPulse — Dynamic On-Chain Skill Verification Protocol

> **"Skills change. Proof should stay alive."**

SkillPulse is a decentralized, AI-augmented skill verification platform built on the Monad network. It shifts credential verification from static badges and diplomas to dynamic, freshness-decaying on-chain skill proofs.

---

## Key Features

- ⚡ **Dynamic Freshness Decay**: Skill proofs feature real-time decay states (`ACTIVE`, `AGING`, `STALE`), encouraging continuous learning and re-verification.
- 🤖 **AI Evaluation Rubrics**: Practical coding challenges are analyzed on multi-dimensional rubrics (security, efficiency, structural patterns).
- ⛓️ **Monad Testnet Attestation**: Deterministically hashes code submissions (`keccak256`) and anchors verified proofs directly to the Monad smart contract (`Chain ID: 10143`).
- 🪪 **Public Skill Passport**: High-fidelity, shareable on-chain competency passport with cryptographic proof receipts and block explorer links.
- 🎨 **Design System**: Tailored Web3 SaaS theme matching exact brand specifications.

---

## Tech Stack

- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS
- **Web3**: wagmi v2, viem, @tanstack/react-query
- **Icons**: Lucide React
- **Network**: Monad Testnet (`10143`)

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/VorugantiRahul/xyz.git
cd xyz
npm install
```

### 2. Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_CONTRACT_ADDRESS=0x9a676E4B1FBEFE93370C157E0e633C1488c0a88A
VITE_CHAIN_ID=10143
VITE_API_URL=http://localhost:3000
VITE_EXPLORER_URL=https://testnet.monadexplorer.com
```

### 3. Run Locally

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## Smart Contract Integration

Contract interaction is handled via `src/config/contracts.ts` and `src/hooks/useSkillContract.ts`.

- `createChallenge(string skill, uint8 level)`
- `submitEvidence(bytes32 challengeId, bytes32 evidenceHash)`
- `verifySkill(address user, string skill, uint256 score, bytes32 evidenceHash)`
- `getSkillProof(address user, string skill)`

---

## License

MIT License
