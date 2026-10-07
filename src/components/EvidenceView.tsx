'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  ChevronDown,
  Download,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  ZoomIn,
  ZoomOut,
  X,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { PROMPTS_DATA } from '@/data/prompts';
import { canonicalizeModelId } from '@/lib/pairwiseAnalytics';
import { trackEvent } from '@/lib/analytics';

export interface LeaderboardItem {
  modelId: string;
  name: string;
  shortName: string;
  company: string;
  codename: string;
  wins: number;
  gamesPlayed?: number;
  winRate: number;
  eloRating: number;
  avgCultural: number;
  avgMedical: number;
  avgTypography: number;
  badgeColor: string;
}

export interface ScenarioMatchupItem {
  pairKey: string;
  modelAId: string;
  modelBId: string;
  winsA: number;
  winsB: number;
  ties: number;
  total: number;
}

export interface ScenarioStatItem {
  code: string;
  promptId: string;
  title: string;
  category: string;
  prompt: string;
  rubricFocus?: string;
  whyItMatters?: string;
  keyVisualCheckpoints?: string[];
  totalVotes: number;
  byModel: Record<
    string,
    {
      wins: number;
      appearances: number;
      winRate: number;
      avgScore: number;
      cultural?: number;
      medical?: number;
      typography?: number;
    }
  >;
  matchups?: ScenarioMatchupItem[];
  winnerModelId?: string | null;
  topWins?: number;
  secondWins?: number;
  isCloseOrTied?: boolean;
}

interface EvidenceViewProps {
  onStartEvaluation?: () => void;
  onNavigateTab?: (tab: 'arena' | 'leaderboard' | 'evidence' | 'gallery' | 'methodology') => void;
  onAskAboutScenario?: (code: string, title: string) => void;
}

export function getModelShortName(modelId?: string, leaderboard?: LeaderboardItem[]): string {
  if (!modelId) return 'Model';
  if (modelId === 'openai') return 'GPT Image 1';
  if (modelId === 'gemini31flashlite') return 'Gemini 3.1 Flash';
  if (modelId === 'geminipro') return 'Gemini 3 Pro';
  const found = leaderboard?.find((m) => m.modelId === modelId);
  return found?.shortName || modelId;
}

export function getModelImageUrl(code: string, modelId: string): string {
  const numPart = code.replace(/\D/g, '');
  const pCode = `P${('0' + numPart).slice(-2)}`;

  let suffix = 'openai.png';
  if (modelId === 'gemini31flashlite' || modelId.includes('flash')) {
    suffix = 'gemini31flashlite.jpg';
  } else if (modelId === 'geminipro' || modelId.includes('pro')) {
    suffix = 'geminipro.jpg';
  }
  return `/eval-images/${pCode}_${suffix}`;
}

export function getRemoteImageUrl(code: string, modelId: string): string {
  const numPart = code.replace(/\D/g, '');
  const pCode = `P${('0' + numPart).slice(-2)}`;

  let suffix = 'openai.png';
  if (modelId === 'gemini31flashlite' || modelId.includes('flash')) {
    suffix = 'gemini31flashlite.jpg';
  } else if (modelId === 'geminipro' || modelId.includes('pro')) {
    suffix = 'geminipro.jpg';
  }
  return `https://snypgasuopheucxlzmgi.supabase.co/storage/v1/object/public/eval-images/${pCode}_${suffix}`;
}

export const MODEL_THEMES: Record<
  string,
  {
    initial: string;
    shape: string;
    label: string;
    dotColor: string;
    barColor: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  openai: {
    initial: 'G',
    shape: '▲',
    label: 'GPT Image 1',
    dotColor: '#123F32',
    barColor: '#2D6A4F',
    badgeBg: '#123F32',
    badgeText: '#FFFFFF',
  },
  gemini31flashlite: {
    initial: 'F',
    shape: '●',
    label: 'Gemini 3.1 Flash',
    dotColor: '#2B4C6F',
    barColor: '#5A84AF',
    badgeBg: '#2B4C6F',
    badgeText: '#FFFFFF',
  },
  geminipro: {
    initial: 'P',
    shape: '■',
    label: 'Gemini 3 Pro',
    dotColor: '#854D0E',
    barColor: '#B45309',
    badgeBg: '#854D0E',
    badgeText: '#FFFFFF',
  },
};

export function getModelTheme(modelId: string) {
  return (
    MODEL_THEMES[modelId] || {
      initial: 'M',
      shape: '◆',
      label: 'Model',
      dotColor: '#4A5568',
      barColor: '#718096',
      badgeBg: '#4A5568',
      badgeText: '#FFFFFF',
    }
  );
}

