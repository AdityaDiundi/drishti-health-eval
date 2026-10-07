'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PROMPTS_DATA, PromptItem } from '@/data/prompts';
import staticManifest from '@/data/database_manifest.json';
import {
  ZoomIn,
  ArrowRight,
  ArrowLeft,
  Award,
  CheckCircle2,
  Info,
  Scale,
  Check,
  AlertOctagon,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ArenaViewProps {
  participant: { name: string; email: string; age: number };
  onEvaluationFinished: () => void;
  onResetParticipant?: () => void;
}

// 3 unique pairs between the 3 benchmark models
const MODEL_PAIRS: [string, string][] = [
  ['OpenAI GPT Image 1', 'Google Gemini 3.1 Flash Image Preview (Nano Banana 2)'], // Pair 0
  ['OpenAI GPT Image 1', 'Google Gemini 3 Pro Image Preview (Nano Banana Pro)'], // Pair 1
  ['Google Gemini 3.1 Flash Image Preview (Nano Banana 2)', 'Google Gemini 3 Pro Image Preview (Nano Banana Pro)'], // Pair 2
];

export function ArenaView({ participant, onEvaluationFinished, onResetParticipant }: ArenaViewProps) {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [subStep, setSubStep] = useState<'pick' | 'verify'>('pick');
  const [winnerChoice, setWinnerChoice] = useState<'A' | 'B' | 'Tie' | 'BothBad' | null>(null);
  const [mobileTab, setMobileTab] = useState<'both' | 'A' | 'B'>('both');

  // Prompt-specific question answers: maps question.id -> selected score (1, 3, or 5)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');
  const [completedRatings, setCompletedRatings] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [zoomImage, setZoomImage] = useState<{ url: string; label: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentPrompt: PromptItem = PROMPTS_DATA[currentPromptIndex];

  // Compute a deterministic seed from the evaluator's identifier (email or name)
  const evaluatorSeed = useMemo(() => {
    const str = participant?.email || participant?.name || 'evaluator';
    return str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }, [participant?.email, participant?.name]);

  // Resolve the 2 blinded models (Model A vs Model B) for the current scenario
  // Evaluator offset ensures all 3 pairs (and all 30 images) are evaluated across the evaluator pool
  const currentImages = useMemo(() => {
    const promptRawImages = staticManifest.filter((m: any) => m.prompt_id === currentPrompt.id);

    // Offset pair index by evaluator seed so different evaluators see different pairs for the same prompt
    const pairIdx = (currentPromptIndex + evaluatorSeed) % MODEL_PAIRS.length;
    const pair = MODEL_PAIRS[pairIdx];

    // Counterbalance left/right (A vs B) placement to eliminate position bias
    const shouldFlip = (evaluatorSeed + currentPromptIndex + currentPrompt.id.charCodeAt(1)) % 2 === 1;
    const orderedModels = shouldFlip ? [pair[1], pair[0]] : pair;

    const imgA = promptRawImages.find((img: any) => img.model_name === orderedModels[0]);
    const imgB = promptRawImages.find((img: any) => img.model_name === orderedModels[1]);

    const labels: ('A' | 'B')[] = ['A', 'B'];
    const resolved = [imgA, imgB].filter(Boolean);

    return resolved.map((img, idx) => ({
      blindLabel: labels[idx],
      modelRealName: img!.model_name,
      imageUrl: img!.image_url,
    }));
  }, [currentPromptIndex, currentPrompt.id, evaluatorSeed]);

  // Reset state when advancing to a new prompt
  useEffect(() => {
    setSubStep('pick');
    setWinnerChoice(null);
    setMobileTab('both');
    const defaults: Record<string, number> = {};
    currentPrompt.evaluationQuestions.forEach((q) => {
      defaults[q.id] = 5;
    });
    setSelectedAnswers(defaults);
    setFeedback('');
    setValidationError(null);
  }, [currentPromptIndex, currentPrompt]);

  // Helper to select winner and proceed directly to step 2 (verify)
  const handleSelectWinner = (choice: 'A' | 'B' | 'Tie' | 'BothBad') => {
    setWinnerChoice(choice);
    setValidationError(null);
    // If both failed, pre-fill criteria with 1 (Fail / Non-compliant)
    if (choice === 'BothBad') {
      const fails: Record<string, number> = {};
      currentPrompt.evaluationQuestions.forEach((q) => {
        fails[q.id] = 1;
      });
      setSelectedAnswers(fails);
    }
    setSubStep('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard navigation for power users: [1] Model A, [2] Model B, [T] Both Good, [B] Both Bad
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (subStep === 'pick') {
        if (e.key === '1' && currentImages[0]) handleSelectWinner('A');
        if (e.key === '2' && currentImages[1]) handleSelectWinner('B');
        if (e.key.toLowerCase() === 't') handleSelectWinner('Tie');
        if (e.key.toLowerCase() === 'b') handleSelectWinner('BothBad');
      } else if (subStep === 'verify') {
        if (e.key === 'Enter') handleNextPrompt();
        if (e.key === 'Backspace' || e.key === 'Escape') setSubStep('pick');
      }

      if (e.key === 'Escape' && zoomImage) setZoomImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentImages, zoomImage, subStep, winnerChoice, selectedAnswers, feedback, currentPromptIndex]);

  const handleNextPrompt = async () => {
    if (!winnerChoice) {
      setValidationError('Please select a model, a Tie, or mark Both as Failed.');
      setSubStep('pick');
      return;
    }

    let selectedWinner = 'Tie / Equivalent';
    if (winnerChoice === 'A' || winnerChoice === 'B') {
      selectedWinner = currentImages.find((img) => img.blindLabel === winnerChoice)?.modelRealName || 'Tie / Equivalent';
    } else if (winnerChoice === 'BothBad') {
      selectedWinner = 'Both Bad / Neither Compliant';
    } else if (winnerChoice === 'Tie') {
      selectedWinner = 'Both Good / Tie';
    }

    let culturalScore = winnerChoice === 'BothBad' ? 1 : 4;
    let medicalScore = winnerChoice === 'BothBad' ? 1 : 4;
    let typographyScore = winnerChoice === 'BothBad' ? 1 : 4;

    currentPrompt.evaluationQuestions.forEach((q) => {
      const score = selectedAnswers[q.id] || (winnerChoice === 'BothBad' ? 1 : 4);
      if (q.dimension === 'cultural') culturalScore = score;
      if (q.dimension === 'medical') medicalScore = score;
      if (q.dimension === 'typography') typographyScore = score;
    });

    const ratingRecord = {
      prompt_id: currentPrompt.id,
      prompt_title: currentPrompt.title,
      model_a_name: currentImages[0]?.modelRealName || '',
      model_b_name: currentImages[1]?.modelRealName || '',
      winner_model: selectedWinner,
      winner_blind_label: winnerChoice,
      cultural_fidelity: culturalScore,
      medical_accuracy: medicalScore,
      typography_fidelity: typographyScore,
      criteria_responses: selectedAnswers,
      feedback: feedback.trim(),
    };

    const newCompleted = [...completedRatings, ratingRecord];
    setCompletedRatings(newCompleted);

    if (currentPromptIndex < PROMPTS_DATA.length - 1) {
      setCurrentPromptIndex((prev) => prev + 1);
    } else {
      // Completed all 10 scenarios!
      setIsSubmitting(true);
      try {
        await fetch('/api/ratings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            participant,
            ratings: newCompleted,
          }),
        });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('drishti_participant');
        }
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        setIsFinished(true);
      } catch (err) {
        console.error('Failed to submit evaluation:', err);
        setIsFinished(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Completion screen: Blind identity reveal
  if (isFinished) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-16 text-center min-w-0 overflow-hidden">
        <div className="w-16 h-16 bg-[#DDEBE3] border border-[#C6DDD1] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#0F2E24] shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E24] tracking-tight mb-2">
          Evaluation Completed!
        </h2>
        <p className="text-[#69716B] text-sm max-w-lg mx-auto mb-8">
          Thank you, <strong>{participant.name}</strong>. Your blind pairwise ratings across all 10 Indian public health prompts have been recorded.
        </p>

        {/* Model Reveal Table */}
        <div className="bg-white border border-[#E3E7E2] rounded-xl p-5 sm:p-6 text-left mb-8 shadow-sm">
          <h3 className="text-xs font-bold text-[#0F2E24] uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Blind Identity Reveal &amp; Your Picks</span>
          </h3>

          <div className="space-y-3">
            {completedRatings.map((r, i) => (
              <div
                key={i}
                className="p-3.5 rounded-lg bg-[#FAFBF9] border border-[#E3E7E2] text-xs space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[#0F2E24] bg-[#DDEBE3] px-1.5 py-0.5 rounded text-[11px]">
                      {r.prompt_id}
                    </span>
                    <span className="text-[#171A18] font-semibold">{r.prompt_title}</span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[#69716B]">Winner:</span>
                    <span
                      className={`px-2.5 py-1 rounded-md font-bold border shadow-2xs ${
                        r.winner_blind_label === 'BothBad' || r.winner_model?.includes('Both Bad')
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : r.winner_blind_label === 'Tie' || r.winner_model?.includes('Tie')
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-white text-[#0F2E24] border-[#C6DDD1]'
                      }`}
                    >
                      {r.winner_model}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-[#69716B] flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-[#E3E7E2]/70">
                  <span className="font-semibold text-slate-700">Pairwise Matchup:</span>
                  <span className="font-medium text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {r.model_a_name}
                  </span>
                  <span className="text-slate-400 font-mono">vs</span>
                  <span className="font-medium text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {r.model_b_name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onEvaluationFinished}
          className="px-6 py-3 rounded-lg bg-[#0F2E24] hover:bg-[#163d30] text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
        >
          View Updated Leaderboard →
        </button>
      </div>
    );
  }

  const progressPercent = Math.round((completedRatings.length / PROMPTS_DATA.length) * 100);
  const selectedWinnerImage = currentImages.find((img) => img.blindLabel === winnerChoice);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-w-0 overflow-hidden">
      {/* Top Progress & Header Bar */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-semibold text-gray-600 gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              Scenario {currentPromptIndex + 1} of {PROMPTS_DATA.length}:{' '}
              <strong className="text-gray-900">{currentPrompt.title}</strong>
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500 font-normal">
              Evaluator: <strong className="text-gray-900">{participant.name}</strong>
            </span>
            {onResetParticipant && (
              <button
                type="button"
                onClick={onResetParticipant}
                className="text-blue-600 hover:text-blue-800 text-[11px] font-medium underline cursor-pointer"
              >
                (Change)
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-auto">
            {/* Step 1 / Step 2 Indicator */}
            <div className="flex items-center space-x-1.5 text-[11px] bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              <span
                className={`px-1.5 py-0.5 rounded font-bold ${
                  subStep === 'pick' ? 'bg-[#0F2E24] text-white' : 'text-slate-500'
                }`}
              >
                1. Pick Model (A vs B)
              </span>
              <span className="text-slate-400">→</span>
              <span
                className={`px-1.5 py-0.5 rounded font-bold ${
                  subStep === 'verify' ? 'bg-[#0F2E24] text-white' : 'text-slate-500'
                }`}
              >
                2. Verify Criteria
              </span>
            </div>
            <span className="font-mono text-xs text-slate-900 font-bold">
              {progressPercent}%
            </span>
          </div>
        </div>

        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0F2E24] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* =========================================================================
          STEP 1: PAIRWISE BLIND SELECTION (MODEL A vs MODEL B)
          ========================================================================= */}
      {subStep === 'pick' && (
        <div className="animate-in fade-in duration-200">
          {/* Prompt Context Card */}
          <div className="bg-white border border-[#E3E7E2] rounded-xl p-4 sm:p-5 mb-5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-[#DDEBE3] text-[#0F2E24] border border-[#C6DDD1]">
                  {currentPrompt.id}
                </span>
                <span className="text-xs font-semibold text-[#171A18]">{currentPrompt.category}</span>
              </div>
              <span className="text-[11px] text-[#0F2E24] bg-[#FAFBF9] px-2.5 py-0.5 rounded-full border border-[#E3E7E2] font-medium">
                Focus: {currentPrompt.rubricFocus}
              </span>
            </div>

            <p className="text-sm font-medium text-slate-900 mb-2.5 bg-[#FAFBF9] p-3 rounded-lg border border-[#E3E7E2] leading-relaxed font-serif">
              &ldquo;{currentPrompt.prompt}&rdquo;
            </p>

            <div className="flex flex-wrap gap-1.5 items-center text-xs text-[#69716B]">
              <span className="font-semibold text-slate-800 flex items-center space-x-1 mr-1">
                <Info className="w-3.5 h-3.5 text-[#0F2E24]" />
                <span>Inspection Points:</span>
              </span>
              {currentPrompt.keyVisualCheckpoints.map((cp, idx) => (
                <span
                  key={idx}
                  className="bg-white px-2 py-0.5 rounded text-[11px] text-[#171A18] border border-[#E3E7E2]"
                >
                  • {cp}
                </span>
              ))}
            </div>
          </div>

          {/* Instructions banner */}
          <div className="mb-4 flex items-center justify-between px-1 text-xs text-[#69716B]">
            <span className="font-semibold text-[#171A18] flex items-center space-x-1.5">
              <span>Compare both models blindly and pick the superior public health depiction:</span>
            </span>
            <span className="hidden md:inline font-mono text-[11px] text-slate-400">
              Shortcuts: [1] Model A • [2] Model B • [T] Both Good • [B] Both Bad
            </span>
          </div>

          {/* DESKTOP PAIRWISE GRID: 2 COLUMNS (Model A vs Model B) */}
          <div className="hidden md:grid md:grid-cols-2 gap-6 mb-6">
            {currentImages.map((img, idx) => (
              <div
                key={img.blindLabel}
                className="bg-white border border-[#E3E7E2] rounded-2xl overflow-hidden shadow-2xs hover:border-[#0F2E24]/40 hover:shadow-xs transition-all flex flex-col group"
              >
                {/* Header */}
                <div className="px-4 py-3 bg-[#FAFBF9] border-b border-[#E3E7E2] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#0F2E24] text-white flex items-center justify-center text-xs font-bold font-mono shadow-2xs">
                      {img.blindLabel}
                    </span>
                    <span className="text-sm font-bold text-[#171A18]">Model {img.blindLabel}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#69716B] bg-white px-2 py-0.5 rounded border border-[#E3E7E2]">
                    Blind Double-Masked
                  </span>
                </div>

                {/* Image */}
                <div
                  className="relative aspect-4/3 w-full bg-slate-100 cursor-pointer overflow-hidden"
                  onClick={() => setZoomImage({ url: img.imageUrl, label: `Model ${img.blindLabel}` })}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.imageUrl}
                    alt={`Model ${img.blindLabel}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                    loading="eager"
                  />
                  <button
                    type="button"
                    className="absolute bottom-2.5 right-2.5 bg-white/95 text-slate-800 hover:text-slate-950 px-2.5 py-1 rounded-md text-[11px] border border-slate-200 shadow-2xs transition-colors flex items-center space-x-1.5 cursor-pointer backdrop-blur-xs"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span className="font-semibold">Inspect Detail</span>
                  </button>
                </div>

                {/* Vote CTA Button */}
                <div className="p-3.5 bg-white mt-auto border-t border-[#E3E7E2]">
                  <button
                    type="button"
                    onClick={() => handleSelectWinner(img.blindLabel)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#0F2E24] hover:bg-[#163d30] text-white transition-all flex items-center justify-center space-x-2.5 cursor-pointer shadow-xs active:scale-[0.99]"
                  >
                    <span className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center text-[11px] font-mono">
                      {idx + 1}
                    </span>
                    <span>Select Model {img.blindLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* MOBILE INTERACTIVE COMPARISON (Visible ONLY on Mobile) */}
          <div className="block md:hidden mb-6">
            {/* View Switcher: Both Stacked | Model A | Model B */}
            <div className="flex border border-[#E3E7E2] bg-[#FAFBF9] rounded-xl p-1 gap-1 mb-4 shadow-2xs">
              <button
                type="button"
                onClick={() => setMobileTab('both')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mobileTab === 'both'
                    ? 'bg-white text-[#0F2E24] shadow-xs border border-[#E3E7E2]'
                    : 'text-[#69716B]'
                }`}
              >
                Compare Both
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('A')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mobileTab === 'A'
                    ? 'bg-white text-[#0F2E24] shadow-xs border border-[#E3E7E2]'
                    : 'text-[#69716B]'
                }`}
              >
                Model A
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('B')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mobileTab === 'B'
                    ? 'bg-white text-[#0F2E24] shadow-xs border border-[#E3E7E2]'
                    : 'text-[#69716B]'
                }`}
              >
                Model B
              </button>
            </div>

            {/* Display Active Selection */}
            {mobileTab === 'both' ? (
              <div className="space-y-4">
                {currentImages.map((img, idx) => (
                  <div
                    key={img.blindLabel}
                    className="bg-white border border-[#E3E7E2] rounded-xl overflow-hidden shadow-xs"
                  >
                    <div className="px-3 py-2 bg-[#FAFBF9] border-b border-[#E3E7E2] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#171A18] flex items-center space-x-2">
                        <span className="w-5 h-5 rounded bg-[#0F2E24] text-white flex items-center justify-center text-[11px] font-mono">
                          {img.blindLabel}
                        </span>
                        <span>Model {img.blindLabel}</span>
                      </span>
                      <span className="text-[10px] text-[#69716B] font-mono">Blind</span>
                    </div>

                    <div
                      className="relative aspect-4/3 w-full bg-slate-100 cursor-pointer overflow-hidden"
                      onClick={() => setZoomImage({ url: img.imageUrl, label: `Model ${img.blindLabel}` })}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.imageUrl}
                        alt={`Model ${img.blindLabel}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute bottom-2 right-2 bg-white/95 text-slate-800 px-2 py-1 rounded text-[11px] shadow-sm flex items-center space-x-1"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>

                    <div className="p-3 bg-white border-t border-[#E3E7E2]">
                      <button
                        type="button"
                        onClick={() => handleSelectWinner(img.blindLabel)}
                        className="w-full py-2.5 px-3 rounded-lg text-xs font-bold bg-[#0F2E24] hover:bg-[#163d30] text-white shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Select Model {img.blindLabel}</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              (() => {
                const activeImg = currentImages.find((img) => img.blindLabel === mobileTab)!;
                return (
                  <div className="bg-white border border-[#E3E7E2] rounded-xl overflow-hidden shadow-xs">
                    <div className="px-3.5 py-2.5 bg-[#FAFBF9] border-b border-[#E3E7E2] flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded bg-[#0F2E24] text-white flex items-center justify-center text-xs font-bold font-mono">
                          {activeImg.blindLabel}
                        </span>
                        <span className="text-xs font-bold text-[#171A18]">Model {activeImg.blindLabel}</span>
                      </div>
                      <span className="text-[10px] text-[#69716B] font-mono">Tap below to switch</span>
                    </div>

                    <div
                      className="relative aspect-square w-full bg-gray-100 cursor-pointer overflow-hidden"
                      onClick={() => setZoomImage({ url: activeImg.imageUrl, label: `Model ${activeImg.blindLabel}` })}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeImg.imageUrl}
                        alt={`Model ${activeImg.blindLabel}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute bottom-3 right-3 bg-white/95 text-gray-800 px-2.5 py-1 rounded-lg text-xs shadow-md flex items-center space-x-1"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span className="font-semibold">Tap to Zoom</span>
                      </button>
                    </div>

                    <div className="p-3.5 bg-white border-t border-[#E3E7E2]">
                      <button
                        type="button"
                        onClick={() => handleSelectWinner(activeImg.blindLabel)}
                        className="w-full py-3 px-4 rounded-lg text-xs font-bold bg-[#0F2E24] hover:bg-[#163d30] text-white shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Select Model {activeImg.blindLabel}</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>

          {/* Tie & Both Bad Action Buttons (LMSYS Research Standard) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 pb-4">
            <button
              type="button"
              onClick={() => handleSelectWinner('Tie')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white text-[#171A18] border border-[#E3E7E2] hover:bg-[#FAFBF9] hover:border-[#69716B] shadow-2xs transition-all cursor-pointer"
            >
              <Scale className="w-4 h-4 text-[#69716B]" />
              <span>Both are Good / Tie</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                [T]
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#69716B]" />
            </button>

            <button
              type="button"
              onClick={() => handleSelectWinner('BothBad')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white text-red-700 border border-red-200 hover:bg-red-50 hover:border-red-300 shadow-2xs transition-all cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4 text-red-600" />
              <span>Both are Bad / Neither Compliant</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                [B]
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: VERIFY SCENARIO CRITERIA (WITH CHOSEN MODEL RIGHT BESIDE QUESTIONS)
          ========================================================================= */}
      {subStep === 'verify' && (
        <div className="animate-in fade-in duration-200">
          {/* Step 2 Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E3E7E2] shadow-xs">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setSubStep('pick')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#171A18] bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Choice</span>
              </button>
              <div>
                <h3 className="text-sm font-bold text-[#171A18] leading-snug">
                  Scenario Verification •{' '}
                  <span
                    className={`font-mono font-bold ${
                      winnerChoice === 'BothBad' ? 'text-red-700' : 'text-[#0F2E24]'
                    }`}
                  >
                    {winnerChoice === 'Tie'
                      ? 'Both are Good / Tie'
                      : winnerChoice === 'BothBad'
                      ? 'Both Bad / Neither Compliant'
                      : `Model ${winnerChoice}`}
                  </span>
                </h3>
                <p className="text-xs text-[#69716B]">
                  {winnerChoice === 'BothBad'
                    ? 'Both models failed public health requirements — verify non-compliance on rubric'
                    : `Rate public health fidelity for Prompt ${currentPrompt.id}`}
                </p>
              </div>
            </div>
          </div>

          {/* Two-Column Responsive Split View: Image Preview (Left) + Questions (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-start">
            {/* Left Column: Image Preview */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="bg-white border border-[#E3E7E2] rounded-xl overflow-hidden shadow-xs">
                <div className="px-3.5 py-2 bg-[#FAFBF9] border-b border-[#E3E7E2] flex items-center justify-between text-xs font-semibold text-[#171A18]">
                  <span>
                    {winnerChoice === 'Tie'
                      ? 'Pairwise Images (Both Good)'
                      : winnerChoice === 'BothBad'
                      ? 'Pairwise Images (Both Failed)'
                      : `Selected Winner: Model ${winnerChoice}`}
                  </span>
                  <span className="text-[#0F2E24] text-[11px] font-mono">{currentPrompt.id}</span>
                </div>

                {winnerChoice !== 'Tie' && winnerChoice !== 'BothBad' && selectedWinnerImage ? (
                  <div
                    className="relative aspect-4/3 w-full bg-gray-100 cursor-pointer overflow-hidden group"
                    onClick={() =>
                      setZoomImage({ url: selectedWinnerImage.imageUrl, label: `Model ${winnerChoice}` })
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedWinnerImage.imageUrl}
                      alt={`Model ${winnerChoice}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                    />
                    <button
                      type="button"
                      className="absolute bottom-2.5 right-2.5 bg-white/95 text-gray-800 px-2 py-1 rounded-lg text-xs shadow-md flex items-center space-x-1"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-semibold">Inspect Detail</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    {winnerChoice === 'BothBad' && (
                      <div className="bg-red-50 text-red-700 px-3 py-1.5 border-b border-red-200 text-[11px] font-semibold flex items-center space-x-1.5">
                        <AlertOctagon className="w-3.5 h-3.5 shrink-0 text-red-600" />
                        <span>Both models failed public health requirements</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2 p-3 bg-gray-100 aspect-4/3 items-center">
                      {currentImages.map((img) => (
                        <div
                          key={img.blindLabel}
                          className={`relative aspect-square rounded-lg overflow-hidden border cursor-pointer ${
                            winnerChoice === 'BothBad' ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                          }`}
                          onClick={() =>
                            setZoomImage({ url: img.imageUrl, label: `Model ${img.blindLabel}` })
                          }
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.imageUrl} alt={img.blindLabel} className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] font-mono px-1 rounded">
                            {img.blindLabel}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-[#FAFBF9] border-t border-[#E3E7E2] text-xs text-[#69716B]">
                  <p className="line-clamp-2 font-serif italic text-[#171A18]">
                    &ldquo;{currentPrompt.prompt}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Clarifying Rubric Questions */}
            <div className="lg:col-span-7 space-y-4">
              {currentPrompt.evaluationQuestions.map((q, qIdx) => {
                const currentScore = selectedAnswers[q.id] || 5;

                return (
                  <div key={q.id} className="p-4 rounded-xl bg-white border border-[#E3E7E2] shadow-xs">
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F2E24] bg-[#DDEBE3]/60 px-2 py-0.5 rounded border border-[#C6DDD1]">
                          {q.dimensionTitle}
                        </span>
                        <h4 className="text-xs sm:text-sm font-semibold text-[#171A18] mt-1 leading-snug">
                          {qIdx + 1}. {q.question}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-[#0F2E24] shrink-0 bg-[#FAFBF9] px-2 py-1 rounded-md border border-[#E3E7E2] font-mono">
                        {currentScore}/5 pts
                      </span>
                    </div>

                    {/* Touch-Friendly Option Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {q.options.map((opt) => {
                        const isPicked = currentScore === opt.score;
                        return (
                          <button
                            key={opt.score}
                            type="button"
                            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt.score }))}
                            className={`text-left p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                              isPicked
                                ? 'bg-[#DDEBE3]/40 border-[#0F2E24] ring-1 ring-[#0F2E24] shadow-xs'
                                : 'bg-[#FAFBF9] border-[#E3E7E2] hover:border-[#69716B] text-[#171A18] hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-bold text-xs ${isPicked ? 'text-[#0F2E24]' : 'text-[#171A18]'}`}>
                                {opt.label}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  opt.score === 5
                                    ? 'bg-[#DDEBE3] text-[#0F2E24]'
                                    : opt.score === 3
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {opt.score}p
                              </span>
                            </div>
                            <p className="text-[11px] text-[#69716B] leading-tight">{opt.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Optional Evaluator Qualitative Note */}
              <div className="bg-white border border-[#E3E7E2] rounded-xl p-3.5 shadow-xs">
                <input
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Optional evaluator observation (e.g. 'ASHA border is spot-on, courtyard looks genuine')"
                  className="w-full bg-[#FAFBF9] border border-[#E3E7E2] rounded-lg px-3.5 py-2 text-xs text-[#171A18] placeholder-[#69716B] focus:outline-hidden focus:border-[#0F2E24] focus:bg-white transition-colors"
                />
              </div>

              {/* Action Buttons: Back / Next Scenario */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setSubStep('pick')}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-[#171A18] bg-white border border-[#E3E7E2] hover:bg-[#FAFBF9] shadow-2xs transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Models</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextPrompt}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#0F2E24] hover:bg-[#163d30] shadow-sm transition-all cursor-pointer"
                >
                  <span>
                    {currentPromptIndex === PROMPTS_DATA.length - 1
                      ? isSubmitting
                        ? 'Submitting Benchmark...'
                        : 'Submit Evaluation'
                      : 'Next Scenario'}
                  </span>
                  <span className="text-[10px] opacity-80 font-mono hidden sm:inline">[Enter ↵]</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-xs"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white p-3 rounded-2xl border border-gray-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-800 font-semibold border-b border-gray-200 mb-2">
              <span>{zoomImage.label} — Detail Inspection</span>
              <button
                onClick={() => setZoomImage(null)}
                className="text-gray-500 hover:text-gray-900 px-2 py-0.5 rounded bg-gray-100 cursor-pointer"
              >
                Close ✕
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomImage.url}
              alt={zoomImage.label}
              className="max-w-full max-h-[75vh] object-contain rounded-xl mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
