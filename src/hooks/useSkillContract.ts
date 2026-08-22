import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, usePublicClient, useSwitchChain, useChainId } from 'wagmi';
import { getAddress, parseGwei } from 'viem';
import {
  SKILLPULSE_CONTRACT_ADDRESS,
  SKILLPULSE_ABI,
  monadTestnet,
  hashEvidence,
  generateChallengeId,
} from '../config/contracts';
import { TxLifecycleState } from '../components/wallet/TransactionStatus';

export function useSkillContract() {
  const { address } = useAccount();
  const currentChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
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
   * Helper to ensure wallet is on Monad Testnet before any transaction
   */
  const ensureMonadNetwork = async () => {
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
        console.warn('wallet_addEthereumChain note:', err);
      }
    }

    if (currentChainId !== monadTestnet.id && switchChainAsync) {
      try {
        await switchChainAsync({ chainId: monadTestnet.id });
      } catch (switchErr) {
        console.warn('Switch chain note:', switchErr);
      }
    }
  };

  /**
   * createChallenge on-chain
   */
  const createChallenge = useCallback(
    async (skill: string, level: number): Promise<`0x${string}` | null> => {
      if (!address) throw new Error('Wallet not connected');
      try {
        setTxState('waiting');
        setTxError(undefined);

        await ensureMonadNetwork();

        const checksumContract = getAddress(SKILLPULSE_CONTRACT_ADDRESS);

        const hash = await writeContractAsync({
          chainId: monadTestnet.id,
          address: checksumContract,
          abi: SKILLPULSE_ABI,
          functionName: 'createChallenge',
          args: [skill, level],
          gas: 100_000n,
          maxPriorityFeePerGas: parseGwei('1'),
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
    [address, writeContractAsync, publicClient, currentChainId, switchChainAsync]
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

        await ensureMonadNetwork();

        const checksumContract = getAddress(SKILLPULSE_CONTRACT_ADDRESS);
        const evidenceHash = hashEvidence(evidenceText);

        const hash = await writeContractAsync({
          chainId: monadTestnet.id,
          address: checksumContract,
          abi: SKILLPULSE_ABI,
          functionName: 'submitEvidence',
          args: [challengeId, evidenceHash],
          gas: 100_000n,
          maxPriorityFeePerGas: parseGwei('1'),
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
    [address, writeContractAsync, publicClient, currentChainId, switchChainAsync]
  );

  /**
   * verifySkill on-chain:
   * Enforces Monad Testnet (MON currency) and executes ultra-low gas verification
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

        // Explicitly ensure user is on Monad Testnet before opening MetaMask
        await ensureMonadNetwork();

        const checksumTarget = getAddress(targetUser);
        const checksumContract = getAddress(SKILLPULSE_CONTRACT_ADDRESS);
        const evidenceHash = hashEvidence(evidenceText);

        // Execute on-chain transaction targeting Monad Testnet (Chain ID 10143)
        const hash = await writeContractAsync({
          chainId: monadTestnet.id,
          address: checksumContract,
          abi: SKILLPULSE_ABI,
          functionName: 'verifySkill',
          args: [checksumTarget, skill, BigInt(score), evidenceHash],
          gas: 120_000n,
          maxPriorityFeePerGas: parseGwei('1'),
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
        const errorMsg = err?.shortMessage || err?.message || 'Transaction was rejected or failed on Monad Testnet.';
        setTxError(errorMsg);
        setTxState('failed');
        return null;
      }
    },
    [writeContractAsync, publicClient, currentChainId, switchChainAsync]
  );

  /**
   * getSkillProof (read contract)
   */
  const getSkillProof = useCallback(
    async (user: `0x${string}`, skill: string) => {
      if (!publicClient) return null;
      try {
        const checksumUser = getAddress(user);
        const checksumContract = getAddress(SKILLPULSE_CONTRACT_ADDRESS);

        const proof = await publicClient.readContract({
          address: checksumContract,
          abi: SKILLPULSE_ABI,
          functionName: 'getSkillProof',
          args: [checksumUser, skill],
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