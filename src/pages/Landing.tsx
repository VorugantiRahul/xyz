import React from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useAuth } from '../context/AuthContext';
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
  Lock,
  UserCheck
} from 'lucide-react';

export const Landing: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { user, isAuthenticated, setShowSignInModal } = useAuth();

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
          Continuously prove your developer skills through practical AI challenges and verifiable on-chain records on Monad.
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

        {/* Protocol Overview Cards */}
        <div className="mt-16 sm:mt-20 max-w-3xl mx-auto">
          <Card variant="glass" className="p-6 sm:p-8 text-left border-border/80 relative overflow-hidden shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-secondary border border-border flex items-center justify-center text-primary">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text text-sm sm:text-base">SkillPulse Protocol Standard</h3>
                  <p className="text-xs text-text-secondary">Zero-Gas Login • AI Evaluation • Monad On-Chain Proofs</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm">
                  Monad #10143
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
              <div className="p-4 rounded-xl bg-surface-secondary/70 border border-border space-y-1">
                <span className="text-[11px] text-text-muted uppercase font-mono block">1. Register Track</span>
                <p className="text-sm font-semibold text-text">Choose Your Skill</p>
                <p className="text-xs text-text-secondary">Solidity, Python, or React</p>
              </div>

              <div className="p-4 rounded-xl bg-surface-secondary/70 border border-border space-y-1">
                <span className="text-[11px] text-text-muted uppercase font-mono block">2. Complete Challenge</span>
                <p className="text-sm font-semibold text-text">AI Evaluation</p>
                <p className="text-xs text-text-secondary">Security & gas optimization</p>
              </div>

              <div className="p-4 rounded-xl bg-surface-secondary/70 border border-border space-y-1">
                <span className="text-[11px] text-text-muted uppercase font-mono block">3. On-Chain Mint</span>
                <p className="text-sm font-semibold text-text">Living Proof</p>
                <p className="text-xs text-text-secondary">Dynamic freshness decay</p>
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
                <span className="font-mono text-xs font-bold text-text-muted">01 / TEST</span>
              </div>
              <h3 className="text-xl font-bold text-text mb-2">Practical Challenges</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                No multiple choice. Solve real-world smart contracts, vault architectures, and system modules evaluated by AI rubrics.
              </p>
            </div>
          </Card>

          {/* Step 2: On-Chain Proof */}
          <Card variant="glass" className="p-8 relative flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-surface-secondary border border-border group-hover:border-primary/40 flex items-center justify-center text-primary transition-colors shadow-inner-light">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs font-bold text-text-muted">02 / MINT</span>
              </div>
              <h3 className="text-xl font-bold text-text mb-2">Monad Attestations</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Verification scores, block timestamps, and deterministic submission hashes are written immutably to Monad Testnet.
              </p>
            </div>
          </Card>

          {/* Step 3: Freshness Decay */}
          <Card variant="glass" className="p-8 relative flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-surface-secondary border border-border group-hover:border-primary/40 flex items-center justify-center text-primary transition-colors shadow-inner-light">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs font-bold text-text-muted">03 / DECAY</span>
              </div>
              <h3 className="text-xl font-bold text-text mb-2">Freshness Lifecycle</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Skills age over time. Proofs remain <span className="text-success font-semibold">Active</span>, become <span className="text-warning font-semibold">Aging</span>, and eventually <span className="text-danger font-semibold">Stale</span> until refreshed.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};