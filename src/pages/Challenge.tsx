import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ChallengeCard } from '../components/skills/ChallengeCard';
import { ScoreCard } from '../components/skills/ScoreCard';
import { TransactionStatus } from '../components/wallet/TransactionStatus';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { generateChallenge, evaluateEvidence } from '../api/client';
import { ChallengeResponse, EvaluateResponse, SkillType, SkillLevel } from '../api/types';
import { useSkillContract } from '../hooks/useSkillContract';
import { useSkillPassport } from '../hooks/useSkillPassport';
import {
  Code,
  Sparkles,
  Send,
  CheckCircle2,
  FileCode,
  ShieldAlert,
  ArrowLeft,
  Terminal,
  RotateCcw
} from 'lucide-react';

const AVAILABLE_SKILLS: SkillType[] = ['Solidity', 'Python', 'React'];
const AVAILABLE_LEVELS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

export const Challenge: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();

  // Step 1 & 2: Skill and Level Selection
  const initialSkill = (searchParams.get('skill') as SkillType) || 'Solidity';
  const initialLevel = (searchParams.get('level') as SkillLevel) || 'Intermediate';

  const [selectedSkill, setSelectedSkill] = useState<SkillType>(initialSkill);
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>(initialLevel);

  // Challenge Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [challenge, setChallenge] = useState<ChallengeResponse | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Evidence Submission State
  const [submissionCode, setSubmissionCode] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluateResponse | null>(null);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);

  // Blockchain Transaction State
  const {
    txState,
    txHash,
    txError,
    resetTx,
    verifySkill,
  } = useSkillContract();

  const { updateSkillProof } = useSkillPassport(address);

  // Auto-generate initial challenge on mount or skill switch
  useEffect(() => {
    handleGenerateChallenge(selectedSkill, selectedLevel);
  }, []);

  const handleGenerateChallenge = async (skill: SkillType, level: SkillLevel) => {
    setIsGenerating(true);
    setGenerationError(null);
    setChallenge(null);
    setEvaluation(null);
    resetTx();

    try {
      const result = await generateChallenge({ skill, level });
      setChallenge(result);
      setSubmissionCode(result.starterCode || '');
    } catch (err: any) {
      setGenerationError(err.message || 'Failed to generate challenge');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSkillChange = (newSkill: SkillType) => {
    setSelectedSkill(newSkill);
    handleGenerateChallenge(newSkill, selectedLevel);
  };

  const handleLevelChange = (newLevel: SkillLevel) => {
    setSelectedLevel(newLevel);
    handleGenerateChallenge(selectedSkill, newLevel);
  };

  // Step 5 & 6: Submit & Analyze Evidence
  const handleSubmitEvidence = async () => {
    if (!challenge) return;
    if (!submissionCode.trim()) {
      alert('Please provide your solution code before submitting.');
      return;
    }

    setIsEvaluating(true);
    setEvaluationError(null);

    try {
      const result = await evaluateEvidence({
        challenge: {
          title: challenge.title,
          description: challenge.description,
          criteria: challenge.criteria,
          skill: selectedSkill,
          level: selectedLevel,
        },
        submission: submissionCode,
      });

      setEvaluation(result);
    } catch (err: any) {
      setEvaluationError(err.message || 'Failed to evaluate code submission');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Step 8 & 9: On-Chain Verification
  const handleVerifyOnChain = async () => {
    if (!evaluation) return;

    const userAddress = (address || '0x8849b2C12D554FEA21B898eE0fF27A419c81DE34') as `0x${string}`;

    const hash = await verifySkill(
      userAddress,
      selectedSkill,
      evaluation.score,
      submissionCode
    );

    if (hash) {
      updateSkillProof(selectedSkill, evaluation.score, hash);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl bg-surface-secondary border border-border hover:border-primary/50 text-text-secondary hover:text-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-text tracking-tight flex items-center gap-2">
              <span>Skill Challenge & Attestation</span>
            </h1>
            <p className="text-xs text-text-secondary">
              Step-by-step practical challenge evaluation and Monad Testnet proof generation.
            </p>
          </div>
        </div>

        {/* Skill & Level Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Skill Selector */}
          <div className="flex items-center bg-surface-secondary p-1 rounded-xl border border-border">
            {AVAILABLE_SKILLS.map((s) => (
              <button
                key={s}
                onClick={() => handleSkillChange(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSkill === s
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Level Selector */}
          <div className="flex items-center bg-surface-secondary p-1 rounded-xl border border-border">
            {AVAILABLE_LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedLevel === lvl
                    ? 'bg-surface text-text border border-border/80 font-bold'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state for challenge generation */}
      {isGenerating && (
        <LoadingState
          message="Synthesizing practical challenge..."
          description={`Generating real-world ${selectedSkill} problem with evaluation rubrics.`}
          size="lg"
        />
      )}

      {/* Generation Error State */}
      {generationError && (
        <ErrorState
          title="Challenge Generation Failed"
          message={generationError}
          onRetry={() => handleGenerateChallenge(selectedSkill, selectedLevel)}
        />
      )}

      {/* Main Challenge + Submission Workspace */}
      {!isGenerating && challenge && (
        <div className="space-y-8">
          {/* Step 3 & 4: Display Challenge */}
          <ChallengeCard
            challenge={challenge}
            skill={selectedSkill}
            level={selectedLevel}
          />

          {/* Step 5: Evidence Code Editor */}
          <Card variant="surface" className="p-6 border-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-text">Code & Evidence Solution</span>
                <Badge variant="secondary" size="sm">
                  {selectedSkill === 'Solidity' ? '.sol' : selectedSkill === 'Python' ? '.py' : '.tsx'}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSubmissionCode(challenge.starterCode || '')}
                  leftIcon={<RotateCcw className="w-3 h-3" />}
                >
                  Reset Template
                </Button>
              </div>
            </div>

            {/* Code Input Area */}
            <div className="relative rounded-xl overflow-hidden border border-border focus-within:border-primary/60 transition-colors bg-[#0D0F16]">
              <textarea
                value={submissionCode}
                onChange={(e) => setSubmissionCode(e.target.value)}
                placeholder="// Write or paste your verified solution here..."
                rows={16}
                className="w-full bg-transparent text-text font-mono text-xs sm:text-sm p-4 outline-none resize-y leading-relaxed selection:bg-primary/30"
                spellCheck={false}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-text-muted">
                Tip: Submissions are evaluated on security patterns, gas economy, and interface conformance.
              </p>

              <Button
                variant="primary"
                size="md"
                onClick={handleSubmitEvidence}
                isLoading={isEvaluating}
                rightIcon={<Send className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-glow-primary"
              >
                Submit Evidence for AI Evaluation
              </Button>
            </div>
          </Card>

          {/* Step 6 & 7: Evaluation State */}
          {isEvaluating && (
            <LoadingState
              message="AI is analyzing your submission..."
              description="Reviewing security bounds, gas consumption, and rubric criteria match."
              size="lg"
            />
          )}

          {evaluationError && (
            <ErrorState
              title="Evaluation Failed"
              message={evaluationError}
              onRetry={handleSubmitEvidence}
            />
          )}

          {/* Step 7 & 8: Score Card Display */}
          {evaluation && !isEvaluating && (
            <ScoreCard
              evaluation={evaluation}
              skillName={selectedSkill}
              onVerifyClick={handleVerifyOnChain}
              isVerifying={txState === 'waiting' || txState === 'confirming'}
            />
          )}

          {/* Step 9: Transaction Status Lifecycle */}
          <TransactionStatus
            state={txState}
            txHash={txHash}
            errorMessage={txError}
            onReset={resetTx}
            targetPassportAddress={address || '0x8849b2C12D554FEA21B898eE0fF27A419c81DE34'}
            skillName={selectedSkill}
            score={evaluation?.score}
          />
        </div>
      )}
    </div>
  );
};
