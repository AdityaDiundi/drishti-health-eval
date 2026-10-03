'use client';

import React, { useState, useEffect } from 'react';
import { PROMPTS_DATA } from '@/data/prompts';
import staticManifest from '@/data/database_manifest.json';
import { ZoomIn, Check, Award, ArrowRight, ArrowLeft, Info, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ArenaViewProps {
  participant: { name: string; email: string; age: number };
  onEvaluationFinished: () => void;
}

interface ImageCardData {
  modelRealName: string;
  blindLabel: string;
  imageUrl: string;
}

export function ArenaView({ participant, onEvaluationFinished }: ArenaViewProps) {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState<{ url: string; label: string } | null>(null);
  const [winnerChoice, setWinnerChoice] = useState<string | null>(null);
  const [culturalRating, setCulturalRating] = useState<number>(4);
  const [medicalRating, setMedicalRating] = useState<number>(4);
  const [typographyRating, setTypographyRating] = useState<number>(4);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Store user's completed ratings across the 10 prompts
  const [completedRatings, setCompletedRatings] = useState<any[]>([]);

  const currentPrompt = PROMPTS_DATA[currentPromptIndex];

  // Extract images for current prompt from the database manifest
  const currentImages: ImageCardData[] = React.useMemo(() => {
    const promptId = currentPrompt.id;
    const matches = staticManifest.filter((m: any) => m.prompt_id === promptId);

    // Shuffle order deterministically per prompt based on promptId hash to avoid positional bias
    const labels = ['Model A', 'Model B', 'Model C'];
    const shuffled = [...matches].sort((a, b) => {
      const hashA = (a.model_name.length * 17 + promptId.charCodeAt(1)) % 10;
      const hashB = (b.model_name.length * 17 + promptId.charCodeAt(1)) % 10;
      return hashA - hashB;
    });

    return shuffled.map((item, idx) => ({
      modelRealName: item.model_name,
      blindLabel: labels[idx] || `Model ${idx + 1}`,
      imageUrl: item.image_url,
    }));
  }, [currentPromptIndex]);

  const [validationError, setValidationError] = useState<string | null>(null);

  // Helper for human-readable anchor labels
  const getScoreDesc = (val: number) => {
    switch (val) {
      case 1: return 'Critical Errors / Distorted';
      case 2: return 'Below Average / Westernized';
      case 3: return 'Moderate / Acceptable';
      case 4: return 'Authentic & Accurate';
      case 5: return 'Gold Standard';
      default: return '';
    }
  };

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
  }, [currentImages, zoomImage, winnerChoice, culturalRating, medicalRating, typographyRating, feedback, currentPromptIndex]);

  // Reset local form when moving to a new prompt
  useEffect(() => {
    setWinnerChoice(null);
    setCulturalRating(4);
    setMedicalRating(4);
    setTypographyRating(4);
    setFeedback('');
    setValidationError(null);
  }, [currentPromptIndex]);

  const handleNext = async () => {
    if (!winnerChoice) {
      setValidationError('Please select your preferred model (Model A, B, C) or choose "Tie / Equivalent" before proceeding.');
      return;
    }
    setValidationError(null);

    const selectedWinner = currentImages.find((img) => img.blindLabel === winnerChoice)?.modelRealName || 'Tie / Equivalent';

    const ratingRecord = {
      prompt_id: currentPrompt.id,
      prompt_title: currentPrompt.title,
      winner_model: selectedWinner,
      winner_blind_label: winnerChoice,
      cultural_fidelity: culturalRating,
      medical_accuracy: medicalRating,
      typography_fidelity: typographyRating,
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
          particleCount: 120,
          spread: 80,
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
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Evaluation Completed!</h2>
        <p className="text-slate-300 text-sm max-w-lg mx-auto mb-8">
          Thank you, <strong>{participant.name}</strong>. Your blind ratings across all 10 Indian public health prompts have been recorded in the Supabase database.
        </p>

        {/* Model Reveal Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left mb-8">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Blind Identity Reveal & Your Picks</span>
          </h3>

          <div className="space-y-3">
            {completedRatings.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <div>
                  <span className="font-semibold text-emerald-400 mr-2">{r.prompt_id}</span>
                  <span className="text-slate-300">{r.prompt_title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">You Picked:</span>
                  <span className="px-2 py-0.5 rounded font-medium bg-slate-800 text-white border border-slate-700">
                    {r.winner_model}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onEvaluationFinished}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-xl shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Award className="w-4 h-4" />
          <span>View Live Leaderboard & Model Rankings</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Progress & Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
          <span>Prompt {currentPromptIndex + 1} of {PROMPTS_DATA.length}: <strong className="text-white">{currentPrompt.title}</strong></span>
          <span className="text-emerald-400">{Math.round(((currentPromptIndex + 1) / PROMPTS_DATA.length) * 100)}% Completed</span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
            style={{ width: `${((currentPromptIndex + 1) / PROMPTS_DATA.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Prompt Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-6 shadow-xl shadow-slate-950/50">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {currentPrompt.id}
            </span>
            <span className="text-xs font-medium text-slate-400">{currentPrompt.category}</span>
          </div>
          <span className="text-[11px] text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Focus: {currentPrompt.rubricFocus}
          </span>
        </div>

        <p className="text-sm sm:text-base font-medium text-white mb-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed">
          &ldquo;{currentPrompt.prompt}&rdquo;
        </p>

        {/* Visual checkpoints checklist */}
        <div className="pt-2 border-t border-slate-800/60 flex flex-wrap gap-2 items-center text-xs text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center space-x-1">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>Key Checkpoints:</span>
          </span>
          {currentPrompt.keyVisualCheckpoints.map((cp, idx) => (
            <span key={idx} className="bg-slate-800/60 px-2 py-0.5 rounded text-[11px] text-slate-300 border border-slate-700/50">
              • {cp}
            </span>
          ))}
        </div>
      </div>

      {/* Blind 3-Model Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {currentImages.map((img, idx) => {
          const isSelected = winnerChoice === img.blindLabel;
          return (
            <div
              key={img.blindLabel}
              className={`group relative flex flex-col bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
                isSelected
                  ? 'border-emerald-500 shadow-xl shadow-emerald-500/15 ring-2 ring-emerald-500/30'
                  : 'border-slate-800 hover:border-slate-700 shadow-lg'
              }`}
            >
              {/* Blind Label Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
                <span className="text-sm font-bold text-white tracking-wide">{img.blindLabel}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Blind Test</span>
              </div>

              {/* Image Container with Zoom Button */}
              <div className="relative aspect-square w-full bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setZoomImage({ url: img.imageUrl, label: img.blindLabel })}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.imageUrl}
                  alt={img.blindLabel}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="eager"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md text-white border border-slate-700/60 opacity-80 group-hover:opacity-100 transition-opacity hover:bg-slate-900"
                  title="Click to zoom and inspect details"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Vote Button */}
              <div className="p-4 bg-slate-900/90 mt-auto">
                <button
                  type="button"
                  onClick={() => setWinnerChoice(img.blindLabel)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  <span className="w-5 h-5 rounded-md bg-black/20 flex items-center justify-center text-[10px] font-mono">
                    {idx + 1}
                  </span>
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 text-slate-950" />
                      <span>Selected as Best</span>
                    </>
                  ) : (
                    <span>Vote {img.blindLabel}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tie Option */}
      <div className="flex justify-center mb-8">
        <button
          type="button"
          onClick={() => setWinnerChoice('Tie')}
          className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all border ${
            winnerChoice === 'Tie'
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="w-4 h-4 rounded bg-slate-800 text-[10px] font-mono flex items-center justify-center text-slate-400">T</span>
          <span>{winnerChoice === 'Tie' ? '✓ Marked as a Tie / Equivalent' : 'Models are Equivalent / Tie'}</span>
        </button>
      </div>

      {/* Scoring Rubric & Feedback Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Detailed Rubric Ratings (1–5)</span>
          </h4>
          <span className="text-[11px] text-slate-500 hidden sm:inline">Use keyboard numbers [1], [2], [3] or [T] to vote</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-4">
          {/* Cultural Fidelity */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-slate-300">Cultural Fidelity</span>
              <span className="text-xs font-bold text-emerald-400">{culturalRating}/5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={culturalRating}
              onChange={(e) => setCulturalRating(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[11px] text-emerald-400/90 font-medium mt-1">{getScoreDesc(culturalRating)}</p>
            <p className="text-[10px] text-slate-500">Saree, village context, Indian nuance</p>
          </div>

          {/* Medical Accuracy */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-slate-300">Domain / Equipment</span>
              <span className="text-xs font-bold text-emerald-400">{medicalRating}/5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={medicalRating}
              onChange={(e) => setMedicalRating(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[11px] text-emerald-400/90 font-medium mt-1">{getScoreDesc(medicalRating)}</p>
            <p className="text-[10px] text-slate-500">Vaccine box, PHC interior, register</p>
          </div>

          {/* Typography */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-slate-300">Typography / Clarity</span>
              <span className="text-xs font-bold text-emerald-400">{typographyRating}/5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={typographyRating}
              onChange={(e) => setTypographyRating(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[11px] text-emerald-400/90 font-medium mt-1">{getScoreDesc(typographyRating)}</p>
            <p className="text-[10px] text-slate-500">Devanagari text, charts, clarity</p>
          </div>
        </div>

        {/* Optional Evaluator Feedback */}
        <div>
          <input
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Optional evaluator observation (e.g. 'Model A had accurate ASHA border, but Model B got the courtyard better')"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Validation Banner */}
      {validationError && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{validationError}</span>
          </div>
          <span className="text-[10px] text-amber-400/80 font-mono hidden sm:inline">Press [1], [2], [3] or [T]</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentPromptIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentPromptIndex === 0}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <span>{currentPromptIndex === PROMPTS_DATA.length - 1 ? (isSubmitting ? 'Submitting...' : 'Submit Evaluation') : 'Next Prompt'}</span>
          <span className="text-[10px] opacity-75 font-mono hidden sm:inline">[Enter ↵]</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Lightbox Zoom Modal */}
      {zoomImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md" onClick={() => setZoomImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-2 text-xs text-slate-300 font-semibold border-b border-slate-800 mb-2">
              <span>{zoomImage.label} — Inspecting Detail</span>
              <button onClick={() => setZoomImage(null)} className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800">Close ✕</button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={zoomImage.url} alt={zoomImage.label} className="max-w-full max-h-[75vh] object-contain rounded-xl mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
