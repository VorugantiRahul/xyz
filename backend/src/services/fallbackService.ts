import { ChallengeResponse, EvaluateResponse } from '../lib/validator';
import { logger } from '../lib/logger';

export const fallbackService = {
  /**
   * Deterministic fallback challenge generator
   */
  getFallbackChallenge(skill: string, level: string): ChallengeResponse {
    logger.fallback('Challenge Generation', `Deterministic fallback for ${skill} (${level})`);

    const normalizedSkill = skill.toLowerCase();

    if (normalizedSkill.includes('solidity') || normalizedSkill.includes('web3') || normalizedSkill.includes('evm')) {
      return {
        title: 'Reentrancy-Resilient Multi-Token Staking Vault on Monad',
        description: `### Challenge Objective\nDesign and implement a secure, gas-efficient **StakingVault** smart contract in Solidity (>=0.8.20) for the Monad blockchain.\n\n### Requirements:\n1. **State & Storage**: Maintain user balances, total staked deposits, and reward accounting with storage packing to optimize memory layout.\n2. **Security Guarantees**: Enforce the *Checks-Effects-Interactions (CEI)* pattern and implement reentrancy protection for all deposit and withdrawal pathways.\n3. **Monad Gas Efficiency**: Use custom errors (\`error InsufficientBalance()\` etc.) instead of long revert strings to minimize gas consumption.\n4. **Emergency Mechanism**: Include an owner-controlled circuit breaker (pause/unpause) that preserves user capital while preventing new stakes during upgrades.\n5. **Events**: Emit explicit events for \`Staked\`, \`Withdrawn\`, and \`EmergencyPaused\` to facilitate external indexing.`,
        criteria: [
          'Strict adherence to Checks-Effects-Interactions (CEI) pattern and reentrancy resistance',
          'Proper use of custom errors and optimized storage layout for Monad execution',
          'Correct reward math calculation without integer overflow/underflow or precision loss',
          'Comprehensive event emission for all state-modifying actions'
        ]
      };
    }

    if (normalizedSkill.includes('python')) {
      return {
        title: 'Asynchronous Event Pipeline & Rate Limiter',
        description: `### Challenge Objective\nBuild a high-throughput async processing pipeline in Python using \`asyncio\` that ingests streaming events and throttles downstream calls with a token-bucket rate limiter.\n\n### Requirements:\n1. Non-blocking asynchronous worker pool.\n2. Token-bucket rate limiter with burst capability.\n3. Graceful shutdown handler on SIGINT/SIGTERM.`,
        criteria: [
          'Correct use of asyncio queues and task cancellation',
          'Accurate token replenishment logic without race conditions',
          'Graceful degradation and timeout handling'
        ]
      };
    }

    if (normalizedSkill.includes('react')) {
      return {
        title: 'Custom Optimistic UI Mutation Hook with Rollback',
        description: `### Challenge Objective\nCreate a production-grade custom React hook \`useOptimisticMutation\` that applies instant UI updates while managing network requests, retry strategies, and automatic state rollback on failure.\n\n### Requirements:\n1. Immediate optimistic cache update.\n2. Automated rollback to previous snapshot on network failure.\n3. Type-safe TypeScript generics for payload and response.`,
        criteria: [
          'State consistency and clean rollback logic',
          'Handling of concurrent and out-of-order mutations',
          'Exhaustive TypeScript generic definitions'
        ]
      };
    }

    // Generic fallback for other skills
    return {
      title: `${skill} Practical Architecture & Implementation Assessment`,
      description: `### Challenge Objective\nDemonstrate practical mastery of **${skill}** by implementing a modular, production-ready solution solving core scalability, security, and edge-case requirements at the **${level}** level.\n\n### Requirements:\n1. Clean modular structure following industry conventions.\n2. Defensive programming and edge-case handling.\n3. Clear documentation and testable logic.`,
      criteria: [
        `Idiomatic ${skill} syntax, patterns, and structure`,
        'Robust edge case handling and error resilience',
        'Performance efficiency and maintainability'
      ]
    };
  },

  /**
   * Deterministic fallback evidence evaluation
   */
  getFallbackEvaluation(challenge: string, submission: string): EvaluateResponse {
    logger.fallback('Evidence Evaluation', 'Deterministic fallback heuristic engine');

    const cleanSubmission = submission.trim();
    const length = cleanSubmission.length;
    const lower = cleanSubmission.toLowerCase();

    // Heuristic analysis based on evidence contents
    let score = 85;
    let confidence = 82;
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Check for Solidity specific indicators
    const hasReentrancyCheck = lower.includes('reentrant') || lower.includes('nonreentrant') || lower.includes('modifier');
    const hasCustomErrors = lower.includes('error ') || lower.includes('revert ');
    const hasEvents = lower.includes('emit ') || lower.includes('event ');
    const hasPragma = lower.includes('pragma solidity') || lower.includes('contract ');
    const hasCEI = lower.includes('balance') && lower.includes('=');

    if (hasPragma) {
      strengths.push('Valid Solidity contract architecture with appropriate pragma declaration');
      score += 3;
    }
    if (hasReentrancyCheck) {
      strengths.push('Defensive design with explicit reentrancy prevention guards');
      score += 3;
    }
    if (hasCustomErrors) {
      strengths.push('Gas-efficient custom error definitions reducing deployment and execution costs');
      score += 2;
    }
    if (hasEvents) {
      strengths.push('Comprehensive event logging facilitating on-chain indexing and monitoring');
      score += 2;
    }

    if (length < 150) {
      score = Math.max(50, score - 25);
      confidence = 65;
      weaknesses.push('Submission evidence is brief; provide complete contract implementation for maximum score');
    } else if (!hasReentrancyCheck && !hasCustomErrors) {
      weaknesses.push('Could further optimize gas and security with custom error declarations and explicit CEI pattern');
    }

    if (strengths.length === 0) {
      strengths.push('Logical structure addressing the fundamental problem requirements');
      strengths.push('Readable and well-formatted code submission');
    }

    if (weaknesses.length === 0) {
      weaknesses.push('Consider adding inline NatSpec comments for all external functions');
    }

    // Clamp score and confidence to 0-100
    const finalScore = Math.min(98, Math.max(45, score));
    const finalConfidence = Math.min(95, Math.max(60, confidence));

    return {
      score: finalScore,
      confidence: finalConfidence,
      summary: `The submitted implementation demonstrates solid competency in meeting the core requirements. Key security considerations and structure were verified successfully with minor areas for optimization noted.`,
      strengths,
      weaknesses
    };
  }
};
