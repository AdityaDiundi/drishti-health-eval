'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Trophy,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download,
  Users,
  BarChart3,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { ComparativeAnalysis } from './ComparativeAnalysis';

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
  const [expandedModelId, setExpandedModelId] = useState<string | null>(null);

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

  const toggleExpand = (modelId: string) => {
    setExpandedModelId((prev) => (prev === modelId ? null : modelId));
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* ───────────────────────────────────────────────────────────
          1. WIDE EDITORIAL HERO SECTION (Matching Reference 1)
         ─────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column (Editorial Headline, Copy, 3 Axis Pills, CTAs) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Metadata Rail */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#0F2E24] text-white tracking-wider uppercase">
              JANEVAL v1.0
            </span>
            <span className="text-[#C6DDD1] font-mono text-[10px] hidden sm:inline">•</span>
            <span className="font-mono text-[10.5px] sm:text-[11px] text-[#69716B] font-medium tracking-tight">
              DOUBLE-BLIND PAIRWISE ELO BENCHMARK
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0F2E24] tracking-tight leading-[1.15]">
            Frontier Vision AI Benchmark for Indian Public-Health Representation
          </h1>

          {/* Subtitle / Core Research Question */}
          <p className="text-base sm:text-lg font-medium text-[#171A18] leading-snug">
            How accurately do frontier vision models represent real-world Indian public-health contexts?
          </p>

          {/* Supporting Description */}
          <p className="text-xs sm:text-sm text-[#69716B] leading-relaxed max-w-2xl">
            JANEVAL evaluates AI-generated images across 10 frontline healthcare scenarios, testing whether models can reproduce the cultural, infrastructural, and visual details that make these environments recognizably and authentically Indian.
          </p>

          {/* 3 Compact Evaluation-Axis Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="bg-white border border-[#E3E7E2] rounded-lg p-2.5 shadow-2xs">
              <span className="font-mono text-[9px] uppercase font-bold text-[#0F2E24] block tracking-wider">
                CULTURAL FIDELITY
              </span>
              <span className="text-[11px] text-[#69716B] mt-0.5 block">
                People, settings, practices
              </span>
            </div>

            <div className="bg-white border border-[#E3E7E2] rounded-lg p-2.5 shadow-2xs">
              <span className="font-mono text-[9px] uppercase font-bold text-[#0F2E24] block tracking-wider">
                INFRASTRUCTURAL FIDELITY
              </span>
              <span className="text-[11px] text-[#69716B] mt-0.5 block">
                Systems, equipment, spaces
              </span>
            </div>

            <div className="bg-white border border-[#E3E7E2] rounded-lg p-2.5 shadow-2xs">
              <span className="font-mono text-[9px] uppercase font-bold text-[#0F2E24] block tracking-wider">
                ORTHOGRAPHIC FIDELITY
              </span>
              <span className="text-[11px] text-[#69716B] mt-0.5 block">
                Devanagari &amp; public-health text
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {onStartEvaluation && (
              <button
                onClick={onStartEvaluation}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#0F2E24] hover:bg-[#163d30] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <span>Explore the Arena</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {onNavigateTab && (
              <>
                <button
                  onClick={() => onNavigateTab('gallery')}
                  className="px-4 py-2.5 rounded-lg bg-white hover:bg-[#FAFBF9] text-[#171A18] border border-[#E3E7E2] font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  View Gallery
                </button>
                <button
                  onClick={() => onNavigateTab('methodology')}
                  className="px-4 py-2.5 rounded-lg bg-white hover:bg-[#FAFBF9] text-[#171A18] border border-[#E3E7E2] font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  Methodology
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Column (Subtle Malgudi Days Pencil Art illustration) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-white border border-[#E3E7E2] rounded-xl overflow-hidden shadow-2xs">
            <div className="relative aspect-4/3 w-full bg-[#FAFBF9] overflow-hidden border-b border-[#E3E7E2]">
              <img
                src="/malgudi-asha.jpg"
                alt="Fine pencil & ink sketch of an ASHA worker outside a rural Indian health sub-centre in the Malgudi Days tradition"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="p-3 bg-[#FAFBF9] flex items-center justify-between text-[11px] text-[#69716B]">
              <span className="font-mono text-[9.5px] uppercase font-bold text-[#0F2E24] tracking-wider">
                FIELD REALITY STUDY
              </span>
              <span className="text-[10.5px]">Frontline health worker · Fine pen &amp; ink sketch</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          2. MODEL RANKINGS (Primary Benchmark Table Rows)
         ─────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F2E24] tracking-tight">
              Model Rankings
            </h2>
            <p className="text-xs text-[#69716B] mt-1">
              Models ranked using double-blind pairwise comparisons (Elo).
            </p>
          </div>

          {/* Live Telemetry Badges */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <div className="bg-white border border-[#E3E7E2] rounded-lg px-3 py-1.5 flex items-center space-x-2 shadow-2xs">
              <Users className="w-3.5 h-3.5 text-[#4E8F6F]" />
              <div className="text-left">
                <div className="text-[9px] uppercase font-bold text-[#69716B] leading-none">Evaluators</div>
                <div className="font-mono text-xs sm:text-sm font-bold text-[#0F2E24] leading-tight">
                  {totalParticipants}
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E3E7E2] rounded-lg px-3 py-1.5 flex items-center space-x-2 shadow-2xs">
              <BarChart3 className="w-3.5 h-3.5 text-[#4E8F6F]" />
              <div className="text-left">
                <div className="text-[9px] uppercase font-bold text-[#69716B] leading-none">Verified Votes</div>
                <div className="font-mono text-xs sm:text-sm font-bold text-[#0F2E24] leading-tight">
                  {totalRatings}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-[#E3E7E2] rounded-xl overflow-hidden shadow-2xs">
          {/* Table Header (Desktop) */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-[#FAFBF9] border-b border-[#E3E7E2] text-[10px] font-mono uppercase font-bold text-[#69716B] tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Model / Provider</div>
            <div className="col-span-1 text-right">Elo Rating</div>
            <div className="col-span-1 text-right">Win Rate</div>
            <div className="col-span-1 text-center">Cultural</div>
            <div className="col-span-1 text-center">Infrastr.</div>
            <div className="col-span-1 text-center">Orthogr.</div>
            <div className="col-span-2 text-right">Detail</div>
          </div>

          {/* Model Rows */}
          <div className="divide-y divide-[#E3E7E2]">
            {leaderboard.map((item, index) => {
              const isFirst = index === 0 && totalRatings > 0;
              const isExpanded = expandedModelId === item.modelId;
              const rankStr = `0${index + 1}`.slice(-2);

              const isGoogle = item.company.toLowerCase().includes('google');
              const isOpenAI = item.company.toLowerCase().includes('openai');

              return (
                <div
                  key={item.modelId}
                  className={`transition-colors hover:bg-[#FAFBF9] ${
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
                        <span className="font-mono text-sm font-bold text-[#0F2E24] bg-[#F7F8F5] border border-[#E3E7E2] px-2 py-0.5 rounded">
                          {rankStr}
                        </span>
                        {isFirst && (
                          <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}
                      </div>

                      {/* Model / Provider */}
                      <div className="col-span-4 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg border border-[#E3E7E2] bg-white flex items-center justify-center shrink-0">
                          {isOpenAI ? (
                            <svg className="w-4 h-4 text-[#0F2E24]" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.5045 4.5045 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                            </svg>
                          ) : isGoogle ? (
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.41 7.33 24 12 24z"/>
                              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.59 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                            </svg>
                          ) : (
                            <span className="font-mono text-xs font-bold text-[#0F2E24]">{item.shortName[0]}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#171A18] tracking-tight">
                            {item.name}
                          </div>
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            <span className="text-[10px] font-mono text-[#69716B]">
                              {item.company} · {item.codename}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Elo Rating */}
                      <div className="col-span-1 text-right">
                        <div className="font-mono text-sm font-bold text-[#0F2E24]">
                          {totalRatings > 0 ? item.eloRating : '1200'}
                        </div>
                        <div className="text-[9px] font-mono text-[#69716B] uppercase">
                          {totalRatings > 0 ? 'Elo' : 'Base'}
                        </div>
                      </div>

                      {/* Win Rate */}
                      <div className="col-span-1 text-right">
                        <div className="font-mono text-sm font-bold text-[#171A18]">
                          {totalRatings > 0 ? `${item.winRate}%` : '—'}
                        </div>
                        <div className="text-[9px] font-mono text-[#69716B]">
                          {item.wins} wins
                        </div>
                      </div>

                      {/* Cultural */}
                      <div className="col-span-1 text-center">
                        <span className="font-mono text-xs font-semibold text-[#171A18]">
                          {item.avgCultural > 0 ? `${item.avgCultural}/5` : '—'}
                        </span>
                      </div>

                      {/* Infrastructure */}
                      <div className="col-span-1 text-center">
                        <span className="font-mono text-xs font-semibold text-[#171A18]">
                          {item.avgMedical > 0 ? `${item.avgMedical}/5` : '—'}
                        </span>
                      </div>

                      {/* Orthography */}
                      <div className="col-span-1 text-center">
                        <span className="font-mono text-xs font-semibold text-[#171A18]">
                          {item.avgTypography > 0 ? `${item.avgTypography}/5` : '—'}
                        </span>
                      </div>

                      {/* Detail Chevron */}
                      <div className="col-span-2 flex items-center justify-end space-x-1.5 text-xs text-[#69716B]">
                        <span className="text-[11px] font-medium hidden xl:inline">
                          {isExpanded ? 'Close' : 'Inspect'}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#0F2E24]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#69716B]" />
                        )}
                      </div>
                    </div>

                    {/* Mobile / Tablet View (< lg screens) */}
                    <div className="lg:hidden space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <span className="font-mono text-xs font-bold text-[#0F2E24] bg-[#F7F8F5] border border-[#E3E7E2] px-2 py-0.5 rounded">
                            {rankStr}
                          </span>
                          <div>
                            <div className="font-bold text-sm text-[#171A18]">
                              {item.name}
                            </div>
                            <div className="text-[10px] font-mono text-[#69716B]">
                              {item.company} · {item.codename}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono text-sm font-bold text-[#0F2E24]">
                            {totalRatings > 0 ? item.eloRating : '1200'} ELO
                          </div>
                          <div className="text-[10px] font-mono text-[#69716B]">
                            {totalRatings > 0 ? `${item.winRate}% win rate` : 'Baseline'}
                          </div>
                        </div>
                      </div>

                      {/* Mobile Scores Grid */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E3E7E2] text-center">
                        <div className="bg-[#FAFBF9] p-1.5 rounded border border-[#E3E7E2]">
                          <div className="text-[9px] uppercase font-bold text-[#69716B]">Cultural</div>
                          <div className="font-mono text-xs font-bold text-[#0F2E24]">
                            {item.avgCultural > 0 ? `${item.avgCultural}/5` : '—'}
                          </div>
                        </div>
                        <div className="bg-[#FAFBF9] p-1.5 rounded border border-[#E3E7E2]">
                          <div className="text-[9px] uppercase font-bold text-[#69716B]">Infrastr.</div>
                          <div className="font-mono text-xs font-bold text-[#0F2E24]">
                            {item.avgMedical > 0 ? `${item.avgMedical}/5` : '—'}
                          </div>
                        </div>
                        <div className="bg-[#FAFBF9] p-1.5 rounded border border-[#E3E7E2]">
                          <div className="text-[9px] uppercase font-bold text-[#69716B]">Orthogr.</div>
                          <div className="font-mono text-xs font-bold text-[#0F2E24]">
                            {item.avgTypography > 0 ? `${item.avgTypography}/5` : '—'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Panel (Section 8) */}
                  {isExpanded && (
                    <div className="px-6 py-5 bg-[#F7F8F5] border-t border-[#E3E7E2] space-y-4 animate-in fade-in duration-150">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-3.5 rounded-lg border border-[#E3E7E2]">
                          <div className="text-[10px] font-mono font-bold uppercase text-[#69716B]">
                            PAIRWISE PERFORMANCE
                          </div>
                          <div className="mt-2 space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-[#69716B]">Total Wins:</span>
                              <span className="font-mono font-bold text-[#171A18]">{item.wins}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#69716B]">Win Rate:</span>
                              <span className="font-mono font-bold text-[#171A18]">{item.winRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#69716B]">Elo Standing:</span>
                              <span className="font-mono font-bold text-[#0F2E24]">{item.eloRating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-lg border border-[#E3E7E2]">
                          <div className="text-[10px] font-mono font-bold uppercase text-[#69716B]">
                            AXIS PERFORMANCE BREAKDOWN
                          </div>
                          <div className="mt-2 space-y-1.5 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-[#69716B]">Cultural Context:</span>
                              <span className="font-mono font-bold">{item.avgCultural}/5</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#69716B]">Equipment / Cold-Chain:</span>
                              <span className="font-mono font-bold">{item.avgMedical}/5</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#69716B]">Devanagari Orthography:</span>
                              <span className="font-mono font-bold">{item.avgTypography}/5</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-lg border border-[#E3E7E2] flex flex-col justify-between">
                          <div>
                            <div className="text-[10px] font-mono font-bold uppercase text-[#69716B]">
                              SCENARIO GALLERY
                            </div>
                            <p className="text-xs text-[#69716B] mt-1">
                              Inspect all 10 public-health test scenarios generated by {item.name}.
                            </p>
                          </div>
                          {onNavigateTab && (
                            <button
                              onClick={() => onNavigateTab('gallery')}
                              className="mt-3 inline-flex items-center space-x-1.5 text-xs font-semibold text-[#0F2E24] hover:text-[#4E8F6F]"
                            >
                              <span>Inspect in Gallery</span>
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
          3. COMPARATIVE REAL-TIME ANALYSIS (Dimensional Profiles, Win Matrix, Failure Diagnostics)
         ─────────────────────────────────────────────────────────── */}
      <ComparativeAnalysis
        leaderboard={leaderboard}
        totalRatings={totalRatings}
        totalParticipants={totalParticipants}
      />

      {/* ───────────────────────────────────────────────────────────
          4. EVALUATION AXES (Section 12: 3 Clean Architectural Cards)
         ─────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F2E24] tracking-tight">
            Evaluation Dimensions
          </h2>
          <p className="text-xs text-[#69716B] mt-1">
            Three domain-specific axes designed to measure public-health representational authenticity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* AXIS 01 */}
          <div className="bg-white border border-[#E3E7E2] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#FAFBF9] text-[#0F2E24] border border-[#E3E7E2]">
                  AXIS 01 · CULTURAL FIDELITY
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#171A18]">
                Frontline Healthcare in Context
              </h3>
              <p className="text-xs text-[#69716B] italic leading-snug">
                Can the model represent who, where, and how healthcare happens in rural India?
              </p>
              <div className="text-[11.5px] text-[#69716B] space-y-1.5 pt-2 border-t border-[#E3E7E2]">
                <div className="font-mono text-[10px] font-bold text-[#171A18] uppercase">
                  Evaluated Against:
                </div>
                <p>• ASHA worker role, presence, and authentic community placement</p>
                <p>• Official cotton sarees, identification badges &amp; physical registers</p>
                <p>• Grounded social body language in rural household triage settings</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E3E7E2] text-[11px]">
              <span className="font-mono text-[10px] uppercase font-bold text-[#69716B] block">
                Primary Failure Mode:
              </span>
              <p className="text-[#69716B] mt-0.5 leading-snug">
                Westernized clinical representation, doctor lab coats, generic uniforms, and distorted social hierarchies.
              </p>
            </div>
          </div>

          {/* AXIS 02 */}
          <div className="bg-white border border-[#E3E7E2] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#FAFBF9] text-[#0F2E24] border border-[#E3E7E2]">
                  AXIS 02 · INFRASTRUCTURAL FIDELITY
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#171A18]">
                Public-Health Systems &amp; Equipment
              </h3>
              <p className="text-xs text-[#69716B] italic leading-snug">
                Can the model accurately represent the equipment and spaces of rural frontline healthcare?
              </p>
              <div className="text-[11.5px] text-[#69716B] space-y-1.5 pt-2 border-t border-[#E3E7E2]">
                <div className="font-mono text-[10px] font-bold text-[#171A18] uppercase">
                  Evaluated Against:
                </div>
                <p>• WHO-standard blue vaccine cold-chain carriers</p>
                <p>• Conditioned hard ice packs &amp; dial temperature monitors</p>
                <p>• Salter spring hanging baby weighing scales &amp; fabric slings</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E3E7E2] text-[11px]">
              <span className="font-mono text-[10px] uppercase font-bold text-[#69716B] block">
                Primary Failure Mode:
              </span>
              <p className="text-[#69716B] mt-0.5 leading-snug">
                Generic hospital apparatus, incorrect cold-chain hardware, and unrealistic high-tech clinical environments.
              </p>
            </div>
          </div>

          {/* AXIS 03 */}
          <div className="bg-white border border-[#E3E7E2] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#FAFBF9] text-[#0F2E24] border border-[#E3E7E2]">
                  AXIS 03 · ORTHOGRAPHIC FIDELITY
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#171A18]">
                Devanagari &amp; Public-Health Text
              </h3>
              <p className="text-xs text-[#69716B] italic leading-snug">
                Can the model generate accurate, legible Hindi in real-world public-health environments?
              </p>
              <div className="text-[11.5px] text-[#69716B] space-y-1.5 pt-2 border-t border-[#E3E7E2]">
                <div className="font-mono text-[10px] font-bold text-[#171A18] uppercase">
                  Evaluated Against:
                </div>
                <p>• Continuous unbroken shirorekha (top horizontal line)</p>
                <p>• Accurate matras &amp; character conjunct formation</p>
                <p>• Legible Hindi public-health messaging on clinic wall murals</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E3E7E2] text-[11px]">
              <span className="font-mono text-[10px] uppercase font-bold text-[#69716B] block">
                Primary Failure Mode:
              </span>
              <p className="text-[#69716B] mt-0.5 leading-snug">
                Gibberish pseudo-script, Latin character bleeding, broken conjuncts, and fragmented shirorekha.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          5. METHODOLOGICAL MANIFESTO (Section 11: Dark Brand Container)
         ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#0F2E24] text-white rounded-xl p-6 sm:p-8 border border-[#163d30] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-white/10">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#DDEBE3]">
              EVALUATION METHODOLOGY
            </span>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white mt-1">
              THE BENCHMARK MEASURES REPRESENTATION FIDELITY — NOT AESTHETIC PREFERENCE.
            </h2>
          </div>
          <span className="shrink-0 font-mono text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded bg-white/10 text-[#DDEBE3] border border-white/15">
            BLIND · PAIRWISE · HUMAN-EVALUATED
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#DDEBE3]/90 leading-relaxed max-w-3xl">
          Each image is evaluated through blinded pairwise comparisons by independent evaluators. Results are aggregated using an Elo-based ranking system. The benchmark asks a singular, foundational question: <span className="text-white font-semibold">Can AI generate an image of India that is actually faithful to the India it is depicting?</span>
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href="/api/export?format=csv"
            download="janeval_benchmark_dataset.csv"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-[#0F2E24] bg-white hover:bg-[#FAFBF9] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Benchmark Dataset CSV</span>
          </a>
          <a
            href="/api/export?type=ratings&format=csv"
            download="janeval_ratings_anonymized.csv"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ratings CSV ({totalRatings} votes)</span>
          </a>
        </div>
      </section>
    </div>
  );
}
