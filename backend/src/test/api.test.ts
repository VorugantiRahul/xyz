/**
 * SkillPulse Backend API & Service Automated Test Suite
 */

import { parseAndCleanJson } from '../lib/jsonParser';
import { fallbackService } from '../services/fallbackService';
import { challengeRequestSchema, evaluateRequestSchema, challengeResponseSchema, evaluateResponseSchema } from '../lib/validator';
import { aiService } from '../services/aiService';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n=============================================');
  console.log('  RUNNING SKILLPULSE BACKEND TEST SUITE');
  console.log('=============================================\n');

  // 1. JSON Parser & Cleaner Unit Tests
  console.log('[1] Testing JSON Parsing & Markdown Recovery:');
  try {
    const rawWithMarkdown = '```json\n{"title": "Test Title", "description": "Test Desc", "criteria": ["C1", "C2"]}\n```';
    const parsed1 = parseAndCleanJson<{ title: string }>(rawWithMarkdown);
    assert(parsed1.title === 'Test Title', 'Extracts and parses JSON wrapped in ```json codeblocks');

    const rawWithPreamble = 'Here is your evaluation result:\n{"score": 92, "confidence": 89, "summary": "Great work", "strengths": ["Clean code"], "weaknesses": []}\nHope this helps!';
    const parsed2 = parseAndCleanJson<{ score: number }>(rawWithPreamble);
    assert(parsed2.score === 92, 'Extracts JSON with conversational preamble and postamble');

    const rawWithTrailingComma = '{"score": 85, "confidence": 80, "summary": "Good", "strengths": ["Safe",], "weaknesses": [],}';
    const parsed3 = parseAndCleanJson<{ score: number }>(rawWithTrailingComma);
    assert(parsed3.score === 85, 'Repairs and parses JSON with trailing commas');
  } catch (err) {
    assert(false, `JSON parser test crashed: ${(err as Error).message}`);
  }

  // 2. Request Validation Schemas
  console.log('\n[2] Testing Request Validation (Zod Schemas):');
  const validChallengeReq = { skill: 'Solidity', level: 'Intermediate' };
  assert(challengeRequestSchema.safeParse(validChallengeReq).success, 'Accepts valid challenge request');

  const invalidLevelReq = { skill: 'Solidity', level: 'Master' };
  assert(!challengeRequestSchema.safeParse(invalidLevelReq).success, 'Rejects invalid level in challenge request');

  const validEvalReq = {
    challenge: 'Build a staking vault with reentrancy protection on Monad.',
    submission: 'contract StakingVault { mapping(address => uint256) public balances; function stake() external payable { balances[msg.sender] += msg.value; } }'
  };
  assert(evaluateRequestSchema.safeParse(validEvalReq).success, 'Accepts valid evaluation request');

  const emptyEvalReq = { challenge: 'Short', submission: '' };
  assert(!evaluateRequestSchema.safeParse(emptyEvalReq).success, 'Rejects submission with insufficient length');

  // 3. Fallback Engine Service Tests
  console.log('\n[3] Testing Fallback Engine (Guaranteed Resilience):');
  const fallbackSolidity = fallbackService.getFallbackChallenge('Solidity', 'Intermediate');
  assert(challengeResponseSchema.safeParse(fallbackSolidity).success, 'Fallback challenge satisfies ChallengeResponse schema');
  assert(fallbackSolidity.title.includes('Monad') || fallbackSolidity.title.includes('Staking') || fallbackSolidity.title.includes('Vault'), 'Fallback challenge tailored for Solidity on Monad');
  assert(fallbackSolidity.criteria.length >= 3, 'Fallback challenge contains at least 3 criteria');

  const fallbackEval = fallbackService.getFallbackEvaluation(
    'Reentrancy vault',
    'pragma solidity ^0.8.20;\ncontract Vault {\n  error InsufficientBalance();\n  modifier nonReentrant() {}\n  emit Staked(msg.sender, msg.value);\n}'
  );
  assert(evaluateResponseSchema.safeParse(fallbackEval).success, 'Fallback evaluation satisfies EvaluateResponse schema');
  assert(fallbackEval.score >= 0 && fallbackEval.score <= 100, `Score is within valid bounds (0-100): ${fallbackEval.score}`);
  assert(fallbackEval.confidence >= 0 && fallbackEval.confidence <= 100, `Confidence is within valid bounds (0-100): ${fallbackEval.confidence}`);
  assert(fallbackEval.strengths.length > 0, 'Evaluation includes strengths');

  // 4. AIService Fallback & Dispatcher Tests
  console.log('\n[4] Testing AIService Orchestrator (No-Key Graceful Execution):');
  const challengeResult = await aiService.generateChallenge('Solidity', 'Intermediate');
  assert(challengeResponseSchema.safeParse(challengeResult).success, 'AIService.generateChallenge returns valid schema seamlessly');

  const evalResult = await aiService.evaluateSubmission(
    'Implement a reentrancy guard for a Monad vault',
    'contract SecureVault { bool private locked; modifier nonReentrant() { require(!locked); locked = true; _; locked = false; } }'
  );
  assert(evaluateResponseSchema.safeParse(evalResult).success, 'AIService.evaluateSubmission returns valid schema seamlessly');
  assert(evalResult.score >= 0 && evalResult.score <= 100, `Evaluated score is valid: ${evalResult.score}`);

  // Summary
  console.log('\n=============================================');
  console.log(`  TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('=============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
