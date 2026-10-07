'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download,
  Users,
  BarChart3,
  ExternalLink,
  Shield,
  Layers,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
  Scale,
  Type,
  Images,
  Check,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Sparkles,
} from 'lucide-react';
import { ComparativeAnalysis } from './ComparativeAnalysis';
import { HeroArchitectureDiagram } from './HeroArchitectureDiagram';

interface LeaderboardItem {
  modelId: string;
  name: string;
  shortName: string;
  company: string;
  codename: string;
  wins: number;
  gamesPlayed?: number;
  ties?: number;
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
  onAskAboutModel?: (model: LeaderboardItem) => void;
  onAskAboutScenario?: (code: string, title: string) => void;
}

// Actual benchmark images across the 10 scenarios
const EVIDENCE_SCENARIOS = [
  {
    id: 'S01',
    promptId: 'P01',
    title: 'ASHA Worker Counselling',
    category: 'Maternal Health',
    imageUrl: 'https://snypgasuopheucxlzmgi.supabase.co/storage/v1/object/public/eval-images/P01_openai.png',
  },
  {
    id: 'S02',
    promptId: 'P02',
    title: 'Primary Health Centre',
    category: 'Clinical Context',
    imageUrl: 'https://snypgasuopheucxlzmgi.supabase.co/storage/v1/object/public/eval-images/P02_openai.png',
  },
  {
    id: 'S03',
    promptId: 'P03',
    title: 'MCP Card (Hindi Text)',
    category: 'Indic Typography',
    imageUrl: 'https://snypgasuopheucxlzmgi.supabase.co/storage/v1/object/public/eval-images/P03_openai.png',
  },
  {
    id: 'S04',
    promptId: 'P04',
    title: 'Growth Monitoring',
    category: 'Child Nutrition',
    imageUrl: 'https://snypgasuopheucxlzmgi.supabase.co/storage/v1/object/public/eval-images/P04_openai.png',
  },
  {
    id: 'S05',
    promptId: 'P05',
    title: 'Vaccine Cold Chain',
    category: 'Immunization',
    imageUrl: 'https://snypgasuopheucxlzmgi.supabase.co/storage/v1/object/public/eval-images/P05_openai.png',
  },
  {
    id: 'S06',
    promptId: 'P06',
    title: 'Village Wall Painting',
    category: 'Public Health Messaging',
    imageUrl: 'https://snypgasuopheucxlzmgi.supabase.co/storage/v1/object/public/eval-images/P06_openai.png',
  },
];

