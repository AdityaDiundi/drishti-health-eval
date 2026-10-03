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
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ArenaViewProps {
  participant: { name: string; email: string; age: number };
  onEvaluationFinished: () => void;
}

export function ArenaView({ participant, onEvaluationFinished }: ArenaViewProps) {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [winnerChoice, setWinnerChoice] = useState<'A' | 'B' | 'C' | 'Tie' | null>(null);
  
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
    setWinnerChoice(null);
    // Initialize default scores for the 3 questions to 5 (or unselected)
    const defaults: Record<string, number> = {};
    currentPrompt.evaluationQuestions.forEach((q) => {
      defaults[q.id] = 5;
    });
    setSelectedAnswers(defaults);
    setFeedback('');
    setValidationError(null);
  }, [currentPromptIndex]);

  // Keyboard navigation for fast evaluation flow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === '1' && currentImages[0]) {
        setWinnerChoice(currentImages[0].blindLabel);
        setValidationError(null);
      }
      if (e.key === '2' && currentImages[1]) {
        setWinnerChoice(currentImages[1].blindLabel);
        setValidationError(null);
      }
      if (e.key === '3' && currentImages[2]) {
        setWinnerChoice(currentImages[2].blindLabel);
        setValidationError(null);
      }
      if (e.key.toLowerCase() === 't') {
        setWinnerChoice('Tie');
        setValidationError(null);
      }
      if (e.key === 'Enter') {
        handleNext();
      }
      if (e.key === 'Escape' && zoomImage) setZoomImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentImages, zoomImage, winnerChoice, selectedAnswers, feedback, currentPromptIndex]);

  const handleNext = async () => {
    if (!winnerChoice) {
      setValidationError('Please vote for your preferred model (Model A, B, or C) or select "Models are Equivalent / Tie".');
      return;
    }
    setValidationError(null);

    const selectedWinner = currentImages.find((img) => img.blindLabel === winnerChoice)?.modelRealName || 'Tie / Equivalent';

    // Extract dimension scores from the prompt-specific questions
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
          Thank you, <strong>{participant.name}</strong>. Your blind ratings across all 10 Indian public health prompts have been recorded in the database.
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Progress & Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-600 mb-2">
          <span>
            Scenario {currentPromptIndex + 1} of {PROMPTS_DATA.length}:{' '}
            <strong className="text-gray-900">{currentPrompt.title}</strong>
          </span>
          <span className="text-blue-700 font-bold">
            {Math.round(((currentPromptIndex + 1) / PROMPTS_DATA.length) * 100)}% Completed
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 rounded-full"
            style={{ width: `${((currentPromptIndex + 1) / PROMPTS_DATA.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Prompt Context Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {currentPrompt.id}
            </span>
            <span className="text-xs font-semibold text-gray-600">{currentPrompt.category}</span>
          </div>
          <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-medium">
            Focus: {currentPrompt.rubricFocus}
          </span>
        </div>

        <p className="text-sm sm:text-base font-medium text-gray-900 mb-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200 leading-relaxed font-serif">
          &ldquo;{currentPrompt.prompt}&rdquo;
        </p>

        {/* Key checkpoints checklist */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-2 items-center text-xs text-gray-600">
          <span className="font-semibold text-gray-800 flex items-center space-x-1">
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

      {/* Blind 3-Model Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {currentImages.map((img, idx) => {
          const isSelected = winnerChoice === img.blindLabel;
          return (
            <div
              key={img.blindLabel}
              className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 flex flex-col ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-100 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Header Label */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {img.blindLabel}
                  </span>
                  <span className="text-xs font-bold text-gray-800">Model {img.blindLabel}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">Blind Randomized</span>
              </div>

              {/* Image Preview Container */}
              <div
                className="relative aspect-square w-full bg-gray-100 cursor-pointer overflow-hidden group"
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
                  className="absolute bottom-3 right-3 bg-white/90 text-gray-800 hover:text-blue-600 p-2 rounded-xl text-xs backdrop-blur-xs shadow-md transition-all flex items-center space-x-1"
                  title="Click to zoom and inspect details"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold">Inspect</span>
                </button>
              </div>

              {/* Selection Button */}
              <div className="p-4 bg-white mt-auto">
                <button
                  type="button"
                  onClick={() => {
                    setWinnerChoice(img.blindLabel);
                    setValidationError(null);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  <span className="w-5 h-5 rounded-md bg-black/10 flex items-center justify-center text-[10px] font-mono">
                    {idx + 1}
                  </span>
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Selected as Best</span>
                    </>
                  ) : (
                    <span>Vote Model {img.blindLabel}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tie Button */}
      <div className="text-center mb-8">
        <button
          type="button"
          onClick={() => {
            setWinnerChoice('Tie');
            setValidationError(null);
          }}
          className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
            winnerChoice === 'Tie'
              ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <span className="w-4 h-4 rounded bg-gray-200 text-[10px] font-mono flex items-center justify-center text-gray-700">T</span>
          <span>{winnerChoice === 'Tie' ? '✓ Marked as a Tie / Equivalent' : 'Models are Equivalent / Tie'}</span>
        </button>
      </div>

      {/* Prompt-Specific Clarifying Verification Rubric (Replaces Generic Sliders) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-gray-200">
          <div>
            <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Scenario Verification Questions</span>
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Specific medical, cultural, and script fidelity criteria for Prompt {currentPrompt.id}
            </p>
          </div>
          <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
            {winnerChoice ? `Evaluating Pick: ${winnerChoice === 'Tie' ? 'Tie / Equivalent' : `Model ${winnerChoice}`}` : 'Please choose your winning model above'}
          </span>
        </div>

        {/* 3 Scenario-Specific Questions */}
        <div className="space-y-6">
          {currentPrompt.evaluationQuestions.map((q, qIdx) => {
            const currentScore = selectedAnswers[q.id] || 5;

            return (
              <div key={q.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                      {q.dimensionTitle}
                    </span>
                    <h5 className="text-xs font-semibold text-gray-900 mt-1.5 leading-snug">
                      {qIdx + 1}. {q.question}
                    </h5>
                  </div>
                  <span className="text-xs font-bold text-gray-700 shrink-0 bg-white px-2 py-1 rounded-md border border-gray-200">
                    {currentScore}/5 pts
                  </span>
                </div>

                {/* Option Choice Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
                  {q.options.map((opt) => {
                    const isPicked = currentScore === opt.score;
                    return (
                      <button
                        key={opt.score}
                        type="button"
                        onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt.score }))}
                        className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                          isPicked
                            ? 'bg-white border-blue-600 ring-2 ring-blue-100 shadow-xs'
                            : 'bg-white/80 border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-bold ${isPicked ? 'text-blue-700' : 'text-gray-900'}`}>
                            {opt.label}
                          </span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            opt.score === 5
                              ? 'bg-emerald-100 text-emerald-800'
                              : opt.score === 3
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {opt.score} pts
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
        </div>

        {/* Optional Evaluator Qualitative Note */}
        <div className="mt-5 pt-4 border-t border-gray-200">
          <input
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Optional evaluator observation (e.g., 'Model A had accurate ASHA border, but Model B rendered the courtyard better')"
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Validation Banner */}
      {validationError && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{validationError}</span>
          </div>
          <span className="text-[10px] text-amber-700 font-mono hidden sm:inline">Use keyboard [1], [2], [3] or [T]</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentPromptIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentPromptIndex === 0}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
        >
          <span>
            {currentPromptIndex === PROMPTS_DATA.length - 1
              ? isSubmitting
                ? 'Submitting...'
                : 'Submit Evaluation'
              : 'Next Scenario'}
          </span>
          <span className="text-[10px] opacity-80 font-mono hidden sm:inline">[Enter ↵]</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

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
                className="text-gray-500 hover:text-gray-900 px-2 py-0.5 rounded bg-gray-100"
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
