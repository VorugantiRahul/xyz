import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { getExplorerUrl } from '../../config/contracts';
import { Loader2, CheckCircle2, XCircle, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export type TxLifecycleState = 'idle' | 'waiting' | 'confirming' | 'success' | 'failed';

export interface TransactionStatusProps {
  state: TxLifecycleState;
  txHash?: string;
  errorMessage?: string;
  onReset?: () => void;
  targetPassportAddress?: string;
  skillName?: string;
  score?: number;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  state,
  txHash,
  errorMessage,
  onReset,
  targetPassportAddress,
  skillName,
  score,
}) => {
  if (state === 'idle') return null;

  return (
    <Card variant="glass" className="p-6 relative overflow-hidden animate-fade-in border-primary/30">
      {/* Background glow subtle effect */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      {state === 'waiting' && (
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center text-primary mb-4 border border-primary/30 animate-pulse">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
          <h4 className="text-lg font-semibold text-text mb-1">Waiting for wallet confirmation...</h4>
          <p className="text-xs text-text-secondary max-w-sm">
            Please approve the signature request in your wallet to record this verification on Monad Testnet.
          </p>
        </div>
      )}

      {state === 'confirming' && (
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-14 h-14 rounded-2xl bg-warning/15 flex items-center justify-center text-warning mb-4 border border-warning/30 animate-pulse">
            <Loader2 className="w-7 h-7 animate-spin text-warning" />
          </div>
          <h4 className="text-lg font-semibold text-text mb-1">Transaction submitted...</h4>
          <p className="text-xs text-text-secondary max-w-sm mb-4">
            Mining block on Monad Testnet. Proof consensus is finalizing.
          </p>
          {txHash && (
            <div className="w-full max-w-md bg-surface-secondary/80 rounded-xl p-3 border border-border text-left">
              <span className="text-[11px] text-text-muted uppercase font-mono block">Transaction Hash</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-xs text-text-secondary truncate mr-2">{txHash}</span>
                <a
                  href={getExplorerUrl('tx', txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:text-primary-hover flex items-center gap-1 font-medium shrink-0"
                >
                  <span>Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {state === 'success' && (
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-success-surface flex items-center justify-center text-success mb-4 border border-success-border">
            <CheckCircle2 className="w-9 h-9 text-success" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-surface text-success text-xs font-semibold mb-2 border border-success-border">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>On-Chain Attestation Verified</span>
          </div>
          <h4 className="text-xl font-bold text-text mb-1">Verification confirmed.</h4>
          <p className="text-sm text-text-secondary max-w-md mb-6">
            Your {skillName || 'Solidity'} skill proof ({score ? `${score}/100` : 'Verified'}) has been permanently anchored to Monad Testnet.
          </p>

          {txHash && (
            <div className="w-full max-w-md bg-surface-secondary/80 rounded-xl p-3.5 border border-border text-left mb-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-text-muted uppercase font-mono">Transaction Receipt</span>
                <span className="text-[11px] text-success font-medium">Confirmed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-text-secondary truncate mr-3">{txHash}</span>
                <a
                  href={getExplorerUrl('tx', txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:text-primary-hover flex items-center gap-1 font-medium shrink-0"
                >
                  <span>View on Monad Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            {targetPassportAddress && (
              <Link to={`/passport/${targetPassportAddress}`} className="w-full">
                <Button variant="primary" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View Updated Passport
                </Button>
              </Link>
            )}
            <Link to="/dashboard" className="w-full">
              <Button variant="secondary" size="md" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}

      {state === 'failed' && (
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-14 h-14 rounded-2xl bg-danger-surface flex items-center justify-center text-danger mb-4 border border-danger-border">
            <XCircle className="w-8 h-8 text-danger" />
          </div>
          <h4 className="text-lg font-semibold text-text mb-1">Transaction Failed</h4>
          <p className="text-xs text-danger/90 max-w-md mb-6">
            {errorMessage || 'The blockchain transaction was rejected or encountered a revert error.'}
          </p>
          {onReset && (
            <Button variant="secondary" size="sm" onClick={onReset}>
              Dismiss & Retry
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