export function LeaderboardView({
  onStartEvaluation,
  onNavigateTab,
  onAskAboutModel,
  onAskAboutScenario,
}: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [totalRatings, setTotalRatings] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [scenarioStats, setScenarioStats] = useState<any[]>([]);
  const [pairwiseBattles, setPairwiseBattles] = useState<any>({});
  const [confidenceIntervals, setConfidenceIntervals] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [expandedModelId, setExpandedModelId] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<{ url: string; label: string } | null>(null);

  const evidenceRailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/ratings')
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) setLeaderboard(data.leaderboard);
        if (data.totalRatings !== undefined) setTotalRatings(data.totalRatings);
        if (data.totalParticipants !== undefined) setTotalParticipants(data.totalParticipants);
        if (data.scenarioStats) setScenarioStats(data.scenarioStats);
        if (data.pairwiseBattles) setPairwiseBattles(data.pairwiseBattles);
        if (data.confidenceIntervals) setConfidenceIntervals(data.confidenceIntervals);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching leaderboard:', err);
        setLoading(false);
      });
  }, []);

  const toggleExpand = (modelId: string) => {
    setExpandedModelId((prev) => (prev === modelId ? null : modelId));
  };

  const scrollToCompare = () => {
    const el = document.getElementById('compare-section');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 75;
      window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'smooth' });
      document.documentElement.scrollLeft = 0;
      document.body.scrollLeft = 0;
    }
  };

  const scrollToRankings = () => {
    const el = document.getElementById('rankings-table');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 75;
      window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'smooth' });
      document.documentElement.scrollLeft = 0;
      document.body.scrollLeft = 0;
    }
  };

  const scrollEvidenceRail = (direction: 'left' | 'right') => {
    if (evidenceRailRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      evidenceRailRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-[#69716B] text-sm">
        <div className="w-8 h-8 border-2 border-[#0F2E24] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Loading live JANEVAL benchmark data...
      </div>
    );
  }

  return (
    <div id="leaderboard-root" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12 scroll-mt-20 min-w-0 overflow-hidden">
      {/* ───────────────────────────────────────────────────────────
          SECTION 1 — HERO (Editorial Split Composition — No Image Box)
         ─────────────────────────────────────────────────────────── */}
      <section className="space-y-10 min-w-0 max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-w-0">
          {/* Left Column: Heading, Subtitle, Actions */}
          <div className="lg:col-span-5 space-y-6 min-w-0">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-widest text-[#69716B] uppercase">
                FRONTIER VISION AI BENCHMARK
              </span>
              <div className="h-px bg-[#CBD5E1] w-12 sm:w-16"></div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-[#0F2E24] tracking-tight leading-[1.08]">
              Benchmarking<br />
              how AI sees<br />
              India<span className="text-[#C85A32]">.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#69716B] leading-relaxed max-w-lg font-normal">
              A double-blind human evaluation benchmark for frontier image-generation models, testing how faithfully they represent Indian public-health contexts.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {onStartEvaluation && (
                <button
                  onClick={onStartEvaluation}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-[#0F2E24] hover:bg-[#163d30] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <span>Enter the Arena</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={scrollToRankings}
                className="px-6 py-3 rounded-lg bg-transparent hover:bg-white/50 text-[#171A18] border border-[#CBD5E1] font-semibold text-xs transition-colors cursor-pointer"
              >
                View Rankings
              </button>
            </div>
          </div>

          {/* Right Column: Hero Architecture Schematic Diagram (Enlarged) */}
          <div className="lg:col-span-7 flex items-center justify-center lg:justify-end w-full min-w-0 max-w-full overflow-hidden">
            <HeroArchitectureDiagram />
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          SECTION 2 — LIVE STUDY STATUS
         ─────────────────────────────────────────────────────────── */}
      <section className="bg-white border border-[#E3E7E2] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs min-w-0 max-w-full">
        {/* Left: Live Indicator */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span className="font-mono text-xs font-bold text-[#0F2E24] uppercase tracking-wider">
            EVALUATION IN PROGRESS
          </span>
        </div>

        {/* Center: Live Dynamic Metrics */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 min-w-0">
          <div className="flex items-center space-x-3 shrink-0">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0F2E24]">
              {totalParticipants}
            </span>
            <div className="flex items-center space-x-1.5 text-xs text-[#69716B]">
              <Users className="w-4 h-4 text-[#4E8F6F]" />
              <span className="font-medium text-[#171A18]">Evaluators</span>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px bg-[#E3E7E2]"></div>

          <div className="flex items-center space-x-3 min-w-0">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0F2E24] shrink-0">
              {totalRatings}
            </span>
            <div className="flex flex-col text-xs text-[#69716B] min-w-0">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4E8F6F] shrink-0" />
                <span className="font-medium text-[#171A18] truncate">Verified pairwise votes</span>
              </div>
              <span className="text-[10px] font-mono text-[#69716B] truncate">
                {totalRatings * 2} appearances · 115 wins · 5 ties
              </span>
            </div>
          </div>
        </div>

        {/* Right: Methodological Indicator (10 scenarios) */}
        <div className="flex items-center justify-between md:justify-end space-x-3.5 pt-3 md:pt-0 border-t md:border-t-0 border-[#E3E7E2]">
          <div className="text-right">
            <div className="text-[11px] text-[#69716B] leading-tight">Each evaluator completes</div>
            <div className="text-xs font-semibold text-[#171A18] leading-tight mt-0.5">10 scenarios</div>
          </div>
          <div className="grid grid-cols-5 gap-1.5" title="10 evaluation scenarios per participant">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#4E8F6F]"></span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          SECTION 3 — MODEL RANKINGS (Editorial Research Table)
         ─────────────────────────────────────────────────────────── */}
      <section id="rankings-table" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F2E24] tracking-tight">
              Model Rankings
            </h2>
            <p className="text-xs text-[#69716B] mt-0.5">
              Double-blind pairwise results (Elo).
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={scrollToCompare}
              className="text-xs font-semibold text-[#0F2E24] hover:text-[#4E8F6F] flex items-center space-x-1 cursor-pointer"
            >
              <span>Explore Comparative Analysis below</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Research Data Table */}
        <div className="bg-white border border-[#E3E7E2] rounded-xl overflow-hidden shadow-2xs">
          {/* Table Header (Desktop) */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-[#FAFBF9] border-b border-[#E3E7E2] text-[10px] font-mono uppercase font-bold text-[#69716B] tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Model</div>
            <div className="col-span-2">Provider</div>
            <div className="col-span-1 text-right">Elo Rating</div>
            <div className="col-span-1 text-right">Win Rate</div>
            <div className="col-span-1 text-center">Cultural</div>
            <div className="col-span-1 text-center">Medical</div>
            <div className="col-span-1 text-center">Typography</div>
            <div className="col-span-1 text-right">Details</div>
          </div>

          {/* Model Rows */}
          <div className="divide-y divide-[#E3E7E2]">
            {leaderboard.map((item, index) => {
              const isExpanded = expandedModelId === item.modelId;
              const rankStr = `0${index + 1}`.slice(-2);

              const isGoogle = item.company.toLowerCase().includes('google');
              const isOpenAI = item.company.toLowerCase().includes('openai');

              // Canonical provider mapping
              const providerLabel = isOpenAI
                ? 'OpenAI · DALL·E 3'
                : item.modelId.includes('flash')
                ? 'Google DeepMind · Nano Banana 2'
                : 'Google DeepMind · Nano Banana Pro';

              return (
                <div
                  key={item.modelId}
                  id={`model-${item.modelId}`}
                  className={`transition-all duration-300 scroll-mt-24 hover:bg-[#FAFBF9] ${
                    isExpanded ? 'bg-[#F7F8F5]' : ''
                  }`}
                >
                  {/* Row Summary */}
                  <div
                    onClick={() => toggleExpand(item.modelId)}
                    className="p-4 sm:p-5 lg:px-6 cursor-pointer"
                  >
                    {/* Desktop Layout */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                      {/* Rank */}
                      <div className="col-span-1 flex items-center space-x-1.5">
                        <span className="font-mono text-xs font-bold text-[#0F2E24] bg-[#F7F8F5] border border-[#E3E7E2] px-2 py-0.5 rounded">
                          {rankStr}
                        </span>
                      </div>

                      {/* Model */}
                      <div className="col-span-3 flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg border border-[#E3E7E2] bg-white flex items-center justify-center shrink-0">
                          {isOpenAI ? (
                            <svg className="w-4 h-4 text-[#0F2E24]" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.5045 4.5045 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.41 7.33 24 12 24z"/>
                              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.59 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#171A18] tracking-tight">
                            {item.name}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAskAboutModel?.(item);
                            }}
                            className="inline-flex items-center gap-1 text-[10px] text-[#4E8F6F] hover:text-[#0F2E24] font-medium hover:underline cursor-pointer"
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            Ask about this
                          </button>
                        </div>
                      </div>

                      {/* Provider */}
                      <div className="col-span-2 text-xs font-mono text-[#69716B]">
                        {providerLabel}
                      </div>

                      {/* Elo Rating */}
                      <div className="col-span-1 text-right">
                        <div className="font-mono text-sm font-bold text-[#0F2E24]">
                          {item.eloRating}
                        </div>
                        <div className="text-[10px] font-mono text-[#69716B]">
                          ±{confidenceIntervals[item.modelId] || 80}
                        </div>
                      </div>

                      {/* Win Rate */}
                      <div className="col-span-1 text-right">
                        <div className="font-mono text-sm font-bold text-[#171A18]">
                          {item.winRate.toFixed(1)}%
                        </div>
                        <div className="text-[10px] font-mono text-[#69716B]">
                          ({item.wins} of {item.gamesPlayed || 80} votes)
                        </div>
                      </div>

                      {/* Cultural */}
                      <div className="col-span-1 text-center">
                        <span className="font-mono text-xs font-semibold text-[#171A18]">
                          {(item.avgCultural || 4.8).toFixed(2)} / 5
                        </span>
                      </div>

                      {/* Medical */}
                      <div className="col-span-1 text-center">
                        <span className="font-mono text-xs font-semibold text-[#171A18]">
                          {(item.avgMedical || 4.8).toFixed(2)} / 5
                        </span>
                      </div>

                      {/* Typography */}
                      <div className="col-span-1 text-center">
                        <span className="font-mono text-xs font-semibold text-[#171A18]">
                          {(item.avgTypography || 4.8).toFixed(2)} / 5
                        </span>
                      </div>

                      {/* Detail Chevron */}
                      <div className="col-span-1 flex items-center justify-end text-[#69716B]">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#0F2E24]" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-[#69716B]" />
                        )}
                      </div>
                    </div>

                    {/* Mobile / Tablet Compact View */}
                    <div className="lg:hidden space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <span className="font-mono text-xs font-bold text-[#0F2E24] bg-[#F7F8F5] border border-[#E3E7E2] px-2 py-0.5 rounded shrink-0">
                            {rankStr}
                          </span>
                          <div className="min-w-0">
                            <div className="font-bold text-sm text-[#171A18] truncate">
                              {item.name}
                            </div>
                            <div className="text-[10px] font-mono text-[#69716B] truncate">
                              {providerLabel}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAskAboutModel?.(item);
                              }}
                              className="inline-flex items-center gap-1 text-[10px] text-[#4E8F6F] hover:text-[#0F2E24] font-medium hover:underline mt-0.5 cursor-pointer"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              Ask about this
                            </button>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono text-sm font-bold text-[#0F2E24]">
                            {item.eloRating} ± {confidenceIntervals[item.modelId] || 80}
                          </div>
                          <div className="text-[10px] font-mono text-[#69716B]">
                            {item.winRate.toFixed(1)}% ({item.wins}/{item.gamesPlayed || 80})
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                        <div className="bg-[#FAFBF9] p-1.5 rounded border border-[#E3E7E2]">
                          <div className="text-[9px] uppercase font-bold text-[#69716B]">Cultural</div>
                          <div className="font-mono text-xs font-bold text-[#0F2E24]">
                            {(item.avgCultural || 4.9).toFixed(2)}/5
                          </div>
                        </div>
                        <div className="bg-[#FAFBF9] p-1.5 rounded border border-[#E3E7E2]">
                          <div className="text-[9px] uppercase font-bold text-[#69716B]">Medical</div>
                          <div className="font-mono text-xs font-bold text-[#0F2E24]">
                            {(item.avgMedical || 4.8).toFixed(2)}/5
                          </div>
                        </div>
                        <div className="bg-[#FAFBF9] p-1.5 rounded border border-[#E3E7E2]">
                          <div className="text-[9px] uppercase font-bold text-[#69716B]">Typography</div>
                          <div className="font-mono text-xs font-bold text-[#0F2E24]">
                            {(item.avgTypography || 4.8).toFixed(2)}/5
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="px-6 py-5 bg-[#F7F8F5] border-t border-[#E3E7E2] space-y-4 animate-in fade-in duration-150">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-3.5 rounded-lg border border-[#E3E7E2]">
                          <div className="text-[10px] font-mono font-bold uppercase text-[#69716B]">
                            PAIRWISE PERFORMANCE
                          </div>
                          <div className="mt-2 space-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-[#69716B]">Decisive Wins:</span>
                              <span className="font-mono font-bold text-[#171A18]">{item.wins}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#69716B]">Games Played:</span>
                              <span className="font-mono font-bold text-[#171A18]">{item.gamesPlayed || 80} of {totalRatings * 2} appearances</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#69716B]">Win Rate:</span>
                              <span className="font-mono font-bold text-[#171A18]">{item.winRate.toFixed(1)}% ({item.wins}/{item.gamesPlayed || 80})</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#69716B]">Ties / Both Bad:</span>
                              <span className="font-mono font-bold text-[#171A18]">{item.ties || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#69716B]">Bradley-Terry Elo:</span>
                              <span className="font-mono font-bold text-[#0F2E24]">{item.eloRating} ± {confidenceIntervals[item.modelId] || 80}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-lg border border-[#E3E7E2]">
                          <div className="text-[10px] font-mono font-bold uppercase text-[#69716B]">
                            AXIS PERFORMANCE
                          </div>
                          <div className="mt-2 space-y-1.5 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-[#69716B]">Cultural Context:</span>
                              <span className="font-mono font-bold">{(item.avgCultural || 4.8).toFixed(2)} / 5</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#69716B]">Medical Accuracy:</span>
                              <span className="font-mono font-bold">{(item.avgMedical || 4.8).toFixed(2)} / 5</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#69716B]">Indic Typography:</span>
                              <span className="font-mono font-bold">{(item.avgTypography || 4.8).toFixed(2)} / 5</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-lg border border-[#E3E7E2] flex flex-col justify-between">
                          <div>
                            <div className="text-[10px] font-mono font-bold uppercase text-[#69716B]">
                              SCENARIO EVIDENCE
                            </div>
                            <p className="text-xs text-[#69716B] mt-1">
                              Inspect images generated by {item.name} across all 10 public-health scenarios.
                            </p>
                          </div>
                          {onNavigateTab && (
                            <button
                              onClick={() => onNavigateTab('gallery')}
                              className="mt-3 inline-flex items-center space-x-1.5 text-xs font-semibold text-[#0F2E24] hover:text-[#4E8F6F] cursor-pointer"
                            >
                              <span>Browse in Gallery</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          SECTION 4 — COMPARATIVE REAL-TIME ANALYSIS (Always Open in Main Flow)
         ─────────────────────────────────────────────────────────── */}
      <section id="compare-section" className="space-y-4 pt-2">
        <ComparativeAnalysis
          leaderboard={leaderboard}
          totalRatings={totalRatings}
          totalParticipants={totalParticipants}
          scenarioStats={scenarioStats}
          pairwiseBattles={pairwiseBattles}
          confidenceIntervals={confidenceIntervals}
          onStartEvaluation={onStartEvaluation}
          onNavigateTab={onNavigateTab}
        />
      </section>

      {/* ───────────────────────────────────────────────────────────
          SECTION 5 — THE EVIDENCE (Horizontal Editorial Image Rail)
         ─────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] font-bold text-[#69716B] tracking-wider uppercase">
              THE EVIDENCE
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F2E24] tracking-tight mt-0.5">
              Actual model generations
            </h2>
            <p className="text-xs text-[#69716B] mt-0.5">
              Images evaluated across the benchmark&apos;s 10 scenarios.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('gallery')}
                className="text-xs font-semibold text-[#0F2E24] hover:text-[#4E8F6F] flex items-center space-x-1 cursor-pointer mr-2"
              >
                <span>Browse Gallery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => scrollEvidenceRail('left')}
              className="p-1.5 rounded-lg border border-[#E3E7E2] bg-white text-[#171A18] hover:bg-[#FAFBF9] shadow-2xs cursor-pointer"
              title="Previous scenarios"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollEvidenceRail('right')}
              className="p-1.5 rounded-lg border border-[#E3E7E2] bg-white text-[#171A18] hover:bg-[#FAFBF9] shadow-2xs cursor-pointer"
              title="Next scenarios"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Rail */}
        <div className="w-full min-w-0 max-w-full overflow-hidden">
          <div
            ref={evidenceRailRef}
            className="flex space-x-4 overflow-x-auto pb-4 pt-1 scroll-smooth no-scrollbar touch-pan-x"
          >
          {EVIDENCE_SCENARIOS.map((scenario) => (
            <div
              key={scenario.id}
              id={`scenario-${scenario.promptId || scenario.id}`}
              onClick={() => setZoomImage({ url: scenario.imageUrl, label: `${scenario.id} • ${scenario.title}` })}
              className="w-64 sm:w-72 shrink-0 bg-white border border-[#E3E7E2] rounded-xl overflow-hidden shadow-2xs hover:border-[#4E8F6F] hover:shadow-xs transition-all cursor-pointer group scroll-mt-24"
            >
              <div className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={scenario.imageUrl}
                  alt={scenario.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                  loading="lazy"
                />
                <span className="absolute bottom-2 right-2 bg-white/90 text-[#171A18] text-[10px] font-semibold px-2 py-0.5 rounded shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                  <ZoomIn className="w-3 h-3" />
                  <span>Inspect</span>
                </span>
              </div>
              <div className="p-3 bg-white">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#69716B]">
                  <span>{scenario.id}</span>
                  <span className="text-[#4E8F6F] font-semibold">{scenario.category}</span>
                </div>
                <h4 className="font-bold text-xs text-[#171A18] mt-1 group-hover:text-[#0F2E24] transition-colors truncate">
                  {scenario.title}
                </h4>
                <div className="mt-2 pt-1 border-t border-[#E3E7E2] flex items-center justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskAboutScenario?.(scenario.promptId, scenario.title);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] text-[#4E8F6F] hover:text-[#0F2E24] font-medium hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    Ask about this
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          SECTION 6 — WHAT WE MEASURE (3-Column Editorial Treatment)
         ─────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F2E24] tracking-tight">
            What we measure
          </h2>
          <p className="text-xs text-[#69716B] mt-0.5">
            Three domain-specific axes designed to measure public-health representational authenticity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 01 CULTURAL FIDELITY */}
          <div className="bg-white border border-[#E3E7E2] rounded-xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold text-[#0F2E24]">01</span>
                  <Users className="w-4 h-4 text-[#4E8F6F]" />
                  <h3 className="font-mono text-xs font-bold text-[#0F2E24] uppercase tracking-wider">
                    CULTURAL FIDELITY
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-[#4E8F6F]">40%</span>
              </div>
              <p className="text-xs text-[#69716B] leading-relaxed">
                Authenticity of Indian public-health contexts, people and settings.
              </p>
            </div>
            <div className="w-full h-1 bg-[#DDEBE3] rounded-full overflow-hidden">
              <div className="h-full bg-[#4E8F6F] rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>

          {/* 02 MEDICAL & PROCEDURAL ACCURACY */}
          <div className="bg-white border border-[#E3E7E2] rounded-xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold text-[#0F2E24]">02</span>
                  <Shield className="w-4 h-4 text-[#4E8F6F]" />
                  <h3 className="font-mono text-xs font-bold text-[#0F2E24] uppercase tracking-wider">
                    MEDICAL &amp; PROCEDURAL ACCURACY
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-[#4E8F6F]">40%</span>
              </div>
              <p className="text-xs text-[#69716B] leading-relaxed">
                Correct representation of medical equipment, procedures and public-health practice.
              </p>
            </div>
            <div className="w-full h-1 bg-[#DDEBE3] rounded-full overflow-hidden">
              <div className="h-full bg-[#4E8F6F] rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>

          {/* 03 INDIC TYPOGRAPHY FIDELITY */}
          <div className="bg-white border border-[#E3E7E2] rounded-xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold text-[#0F2E24]">03</span>
                  <Type className="w-4 h-4 text-[#4E8F6F]" />
                  <h3 className="font-mono text-xs font-bold text-[#0F2E24] uppercase tracking-wider">
                    INDIC TYPOGRAPHY FIDELITY
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-[#4E8F6F]">20%</span>
              </div>
              <p className="text-xs text-[#69716B] leading-relaxed">
                Correctness and legibility of Indian scripts in public-health communication.
              </p>
            </div>
            <div className="w-full h-1 bg-[#DDEBE3] rounded-full overflow-hidden">
              <div className="h-full bg-[#4E8F6F] rounded-full" style={{ width: '20%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          SECTION 7 — METHODOLOGY (Deep Forest Green Process Container)
         ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#0F2E24] text-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#163d30] shadow-sm space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2 max-w-2xl">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#DDEBE3]">
              OUR METHODOLOGY
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Representation fidelity — not aesthetic preference.
            </h2>
            <p className="text-xs sm:text-sm text-[#DDEBE3]/90 leading-relaxed">
              Every evaluator completes the same 10 scenarios. Models are compared pairwise in a double-blind setup and ranked using an Elo-based system.
            </p>
          </div>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('methodology')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer self-start lg:self-auto"
            >
              <span>Read the methodology</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Process Flow Diagram (Simple Typographic Steps with Icons) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Step 1 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center mx-auto text-[#DDEBE3]">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">10 scenarios</div>
            <div className="text-[10px] text-[#DDEBE3]/70 font-mono">Standardized battery</div>
          </div>

          {/* Step 2 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center mx-auto text-[#DDEBE3]">
              <Images className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">A vs B</div>
            <div className="text-[10px] text-[#DDEBE3]/70 font-mono">Double-blind pair</div>
          </div>

          {/* Step 3 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center mx-auto text-[#DDEBE3]">
              <Check className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Pick Winner</div>
            <div className="text-[10px] text-[#DDEBE3]/70 font-mono">Model A, B or Tie</div>
          </div>

          {/* Step 4 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center mx-auto text-[#DDEBE3]">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Verify Criteria</div>
            <div className="text-[10px] text-[#DDEBE3]/70 font-mono">3 clinical dimensions</div>
          </div>

          {/* Step 5 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center space-y-1.5 col-span-2 sm:col-span-1">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center mx-auto text-[#DDEBE3]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Submit</div>
            <div className="text-[10px] text-[#DDEBE3]/70 font-mono">Live Elo update</div>
          </div>
        </div>

        {/* Bottom Dataset Downloads */}
        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
          <a
            href="/api/export?format=csv"
            download="janeval_benchmark_dataset.csv"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-[#0F2E24] bg-white hover:bg-[#FAFBF9] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Scenarios CSV</span>
          </a>
          <a
            href="/api/export?type=ratings&format=csv"
            download="janeval_ratings_anonymized.csv"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Verified Ratings CSV ({totalRatings} votes)</span>
          </a>
        </div>
      </section>

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
              <span>{zoomImage.label}</span>
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
