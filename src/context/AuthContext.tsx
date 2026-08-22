import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { UserProfile } from '../api/types';
import { getAuthNonce, verifyAuthSignature, getUserProfile, saveUserProfile } from '../api/client';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isSigningIn: boolean;
  isNewUser: boolean;
  showSignInModal: boolean;
  showProfileModal: boolean;
  setShowSignInModal: (show: boolean) => void;
  setShowProfileModal: (show: boolean) => void;
  signInWithWallet: () => Promise<boolean>;
  saveProfile: (data: { name: string; role: string; primarySkill: string; bio?: string }) => Promise<UserProfile | null>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Sync auth state when wallet changes or disconnects
  useEffect(() => {
    if (!isConnected || !address) {
      setUser(null);
      setIsAuthenticated(false);
      setShowSignInModal(false);
      setShowProfileModal(false);
      return;
    }

    const checkExistingProfile = async () => {
      try {
        const profile = await getUserProfile(address);
        if (profile) {
          setUser(profile);
        }
      } catch (err) {
        console.warn('Error fetching existing profile:', err);
      }
    };

    checkExistingProfile();
  }, [address, isConnected]);

  // Sign in with wallet flow
  const signInWithWallet = useCallback(async (): Promise<boolean> => {
    if (!address) return false;

    try {
      setIsSigningIn(true);

      // 1. Get SIWE-structured nonce message
      const { message } = await getAuthNonce(address);

      // 2. Prompt user to sign zero-gas signature in MetaMask
      const signature = await signMessageAsync({ message });

      // 3. Verify signature with backend
      const result = await verifyAuthSignature(address, message, signature);

      if (result.verified) {
        setIsAuthenticated(true);
        setShowSignInModal(false);

        if (result.isNewUser || !result.user.name) {
          setIsNewUser(true);
          setShowProfileModal(true);
        } else {
          setUser(result.user);
          setIsNewUser(false);
        }
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Wallet signature authentication failed:', err);
      return false;
    } finally {
      setIsSigningIn(false);
    }
  }, [address, signMessageAsync]);

  // Save/Update profile
  const saveProfile = useCallback(
    async (data: { name: string; role: string; primarySkill: string; bio?: string }): Promise<UserProfile | null> => {
      if (!address) return null;

      try {
        const saved = await saveUserProfile({
          walletAddress: address,
          name: data.name,
          role: data.role,
          primarySkill: data.primarySkill,
          bio: data.bio
        });

        setUser(saved);
        setShowProfileModal(false);
        setIsNewUser(false);
        return saved;
      } catch (err) {
        console.error('Failed to save profile:', err);
        return null;
      }
    },
    [address]
  );

  const signOut = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setShowSignInModal(false);
    setShowProfileModal(false);
    if (address) {
      localStorage.removeItem(`sp_token_${address.toLowerCase()}`);
    }
  }, [address]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isSigningIn,
        isNewUser,
        showSignInModal,
        showProfileModal,
        setShowSignInModal,
        setShowProfileModal,
        signInWithWallet,
        saveProfile,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};