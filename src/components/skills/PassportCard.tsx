import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { StatusBadge } from '../ui/StatusBadge';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { SkillProofData } from '../../api/types';
import { getExplorerUrl } from '../../config/contracts';
import {
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Award,
  Clock,
  Share2,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

export interface PassportCardProps {
  address: string;
  skills: SkillProofData[];
  primarySkillName?: string;
  isOwner?: boolean;
}

export const PassportCard: React.FC<PassportCardProps> = ({
  address,
  skills,
  primarySkillName = 'Solidity',
  isOwner = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const primarySkill = skills.find((s) => s.skill.toLowerCase() === primarySkillName.toLowerCase()) || skills[0];

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const truncatedAddress = `${address.slice(0, 8)}...${address.slice(-6)}`;
  const freshnessPercent = primarySkill
    ? Math.max(0, 100 - (primarySkill.daysAgo / primarySkill.expiryDays) * 100)
    : 90;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Passport Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Monad On-Chain Attestation
          </Badge>
          <span className="text-xs text-text-muted">Standard v1.0</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyShareUrl}
            leftIcon={copiedLink ? <Check className="w-3.5 h-3.5 text-success" /> : <Share2 className="w-3.5 h-3.5" />}
          >
            {copiedLink ? 'Link Copied' : 'Share Passport'}
          </Button>
        </div>
      </div>

      {/* Main Visual Passport Card */}
      <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-primary/60 via-border to-border/40 shadow-2xl overflow-hidden">
        {/* Holographic background ambient highlights */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-success/15 blur-3xl pointer-events-none" />

        <div className="relative bg-surface rounded-3xl p-6 sm:p-10 backdrop-blur-xl space-y-8">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/80 pb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-surface-secondary to-surface-card border border-border flex items-center justify-center shadow-inner-light">
                  <Award className="w-9 h-9 sm:w-11 sm:h-11 text-primary-light" />
                </div>
                <div className="absolute -bottom-2 -right-2 p-1 bg-surface rounded-full border border-border">
                  <div className="w-4 h-4 rounded-full bg-success flex items-center justify-center text-black">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
                    SkillPulse Passport
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                  Decentralized Proof of Competency Record
                </p>
              </div>
            </div>

            {/* Wallet Address Chip */}
            <div className="flex flex-col sm:items-end">
              <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Subject Address</span>
              <div className="flex items-center gap-2 bg-surface-secondary/90 px-3.5 py-2 rounded-xl border border-border">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="font-mono text-xs text-text font-medium">{truncatedAddress}</span>
                <button
                  onClick={handleCopyAddress}
                  className="text-text-muted hover:text-text p-1 transition-colors"
                  title="Copy full address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={getExplorerUrl('address', address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-primary p-1 transition-colors"
                  title="View on Monad Explorer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Primary Featured Skill Banner */}
          {primarySkill && (
            <div className="rounded-2xl bg-gradient-to-r from-surface-secondary via-surface-card to-surface-secondary p-6 sm:p-8 border border-border/90 relative overflow-hidden shadow-inner-light">
              <div className="absolute top-0 right-0 w-48 h-full bg-primary/5 blur-xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase font-mono tracking-widest text-primary-light font-semibold">
                      Primary Attestation
                    </span>
                    <StatusBadge status={primarySkill.status} size="sm" />
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
                    {primarySkill.skill}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>Last Verified: {primarySkill.lastVerified}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-success" />
                      <span>On-Chain Cryptographic Proof</span>
                    </span>
                  </div>
                </div>

                {/* Score & Freshness Gauge */}
                <div className="flex sm:items-center gap-6 bg-surface/80 p-5 rounded-2xl border border-border/80 min-w-[280px]">
                  <div className="border-r border-border pr-6">
                    <span className="text-[11px] text-text-muted uppercase font-mono block">Attested Score</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-4xl font-extrabold text-text font-mono text-gradient-purple">
                        {primarySkill.score}
                      </span>
                      <span className="text-sm text-text-muted">/100</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                      <span className="text-text-secondary">Freshness</span>
                      <span className="text-text font-mono">{Math.round(freshnessPercent)}%</span>
                    </div>
                    <ProgressBar value={freshnessPercent} size="md" variant="auto" />
                    <span className="text-[10px] text-text-muted mt-1 block">
                      {primarySkill.status === 'ACTIVE'
                        ? 'High freshness decay window'
                        : `${primarySkill.daysAgo} days elapsed`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transaction details row */}
              {primarySkill.txHash && (
                <div className="mt-6 pt-5 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Layers className="w-3.5 h-3.5 text-text-muted" />
                    <span className="font-mono text-text-muted">TX:</span>
                    <span className="font-mono text-text truncate max-w-[200px] sm:max-w-xs">{primarySkill.txHash}</span>
                  </div>

                  <a
                    href={getExplorerUrl('tx', primarySkill.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-light font-medium inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>View on Monad Explorer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* All Skills Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text flex items-center gap-2">
                <span>Verified Skill Records</span>
                <Badge variant="secondary" size="sm">
                  {skills.length} Total
                </Badge>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((s) => {
                const sFreshness = Math.max(0, 100 - (s.daysAgo / s.expiryDays) * 100);
                return (
                  <div
                    key={s.skill}
                    className="p-5 rounded-2xl bg-surface-secondary/60 border border-border flex flex-col justify-between hover:border-border-light transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h4 className="text-base font-bold text-text">{s.skill}</h4>
                        <span className="text-xs text-text-secondary">
                          {s.daysAgo === 0 ? 'Verified today' : `${s.daysAgo} days ago`}
                        </span>
                      </div>
                      <StatusBadge status={s.status} size="sm" />
                    </div>

                    <div className="space-y-2 mt-2 pt-3 border-t border-border/50">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-secondary">Score: <strong className="text-text font-mono">{s.score}/100</strong></span>
                        <span className="text-text-muted font-mono">{Math.round(sFreshness)}% fresh</span>
                      </div>
                      <ProgressBar value={sFreshness} size="sm" variant="auto" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Passport Footer Seal */}
          <div className="rounded-xl bg-surface-secondary/40 border border-border/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-success" />
              <div>
                <span className="font-semibold text-text">Cryptographically Anchored</span>
                <p className="text-[11px] text-text-muted">Proofs are secured by Monad consensus and verifiable by any dApp or recruiter.</p>
              </div>
            </div>

            <a
              href={getExplorerUrl('address', address)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-hover flex items-center gap-1.5 font-medium shrink-0"
            >
              <span>Verify on Monad Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
