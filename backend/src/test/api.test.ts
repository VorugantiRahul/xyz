/**
 * SkillPulse Backend API & Service Automated Test Suite
 */

import { parseAndCleanJson } from '../lib/jsonParser';
import { fallbackService } from '../services/fallbackService';
import { challengeRequestSchema, evaluateRequestSchema, challengeResponseSchema, evaluateResponseSchema } from '../lib/validator';
import { aiService } from '../services/aiService';
import { profileService } from '../services/profileService';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  âœ“ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  âœ— FAIL: ${testName}`);
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

  // 3. Fallback Engine Resiliency
  console.log('\n[3] Testing Fallback Engine (Guaranteed Resilience):');
  const fallbackChallenge = fallbackService.getFallbackChallenge('Solidity', 'Intermediate');
  assert(challengeResponseSchema.safeParse(fallbackChallenge).success, 'Fallback challenge satisfies ChallengeResponse schema');
  assert(fallbackChallenge.title.includes('Monad') || fallbackChallenge.title.includes('Vault'), 'Fallback challenge tailored for Solidity on Monad');
  assert(fallbackChallenge.criteria.length >= 3, 'Fallback challenge contains at least 3 criteria');

  const fallbackEval = fallbackService.getFallbackEvaluation(validEvalReq.challenge, validEvalReq.submission);
  assert(evaluateResponseSchema.safeParse(fallbackEval).success, 'Fallback evaluation satisfies EvaluateResponse schema');
  assert(fallbackEval.score >= 0 && fallbackEval.score <= 100, `Score is within valid bounds (0-100): ${fallbackEval.score}`);
  assert(fallbackEval.confidence >= 0 && fallbackEval.confidence <= 100, `Confidence is within valid bounds (0-100): ${fallbackEval.confidence}`);
  assert(fallbackEval.strengths.length > 0, 'Evaluation includes strengths');

  // 4. AIService Orchestrator
  console.log('\n[4] Testing AIService Orchestrator (No-Key Graceful Execution):');
  const aiChallenge = await aiService.generateChallenge('Solidity', 'Intermediate');
  assert(challengeResponseSchema.safeParse(aiChallenge).success, 'AIService.generateChallenge returns valid schema seamlessly');

  const aiEval = await aiService.evaluateSubmission(validEvalReq.challenge, validEvalReq.submission);
  assert(evaluateResponseSchema.safeParse(aiEval).success, 'AIService.evaluateSubmission returns valid schema seamlessly');
  assert(typeof aiEval.score === 'number', `Evaluated score is valid: ${aiEval.score}`);

  // 5. Auth Nonce & Profile Identity Layer
  console.log('\n[5] Testing Profile Identity & Wallet Authentication Service:');
  const sampleWallet = '0x1111111111111111111111111111111111111111';
  const nonceData = profileService.generateNonce(sampleWallet);
  assert(typeof nonceData.nonce === 'string' && nonceData.nonce.length === 6, `Generates secure 6-digit nonce: ${nonceData.nonce}`);
  assert(nonceData.message.includes(sampleWallet) && nonceData.message.includes('SkillPulse wants you to sign in'), 'Message contains SIWE structure');

  // Profile save & retrieve
  const savedProfile = profileService.saveProfile({
    walletAddress: sampleWallet,
    name: 'Test Engineer',
    role: 'Core Contributor',
    primarySkill: 'Solidity',
    bio: 'Continuous verification tester.'
  });
  assert(savedProfile.name === 'Test Engineer' && savedProfile.role === 'Core Contributor', 'Saves profile correctly');

  const fetchedProfile = profileService.getProfile(sampleWallet);
  assert(fetchedProfile !== null && fetchedProfile.name === 'Test Engineer', 'Retrieves saved profile by wallet address');

  const seededRahul = profileService.getProfile('0x8849b2C12D554FEA21B898eE0fF27A419c81DE34');
  assert(seededRahul !== null && seededRahul.name === 'Rahul Voruganti', 'Seeded Rahul profile is accessible');

  // Final Summary
  console.log('\n=============================================');
  console.log(`  TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('=============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner encountered unexpected error:', err);
  process.exit(1);
});