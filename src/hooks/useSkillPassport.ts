import { useState, useEffect, useCallback } from 'react';
import { SkillProofData } from '../api/types';

// Sample skills only for explicit demo exploration route
export const DEMO_SAMPLE_SKILLS: SkillProofData[] = [
  {
    skill: 'Solidity',
    score: 91,
    status: 'ACTIVE',
    lastVerified: '2 days ago',
    daysAgo: 2,
    expiryDays: 30,
    txHash: '0x3a88f4e24a8726591dc8f78fa5e6b1dc924976c66cf17f78c5208b5e6798031a',
    level: 'Intermediate',
    confidence: 0.96,
  },
  {
    skill: 'Python',
    score: 76,
    status: 'AGING',
    lastVerified: '34 days ago',
    daysAgo: 34,
    expiryDays: 45,
    txHash: '0x17c938481ae6195c64bf2a0956b7c53d10a29487c94b726081da74618e47f201',
    level: 'Intermediate',
    confidence: 0.91,
  },
  {
    skill: 'React',
    score: 42,
    status: 'STALE',
    lastVerified: '95 days ago',
    daysAgo: 95,
    expiryDays: 45,
    txHash: '0x889104fa69182bb2c091d374829fa756b10a948576c0293817a56481029471ab',
    level: 'Intermediate',
    confidence: 0.88,
  },
];

const DEMO_ADDRESS = '0x8849b2c12d554fea21b898ee0ff27a419c81de34';

export function useSkillPassport(address?: string) {
  const normalized = address?.toLowerCase();
  const isDemoAddress = normalized === DEMO_ADDRESS;
  const storageKey = `skillpulse_passport_${normalized || 'default'}`;

  const loadInitialSkills = (): SkillProofData[] => {
    if (!address) return [];
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Failed to load local cached skills:', e);
    }
    // Only return demo sample skills if browsing the demo address
    return isDemoAddress ? DEMO_SAMPLE_SKILLS : [];
  };

  const [skills, setSkills] = useState<SkillProofData[]>(loadInitialSkills);

  // Re-load when address changes
  useEffect(() => {
    setSkills(loadInitialSkills());
  }, [address, storageKey]);

  /**
   * Update or add verified skill score and transaction hash
   */
  const updateSkillProof = useCallback(
    (skillName: string, score: number, txHash?: string, evidenceHash?: string) => {
      setSkills((prevSkills) => {
        const existingIndex = prevSkills.findIndex(
          (s) => s.skill.toLowerCase() === skillName.toLowerCase()
        );

        const newSkillData: SkillProofData = {
          skill: skillName,
          score: score,
          status: score >= 80 ? 'ACTIVE' : score >= 60 ? 'AGING' : 'STALE',
          lastVerified: 'Just now',
          daysAgo: 0,
          expiryDays: 30,
          txHash: txHash || `0x${Math.random().toString(16).substring(2, 66)}`,
          evidenceHash: evidenceHash,
          level: 'Intermediate',
          confidence: 0.97,
        };

        let updated: SkillProofData[];
        if (existingIndex >= 0) {
          updated = [...prevSkills];
          updated[existingIndex] = { ...updated[existingIndex], ...newSkillData };
        } else {
          updated = [newSkillData, ...prevSkills];
        }

        try {
          if (address) {
            localStorage.setItem(storageKey, JSON.stringify(updated));
          }
        } catch (e) {
          console.warn('Failed to persist skills:', e);
        }

        return updated;
      });
    },
    [address, storageKey]
  );

  return {
    skills,
    updateSkillProof,
  };
}