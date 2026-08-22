import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
import {
  SKILLPULSE_CONTRACT_ADDRESS,
  SKILLPULSE_ABI,
  hashEvidence,
  generateChallengeId,
} from '../config/contracts';
import { TxLifecycleState } from '../components/wallet/TransactionStatus';

export function useSkillContract() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [txState, setTxState] = useState<TxLifecycleState>('idle');
  const [txHash, setTxHash] = useState<string | undefined>();
  const [txError, setTxError] = useState<string | undefined>();

  const resetTx = useCallback(() => {
    setTxState('idle');
    setTxHash(undefined);
    setTxError(undefined);
  }, []);

  /**
   * createChallenge on-chain
   */
  const createChallenge = useCallback(
    async (skill: string, level: number): Promise<`0x${string}` | null> => {
      if (!address) throw new Error('Wallet not connected');
      try {
        setTxState('waiting');
        setTxError(undefined);

        const hash = await writeContractAsync({
          address: SKILLPULSE_CONTRACT_ADDRESS,
          abi: SKILLPULSE_ABI,
          functionName: 'createChallenge',
          args: [skill, level],
        });

        setTxHash(hash);
        setTxState('confirming');

        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash });
        }
        setTxState('success');
        return hash;
      } catch (err: any) {
        console.error('createChallenge error:', err);
        setTxError(err.shortMessage || err.message || 'Transaction rejected');
        setTxState('failed');
        return null;
      }
    },
    [address, writeContractAsync, publicClient]
  );

  /**
   * submitEvidence on-chain (using deterministic hash of evidence)
   */
  const submitEvidence = useCallback(
    async (challengeId: `0x${string}`, evidenceText: string): Promise<`0x${string}` | null> => {
      if (!address) throw new Error('Wallet not connected');
      try {
        setTxState('waiting');
        setTxError(undefined);

        const evidenceHash = hashEvidence(evidenceText);

        const hash = await writeContractAsync({
          address: SKILLPULSE_CONTRACT_ADDRESS,
          abi: SKILLPULSE_ABI,
          functionName: 'submitEvidence',
          args: [challengeId, evidenceHash],
        });

        setTxHash(hash);
        setTxState('confirming');

        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash });
        }
        setTxState('success');
        return hash;
      } catch (err: any) {
        console.error('submitEvidence error:', err);
        setTxError(err.shortMessage || err.message || 'Transaction rejected');
        setTxState('failed');
        return null;
      }
    },
    [address, writeContractAsync, publicClient]
  );

  /**
   * verifySkill on-chain:
   * Commits the verified skill, score, and deterministic evidence hash to Monad.
   */
  const verifySkill = useCallback(
    async (
      targetUser: `0x${string}`,
      skill: string,
      score: number,
      evidenceText: string
    ): Promise<`0x${string}` | null> => {
      try {
        setTxState('waiting');
        setTxError(undefined);

        const evidenceHash = hashEvidence(evidenceText);

        // Execute on-chain transaction
        const hash = await writeContractAsync({
          address: SKILLPULSE_CONTRACT_ADDRESS,
          abi: SKILLPULSE_ABI,
          functionName: 'verifySkill',
          args: [targetUser, skill, BigInt(score), evidenceHash],
        });

        setTxHash(hash);
        setTxState('confirming');

        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash });
        } else {
          // Await standard block confirmation delay if provider unavailable
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        setTxState('success');
        return hash;
      } catch (err: any) {
        console.error('verifySkill error:', err);
        // Clean error message extraction
        const errorMsg = err?.shortMessage || err?.message || 'Transaction was rejected or failed on Monad Testnet.';
        setTxError(errorMsg);
        setTxState('failed');
        return null;
      }
    },
    [writeContractAsync, publicClient]
  );

  /**
   * getSkillProof (read contract)
   */
  const getSkillProof = useCallback(
    async (user: `0x${string}`, skill: string) => {
      if (!publicClient) return null;
      try {
        const proof = await publicClient.readContract({
          address: SKILLPULSE_CONTRACT_ADDRESS,
          abi: SKILLPULSE_ABI,
          functionName: 'getSkillProof',
          args: [user, skill],
        });
        return proof;
      } catch (err) {
        console.warn('getSkillProof read fallback:', err);
        return null;
      }
    },
    [publicClient]
  );

  return {
    txState,
    txHash,
    txError,
    resetTx,
    createChallenge,
    submitEvidence,
    verifySkill,
    getSkillProof,
    hashEvidence,
    generateChallengeId,
  };
}
