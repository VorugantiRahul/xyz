import React from 'react';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { SkillProofData } from '../../api/types';
import { ArrowRight, Clock, ShieldCheck, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface SkillCardProps {
  skill: SkillProofData;
  onProveClick?: (skillName: string) => void;
  isRealBlockchain?: boolean;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  onProveClick,
  isRealBlockchain = false,
}) => {
  // Freshness calculation (100% when fresh, decaying towards 0%)
  const freshnessPercent = Math.max(0, 100 - (skill.daysAgo / skill.expiryDays) * 100);

  return (
    <Card variant="interactive" className="p-6 relative group flex flex-col justify-between overflow-hidden">
      {/* Top ambient highlight on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-surface-secondary border border-border flex items-center justify-center text-primary group-hover:border-primary/40 transition-colors">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text group-hover:text-primary-light transition-colors">
                  {skill.skill}
                </h3>
                {isRealBlockchain && (
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary-light border border-primary/20">
                    On-Chain
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>Verified {skill.daysAgo === 0 ? 'today' : `${skill.daysAgo}d ago`}</span>
              </p>
            </div>
          </div>

          <StatusBadge status={skill.status} />
        </div>

        {/* Score display */}
        <div className="my-5 p-4 rounded-xl bg-surface-secondary/70 border border-border/70 flex items-center justify-between">
          <div>
            <span className="text-xs text-text-secondary block">Competency Score</span>
            <span className="text-2xl font-extrabold text-text tracking-tight font-mono">
              {skill.score}
              <span className="text-sm font-normal text-text-muted">/100</span>
            </span>
          </div>

          <div className="w-28 text-right">
            <span className="text-[11px] text-text-secondary block mb-1">Proof Freshness</span>
            <ProgressBar value={freshnessPercent} size="sm" variant="auto" />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2">
        <Link to={`/challenge?skill=${skill.skill}`}>
          <Button
            variant={skill.status === 'STALE' ? 'primary' : 'secondary'}
            size="sm"
            className="w-full"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            {skill.status === 'STALE' ? 'Re-Verify Skill' : 'Prove Skill'}
          </Button>
        </Link>
      </div>
    </Card>
  );
};
