import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { User, Briefcase, Code, Sparkles, X } from 'lucide-react';

export const ProfileSetupModal: React.FC = () => {
  const { address } = useAccount();
  const { showProfileModal, setShowProfileModal, saveProfile, user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || 'Smart Contract Engineer');
  const [primarySkill, setPrimarySkill] = useState(user?.primarySkill || 'Solidity');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!showProfileModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name or developer handle');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await saveProfile({
        name,
        role,
        primarySkill,
        bio
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={() => setShowProfileModal(false)}
          className="absolute top-5 right-5 text-text-secondary hover:text-text p-1.5 rounded-xl hover:bg-surface-secondary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Identity</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-text">
            {user?.name ? 'Edit Profile' : 'Welcome to SkillPulse'}
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Set up your profile identity linked to your verified Monad wallet address.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Your Name / Handle
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Voruganti"
                required
                className="w-full px-4 py-3 pl-10 rounded-xl bg-surface-secondary border border-border focus:border-primary focus:outline-none text-text text-sm font-medium transition-colors"
              />
              <User className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Role Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Role / Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Smart Contract Engineer, Full Stack Dev"
                required
                className="w-full px-4 py-3 pl-10 rounded-xl bg-surface-secondary border border-border focus:border-primary focus:outline-none text-text text-sm font-medium transition-colors"
              />
              <Briefcase className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Primary Skill Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Primary Skill
            </label>
            <div className="relative">
              <select
                value={primarySkill}
                onChange={(e) => setPrimarySkill(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-xl bg-surface-secondary border border-border focus:border-primary focus:outline-none text-text text-sm font-medium transition-colors appearance-none cursor-pointer"
              >
                <option value="Solidity">Solidity (Monad On-Chain MVP)</option>
                <option value="Python">Python (Async & Systems)</option>
                <option value="React">React (Web3 & Optimistic State)</option>
              </select>
              <Code className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Bio (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Bio / Focus (Optional)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Building secure decentralized applications and AI verification agents on Monad."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border focus:border-primary focus:outline-none text-text text-sm transition-colors resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-danger font-medium">{error}</p>
          )}

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full shadow-glow-primary font-semibold"
            >
              {user?.name ? 'Save Changes' : 'Create Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};