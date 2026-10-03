'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PROMPTS_DATA, PromptItem } from '@/data/prompts';
import staticManifest from '@/data/database_manifest.json';
import {
  Sparkles,
  Check,
  ZoomIn,
  ArrowRight,
  ArrowLeft,
  Award,
  CheckCircle2,
  Info,
  Scale,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ArenaViewProps {
  participant: { name: string; email: string; age: number };
  onEvaluationFinished: () => void;
  onResetParticipant?: () => void;
}

export function ArenaView({ participant, onEvaluationFinished, onResetParticipant }: ArenaViewProps) {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [subStep, setSubStep] = useState<'pick' | 'verify'>('pick');
  const [winnerChoice, setWinnerChoice] = useState<'A' | 'B' | 'C' | 'Tie' | null>(null);
  const [mobileActiveTab, setMobileActiveTab] = useState<'A' | 'B' | 'C'>('A');

  // Prompt-specific question answers: maps question.id -> selected score (1, 3, or 5)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');
  const [completedRatings, setCompletedRatings] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [zoomImage, setZoomImage] = useState<{ url: string; label: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentPrompt: PromptItem = PROMPTS_DATA[currentPromptIndex];

  // Deterministic shuffle seeded by prompt ID so Model A, B, C positions vary across prompts
  const currentImages = useMemo(() => {
    const rawImages = staticManifest.filter((m: any) => m.prompt_id === currentPrompt.id);
    const seed = currentPrompt.id.charCodeAt(1) + currentPrompt.id.charCodeAt(2);
    const shuffled = [...rawImages].sort((a, b) => {
      const hashA = (a.model_name.charCodeAt(0) + seed) % 7;
      const hashB = (b.model_name.charCodeAt(0) + seed) % 7;
      return hashA - hashB;
    });

    const labels: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];
    return shuffled.map((img, idx) => ({
      blindLabel: labels[idx],
      modelRealName: img.model_name,
      imageUrl: img.image_url,
    }));
  }, [currentPromptIndex]);

  // Reset form when moving to a new prompt
  useEffect(() => {
    setSubStep('pick');
    setWinnerChoice(null);
    setMobileActiveTab('A');
    const defaults: Record<string, number> = {};
    currentPrompt.evaluationQuestions.forEach((q) => {
      defaults[q.id] = 5;
    });
    setSelectedAnswers(defaults);
    setFeedback('');
    setValidationError(null);
  }, [currentPromptIndex]);

  // Helper to select winner and proceed directly to step 2 (verify)
  const handleSelectWinner = (choice: 'A' | 'B' | 'C' | 'Tie') => {
    setWinnerChoice(choice);
    setValidationError(null);
    setSubStep('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard navigation for power users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (subStep === 'pick') {
        if (e.key === '1' && currentImages[0]) handleSelectWinner('A');
        if (e.key === '2' && currentImages[1]) handleSelectWinner('B');
        if (e.key === '3' && currentImages[2]) handleSelectWinner('C');
        if (e.key.toLowerCase() === 't') handleSelectWinner('Tie');
      } else if (subStep === 'verify') {
        if (e.key === 'Enter') handleNextPrompt();
        if (e.key === 'Backspace' || e.key.toLowerCase() === 'b') setSubStep('pick');
      }

      if (e.key === 'Escape' && zoomImage) setZoomImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentImages, zoomImage, subStep, winnerChoice, selectedAnswers, feedback, currentPromptIndex]);

  const handleNextPrompt = async () => {
    if (!winnerChoice) {
      setValidationError('Please select a model or mark a Tie.');
      setSubStep('pick');
      return;
    }

    const selectedWinner = currentImages.find((img) => img.blindLabel === winnerChoice)?.modelRealName || 'Tie / Equivalent';

    let culturalScore = 4;
    let medicalScore = 4;
    let typographyScore = 4;

    currentPrompt.evaluationQuestions.forEach((q) => {
      const score = selectedAnswers[q.id] || 4;
      if (q.dimension === 'cultural') culturalScore = score;
      if (q.dimension === 'medical') medicalScore = score;
      if (q.dimension === 'typography') typographyScore = score;
    });

    const ratingRecord = {
      prompt_id: currentPrompt.id,
      prompt_title: currentPrompt.title,
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
      // Completed all 10!
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

  // Completion screen
  if (isFinished) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Evaluation Completed!
        </h2>
        <p className="text-gray-600 text-sm max-w-lg mx-auto mb-8">
          Thank you, <strong>{participant.name}</strong>. Your blind ratings across all 10 Indian public health prompts have been successfully recorded.
        </p>

        {/* Model Reveal Table */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left mb-8 shadow-sm">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Blind Identity Reveal &amp; Your Picks</span>
          </h3>

          <div className="space-y-3">
            {completedRatings.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                <div>
                  <span className="font-bold text-blue-700 mr-2">{r.prompt_id}</span>
                  <span className="text-gray-800 font-medium">{r.prompt_title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Your Pick:</span>
                  <span className="px-2.5 py-1 rounded-md font-semibold bg-white text-gray-900 border border-gray-300 shadow-2xs">
                    {r.winner_model}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onEvaluationFinished}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
        >
          View Updated Leaderboard →
        </button>
      </div>
    );
  }

  const progressPercent = Math.round((completedRatings.length / PROMPTS_DATA.length) * 100);
  const selectedWinnerImage = currentImages.find((img) => img.blindLabel === winnerChoice);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            <div className="flex items-center space-x-1.5 text-[11px] bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
              <span className={`px-1.5 py-0.5 rounded font-bold ${subStep === 'pick' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>
                1. Pick Winner
              </span>
              <span className="text-gray-400">→</span>
              <span className={`px-1.5 py-0.5 rounded font-bold ${subStep === 'verify' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>
                2. Verify Criteria
              </span>
            </div>
            <span className="text-blue-700 font-bold">
              {progressPercent}% Completed
            </span>
          </div>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* =========================================================================
          STEP 1: BLIND SELECTION (COMPARE & PICK WINNER)
          ========================================================================= */}
      {subStep === 'pick' && (
        <div className="animate-in fade-in duration-200">
          {/* Prompt Context Card (Compact & Readable) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 mb-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {currentPrompt.id}
                </span>
                <span className="text-xs font-semibold text-gray-700">{currentPrompt.category}</span>
              </div>
              <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-medium">
                Focus: {currentPrompt.rubricFocus}
              </span>
            </div>

            <p className="text-sm font-medium text-gray-900 mb-2.5 bg-gray-50 p-3 rounded-xl border border-gray-200 leading-relaxed font-serif">
              &ldquo;{currentPrompt.prompt}&rdquo;
            </p>

            <div className="flex flex-wrap gap-1.5 items-center text-xs text-gray-600">
              <span className="font-semibold text-gray-800 flex items-center space-x-1 mr-1">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>Inspection Points:</span>
              </span>
              {currentPrompt.keyVisualCheckpoints.map((cp, idx) => (
                <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-[11px] text-gray-700 border border-gray-200">
                  • {cp}
                </span>
              ))}
            </div>
          </div>

          {/* Instructions banner */}
          <div className="mb-4 flex items-center justify-between px-1 text-xs text-gray-500">
            <span className="font-semibold text-gray-800">
              Select the most authentic public health depiction:
            </span>
            <span className="hidden md:inline font-mono text-[11px] text-gray-400">
              Shortcuts: [1], [2], [3] or [T]
            </span>
          </div>

          {/* DESKTOP 3-MODEL GRID (Hidden on Mobile) */}
          <div className="hidden md:grid md:grid-cols-3 gap-5 mb-5">
            {currentImages.map((img, idx) => (
              <div
                key={img.blindLabel}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col group"
              >
                {/* Header */}
                <div className="px-3.5 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-md bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold font-mono">
                      {img.blindLabel}
                    </span>
                    <span className="text-xs font-bold text-gray-800">Model {img.blindLabel}</span>
                  </div>
                </div>

                {/* Image */}
                <div
                  className="relative aspect-4/3 w-full bg-gray-100 cursor-pointer overflow-hidden"
                  onClick={() => setZoomImage({ url: img.imageUrl, label: `Model ${img.blindLabel}` })}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.imageUrl}
                    alt={`Model ${img.blindLabel}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                    loading="eager"
                  />
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 bg-white/90 text-gray-800 hover:text-blue-600 px-2 py-1 rounded-lg text-[11px] backdrop-blur-xs shadow-xs transition-all flex items-center space-x-1"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span className="font-semibold">Inspect</span>
                  </button>
                </div>

                {/* Vote CTA Button */}
                <div className="p-3 bg-white mt-auto border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleSelectWinner(img.blindLabel)}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
                  >
                    <span className="w-4 h-4 rounded bg-black/10 flex items-center justify-center text-[10px] font-mono">
                      {idx + 1}
                    </span>
                    <span>Select Model {img.blindLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* MOBILE INTERACTIVE TABBED VIEWER (Visible ONLY on Mobile) */}
          <div className="block md:hidden mb-5 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            {/* Segmented Model Selector */}
            <div className="flex border-b border-gray-200 bg-gray-50 p-1.5 gap-1.5">
              {(['A', 'B', 'C'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setMobileActiveTab(tab)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    mobileActiveTab === tab
                      ? 'bg-white text-blue-700 shadow-xs border border-gray-200'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Model {tab}
                </button>
              ))}
            </div>

            {/* Active Mobile Image */}
            {(() => {
              const activeImg = currentImages.find((img) => img.blindLabel === mobileActiveTab)!;
              return (
                <div>
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
                      className="absolute bottom-3 right-3 bg-white/90 text-gray-800 px-2.5 py-1 rounded-lg text-xs shadow-md flex items-center space-x-1"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span className="font-semibold">Tap to Zoom</span>
                    </button>
                  </div>

                  <div className="p-4 bg-white border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleSelectWinner(activeImg.blindLabel)}
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Select Model {activeImg.blindLabel}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Tie Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => handleSelectWinner('Tie')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 shadow-2xs cursor-pointer"
            >
              <span className="w-4 h-4 rounded bg-gray-200 text-[10px] font-mono flex items-center justify-center text-gray-700">T</span>
              <span>Models are Equivalent / Tie →</span>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setSubStep('pick')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Model</span>
              </button>
              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-snug">
                  Scenario Criteria • <span className="text-blue-700">{winnerChoice === 'Tie' ? 'Tie / Equivalent' : `Model ${winnerChoice}`}</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Rate public health fidelity for Prompt {currentPrompt.id}
                </p>
              </div>
            </div>
          </div>

          {/* Two-Column Responsive Split View: Image (Left) + Questions (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-start">
            {/* Left Column: Image Preview (Sticky on desktop so it never disappears) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="px-3.5 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span>Selected Image Preview</span>
                  <span className="text-blue-700 text-[11px] font-mono">{currentPrompt.id}</span>
                </div>

                {winnerChoice !== 'Tie' && selectedWinnerImage ? (
                  <div
                    className="relative aspect-4/3 w-full bg-gray-100 cursor-pointer overflow-hidden group"
                    onClick={() => setZoomImage({ url: selectedWinnerImage.imageUrl, label: `Model ${winnerChoice}` })}
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
                  <div className="grid grid-cols-3 gap-1 p-2 bg-gray-100 aspect-4/3 items-center">
                    {currentImages.map((img) => (
                      <div key={img.blindLabel} className="aspect-square rounded-lg overflow-hidden border border-gray-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.imageUrl} alt={img.blindLabel} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
                  <p className="line-clamp-2 font-serif italic text-gray-700">
                    &ldquo;{currentPrompt.prompt}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Clarifying Questions */}
            <div className="lg:col-span-7 space-y-4">
              {currentPrompt.evaluationQuestions.map((q, qIdx) => {
                const currentScore = selectedAnswers[q.id] || 5;

                return (
                  <div key={q.id} className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {q.dimensionTitle}
                        </span>
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mt-1 leading-snug">
                          {qIdx + 1}. {q.question}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-gray-700 shrink-0 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
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
                            className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                              isPicked
                                ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-100 shadow-xs'
                                : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-bold text-xs ${isPicked ? 'text-blue-700' : 'text-gray-900'}`}>
                                {opt.label}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                opt.score === 5
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : opt.score === 3
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {opt.score}p
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 leading-tight">
                              {opt.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Optional Evaluator Qualitative Note */}
              <div className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-xs">
                <input
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Optional evaluator observation (e.g. 'ASHA border is spot-on, courtyard looks genuine')"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>

              {/* Action Buttons: Next Scenario / Submit */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setSubStep('pick')}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-2xs transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Models</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextPrompt}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
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
