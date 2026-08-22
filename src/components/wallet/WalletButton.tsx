import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { Button } from '../ui/Button';
import { monadTestnet, getExplorerUrl } from '../../config/contracts';
import { Wallet, LogOut, ChevronDown, ExternalLink, AlertTriangle, HelpCircle, X, Download } from 'lucide-react';

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
  const [showNoWalletModal, setShowNoWalletModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isWrongNetwork = isConnected && chainId !== monadTestnet.id;

  const formatAddress = (addr?: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  /**
   * Add Monad Testnet directly to MetaMask if not present
   */
  const addMonadTestnetToWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x279f', // 10143 in hex
              chainName: 'Monad Testnet',
              nativeCurrency: {
                name: 'Monad',
                symbol: 'MON',
                decimals: 18,
              },
              rpcUrls: ['https://testnet-rpc.monad.xyz'],
              blockExplorerUrls: ['https://testnet.monadexplorer.com'],
            },
          ],
        });
      } catch (err: any) {
        console.warn('wallet_addEthereumChain info:', err);
      }
    }
  };

  const handleConnect = async () => {
    setErrorMessage(null);
    const hasEthereum = typeof window !== 'undefined' && Boolean((window as any).ethereum);

    if (!hasEthereum) {
      setShowNoWalletModal(true);
      return;
    }

    try {
      // First ensure Monad Testnet is known to the wallet
      await addMonadTestnetToWallet();

      const connector = connectors[0];
      if (connector) {
        await connect({ connector, chainId: monadTestnet.id });
      } else if ((window as any).ethereum) {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      }
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      if (err?.code === 4001) {
        setErrorMessage('Connection request rejected in wallet.');
      } else {
        setErrorMessage(err?.message || 'Failed to connect wallet');
      }
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await addMonadTestnetToWallet();
      if (switchChain) {
        switchChain({ chainId: monadTestnet.id });
      }
    } catch (err) {
      console.error('Switch chain error:', err);
    }
  };

  if (!isConnected) {
    return (
      <>
        <div className="flex flex-col items-end">
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
          {errorMessage && (
            <span className="text-[11px] text-danger mt-1 animate-fade-in font-mono">
              {errorMessage}
            </span>
          )}
        </div>

        {/* Modal shown if no Web3 wallet extension is found */}
        {showNoWalletModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-2xl space-y-5">
              <button
                onClick={() => setShowNoWalletModal(false)}
                className="absolute top-4 right-4 text-text-secondary hover:text-text p-1 rounded-lg hover:bg-surface-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text text-base">Connect Web3 Wallet</h3>
                  <p className="text-xs text-text-secondary">Monad Testnet Verification</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-secondary/60 border border-border/80 text-xs text-text-secondary leading-relaxed space-y-2">
                <p>
                  No Web3 wallet extension (such as <strong className="text-text">MetaMask</strong>, <strong className="text-text">Rabby</strong>, or <strong className="text-text">Coinbase Wallet</strong>) was detected in this browser.
                </p>
                <p>
                  To interact directly with the Monad Testnet, install the MetaMask browser extension.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="primary" size="md" className="w-full" leftIcon={<Download className="w-4 h-4" />}>
                    Install MetaMask Extension
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNoWalletModal(false)}
                  className="w-full text-text-secondary"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
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