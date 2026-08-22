# SkillPulse Project Specification

## 1. Overview
SkillPulse is a decentralized, AI-augmented skill verification platform built on the Monad network. It shifts credential verification from static credentials (degrees, badges) to dynamic, freshness-decaying on-chain skill proofs.

## 2. Core Concepts
- **Dynamic Skill Proofs**: Skills naturally decay over time unless renewed by taking practical challenges.
- **AI Evaluation**: Practical submissions are graded on multi-dimensional criteria (efficiency, security, correctness, structure) producing a verifiable score.
- **On-Chain Verification**: Verified challenges yield cryptographic evidence hashes committed to the Monad smart contract.
- **Skill Passport**: A shareable, public, decentralized proof portal showcasing real-time skill freshness and on-chain verification receipts.

## 3. Design System
- **Background**: `#08090D`
- **Surface**: `#11131A`
- **Secondary Surface**: `#171923`
- **Primary**: `#836EF9`
- **Primary Hover**: `#6F5CE7`
- **Text**: `#F5F5F7`
- **Secondary Text**: `#A5A7B4`
- **Success**: `#22C55E`
- **Warning**: `#F59E0B`
- **Danger**: `#EF4444`
- **Border**: `#272A36`
- **Typography**: Inter / Geist
- **Style**: Premium Web3 SaaS (crisp, restrained, functional, high legibility).

## 4. Frontend Architecture
- **Framework**: React 18+ (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3 Layer**: wagmi v2 + viem
- **Target Network**: Monad Testnet (Chain ID `10143`)
- **API Client**: Standardized fetch client for `/api/challenge` and `/api/evaluate`
- **Contract Functions**:
  - `createChallenge(string skill, uint8 level)`
  - `submitEvidence(bytes32 challengeId, bytes32 evidenceHash)`
  - `verifySkill(address user, string skill, uint256 score, bytes32 evidenceHash)`
  - `getSkillProof(address user, string skill)`
