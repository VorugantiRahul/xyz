import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { EvaluateResponse } from '../../api/types';
import { Award, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export interface ScoreCardProps {
  evaluation: EvaluateResponse;
  skillName: string;
  onVerifyClick: () => void;
  isVerifying?: boolean;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  evaluation,
  skillName,
  onVerifyClick,
  isVerifying = false,
}) => {
  const isPassing = evaluation.score >= 70;

  return (
    <Card variant="glass" className="p-6 sm:p-8 space-y-6 animate-fade-in border-primary/30">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-surface-secondary border border-border flex items-center justify-center text-primary shadow-glow-primary">
              <Award className="w-8 h-8 text-primary" />
            </div>
            {isPassing && (
              <span className="absolute -bottom-1 -right-1 p-1 bg-success rounded-full text-black">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-text">AI Evaluation Complete</h3>
              <StatusBadge status={isPassing ? 'ACTIVE' : 'STALE'} size="sm" />
            </div>
            <p className="text-xs text-text-secondary flex items-center gap-2">
              <span className="flex items-center gap-1 text-primary-light">
                <Sparkles className="w-3 h-3" />
                <span>Confidence: {Math.round(evaluation.confidence * 100)}%</span>
              </span>
              <span>•</span>
              <span>Target: {skillName}</span>
            </p>
          </div>
        </div>

        {/* Score Number Display */}
        <div className="flex items-baseline gap-1 sm:text-right bg-surface-secondary/70 sm:bg-transparent p-4 sm:p-0 rounded-xl border sm:border-0 border-border">
          <span className="text-4xl sm:text-5xl font-extrabold text-text font-mono tracking-tight text-gradient-purple">
            {evaluation.score}
          </span>
          <span className="text-base font-medium text-text-muted">/100</span>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="p-4 rounded-xl bg-surface-secondary/60 border border-border">
        <h4 className="text-xs font-semibold text-text uppercase tracking-wider mb-2">Executive Summary</h4>
        <p className="text-sm text-text-secondary leading-relaxed">{evaluation.summary}</p>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-success-surface/40 border border-success-border/60">
          <div className="flex items-center gap-2 text-xs font-bold text-success uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>Demonstrated Strengths</span>
          </div>
          <ul className="space-y-2">
            {evaluation.strengths.map((item, idx) => (
              <li key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                <span className="text-success font-bold mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="p-4 rounded-xl bg-warning-surface/40 border border-warning-border/60">
          <div className="flex items-center gap-2 text-xs font-bold text-warning uppercase tracking-wider mb-3">
            <AlertCircle className="w-4 h-4" />
            <span>Opportunities for Optimization</span>
          </div>
          <ul className="space-y-2">
            {evaluation.weaknesses.map((item, idx) => (
              <li key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                <span className="text-warning font-bold mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Gas Economy & Verification CTA */}
      <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs text-text-secondary">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary-light">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono">Gas: ~0.00005 MON</span>
          </div>
          <span className="text-text-muted text-[11px]">Enables 200+ verifications on minimal testnet balance</span>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onVerifyClick}
          isLoading={isVerifying}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full sm:w-auto shadow-glow-primary"
        >
          Verify Skill On-Chain
        </Button>
      </div>
    </Card>
  );
};