function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  onClick,
}: {
  src: string;
  fallbackSrc?: string;
  alt: string;
  onClick?: () => void;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setTriedFallback(false);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && !triedFallback && currentSrc !== fallbackSrc) {
      setTriedFallback(true);
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasError(false);
    setTriedFallback(false);
    setCurrentSrc(`${src}?t=${Date.now()}`);
  };

  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#F1F2EC] text-[#5E6963] text-center font-sans select-none space-y-2">
        <ImageIcon className="w-6 h-6 text-[#7C8580] opacity-60" />
        <div className="space-y-0.5">
          <span className="text-xs font-semibold text-[#17211D] block">Preview unavailable</span>
          <span className="text-[11px] text-[#7C8580] block">Image failed to load</span>
        </div>
        <button
          type="button"
          onClick={handleRetry}
          className="mt-1 px-2.5 py-1 text-[11px] font-sans font-medium rounded-[4px] bg-white border border-[#D9DED8] text-[#123F32] hover:bg-[#F7F6F1] shadow-2xs transition-colors cursor-pointer flex items-center gap-1 mx-auto"
        >
          <RotateCcw className="w-3 h-3 text-[#123F32]" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={currentSrc}
      src={currentSrc}
      alt={alt}
      onError={handleError}
      onClick={onClick}
      className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02] ${
        onClick ? 'cursor-zoom-in' : ''
      }`}
      loading="eager"
    />
  );
}

export function EvidenceView({
  onStartEvaluation,
  onNavigateTab,
  onAskAboutScenario,
}: EvidenceViewProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [scenarioStats, setScenarioStats] = useState<ScenarioStatItem[]>([]);
  const [rawVotes, setRawVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedScenarioCode, setSelectedScenarioCode] = useState<string>('S01');
  const [focusedPairKey, setFocusedPairKey] = useState<string | null>(null);
  const [showHowAddUp, setShowHowAddUp] = useState<boolean>(false);

  // Lightbox modal state for high-res image inspection
  const [lightboxData, setLightboxData] = useState<{
    scenarioCode: string;
    scenarioTitle: string;
    prompt: string;
    modelId: string;
  } | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);

  useEffect(() => {
    fetch('/api/ratings')
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard && data.leaderboard.length > 0) {
          setLeaderboard(data.leaderboard);
        }
        if (data.scenarioStats) {
          setScenarioStats(data.scenarioStats);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching ratings:', err);
        setLoading(false);
      });

    // Load raw pairwise votes for exact breakdown
    import('@/data/pairwiseVotes.json')
      .then((mod) => {
        const votes = (mod.default || mod) as any[];
        setRawVotes(votes);
      })
      .catch((err) => {
        console.error('Failed to load raw pairwise votes:', err);
      });
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxData(null);
        setLightboxZoom(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleHeroImageClick = (choice: 'left' | 'right') => {
    trackEvent('hero_image_clicked', { choice });
    if (onStartEvaluation) {
      onStartEvaluation();
    } else if (onNavigateTab) {
      onNavigateTab('arena');
    }
  };

  // Build the complete 10 scenarios list with pairwise matchup calculations
  const scenariosList = useMemo(() => {
    const pairsDef: [string, string][] = [
      ['openai', 'gemini31flashlite'],
      ['openai', 'geminipro'],
      ['gemini31flashlite', 'geminipro'],
    ];

    return PROMPTS_DATA.map((p, idx) => {
      const code = `S${('0' + (idx + 1)).slice(-2)}`;
      const stat = scenarioStats.find((s) => s.code === code || s.promptId === p.id);

      // Raw votes for this scenario
      const scenarioVotes = rawVotes.filter(
        (v) => (v.prompt_id || '').toUpperCase() === p.id.toUpperCase()
      );

      // Compute pairwise matchups for this scenario
      const matchups: ScenarioMatchupItem[] = pairsDef.map(([idA, idB]) => {
        const pairKey = `${idA}-${idB}`;
        const relevantVotes = scenarioVotes.filter((v) => {
          const ma = canonicalizeModelId(v.model_a);
          const mb = canonicalizeModelId(v.model_b);
          return (ma === idA && mb === idB) || (ma === idB && mb === idA);
        });

        let winsA = 0;
        let winsB = 0;
        let ties = 0;

        for (const v of relevantVotes) {
          const winner = canonicalizeModelId(v.winner_model);
          if (winner === idA) winsA++;
          else if (winner === idB) winsB++;
          else ties++;
        }

        return {
          pairKey,
          modelAId: idA,
          modelBId: idB,
          winsA,
          winsB,
          ties,
          total: relevantVotes.length > 0 ? relevantVotes.length : 4,
        };
      });

      // Compute byModel per-model statistics with exact appearances and wins
      const byModel: Record<string, { wins: number; appearances: number; winRate: number; avgScore: number; cultural: number; medical: number; typography: number }> = {};
      const modelsList = ['openai', 'gemini31flashlite', 'geminipro'];
      modelsList.forEach((mId) => {
        let mWins = 0;
        let mApps = 0;
        scenarioVotes.forEach((v) => {
          const ma = canonicalizeModelId(v.model_a);
          const mb = canonicalizeModelId(v.model_b);
          if (ma === mId || mb === mId) mApps++;
          const winner = canonicalizeModelId(v.winner_model);
          if (winner === mId) mWins++;
        });

        const statCell = stat?.byModel?.[mId];
        const wins = statCell?.wins !== undefined ? statCell.wins : mWins;
        const appearances = statCell?.appearances !== undefined && statCell.appearances > 0 ? statCell.appearances : (mApps > 0 ? mApps : 8);
        const winRate = appearances > 0 ? wins / appearances : 0;
        const cultural = statCell?.cultural || 4.8;
        const medical = statCell?.medical || 4.8;
        const typography = statCell?.typography || 4.8;
        const avgScore = statCell?.avgScore || Number(((cultural + medical + typography) / 3).toFixed(1));

        byModel[mId] = {
          wins,
          appearances,
          winRate,
          cultural,
          medical,
          typography,
          avgScore,
        };
      });

      // Find top winning model
      let winnerId = 'openai';
      let topWins = 0;
      let secondWins = 0;
      let isCloseOrTied = false;

      const sortedByWins = Object.entries(byModel).sort((a, b) => b[1].wins - a[1].wins);
      if (sortedByWins.length > 0) {
        winnerId = sortedByWins[0][0];
        topWins = sortedByWins[0][1].wins;
        secondWins = sortedByWins[1] ? sortedByWins[1][1].wins : 0;
        isCloseOrTied = sortedByWins.length >= 2 && topWins - secondWins <= 1;
      }

      return {
        code,
        promptId: p.id,
        title: p.title,
        category: p.category,
        prompt: p.prompt,
        rubricFocus: p.rubricFocus,
        whyItMatters: p.whyItMatters,
        keyVisualCheckpoints: p.keyVisualCheckpoints,
        totalVotes: stat?.totalVotes || scenarioVotes.length || 12,
        byModel,
        matchups,
        winnerModelId: stat?.winnerModelId || winnerId,
        topWins,
        secondWins,
        isCloseOrTied,
      };
    });
  }, [scenarioStats, rawVotes]);

  const activeScenario = useMemo(() => {
    return scenariosList.find((s) => s.code === selectedScenarioCode) || scenariosList[0];
  }, [scenariosList, selectedScenarioCode]);

  const activeIndex = scenariosList.findIndex((s) => s.code === activeScenario?.code);

  const activeMatchupKey = useMemo(() => {
    if (!focusedPairKey || focusedPairKey === 'all') return null;
    if (!activeScenario?.matchups || activeScenario.matchups.length === 0) return null;
    return activeScenario.matchups.find((m) => m.pairKey === focusedPairKey)?.pairKey || null;
  }, [activeScenario, focusedPairKey]);

  const focusedPairModels = useMemo<[string, string] | null>(() => {
    if (!activeMatchupKey || !activeScenario?.matchups) return null;
    const matchup = activeScenario.matchups.find((m) => m.pairKey === activeMatchupKey);
    if (!matchup) return null;
    return [matchup.modelAId, matchup.modelBId];
  }, [activeMatchupKey, activeScenario]);

  const handleToggleMatchup = (pairKey: string, modelAId?: string, modelBId?: string) => {
    if (pairKey === 'all' || focusedPairKey === pairKey) {
      setFocusedPairKey(null);
      return;
    }
    setFocusedPairKey(pairKey);
    if (modelAId && modelBId) {
      const rankA = leaderboard.findIndex((m) => m.modelId === modelAId) + 1;
      const rankB = leaderboard.findIndex((m) => m.modelId === modelBId) + 1;
      trackEvent('matchup_focus', {
        scenario_code: activeScenario.code,
        pair_key: pairKey,
        rank_a: rankA,
        rank_b: rankB,
      });
    }
  };

  const handleToggleHowAddUp = () => {
    const next = !showHowAddUp;
    setShowHowAddUp(next);
    if (next) {
      trackEvent('how_add_up_open', { scenario_code: activeScenario.code });
    }
  };

  const handlePrevScenario = () => {
    if (activeIndex > 0) {
      const prev = scenariosList[activeIndex - 1];
      setSelectedScenarioCode(prev.code);
      setFocusedPairKey(null);
      trackEvent('heatmap_cell_open', { scenario_code: prev.code, model_rank: 1 });
    }
  };

  const handleNextScenario = () => {
    if (activeIndex < scenariosList.length - 1) {
      const next = scenariosList[activeIndex + 1];
      setSelectedScenarioCode(next.code);
      setFocusedPairKey(null);
      trackEvent('heatmap_cell_open', { scenario_code: next.code, model_rank: 1 });
    }
  };

  const handleSelectScenario = (code: string) => {
    setSelectedScenarioCode(code);
    setFocusedPairKey(null);
    trackEvent('heatmap_cell_open', { scenario_code: code, model_rank: 1 });
  };

  // Verdict plain sentence for active scenario (Pairwise consistent)
  const scenarioVerdict = useMemo(() => {
    if (!activeScenario) return '';

    // If an active matchup is focused, display head-to-head details
    if (activeMatchupKey && activeScenario.matchups) {
      const match = activeScenario.matchups.find((m) => m.pairKey === activeMatchupKey);
      if (match) {
        const nameA = getModelShortName(match.modelAId, leaderboard);
        const nameB = getModelShortName(match.modelBId, leaderboard);
        if (match.winsA === match.winsB) {
          return `Pairwise battle: ${nameA} and ${nameB} tied with ${match.winsA} wins each (total ${match.total} votes). Showing these 2 models; the 3rd model is dimmed.`;
        }
        const winner = match.winsA > match.winsB ? nameA : nameB;
        const winnerWins = Math.max(match.winsA, match.winsB);
        const loser = match.winsA > match.winsB ? nameB : nameA;
        const loserWins = Math.min(match.winsA, match.winsB);
        return `Pairwise battle: ${winner} won ${winnerWins} of ${match.total} head-to-head votes against ${loser} (${loserWins} wins). Showing these 2 models; the 3rd model is dimmed.`;
      }
    }

    // Default "All 3 Models" view verdict
    const winnerId = activeScenario.winnerModelId || 'openai';
    const winnerName = getModelShortName(winnerId, leaderboard);
    const topWins = activeScenario.byModel[winnerId]?.wins ?? (activeScenario.topWins ?? 0);
    const secondWins = Math.max(0, activeScenario.secondWins ?? 0);
    const appearances = activeScenario.byModel[winnerId]?.appearances || 8;

    if (activeScenario.isCloseOrTied) {
      if (topWins === secondWins) {
        return `All 3 models shown: Evaluators were evenly split between the leading models at ${topWins} wins each across ${appearances} appearances. Toggle a matchup to isolate pairs.`;
      }
      return `All 3 models shown: ${winnerName} won ${topWins} of ${appearances} appearances (margin was 1 vote). Toggle a matchup to isolate pairs.`;
    }
    return `All 3 models shown: ${winnerName} was preferred overall (${topWins} of ${appearances} appearances). Toggle a matchup below to isolate head-to-head pairs.`;
  }, [activeScenario, activeMatchupKey, leaderboard]);

  // Fallback models list if leaderboard is loading
  const modelsToDisplay = useMemo(() => {
    if (leaderboard.length > 0) return leaderboard;
    return [
      { modelId: 'openai', shortName: 'GPT Image 1', company: 'OpenAI' },
      { modelId: 'gemini31flashlite', shortName: 'Gemini 3.1 Flash', company: 'Google DeepMind' },
      { modelId: 'geminipro', shortName: 'Gemini 3 Pro', company: 'Google DeepMind' },
    ] as LeaderboardItem[];
  }, [leaderboard]);

  if (loading) {
    return (
      <div className="max-w-[1120px] mx-auto px-5 sm:px-6 lg:px-8 py-28 text-center text-[#5E6963]">
        <div className="w-8 h-8 border-2 border-[#123F32] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-sans">Loading benchmark evidence...</p>
      </div>
    );
  }

  return (
    <div id="evidence-root" className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 space-y-12 sm:space-y-16 scroll-mt-20 min-w-0 overflow-hidden">
      {/* ───────────────────────────────────────────────────────────
          1. HERO (Ingress to Arena - Unchanged)
         ─────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase text-[#123F32] tracking-wider">
              EVALUATION ARENA INGRESS
            </span>
            <span className="text-xs text-[#7C8580] hidden sm:inline">·</span>
            <span className="text-xs text-[#5E6963] hidden sm:inline">Double-blind human evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif text-[#17211D] font-normal tracking-tight leading-tight max-w-3xl">
            Which image feels like a real anganwadi visit?
          </h1>
          <p className="text-sm sm:text-base text-[#5E6963] font-sans leading-relaxed max-w-2xl">
            Compare the people, setting, equipment, and visible text.
          </p>
        </div>

        <div className="pt-2 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Image A */}
            <Link
              href="/?tab=arena"
              onClick={(e) => {
                e.preventDefault();
                handleHeroImageClick('left');
              }}
              aria-label="Start the evaluation - Option A"
              className="group relative aspect-[4/3] rounded-[4px] overflow-hidden bg-[#F1F2EC] border border-[#D9DED8] hover:border-[#123F32] transition-colors cursor-pointer block select-none focus-visible:ring-2 focus-visible:ring-[#123F32] focus-visible:outline-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/eval-images/P04_openai.png"
                alt="Benchmark Scenario - Option A"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                loading="eager"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono font-medium px-2 py-0.5 rounded-[3px]">
                Option A
              </div>
              <div className="absolute inset-0 bg-[#123F32]/0 group-hover:bg-[#123F32]/10 transition-colors flex items-end justify-center p-3 sm:p-4">
                <span className="text-xs font-sans font-medium text-[#123F32] bg-white/95 px-3 py-1 rounded-[4px] shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Judge in Arena →
                </span>
              </div>
            </Link>

            {/* Image B */}
            <Link
              href="/?tab=arena"
              onClick={(e) => {
                e.preventDefault();
                handleHeroImageClick('right');
              }}
              aria-label="Start the evaluation - Option B"
              className="group relative aspect-[4/3] rounded-[4px] overflow-hidden bg-[#F1F2EC] border border-[#D9DED8] hover:border-[#123F32] transition-colors cursor-pointer block select-none focus-visible:ring-2 focus-visible:ring-[#123F32] focus-visible:outline-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/eval-images/P04_gemini31flashlite.jpg"
                alt="Benchmark Scenario - Option B"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                loading="eager"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono font-medium px-2 py-0.5 rounded-[3px]">
                Option B
              </div>
              <div className="absolute inset-0 bg-[#123F32]/0 group-hover:bg-[#123F32]/10 transition-colors flex items-end justify-center p-3 sm:p-4">
                <span className="text-xs font-sans font-medium text-[#123F32] bg-white/95 px-3 py-1 rounded-[4px] shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Judge in Arena →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          2. EVIDENCE (Scenario by scenario)
         ─────────────────────────────────────────────────────────── */}
      <section id="scenarios" className="scroll-mt-20 space-y-6">
        <div className="border-b border-[#D9DED8] pb-5 space-y-1">
          <span className="text-xs font-mono uppercase font-semibold text-[#123F32] tracking-wider block">
            Evidence
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#17211D] leading-tight">
            Scenario by scenario
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#5E6963]">
            Examine side-by-side outputs for each scenario. Evaluators evaluated blinded pairs with randomized presentation order.
          </p>
        </div>

        {/* Sleek Horizontal Scenario Selector with Scroll Cue */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-sans text-[#7C8580]">
            <span className="font-mono uppercase tracking-wider text-[10px] text-[#5E6963]">10 Scenarios</span>
            <span className="flex items-center gap-1 text-[#7C8580]">
              <span>Scroll tabs</span>
              <span>→</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {scenariosList.map((scen) => {
              const isSelected = scen.code === activeScenario?.code;
              const winnerName = getModelShortName(scen.winnerModelId || 'openai', leaderboard);

              return (
                <button
                  key={scen.code}
                  type="button"
                  onClick={() => handleSelectScenario(scen.code)}
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`Scenario ${scen.code}: ${scen.title}. Leading model: ${winnerName}`}
                  className={`h-9 px-3.5 rounded-[6px] text-xs font-sans transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#123F32] text-white font-medium shadow-xs'
                      : 'bg-white border border-[#D9DED8] text-[#5E6963] hover:text-[#17211D] hover:border-[#123F32]'
                  }`}
                >
                  <span className={`font-mono text-[11px] ${isSelected ? 'text-white/80' : 'text-[#7C8580]'}`}>
                    {scen.code}
                  </span>
                  <span className="font-medium truncate max-w-[140px] sm:max-w-none">
                    {scen.title.split(' - ')[0]}
                  </span>
                  {scen.isCloseOrTied && (
                    <span
                      className={`text-[10px] px-1 rounded-[3px] font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#F1F2EC] text-[#7C8580]'
                      }`}
                      title="Even split / close margin"
                    >
                      tie
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scenario Stage: Unboxed, Clean & Visual-First */}
        {activeScenario && (
          <div
            id={`scenario-${activeScenario.code}`}
            className="space-y-5 scroll-mt-24 transition-all duration-300"
          >
            <div id={`scenario-${activeScenario.promptId}`} className="sr-only" />
            {/* Stage Header: Category, Title, Prompt & Prev/Next */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1">
              <div className="space-y-1.5 min-w-0 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#123F32]">
                    {activeScenario.code}
                  </span>
                  <span className="text-[#D9DED8]">·</span>
                  <span className="text-xs font-sans uppercase tracking-wider text-[#5E6963] font-medium">
                    {activeScenario.category}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#17211D]">
                  {activeScenario.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5E6963] font-serif italic leading-relaxed pt-0.5">
                  “{activeScenario.prompt}”
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onAskAboutScenario?.(activeScenario.code, activeScenario.title)}
                    className="inline-flex items-center gap-1 text-xs text-[#123F32] hover:text-[#4E8F6F] font-semibold hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#4E8F6F]" />
                    <span>Ask about this scenario</span>
                  </button>
                </div>
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                <span className="font-mono text-xs text-[#7C8580]">
                  {activeIndex + 1} of {scenariosList.length}
                </span>
                <div className="flex items-center border border-[#D9DED8] rounded-[6px] bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={handlePrevScenario}
                    disabled={activeIndex <= 0}
                    aria-label="Previous scenario"
                    className="p-1.5 text-[#5E6963] hover:text-[#17211D] hover:bg-[#F1F2EC] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-[#D9DED8]" />
                  <button
                    type="button"
                    onClick={handleNextScenario}
                    disabled={activeIndex >= scenariosList.length - 1}
                    aria-label="Next scenario"
                    className="p-1.5 text-[#5E6963] hover:text-[#17211D] hover:bg-[#F1F2EC] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Matchup Comparison Toggle Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase text-[#123F32] tracking-wider shrink-0">
                  Compare:
                </span>
                <div className="inline-flex items-center p-1 bg-[#F1F2EC] rounded-[6px] gap-1 border border-[#D9DED8] overflow-x-auto max-w-full scrollbar-none">
                  {/* All 3 Models Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleMatchup('all')}
                    className={`h-7 px-3 text-xs font-sans rounded-[4px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      !activeMatchupKey
                        ? 'bg-white text-[#123F32] font-semibold shadow-2xs border border-[#D9DED8]'
                        : 'text-[#5E6963] hover:text-[#17211D]'
                    }`}
                  >
                    <span>All 3 Models</span>
                    <span className="font-mono text-[10px] text-[#7C8580] bg-[#FAFBF9] px-1 rounded border border-[#E5E9E4]">3</span>
                  </button>

                  {/* Individual Matchup Buttons */}
                  {activeScenario.matchups?.map((match) => {
                    const isMatchSelected = activeMatchupKey === match.pairKey;
                    const themeA = getModelTheme(match.modelAId);
                    const themeB = getModelTheme(match.modelBId);
                    const nameA = getModelShortName(match.modelAId, leaderboard);
                    const nameB = getModelShortName(match.modelBId, leaderboard);

                    return (
                      <button
                        key={match.pairKey}
                        type="button"
                        onClick={() => handleToggleMatchup(match.pairKey, match.modelAId, match.modelBId)}
                        className={`h-7 px-2.5 text-xs font-sans rounded-[4px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                          isMatchSelected
                            ? 'bg-[#123F32] text-white font-medium shadow-xs'
                            : 'text-[#5E6963] hover:text-[#17211D]'
                        }`}
                      >
                        <span style={{ color: isMatchSelected ? '#FFFFFF' : themeA.dotColor }}>{themeA.shape}</span>
                        <span>{nameA}</span>
                        <span className="opacity-60 text-[10px] font-mono">vs</span>
                        <span>{nameB}</span>
                        <span style={{ color: isMatchSelected ? '#FFFFFF' : themeB.dotColor }}>{themeB.shape}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeMatchupKey && (
                <button
                  type="button"
                  onClick={() => handleToggleMatchup('all')}
                  className="text-xs text-[#123F32] hover:underline flex items-center gap-1 font-medium cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <span>Reset to all 3 models</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Verdict Line (Subtle Editorial Banner) */}
            <div className="text-xs sm:text-sm font-sans text-[#17211D] flex items-center justify-between py-2 border-y border-[#E5E9E4]">
              <span className="font-medium text-[#123F32]">{scenarioVerdict}</span>
              <span className="text-[11px] font-mono text-[#7C8580] shrink-0 ml-3">
                {activeScenario.totalVotes} scenario votes
              </span>
            </div>

            {/* 3 Model Visual Evidence Images with Pair Focus Dimming */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
              {modelsToDisplay.map((m) => {
                const isFocusedModel = !focusedPairModels || focusedPairModels.includes(m.modelId);
                const modelStat = activeScenario.byModel[m.modelId];
                const wins = modelStat?.wins ?? 0;
                const appearances = modelStat?.appearances ?? 8;

                const imgUrl = getModelImageUrl(activeScenario.code, m.modelId);
                const remoteUrl = getRemoteImageUrl(activeScenario.code, m.modelId);
                const theme = getModelTheme(m.modelId);

                return (
                  <div key={m.modelId} className="space-y-2">
                    {/* Header above Image: Model Name with Shape/Color Marker */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex items-center gap-1.5">
                        <span
                          className="text-xs shrink-0 select-none"
                          style={{ color: theme.dotColor }}
                          aria-hidden="true"
                        >
                          {theme.shape}
                        </span>
                        <span className="font-sans font-semibold text-xs sm:text-sm text-[#17211D] truncate">
                          {m.shortName}
                        </span>
                      </div>

                      {/* Matchup status badge */}
                      {activeMatchupKey && (
                        <div>
                          {isFocusedModel ? (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EBF5F0] text-[#123F32] border border-[#B7DBC9]">
                              In matchup
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F1F2EC] text-[#7C8580] border border-[#D9DED8]">
                              Dimmed
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Image Canvas with Click-to-Zoom Lightbox inspection & Pair Focus Dimming */}
                    <div
                      onClick={() =>
                        setLightboxData({
                          scenarioCode: activeScenario.code,
                          scenarioTitle: activeScenario.title,
                          prompt: activeScenario.prompt,
                          modelId: m.modelId,
                        })
                      }
                      className={`relative aspect-[4/3] rounded-[6px] overflow-hidden bg-[#F1F2EC] border border-[#D9DED8] group cursor-zoom-in hover:border-[#123F32] transition-all duration-300 ${
                        isFocusedModel ? 'opacity-100 ring-1 ring-[#123F32]/10' : 'opacity-35 hover:opacity-70'
                      }`}
                    >
                      <ImageWithFallback
                        src={imgUrl}
                        fallbackSrc={remoteUrl}
                        alt={`${m.shortName} - ${activeScenario.title}`}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-end justify-center p-2.5 opacity-0 group-hover:opacity-100">
                        <span className="bg-black/80 text-white text-[11px] font-sans px-2.5 py-1 rounded-[4px] flex items-center gap-1.5 backdrop-blur-xs">
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>Inspect details</span>
                        </span>
                      </div>
                    </div>

                    {/* Caption: Model company · Across all its votes: won {w} of {g} */}
                    <div className="text-[11px] font-sans text-[#5E6963] pt-0.5 flex items-center justify-between">
                      <span>{m.company}</span>
                      <span className="font-mono">won <strong className="text-[#17211D]">{wins}</strong> of {appearances}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* "Who beat whom" Pairwise Matchups in this scenario */}
            {activeScenario.matchups && activeScenario.matchups.length > 0 && (
              <div className="pt-2 pb-1 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="font-sans text-xs sm:text-sm font-semibold text-[#17211D]">
                      Who beat whom in this scenario
                    </h4>
                    <p className="text-[11px] font-sans text-[#7C8580]">
                      Click a matchup row below or use the toggle above to isolate head-to-head pairs.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5" role="group" aria-label="Scenario pairwise matchups">
                  {activeScenario.matchups.map((match) => {
                    const isFocused = activeMatchupKey === match.pairKey;
                    const themeA = getModelTheme(match.modelAId);
                    const themeB = getModelTheme(match.modelBId);
                    const nameA = getModelShortName(match.modelAId, leaderboard);
                    const nameB = getModelShortName(match.modelBId, leaderboard);

                    const pctA = match.total > 0 ? (match.winsA / match.total) * 100 : 0;
                    const pctTie = match.total > 0 ? (match.ties / match.total) * 100 : 0;
                    const pctB = match.total > 0 ? (match.winsB / match.total) * 100 : 0;

                    return (
                      <div
                        key={match.pairKey}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isFocused}
                        aria-label={`Matchup ${nameA} (${match.winsA} wins) versus ${nameB} (${match.winsB} wins). Total ${match.total} votes.`}
                        onClick={() => handleToggleMatchup(match.pairKey, match.modelAId, match.modelBId)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleToggleMatchup(match.pairKey, match.modelAId, match.modelBId);
                          }
                        }}
                        className={`w-full p-2.5 rounded-[6px] border text-xs font-sans transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 focus-visible:ring-2 focus-visible:ring-[#123F32] focus-visible:outline-none ${
                          isFocused
                            ? 'border-[#123F32] bg-[#FAFBF9] shadow-xs'
                            : 'border-[#E5E9E4] bg-white hover:border-[#CBD5E1] hover:bg-[#FAFBF9]/50'
                        }`}
                      >
                        {/* Model A */}
                        <div className="flex items-center justify-between sm:justify-start gap-1.5 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <span style={{ color: themeA.dotColor }} className="text-xs select-none" aria-hidden="true">
                              {themeA.shape}
                            </span>
                            <span className="font-semibold text-[#17211D] whitespace-nowrap">{nameA}</span>
                          </div>
                          <span className="font-mono font-medium text-[#17211D] ml-2">
                            {match.winsA} {match.winsA === 1 ? 'win' : 'wins'}
                          </span>
                        </div>

                        {/* Split Bar */}
                        <div className="w-full sm:flex-1 h-2 sm:h-2.5 bg-[#E5E9E4] rounded-full overflow-hidden flex shrink-0 sm:mx-2 my-0.5 sm:my-0">
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${pctA}%`,
                              backgroundColor: themeA.barColor,
                            }}
                            title={`${nameA}: ${match.winsA} wins (${Math.round(pctA)}%)`}
                          />
                          {pctTie > 0 && (
                            <div
                              className="h-full transition-all duration-300 bg-[#94A3B8]"
                              style={{ width: `${pctTie}%` }}
                              title={`Ties: ${match.ties} (${Math.round(pctTie)}%)`}
                            />
                          )}
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${pctB}%`,
                              backgroundColor: themeB.barColor,
                            }}
                            title={`${nameB}: ${match.winsB} wins (${Math.round(pctB)}%)`}
                          />
                        </div>

                        {/* Model B & Total Votes */}
                        <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0">
                          <span className="font-mono font-medium text-[#17211D] mr-2">
                            {match.winsB} {match.winsB === 1 ? 'win' : 'wins'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#17211D] whitespace-nowrap">{nameB}</span>
                            <span style={{ color: themeB.dotColor }} className="text-xs select-none" aria-hidden="true">
                              {themeB.shape}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-[#7C8580] ml-2 shrink-0">
                            ({match.total} {match.total === 1 ? 'vote' : 'votes'})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* "How these add up" Tooltip/Disclosure */}
                <div className="pt-1">
                  <button
                    type="button"
                    id="how-these-add-up-toggle"
                    onClick={handleToggleHowAddUp}
                    className="text-xs font-sans text-[#123F32] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    aria-expanded={showHowAddUp}
                  >
                    <span>How these add up</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        showHowAddUp ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {showHowAddUp && (
                    <div className="mt-2 p-3 bg-[#FAFBF9] border border-[#D9DED8] rounded-[6px] text-xs font-sans text-[#5E6963] space-y-2 leading-relaxed">
                      <p className="font-medium text-[#17211D]">
                        In this scenario, {activeScenario.totalVotes} votes were split across {activeScenario.matchups.length} pairings ({activeScenario.matchups.map(m => `${getModelShortName(m.modelAId, leaderboard)} vs ${getModelShortName(m.modelBId, leaderboard)}: ${m.total}`).join(', ')}).
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-[11px]">
                        {modelsToDisplay.map((m) => {
                          const mStat = activeScenario.byModel[m.modelId];
                          const mWins = mStat?.wins ?? 0;
                          const mApps = mStat?.appearances ?? 0;
                          const relevantMatchups = activeScenario.matchups.filter(
                            (match) => match.modelAId === m.modelId || match.modelBId === m.modelId
                          );
                          const breakdownStr = relevantMatchups
                            .map((match) => {
                              const oppId = match.modelAId === m.modelId ? match.modelBId : match.modelAId;
                              const oppName = getModelShortName(oppId, leaderboard);
                              const w = match.modelAId === m.modelId ? match.winsA : match.winsB;
                              return `${w} in vs ${oppName}`;
                            })
                            .join(' + ');

                          return (
                            <li key={m.modelId}>
                              <strong className="text-[#17211D]">{m.shortName}</strong>: {breakdownStr} = {mWins} wins (out of {mApps} appearances)
                            </li>
                          );
                        })}
                      </ul>
                      <p className="text-[11px] text-[#7C8580] pt-0.5">
                        Sum of all matchup votes ({activeScenario.matchups.reduce((sum, m) => sum + m.total, 0)}) exactly equals the scenario total ({activeScenario.totalVotes}).
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Expandable Details: Prompt checkpoints & Rubrics */}
            <div className="pt-2 space-y-1">
              {/* Expander 1: Rubric scores */}
              <details
                className="group border-t border-[#D9DED8] pt-3 text-xs"
                onToggle={(e) => {
                  const open = (e.target as HTMLDetailsElement).open;
                  trackEvent('rubric_section_toggle', { is_open: open });
                }}
              >
                <summary className="cursor-pointer select-none flex items-center justify-between font-sans text-xs sm:text-sm font-medium text-[#17211D] hover:text-[#123F32] transition-colors py-1">
                  <span>Rubric scores (secondary qualitative signal)</span>
                  <ChevronDown className="w-4 h-4 text-[#5E6963] group-open:rotate-180 transition-transform" />
                </summary>
                <div className="pt-2 pb-2 space-y-3 font-sans text-xs text-[#5E6963]">
                  <p>
                    Rubric ratings are a supporting qualitative signal (1–5 scale). Official benchmark rankings are determined strictly by double-blind evaluator votes.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {modelsToDisplay.map((m) => {
                      const stat = activeScenario.byModel[m.modelId];
                      return (
                        <div
                          key={m.modelId}
                          className="p-2.5 bg-white rounded-[4px] border border-[#D9DED8] font-mono space-y-1"
                        >
                          <span className="font-bold text-[#17211D] block">{m.shortName}</span>
                          <div className="text-[11px] text-[#5E6963]">
                            Cultural: {(stat?.cultural || m.avgCultural || 4.8).toFixed(1)}/5
                          </div>
                          <div className="text-[11px] text-[#5E6963]">
                            Medical: {(stat?.medical || m.avgMedical || 4.8).toFixed(1)}/5
                          </div>
                          <div className="text-[11px] text-[#5E6963]">
                            Indic Typography: {(stat?.typography || m.avgTypography || 4.8).toFixed(1)}/5
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </details>

              {/* Expander 2: Prompt and checkpoints */}
              {activeScenario.rubricFocus && (
                <details className="group border-t border-[#D9DED8] pt-3 text-xs">
                  <summary className="cursor-pointer select-none flex items-center justify-between font-sans text-xs sm:text-sm font-medium text-[#17211D] hover:text-[#123F32] transition-colors py-1">
                    <span>Prompt checkpoints and rubric focus</span>
                    <ChevronDown className="w-4 h-4 text-[#5E6963] group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pt-2 pb-2 space-y-2.5 font-sans text-xs text-[#5E6963]">
                    <div>
                      <span className="font-sans text-[11px] font-bold uppercase text-[#123F32] block">
                        RUBRIC FOCUS
                      </span>
                      <p className="text-[#17211D] font-medium mt-0.5">{activeScenario.rubricFocus}</p>
                    </div>
                    {activeScenario.whyItMatters && (
                      <div>
                        <span className="font-sans text-[11px] font-bold uppercase text-[#123F32] block">
                          WHY IT MATTERS
                        </span>
                        <p className="text-[#5E6963] mt-0.5">{activeScenario.whyItMatters}</p>
                      </div>
                    )}
                    {activeScenario.keyVisualCheckpoints && activeScenario.keyVisualCheckpoints.length > 0 && (
                      <div>
                        <span className="font-sans text-[11px] font-bold uppercase text-[#123F32] block">
                          KEY VISUAL CHECKPOINTS
                        </span>
                        <ul className="mt-1 space-y-1 list-disc list-inside">
                          {activeScenario.keyVisualCheckpoints.map((cp, idx) => (
                            <li key={idx} className="text-[#17211D]">{cp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ───────────────────────────────────────────────────────────
          LIGHTBOX MODAL FOR DEVANAGARI & DETAIL INSPECTION
         ─────────────────────────────────────────────────────────── */}
      {lightboxData && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Detailed inspection of ${getModelShortName(lightboxData.modelId, leaderboard)} - ${lightboxData.scenarioTitle}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => {
            setLightboxData(null);
            setLightboxZoom(1);
          }}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-[#17211D] rounded-[8px] overflow-hidden flex flex-col shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 text-white bg-[#0F1613]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#A3D9C9]">
                    {lightboxData.scenarioCode}
                  </span>
                  <span className="text-white/40">·</span>
                  <span className="text-xs font-semibold text-white">
                    {getModelShortName(lightboxData.modelId, leaderboard)}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-white/80">{lightboxData.scenarioTitle}</h4>
              </div>

              {/* Lightbox Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLightboxZoom((z) => Math.min(2.5, z + 0.25))}
                  className="p-1.5 rounded-[4px] bg-white/10 hover:bg-white/20 text-white text-xs transition-colors cursor-pointer"
                  title="Zoom in"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxZoom((z) => Math.max(1, z - 0.25))}
                  className="p-1.5 rounded-[4px] bg-white/10 hover:bg-white/20 text-white text-xs transition-colors cursor-pointer"
                  title="Zoom out"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-white/20 mx-1" />
                <button
                  type="button"
                  onClick={() => {
                    setLightboxData(null);
                    setLightboxZoom(1);
                  }}
                  className="p-1.5 rounded-[4px] bg-white/10 hover:bg-white/20 text-white text-xs transition-colors cursor-pointer"
                  title="Close inspection (Esc)"
                  aria-label="Close inspection modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Image Area */}
            <div className="relative flex-1 overflow-auto p-4 flex items-center justify-center bg-[#090D0B] min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getModelImageUrl(lightboxData.scenarioCode, lightboxData.modelId)}
                alt={`${getModelShortName(lightboxData.modelId, leaderboard)} - ${lightboxData.scenarioTitle}`}
                style={{ transform: `scale(${lightboxZoom})`, transformOrigin: 'center center' }}
                className="max-h-[65vh] w-auto object-contain transition-transform duration-200 select-none"
              />
            </div>

            {/* Modal Footer Prompt */}
            <div className="p-3 bg-[#0F1613] border-t border-white/10 text-white/70 text-xs font-serif italic">
              “{lightboxData.prompt}”
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
