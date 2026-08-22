# SkillPulse — Monad Testnet Blockchain Documentation

> **Role**: Developer 1 (Blockchain Engineer) Handoff  
> **Smart Contract**: `SkillPulse.sol`  
> **Network**: Monad Testnet (Chain ID: 10143)

---

## 1. Network & Deployment Summary

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Monad Testnet |
| **Chain ID** | `10143` |
| **RPC Endpoint** | `https://testnet-rpc.monad.xyz/` |
| **Native Token** | `MON` (18 Decimals) |
| **Block Explorer** | `https://testnet.monadexplorer.com` |
| **Deployed Contract** | `0x26496924b17bF32D5b8C2aF41A69e5C3d49265c7` |
| **Explorer URL** | [`https://testnet.monadexplorer.com/address/0x26496924b17bF32D5b8C2aF41A69e5C3d49265c7`](https://testnet.monadexplorer.com/address/0x26496924b17bF32D5b8C2aF41A69e5C3d49265c7) |
| **ABI File Path** | `contracts/abi/SkillPulse.json` |

---

## 2. Smart Contract Architecture

The `SkillPulse` contract serves as the source of truth for **Living Skill Proofs**. It tracks challenge states and maintains the continuous verification state of candidates for each skill.

### Data Structures

```solidity
struct Challenge {
    uint256 id;
    address candidate;
    string skill;
    bytes32 challengeHash;
    bytes32 evidenceHash;
    uint256 score;
    bool evidenceSubmitted;
    bool verified;
    uint256 lastVerified;
}

struct SkillProof {
    address candidate;
    string skill;
    uint256 score;
    bool verified;
    uint256 lastVerified;
}
```

---

## 3. Contract Functions

### Write Functions (State-Changing)

#### 1. `createChallenge(string calldata skill, bytes32 challengeHash) external returns (uint256 challengeId)`
- **Caller**: Candidate (`msg.sender`)
- **Behavior**: Allocates a new unique `challengeId` starting from 1, stores the challenge with `verified = false` and `evidenceSubmitted = false`, and emits `ChallengeCreated`.
- **Parameters**:
  - `skill`: e.g. `"Solidity"`
  - `challengeHash`: `keccak256` hash of the challenge text/criteria.

#### 2. `submitEvidence(uint256 challengeId, bytes32 evidenceHash, uint256 score) external`
- **Caller**: Candidate who initiated the challenge (`msg.sender == candidate`)
- **Behavior**: Records the `evidenceHash` and AI-evaluated `score` (0–100), sets `evidenceSubmitted = true`, and emits `EvidenceSubmitted`.
- **Reverts**:
  - `ChallengeNotFound()` if `challengeId` does not exist.
  - `Unauthorized()` if caller is not the challenge candidate.
  - `EvidenceAlreadySubmitted()` if evidence was already provided.
  - `InvalidScore()` if `score > 100`.

#### 3. `verifySkill(uint256 challengeId) external`
- **Caller**: Candidate / verifier
- **Behavior**: Marks the challenge as `verified = true`, sets `lastVerified = block.timestamp`, updates `skillProofs[candidate][skill]`, and emits `SkillVerified`.
- **Reverts**:
  - `ChallengeNotFound()` if `challengeId` does not exist.
  - `EvidenceNotSubmitted()` if `verifySkill` is called before evidence submission.

---

### Read Functions (Views)

#### 1. `getChallenge(uint256 challengeId) external view returns (Challenge memory)`
Returns the full challenge object by its numeric ID.

#### 2. `getSkillProof(address candidate, string calldata skill) external view returns (SkillProof memory)`
Returns the latest living skill proof for the given wallet address and skill name.

```typescript
// Return schema
{
  candidate: "0x...",
  skill: "Solidity",
  score: 91n,
  verified: true,
  lastVerified: 1724320000n
}
```

#### 3. `challenges(uint256) external view returns (...)`
Public getter mapping for raw challenge records.

#### 4. `skillProofs(address, string) external view returns (...)`
Public getter mapping for raw skill proof records.

---

## 4. Contract Events

```solidity
event ChallengeCreated(
    uint256 indexed challengeId,
    address indexed candidate,
    string skill
);

event EvidenceSubmitted(
    uint256 indexed challengeId,
    bytes32 evidenceHash,
    uint256 score
);

event SkillVerified(
    uint256 indexed challengeId,
    address indexed candidate,
    string skill,
    uint256 score,
    uint256 timestamp
);
```

---

## 5. Frontend Integration Guide (For Developer 2)

### Wagmi / Viem Setup

```typescript
import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';

export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz/'] },
  },
  blockExplorers: {
    default: { name: 'MonadExplorer', url: 'https://testnet.monadexplorer.com' },
  },
});
```

### Complete 3-Step Blockchain Flow:

```typescript
import { useWriteContract, useReadContract } from 'wagmi';
import { keccak256, toHex, stringToBytes } from 'viem';
import SKILLPULSE_ABI from '../abi/SkillPulse.json';

const CONTRACT_ADDRESS = '0x26496924b17bF32D5b8C2aF41A69e5C3d49265c7';

// 1. Create Challenge
const { writeContractAsync: createChallengeTx } = useWriteContract();
const challengeHash = keccak256(toHex(stringToBytes(challengeDescription)));
const tx1 = await createChallengeTx({
  address: CONTRACT_ADDRESS,
  abi: SKILLPULSE_ABI,
  functionName: 'createChallenge',
  args: ['Solidity', challengeHash],
});

// 2. Submit Evidence
const { writeContractAsync: submitEvidenceTx } = useWriteContract();
const evidenceHash = keccak256(toHex(stringToBytes(submissionCode)));
const tx2 = await submitEvidenceTx({
  address: CONTRACT_ADDRESS,
  abi: SKILLPULSE_ABI,
  functionName: 'submitEvidence',
  args: [challengeId, evidenceHash, score], // e.g. score = 91
});

// 3. Verify Skill
const { writeContractAsync: verifySkillTx } = useWriteContract();
const tx3 = await verifySkillTx({
  address: CONTRACT_ADDRESS,
  abi: SKILLPULSE_ABI,
  functionName: 'verifySkill',
  args: [challengeId],
});

// 4. Read Live Skill Proof
const { data: proof } = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: SKILLPULSE_ABI,
  functionName: 'getSkillProof',
  args: [userAddress, 'Solidity'],
});
```

---

## 6. Test Suite Verification

Run tests anytime with:
```bash
npx hardhat test
```

Test coverage includes:
1. `createChallenge`: Initial state & `ChallengeCreated` event
2. `challengeId`: Incremental unique identifier validation
3. `submitEvidence`: Valid submission & `EvidenceSubmitted` event
4. `InvalidScore`: Reverts when `score > 100`
5. `Unauthorized`: Reverts when non-candidate submits evidence
6. `EvidenceAlreadySubmitted`: Reverts on duplicate evidence submission
7. `EvidenceNotSubmitted`: Reverts if `verifySkill` is invoked prior to evidence submission
8. `verifySkill`: Sets `verified = true`, updates `lastVerified`, emits `SkillVerified`
9. `getSkillProof`: Returns accurate candidate, score, verification status, and timestamp

All **9/9 test cases** are passing.