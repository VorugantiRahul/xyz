# SkillPulse — Architecture Specification

> **Tagline**: *"Skills change. Proof should stay alive."*

## 1. System Overview

SkillPulse is an AI-powered continuous skill verification platform. Traditional certificates and credentials provide only a historical snapshot: they prove that an individual demonstrated proficiency at a single point in time, but offer no indication of current competency. SkillPulse introduces **Living Skill Proofs** on **Monad Testnet**, maintaining dynamic skill states that reflect ongoing capability through practical AI-evaluated challenges and immutable on-chain records.

```
+-----------------------------------------------------------------------------------+
|                                 USER INTERFACE                                    |
|   (React 18 + Vite + Tailwind CSS + Wagmi + Viem | Inter / Monad Dark Theme)     |
+--------------------------+-----------------------------------+--------------------+
                           |                                   |
              HTTP / REST  |                                   |  EVM Transactions
              (JSON)       |                                   |  (JSON-RPC / Viem)
                           v                                   v
             +---------------------------+        +---------------------------+
             |      AI BACKEND API       |        |   MONAD TESTNET CONTRACT  |
             |  (Node.js / Express / AI) |        |       (SkillPulse.sol)    |
             +---------------------------+        +---------------------------+
             | - Challenge Generation    |        | - Challenge Lifecycle     |
             | - Automated Rubric Eval   |        | - Evidence Hash Registry  |
             | - Feedback & Score Digest |        | - Living Skill Proofs     |
             +---------------------------+        | - Freshness Decay Model   |
                                                  +---------------------------+
```

---

## 2. Core Paradigm: Continuous Skill Verification

A static certificate answers: *"Did you pass an assessment in the past?"*
SkillPulse answers: *"Can you demonstrate this skill today?"*

### Skill Lifecycle States

```
   [ Practical Challenge Completed ]
                  │
                  ▼
          ┌───────────────┐
          │    ACTIVE     │  (Green - Freshness: 80% - 100%)
          └───────┬───────┘
                  │  Time elapsed (> 30 days without revalidation)
                  ▼
          ┌───────────────┐
          │     AGING     │  (Amber - Freshness: 40% - 79%)
          └───────┬───────┘
                  │  Time elapsed (> 90 days without revalidation)
                  ▼
          ┌───────────────┐
          │     STALE     │  (Red - Freshness: 0% - 39%)
          └───────┬───────┘
                  │
                  └─► [ Re-verification via practical challenge resets to ACTIVE ]
```

---

## 3. End-to-End MVP Flow

The system strictly executes this 13-step critical user journey:

1. **Open SkillPulse**: User lands on the homepage.
2. **Connect Wallet**: Authenticate with MetaMask / EVM wallet on Monad Testnet (`Chain ID: 10143`).
3. **Select Skill**: Select **Solidity** (the primary on-chain verified skill).
4. **AI Generates Challenge**: Backend dynamically creates a practical challenge with explicit criteria.
5. **Display Challenge**: Frontend renders task description, level, and rubrics.
6. **Submit Evidence**: User writes and submits code/implementation.
7. **AI Evaluates Evidence**: Backend analyzes submission against challenge criteria.
8. **Display Score & Feedback**: Frontend presents score (e.g. `91/100`), confidence, strengths, and weaknesses.
9. **Click "Verify Skill"**: User initiates on-chain verification.
10. **Confirm Wallet Transaction**: Wallet prompts user to sign transaction calling `verifySkill()`.
11. **Transaction Confirmed on Monad**: Monad block commits the verification record.
12. **Passport Updates**: User's living SkillPulse Passport shows updated status (`ACTIVE`, `91/100`, `94%`).
13. **Monad Explorer Link**: Transaction hash is linked directly to the Monad block explorer.

---

## 4. Directory Structure

```
/skillpulse
  ├── /contracts          # Solidity contracts, Hardhat test suites, Monad deployment scripts
  │   ├── src/            # SkillPulse.sol
  │   ├── test/           # SkillPulse.test.cjs
  │   └── scripts/        # deploy.cjs
  ├── /backend            # Express API with AI challenge generation & code evaluation
  │   ├── src/
  │   │   ├── routes/     # challenge.js, evaluate.js
  │   │   ├── services/   # aiService.js
  │   │   ├── lib/        # constants.js
  │   │   └── server.js
  ├── /frontend           # React 18 + Tailwind CSS + Wagmi + Viem Web3 UI
  │   ├── src/
  │   │   ├── components/ # Reusable UI components
  │   │   ├── pages/      # 5 Core Pages: Landing, Dashboard, Challenge, Evidence, Passport
  │   │   ├── hooks/      # useSkillPulse.js
  │   │   ├── config/     # wagmi.js, contract.js
  │   │   └── lib/        # api.js, utils.js
  └── /docs               # Project specifications and guides
      ├── ARCHITECTURE.md
      ├── API.md
      └── BLOCKCHAIN.md
```
