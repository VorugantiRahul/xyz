export type SkillType = 'Solidity' | 'Python' | 'React';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ChallengeRequest {
  skill: string;
  level: string;
}

export interface ChallengeResponse {
  title: string;
  description: string;
  criteria: string[];
  starterCode?: string;
}

export interface EvaluateRequest {
  challenge: {
    title: string;
    description: string;
    criteria: string[];
    skill?: string;
    level?: string;
  };
  submission: string;
}

export interface EvaluateResponse {
  score: number;
  confidence: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
}

export type SkillStatus = 'ACTIVE' | 'AGING' | 'STALE';

export interface SkillProofData {
  skill: string;
  score: number;
  status: SkillStatus;
  lastVerified: string;
  daysAgo: number;
  txHash?: string;
  evidenceHash?: string;
  expiryDays: number;
  level?: string;
  confidence?: number;
}
