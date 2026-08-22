import React from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SkillCard } from '../components/skills/SkillCard';
import { useSkillPassport } from '../hooks/useSkillPassport';
import { getExplorerUrl } from '../config/contracts';
import {
  Wallet,
  ShieldCheck,
  PlusCircle,
  ExternalLink,
  Activity,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { skills } = useSkillPassport(address);

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '0x8849...DE34 (Demo Mode)';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
      {/* Wallet Status & Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-surface border border-border relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Badge variant="primary" size="sm">
              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block mr-1" />
              Monad Testnet Connected
            </Badge>
            <span className="text-xs text-text-muted">Chain ID: 10143</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Candidate Dashboard
          </h1>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-2 bg-surface-secondary px-3 py-1.5 rounded-xl border border-border text-xs">
              <Wallet className="w-3.5 h-3.5 text-primary" />
              <span className="font-mono text-text font-medium">{truncatedAddress}</span>
              {address && (
                <a
                  href={getExplorerUrl('address', address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-text ml-1"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <Link
              to={address ? `/passport/${address}` : '/passport/0x8849b2C12D554FEA21B898eE0fF27A419c81DE34'}
              className="text-xs text-primary hover:text-primary-hover font-medium flex items-center gap-1 transition-colors"
            >
              <span>View Public Passport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Prove Button */}
        <div className="flex items-center gap-3">
          <Link to="/challenge?skill=Solidity">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              className="shadow-glow-primary w-full sm:w-auto"
            >
              Prove a Skill
            </Button>
          </Link>
        </div>
      </div>

      {/* Skills Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-text tracking-tight flex items-center gap-2.5">
              <span>Your Skills & Freshness Records</span>
              <Badge variant="secondary" size="sm">
                {skills.length} Tracked
              </Badge>
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Active skills retain verification strength. Aging and stale skills need re-verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/challenge">
              <Button variant="secondary" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5 text-primary" />}>
                New Challenge
              </Button>
            </Link>
          </div>
        </div>

        {/* Grid of Skill Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <SkillCard
              key={skill.skill}
              skill={skill}
              isRealBlockchain={skill.skill === 'Solidity'}
            />
          ))}
        </div>
      </div>

      {/* Verification Protocol Explainer Banner */}
      <Card variant="surface" className="p-6 sm:p-8 border-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-surface-secondary border border-border flex items-center justify-center text-primary shrink-0">
              <ShieldCheck className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text">How Freshness Decay Works</h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
                When you pass an AI challenge and confirm on Monad, your skill enters the <strong>ACTIVE</strong> state (100% freshness). After 30 days of inactivity, it transitions to <strong>AGING</strong>, and eventually <strong>STALE</strong>. Take practical challenges to reset your decay window.
              </p>
            </div>
          </div>

          <Link to="/challenge?skill=Solidity" className="shrink-0 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full">
              Re-Verify Solidity
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
