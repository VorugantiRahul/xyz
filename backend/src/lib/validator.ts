import { z } from 'zod';

// ==========================================
// Request Schemas
// ==========================================

export const challengeRequestSchema = z.object({
  skill: z
    .string({
      required_error: 'Skill is required',
      invalid_type_error: 'Skill must be a string'
    })
    .trim()
    .min(1, 'Skill cannot be empty')
    .max(50, 'Skill name is too long')
    .default('Solidity'),
  level: z
    .enum(['Beginner', 'Intermediate', 'Advanced'], {
      invalid_type_error: 'Level must be Beginner, Intermediate, or Advanced'
    })
    .default('Intermediate')
});

export type ChallengeRequest = z.infer<typeof challengeRequestSchema>;

export const evaluateRequestSchema = z.object({
  challenge: z
    .string({
      required_error: 'Challenge context is required',
      invalid_type_error: 'Challenge must be a string'
    })
    .trim()
    .min(5, 'Challenge description must be at least 5 characters')
    .max(10000, 'Challenge description exceeds maximum length of 10000 characters'),
  submission: z
    .string({
      required_error: 'Submission evidence is required',
      invalid_type_error: 'Submission must be a string'
    })
    .trim()
    .min(5, 'Submission evidence must be at least 5 characters')
    .max(20000, 'Submission exceeds maximum length of 20000 characters')
});

export type EvaluateRequest = z.infer<typeof evaluateRequestSchema>;

// ==========================================
// Response Schemas (AI & Fallback Output)
// ==========================================

export const challengeResponseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  criteria: z.array(z.string()).min(1)
});

export type ChallengeResponse = z.infer<typeof challengeResponseSchema>;

export const evaluateResponseSchema = z.object({
  score: z.number().int().min(0).max(100),
  confidence: z.number().int().min(0).max(100),
  summary: z.string().min(5),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string())
});

export type EvaluateResponse = z.infer<typeof evaluateResponseSchema>;
