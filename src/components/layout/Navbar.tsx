import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletButton } from '../wallet/WalletButton';
import { useAccount } from 'wagmi';
import { useAuth } from '../../context/AuthContext';
import { Activity, Shield, Code, User, Menu, X, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { address, isConnected } = useAccount();
  const { user, isAuthenticated, setShowSignInModal, setShowProfileModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const passportUrl = isConnected && address ? `/passport/${address}` : '/passport/0x8849b2C12D554FEA21B898eE0fF27A419c81DE34';

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Take Challenge', path: '/challenge', icon: Code },
    { name: 'Skill Passport', path: passportUrl, icon: Shield },
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/passport') && location.pathname.startsWith('/passport')) return true;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 glass-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-surface-secondary border border-border group-hover:border-primary/50 flex items-center justify-center transition-all shadow-inner-light">
              <Activity className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-text tracking-tight flex items-center gap-1.5">
                SkillPulse
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-primary/20 text-primary-light border border-primary/30">
                  Monad
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={clsx(
                    'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all',
                    active
                      ? 'bg-surface-secondary text-text border border-border shadow-sm'
                      : 'text-text-secondary hover:text-text hover:bg-surface-secondary/50'
                  )}
                >
                  <Icon className={clsx('w-4 h-4', active ? 'text-primary' : 'text-text-secondary')} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Side: User Profile / Wallet */}
          <div className="hidden md:flex items-center gap-3">
            {isConnected && !isAuthenticated && (
              <button
                onClick={() => setShowSignInModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary-light font-semibold text-xs transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sign in with Wallet</span>
              </button>
            )}

            {isConnected && isAuthenticated && user && (
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-secondary hover:bg-surface-secondary/80 border border-border text-xs text-text transition-all"
                title="Edit Profile"
              >
                <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary text-[10px] font-bold">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="font-semibold text-text">{user.name || 'Anonymous'}</span>
                  <span className="text-[10px] text-text-muted">{user.role}</span>
                </div>
              </button>
            )}

            <WalletButton size="sm" />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-surface-secondary border border-border text-text-secondary hover:text-text focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-text" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    active
                      ? 'bg-surface-secondary text-text border border-border'
                      : 'text-text-secondary hover:text-text hover:bg-surface-secondary/40'
                  )}
                >
                  <Icon className={clsx('w-4 h-4', active ? 'text-primary' : 'text-text-secondary')} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-border/60 space-y-2">
            {isConnected && !isAuthenticated && (
              <button
                onClick={() => {
                  setShowSignInModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-text font-semibold text-sm shadow-glow-primary"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sign in with Wallet</span>
              </button>
            )}
            <WalletButton size="md" className="w-full" />
          </div>
        </div>
      )}
    </header>
  );
};