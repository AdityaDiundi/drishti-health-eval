'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Download, Users, CheckCircle, BarChart3, Sparkles } from 'lucide-react';

interface LeaderboardItem {
  modelId: string;
  name: string;
  shortName: string;
  company: string;
  codename: string;
  wins: number;
  winRate: number;
  eloRating: number;
  avgCultural: number;
  avgMedical: number;
  avgTypography: number;
  badgeColor: string;
}

interface LeaderboardProps {
  onStartEvaluation?: () => void;
  onNavigateTab?: (tab: 'arena' | 'leaderboard' | 'gallery' | 'methodology') => void;
}

export function LeaderboardView({ onStartEvaluation, onNavigateTab }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [totalRatings, setTotalRatings] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ratings')
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) setLeaderboard(data.leaderboard);
        if (data.totalRatings !== undefined) setTotalRatings(data.totalRatings);
        if (data.totalParticipants !== undefined) setTotalParticipants(data.totalParticipants);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching leaderboard:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500 text-sm">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Loading live Drishti-Health benchmark data...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* JANEVAL v1.0 Research Masthead & Hero Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-8 shadow-2xs">
        {/* Research Metadata Rail */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5">
          <span className="font-mono text-[10px] font-bold tracking-tight px-2 py-0.5 rounded bg-slate-900 text-white">
            JANEVAL v1.0
          </span>
          <span className="text-slate-300 font-mono text-[10px] hidden sm:inline">•</span>
          <span className="font-mono text-[10px] sm:text-[11px] text-slate-600 font-medium">
            {totalRatings} VERIFIED BLIND VOTES · {totalParticipants} EVALUATORS · DOUBLE-BLIND PAIRWISE ELO
          </span>
        </div>

        {/* Clean, High-Authority Research Headline */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Frontier Vision AI Benchmark for Indian Public-Health Representation
        </h1>

        {/* Core Research Framing */}
        <div className="mt-3 space-y-2 max-w-3xl text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-900 text-sm sm:text-base">
            How accurately do frontier vision models represent real-world Indian public-health contexts?
          </p>
          <p>
            JANEVAL evaluates AI-generated images across 10 frontline healthcare scenarios, testing whether models can reproduce the cultural, infrastructural, and visual details that make these environments recognizably and authentically Indian.
          </p>
        </div>

        {/* 2 Crisp Meta Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              03 EVALUATION AXES
            </span>
            <span className="font-semibold text-xs text-slate-800 mt-1 block">
              CULTURAL · INFRASTRUCTURAL · ORTHOGRAPHY
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              03 FRONTIER MODELS
            </span>
            <span className="font-semibold text-xs text-slate-800 mt-1 block font-mono">
              OpenAI GPT Image 1 · Google Gemini 3 Pro · Google Gemini 3.1 Flash
            </span>
          </div>
        </div>

        {/* 3 Domain-Specific Evaluation Axes Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-6">
          {/* AXIS 01 */}
          <div className="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  AXIS 01 · CULTURAL FIDELITY
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Frontline Healthcare in Context</h3>
              <p className="text-xs text-slate-600 font-medium italic mt-1 mb-2.5">
                Can the model represent who, where, and how healthcare happens in rural India?
              </p>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider font-mono text-slate-400">Evaluated against:</div>
                <p>• ASHA &amp; frontline worker appearance, identity &amp; role</p>
                <p>• Appropriate clothing, cotton sarees &amp; government ID badges</p>
                <p>• Working registers, field kits &amp; physical record books</p>
                <p>• Patient–worker interactions &amp; grounded social body language</p>
                <p>• Rural household &amp; community triage settings</p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">Failure mode:</span>
              <p className="text-slate-500 mt-0.5 leading-snug">
                Westernized clinical representation, doctor lab coats, generic uniforms &amp; distorted social dynamics.
              </p>
            </div>
          </div>

          {/* AXIS 02 */}
          <div className="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  AXIS 02 · INFRASTRUCTURAL FIDELITY
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Public-Health Systems &amp; Equipment</h3>
              <p className="text-xs text-slate-600 font-medium italic mt-1 mb-2.5">
                Can the model accurately represent the equipment and infrastructure used in frontline public healthcare?
              </p>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider font-mono text-slate-400">Evaluated against:</div>
                <p>• WHO-standard blue vaccine cold-chain carriers</p>
                <p>• Conditioned hard ice packs &amp; dial temperature monitors</p>
                <p>• Salter spring hanging baby weighing scales &amp; slings</p>
                <p>• Rural Primary Health Centre architecture &amp; non-electric storage</p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">Failure mode:</span>
              <p className="text-slate-500 mt-0.5 leading-snug">
                Generic hospital apparatus, incorrect cold-chain equipment &amp; unrealistic high-tech clinical environments.
              </p>
            </div>
          </div>

          {/* AXIS 03 */}
          <div className="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  AXIS 03 · ORTHOGRAPHIC FIDELITY
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Devanagari &amp; Public-Health Text</h3>
              <p className="text-xs text-slate-600 font-medium italic mt-1 mb-2.5">
                Can the model generate accurate, legible Hindi in real-world public-health environments?
              </p>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider font-mono text-slate-400">Evaluated against:</div>
                <p>• Continuous unbroken shirorekha (top horizontal line)</p>
                <p>• Accurate matras &amp; correct character conjunct formation</p>
                <p>• Legible Hindi public-health messaging on clinic wall murals</p>
                <p>• Authentic awareness messaging without Latin glyph bleeding</p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">Failure mode:</span>
              <p className="text-slate-500 mt-0.5 leading-snug">
                Gibberish pseudo-script, broken characters, misplaced matras &amp; fragmented shirorekha.
              </p>
            </div>
          </div>
        </div>

        {/* Action CTAs & Telemetry Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {onStartEvaluation && (
              <button
                onClick={onStartEvaluation}
                className="w-full sm:w-auto justify-center px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-300" />
                <span>Start Evaluation</span>
              </button>
            )}
            {onNavigateTab && (
              <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center sm:gap-2.5">
                <button
                  onClick={() => onNavigateTab('gallery')}
                  className="px-3.5 py-2 text-center rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  Gallery (30)
                </button>
                <button
                  onClick={() => onNavigateTab('methodology')}
                  className="px-3.5 py-2 text-center rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  Methodology
                </button>
              </div>
            )}
          </div>

          {/* Right: Live Telemetry Badges */}
          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto sm:flex sm:items-center sm:space-x-2.5">
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 sm:px-3 py-1.5 text-center sm:text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Evaluators</div>
              <div className="font-mono text-sm font-bold text-slate-900 flex items-center justify-center sm:justify-end space-x-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>{totalParticipants}</span>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 sm:px-3 py-1.5 text-center sm:text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Votes</div>
              <div className="font-mono text-sm font-bold text-slate-900 flex items-center justify-center sm:justify-end space-x-1">
                <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                <span>{totalRatings}</span>
              </div>
            </div>
            <a
              href="/api/export?type=ratings&format=csv"
              download="janeval_ratings_anonymized.csv"
              className="flex items-center justify-center space-x-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
              title="Download verified ratings (100% anonymized, zero personal data)"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate font-mono text-[11px]">Ratings CSV</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Leaderboard Cards - Disciplined Architectural Geometry */}
      <div className="grid grid-cols-1 gap-4 mb-10">
        {leaderboard.map((item, index) => {
          const isFirst = index === 0 && totalRatings > 0;
          return (
            <div
              key={item.modelId}
              className={`bg-white border rounded-xl p-5 sm:p-6 transition-all duration-200 shadow-2xs ${
                isFirst
                  ? 'border-slate-300 ring-1 ring-slate-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Rank & Model Info */}
                <div className="flex items-start sm:items-center space-x-4">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center font-extrabold text-sm shrink-0 border ${
                    index === 0
                      ? 'bg-slate-900 text-white border-slate-900'
                      : index === 1
                      ? 'bg-slate-100 text-slate-800 border-slate-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {index === 0 ? <Trophy className="w-5 h-5 text-amber-400" /> : `#${index + 1}`}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">{item.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                        {item.company}
                      </span>
                      <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-mono">
                        {item.codename}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Frontier Generative Vision • 10 Rural Health Scenarios
                    </p>
                  </div>
                </div>

                {/* Right: Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center shrink-0">
                  {/* Elo Rating */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 min-w-[90px]">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Elo Rating</div>
                    <div className="font-mono text-base font-bold text-slate-900">{totalRatings > 0 ? item.eloRating : '1200'}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{totalRatings > 0 ? 'Live Score' : 'Baseline'}</div>
                  </div>

                  {/* Win Rate */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 min-w-[90px]">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Win Rate</div>
                    <div className="font-mono text-base font-bold text-slate-900">{totalRatings > 0 ? `${item.winRate}%` : '—'}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.wins} Wins</div>
                  </div>

                  {/* Cultural Score */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 min-w-[90px]">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Attire Fidelity</div>
                    <div className="font-mono text-base font-bold text-slate-900">
                      {item.avgCultural > 0 ? <>{item.avgCultural}<span className="text-xs text-slate-400 font-normal">/5</span></> : '—'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">ASHA Context</div>
                  </div>

                  {/* Typography Score */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 min-w-[90px]">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Devanagari</div>
                    <div className="font-mono text-base font-bold text-slate-900">
                      {item.avgTypography > 0 ? <>{item.avgTypography}<span className="text-xs text-slate-400 font-normal">/5</span></> : '—'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Hindi Script</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Evaluation Method & Manifesto - Disciplined Architectural Container */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-6 sm:p-8 shadow-sm mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              EVALUATION METHODOLOGY
            </span>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white mt-1">
              THE BENCHMARK MEASURES REPRESENTATION FIDELITY — NOT AESTHETIC PREFERENCE.
            </h2>
          </div>
          <span className="shrink-0 font-mono text-[11px] font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            BLIND · PAIRWISE · HUMAN-EVALUATED
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Each image is evaluated through blinded pairwise comparisons by independent evaluators. Results are aggregated using an Elo-based ranking system. The benchmark asks a singular, foundational question: <span className="text-white font-medium">Can AI generate an image of India that is actually faithful to the India it is depicting?</span>
        </p>
      </div>
    </div>
  );
}
