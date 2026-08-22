import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { PassportCard } from '../components/skills/PassportCard';
import { useSkillPassport } from '../hooks/useSkillPassport';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

export const Passport: React.FC = () => {
  const { address: routeAddress } = useParams<{ address: string }>();
  const { address: connectedAddress } = useAccount();

  // Target address from URL or connected wallet fallback
  const targetAddress = routeAddress || connectedAddress || '0x8849b2C12D554FEA21B898eE0fF27A419c81DE34';

  const { skills } = useSkillPassport(targetAddress);
  const isOwner = !!(connectedAddress && targetAddress.toLowerCase() === connectedAddress.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-4xl mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {isOwner && (
          <Link to="/challenge?skill=Solidity">
            <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
              Add / Renew Skill Proof
            </Button>
          </Link>
        )}
      </div>

      {/* Public Passport Card */}
      <PassportCard
        address={targetAddress}
        skills={skills}
        primarySkillName="Solidity"
        isOwner={isOwner}
      />
    </div>
  );
};
