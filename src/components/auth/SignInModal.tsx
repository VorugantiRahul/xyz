import React from 'react';
import { useAccount } from 'wagmi';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { ShieldCheck, KeyRound, X, Sparkles } from 'lucide-react';

export const SignInModal: React.FC = () => {
  const { address } = useAccount();
  const { showSignInModal, setShowSignInModal, signInWithWallet, isSigningIn } = useAuth();

  if (!showSignInModal) return null;

  const formatAddress = (addr?: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={() => setShowSignInModal(false)}
          className="absolute top-5 right-5 text-text-secondary hover:text-text p-1.5 rounded-xl hover:bg-surface-secondary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-glow-primary">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-text">Welcome to SkillPulse</h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Sign a cryptographic message with your wallet to prove ownership and unlock your living skill profile.
          </p>
        </div>

        {/* Wallet Address Chip */}
        <div className="p-4 rounded-2xl bg-surface-secondary/70 border border-border/80 text-center space-y-1">
          <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
            Connected Wallet
          </p>
          <p className="font-mono text-sm font-bold text-text">
            {formatAddress(address)}
          </p>
        </div>

        {/* Security / Zero Gas Notice */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-primary/5 border border-primary/15 text-xs text-text-secondary">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            This signature is <strong>gas-free</strong> and will <strong>not</strong> trigger a blockchain transaction.
          </p>
        </div>

        {/* Sign In Button */}
        <div className="space-y-2.5 pt-1">
          <Button
            variant="primary"
            size="lg"
            onClick={signInWithWallet}
            isLoading={isSigningIn}
            leftIcon={<Sparkles className="w-4 h-4" />}
            className="w-full shadow-glow-primary font-semibold"
          >
            Sign in with Wallet
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSignInModal(false)}
            className="w-full text-text-secondary"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};