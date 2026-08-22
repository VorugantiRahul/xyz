import { aiService } from '../services/aiService';

async function runDemoVerification() {
  console.log('\n======================================================');
  console.log('  SKILLPULSE DEMO: VERIFYING REAL EVIDENCE SUBMISSION');
  console.log('======================================================\n');

  const challenge = `### Challenge Objective
Design and implement a secure, gas-efficient StakingVault smart contract in Solidity (>=0.8.20) for the Monad blockchain.

### Requirements:
1. State & Storage: Maintain user balances, total staked deposits, and reward accounting.
2. Security Guarantees: Enforce Checks-Effects-Interactions (CEI) pattern and reentrancy protection.
3. Monad Gas Efficiency: Use custom errors instead of long revert strings.
4. Emergency Mechanism: Include circuit breaker (pause/unpause).
5. Events: Emit explicit events for Staked, Withdrawn, and EmergencyPaused.`;

  const candidateSubmission = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Monad Staking Vault
/// @notice Implements gas-efficient staking with reentrancy protection and custom errors
contract StakingVault {
    // Custom errors for gas efficiency on Monad
    error InsufficientBalance();
    error ZeroAmount();
    error ReentrancyGuardReentrantCall();
    error ContractPaused();
    error Unauthorized();

    address public owner;
    bool public paused;
    uint256 private _status; // 1 = unlocked, 2 = locked
    
    mapping(address => uint256) public balances;
    uint256 public totalStaked;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event EmergencyPaused(bool isPaused);

    modifier nonReentrant() {
        if (_status == 2) revert ReentrancyGuardReentrantCall();
        _status = 2;
        _;
        _status = 1;
    }

    modifier whenNotPaused() {
        if (paused) revert ContractPaused();
        _;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor() {
        owner = msg.sender;
        _status = 1;
    }

    function stake() external payable nonReentrant whenNotPaused {
        if (msg.value == 0) revert ZeroAmount();
        balances[msg.sender] += msg.value;
        totalStaked += msg.value;
        emit Staked(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (balances[msg.sender] < amount) revert InsufficientBalance();

        // Checks-Effects-Interactions (CEI) pattern
        balances[msg.sender] -= amount;
        totalStaked -= amount;

        (bool success, ) = msg.sender.call{value: amount}('');
        require(success, 'Transfer failed');

        emit Withdrawn(msg.sender, amount);
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit EmergencyPaused(_paused);
    }
}`;

  console.log('[1] Submitting candidate code to POST /api/evaluate...');
  const evaluation = await aiService.evaluateSubmission(challenge, candidateSubmission);

  console.log('\n[2] Evaluation Results:');
  console.log('------------------------------------------------------');
  console.log(`  Score:       ${evaluation.score} / 100`);
  console.log(`  Confidence:  ${evaluation.confidence} %`);
  console.log(`  Summary:     ${evaluation.summary}`);
  console.log('\n  Strengths:');
  evaluation.strengths.forEach((s) => console.log(`    ✓ ${s}`));
  console.log('\n  Weaknesses / Recommendations:');
  evaluation.weaknesses.forEach((w) => console.log(`    • ${w}`));
  console.log('------------------------------------------------------\n');
  console.log('Result Status: READY FOR MONAD ON-CHAIN VERIFICATION (verifySkill)\n');
}

runDemoVerification();
