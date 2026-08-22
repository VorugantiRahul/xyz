import React from 'react';
import { Activity, ShieldCheck, Github, ExternalLink } from 'lucide-react';
import { MONAD_EXPLORER_URL } from '../../config/contracts';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border/70 bg-surface py-8 mt-20 text-xs text-text-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-surface-secondary border border-border flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-semibold text-text">SkillPulse</span>
          <span className="text-text-muted">•</span>
          <span>Proof of Competency Protocol</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={MONAD_EXPLORER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text flex items-center gap-1 transition-colors"
          >
            <span>Monad Explorer</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="inline-flex items-center gap-1 text-success">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Monad Testnet Active</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
