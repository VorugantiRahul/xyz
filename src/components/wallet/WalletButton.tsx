import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { Button } from '../ui/Button';
import { monadTestnet, getExplorerUrl } from '../../config/contracts';
import { Wallet, LogOut, ChevronDown, ExternalLink, AlertTriangle } from 'lucide-react';

export interface WalletButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const WalletButton: React.FC<WalletButtonProps> = ({ className, size = 'md' }) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isWrongNetwork = isConnected && chainId !== monadTestnet.id;

  const formatAddress = (addr?: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = () => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  const handleSwitchNetwork = () => {
    if (switchChain) {
      switchChain({ chainId: monadTestnet.id });
    }
  };

  if (!isConnected) {
    return (
      <Button
        variant="primary"
        size={size}
        onClick={handleConnect}
        isLoading={isConnecting}
        leftIcon={<Wallet className="w-4 h-4" />}
        className={className}
      >
        Connect Wallet
      </Button>
    );
  }

  if (isWrongNetwork) {
    return (
      <Button
        variant="danger"
        size={size}
        onClick={handleSwitchNetwork}
        isLoading={isSwitching}
        leftIcon={<AlertTriangle className="w-4 h-4" />}
        className={className}
      >
        Switch to Monad
      </Button>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface border border-border hover:border-primary/50 text-text font-medium text-xs md:text-sm transition-all shadow-sm focus:outline-none"
        >
          {/* Network Indicator */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-secondary border border-border text-[11px] text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="hidden sm:inline">Monad</span>
          </div>

          <span className="font-mono text-text">{formatAddress(address)}</span>
          <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
        </button>
      </div>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface border border-border shadow-2xl p-3 z-50 animate-fade-in">
            <div className="px-3 py-2 border-b border-border/70 mb-2">
              <p className="text-[11px] text-text-secondary uppercase tracking-wider font-semibold">Connected Account</p>
              <p className="font-mono text-xs text-text break-all mt-1">{address}</p>
            </div>

            <div className="space-y-1">
              <a
                href={address ? getExplorerUrl('address', address) : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-text-secondary hover:text-text hover:bg-surface-secondary transition-colors"
              >
                <span>View on Monad Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  disconnect();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-danger hover:bg-danger-surface transition-colors text-left"
              >
                <span>Disconnect</span>
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
