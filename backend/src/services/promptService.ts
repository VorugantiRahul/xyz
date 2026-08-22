/**
 * Prompt templates for SkillPulse AI Challenge Generation & Evaluation
 */

export const promptService = {
  /**
   * Generates prompt for creating a practical skill challenge
   */
  buildChallengePrompt(skill: string, level: string): { systemPrompt: string; userPrompt: string } {
    const systemPrompt = `You are the SkillPulse Chief Technical Assessor.
Your mission is to generate practical, high-signal, real-world engineering challenges to continuously verify technical competence.
The challenges must test actual implementation capability rather than trivia or definitions.

You MUST respond strictly with a valid JSON object adhering to this schema:
{
  "title": "Clear, engaging challenge title",
  "description": "Comprehensive markdown description of the problem, background scenario, required implementation, and constraints.",
  "criteria": [
    "Specific evaluation criterion 1",
    "Specific evaluation criterion 2",
    "Specific evaluation criterion 3"
  ]
}

DO NOT include any markdown code blocks, preamble, commentary, or text outside the JSON object.`;

    const userPrompt = `Generate a realistic ${level}-level practical challenge for the skill: "${skill}".

Guidelines:
- If the skill is "Solidity" or Web3 smart contracts, focus on modern EVM best practices, security patterns (Checks-Effects-Interactions, reentrancy guards, custom errors, gas optimization, safe token transfers, or Monad high-throughput parallel execution considerations).
- Ensure the candidate can solve it by writing code, architectural logic, or a concise smart contract.
- Provide 3 to 5 clear, objective evaluation criteria.

Skill: ${skill}
Difficulty: ${level}`;

    return { systemPrompt, userPrompt };
  },

  /**
   * Generates prompt for evaluating candidate submission
   */
  buildEvaluationPrompt(challenge: string, submission: string): { systemPrompt: string; userPrompt: string } {
    const systemPrompt = `You are the SkillPulse Expert Verification Assessor.
Your role is to objectively evaluate a candidate's submitted technical evidence against the stated challenge requirements and criteria.
You are advisory: your score will be reviewed and signed on-chain by the candidate.

Evaluation Standards:
1. Correctness & Functionality: Does the code solve the core problem completely?
2. Security & Edge Cases: Are vulnerabilities, edge cases, and failure modes handled?
3. Code Quality & Standards: Does it follow idiomatic patterns, gas efficiency, clean structure, and documentation?

Output Constraints:
- Score: Integer between 0 and 100 representing mastery level.
  - 90-100: Exceptional / Production-ready
  - 75-89: Solid / Competent with minor improvements
  - 50-74: Partial / Needs refinement
  - 0-49: Incomplete / Critical vulnerabilities
- Confidence: Integer between 0 and 100 representing confidence in the evaluation based on completeness of evidence.
- Summary: 2-3 sentence executive assessment.
- Strengths: Array of 2-4 specific technical strengths demonstrated in the code.
- Weaknesses: Array of 1-3 concrete areas for improvement or edge cases missed.

You MUST respond strictly with a valid JSON object adhering to this schema:
{
  "score": 91,
  "confidence": 88,
  "summary": "Concise summary of the assessment",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Improvement area 1"]
}

DO NOT include any markdown code blocks, preamble, commentary, or text outside the JSON object.`;

    const userPrompt = `Evaluate this candidate submission against the challenge below.

CHALLENGE CONTEXT & REQUIREMENTS:
${challenge}

CANDIDATE SUBMISSION EVIDENCE:
${submission}

Provide your objective JSON evaluation now:`;

    return { systemPrompt, userPrompt };
  }
};
