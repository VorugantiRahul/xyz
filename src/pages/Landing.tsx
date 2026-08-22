import React from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  Code,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
  Sparkles,
  Lock
} from 'lucide-react';

export const Landing: React.FC = () => {
  const { isConnected, address } = useAccount();

  const passportTarget = isConnected && address
    ? `/passport/${address}`
    : '/passport/0x8849b2C12D554FEA21B898eE0fF27A419c81DE34';

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-20 text-center max-w-5xl mx-auto px-4">
        {/* Subtle glowing ambient backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-primary/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-secondary border border-border/90 mb-8 shadow-sm animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-text-secondary">
            Live on <strong className="text-text">Monad Testnet</strong>
          </span>
          <span className="text-text-muted">•</span>
          <span className="text-xs text-primary-light font-medium">Dynamic Proof Protocol</span>
        </div>

        {/* Main Headings */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text leading-[1.1] mb-6">
          Skills change. <br className="hidden sm:inline" />
          <span className="text-gradient-purple">Proof should stay alive.</span>
        </h1>

        <p className="text-base sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Continuously prove your skills through practical challenges and verifiable on-chain records.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          {isConnected ? (
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-glow-primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/challenge" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-glow-primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Take a Challenge
              </Button>
            </Link>
          )}

          <Link to={passportTarget} className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto" leftIcon={<ShieldCheck className="w-4 h-4" />}>
              Explore Passport
            </Button>
          </Link>
        </div>

        {/* Live Interactive Verification Preview */}
        <div className="mt-16 sm:mt-20 max-w-3xl mx-auto">
          <Card variant="glass" className="p-6 sm:p-8 text-left border-border/80 relative overflow-hidden shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-border/70 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-secondary border border-border flex items-center justify-center text-primary">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text text-sm sm:text-base">Solidity Smart Contract Engineering</h3>
                  <p className="text-xs text-text-secondary">Monad Testnet Attestation</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status="ACTIVE" size="sm" />
                <span className="font-mono text-xs text-text-muted">#10143</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-surface-secondary/70 border border-border">
                <span className="text-[11px] text-text-muted uppercase font-mono block">Attested Score</span>
                <span className="text-2xl font-bold font-mono text-text text-gradient-purple">91/100</span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-secondary/70 border border-border">
                <span className="text-[11px] text-text-muted uppercase font-mono block">Freshness State</span>
                <span className="text-xs font-semibold text-success block mt-1">94% Active</span>
                <ProgressBar value={94} size="sm" variant="success" className="mt-1" />
              </div>

              <div className="p-3.5 rounded-xl bg-surface-secondary/70 border border-border">
                <span className="text-[11px] text-text-muted uppercase font-mono block">Cryptographic Proof</span>
                <span className="text-xs font-mono text-text-secondary truncate block mt-1">0x3a88...031a</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 3-Step Visual Flow: Challenge -> Prove -> Stay Verified */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <Badge variant="primary" size="md" className="mb-3">
            Proof of Competency Cycle
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
            How SkillPulse Works
          </h2>
          <p className="text-sm text-text-secondary mt-2 max-w-xl mx-auto">
            A continuous loop that keeps developer credentials provable, objective, and resistant to decay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1: Challenge */}
          <Card variant="glass" className="p-8 relative flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-surface-secondary border border-border group-hover:border-primary/40 flex items-center justify-center text-primary transition-colors shadow-inner-light">
                  <Code className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-text-muted font-bold">STEP 01</span>
              </div>

              <h3 className="text-xl font-bold text-text mb-2">1. Challenge</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Generate practical, real-world coding problems synthesized by AI to evaluate production competence.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2 text-xs text-primary-light font-medium">
              <span>Interactive Rubrics</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </div>
          </Card>

          {/* Step 2: Prove */}
          <Card variant="glass" className="p-8 relative flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-surface-secondary border border-border group-hover:border-primary/40 flex items-center justify-center text-primary transition-colors shadow-inner-light">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-text-muted font-bold">STEP 02</span>
              </div>

              <h3 className="text-xl font-bold text-text mb-2">2. Prove</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Submit your solution. Multi-dimensional AI evaluation grades code safety, structure, and gas efficiency.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2 text-xs text-primary-light font-medium">
              <span>Deterministic Hashing</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </div>
          </Card>

          {/* Step 3: Stay Verified */}
          <Card variant="glass" className="p-8 relative flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-surface-secondary border border-border group-hover:border-primary/40 flex items-center justify-center text-primary transition-colors shadow-inner-light">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-text-muted font-bold">STEP 03</span>
              </div>

              <h3 className="text-xl font-bold text-text mb-2">3. Stay Verified</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Record your verified score to Monad Testnet. Proofs decay over time unless renewed by new challenges.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2 text-xs text-success font-medium">
              <span>Immutable Attestation</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </div>
          </Card>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="surface" className="p-8 border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">On-Chain Evidence Hashing</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Submissions are deterministically hashed via Keccak-256 before blockchain transmission, ensuring cryptographic integrity without on-chain storage bloat.
            </p>
          </Card>

          <Card variant="surface" className="p-8 border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">Decay-Aware Freshness Meters</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Static certificates expire in value without anyone noticing. SkillPulse introduces dynamic decay states (Active, Aging, Stale) reflecting real-world currency.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};
