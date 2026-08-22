import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ChallengeResponse } from '../../api/types';
import { CheckCircle, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export interface ChallengeCardProps {
  challenge: ChallengeResponse;
  skill: string;
  level: string;
  className?: string;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  skill,
  level,
  className,
}) => {
  return (
    <Card variant="glass" className={`p-6 sm:p-8 space-y-6 ${className || ''}`}>
      {/* Top Meta info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-5">
        <div className="flex items-center gap-2.5">
          <Badge variant="primary" size="md">
            {skill}
          </Badge>
          <Badge variant="secondary" size="md">
            {level} Level
          </Badge>
          <div className="flex items-center gap-1 text-xs text-primary-light font-medium ml-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Synthesized</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span>Evaluation Rubric Active</span>
        </div>
      </div>

      {/* Challenge Title & Description */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-text mb-3 tracking-tight">
          {challenge.title}
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          {challenge.description}
        </p>
      </div>

      {/* Criteria Breakdown */}
      <div className="p-4 rounded-xl bg-surface-secondary/60 border border-border">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-text uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span>Required Verification Criteria</span>
        </div>
        <ul className="space-y-2.5">
          {challenge.criteria.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary">
              <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
