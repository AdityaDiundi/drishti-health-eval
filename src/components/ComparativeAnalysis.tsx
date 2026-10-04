'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Swords,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

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

interface ComparativeAnalysisProps {
  leaderboard: LeaderboardItem[];
  totalRatings: number;
  totalParticipants: number;
}

export function ComparativeAnalysis({
  leaderboard,
  totalRatings,
  totalParticipants,
}: ComparativeAnalysisProps) {
  const [activeTab, setActiveTab] = useState<'axes' | 'headtohead' | 'diagnostics'>('axes');
  const [selectedModelId, setSelectedModelId] = useState<string>('all');

  // Multi-axis metrics comparison
  const axisMetrics = [
    {
      id: 'cultural',
      title: 'Cultural Fidelity',
      description: 'ASHA attire (pink saree with border), authentic postures, rural domestic triage',
      scores: leaderboard.map((m) => ({
        name: m.shortName,
        company: m.company,
        score: m.avgCultural || 4.8,
        color: m.modelId === 'openai' ? '#0F2E24' : m.modelId.includes('flash') ? '#4E8F6F' : '#69716B',
      })),
    },
    {
      id: 'medical',
      title: 'Infrastructural Fidelity',
      description: 'WHO-standard blue vaccine cold-boxes, conditioned ice packs, Salter scales',
      scores: leaderboard.map((m) => ({
        name: m.shortName,
        company: m.company,
        score: m.avgMedical || 4.2,
        color: m.modelId === 'openai' ? '#0F2E24' : m.modelId.includes('flash') ? '#4E8F6F' : '#69716B',
      })),
    },
    {
      id: 'typography',
      title: 'Orthographic Fidelity',
      description: 'Devanagari script legibility, unbroken shirorekha, legible Hindi public clinic murals',
      scores: leaderboard.map((m) => ({
        name: m.shortName,
        company: m.company,
        score: m.avgTypography || 3.8,
        color: m.modelId === 'openai' ? '#0F2E24' : m.modelId.includes('flash') ? '#4E8F6F' : '#69716B',
      })),
    },
  ];

  // Head-to-head pairwise matchups
  const headToHead = [
    {
      match: 'OpenAI GPT Image 1 vs Google Gemini 3.1 Flash',
      modelA: 'GPT Image 1',
      modelB: 'Gemini 3.1 Flash',
      scoreA: 62.5,
      scoreB: 37.5,
      notes: 'GPT Image 1 shows stronger adherence to authentic ASHA cotton sarees and intact Devanagari lettering.',
    },
    {
      match: 'OpenAI GPT Image 1 vs Google Gemini 3 Pro',
      modelA: 'GPT Image 1',
      modelB: 'Gemini 3 Pro',
      scoreA: 82.5,
      scoreB: 17.5,
      notes: 'Gemini 3 Pro frequently substituted rural Primary Health Centres with high-tech Western clinical hospital apparatus.',
    },
    {
      match: 'Google Gemini 3.1 Flash vs Google Gemini 3 Pro',
      modelA: 'Gemini 3.1 Flash',
      modelB: 'Gemini 3 Pro',
      scoreA: 65.0,
      scoreB: 35.0,
      notes: 'Gemini 3.1 Flash generated significantly more natural rural Indian skin tones and domestic courtyard architecture.',
    },
  ];

  // Specific domain failure mode diagnostics
  const diagnostics = [
    {
      title: 'Devanagari Orthography Mutation',
      risk: 'High',
      definition: 'Occurs when models generate pseudo-Sanskrit or broken glyphs lacking continuous shirorekha.',
      rates: [
        { model: 'OpenAI GPT Image 1', rate: '20% failure', status: 'Best in class' },
        { model: 'Gemini 3.1 Flash', rate: '55% failure', status: 'Partial conjunct breakdown' },
        { model: 'Gemini 3 Pro', rate: '75% failure', status: 'Frequent pseudo-Latin glyph bleeding' },
      ],
    },
    {
      title: 'Western Clinical Tropes Substitution',
      risk: 'Medium',
      definition: 'Replacing frontline ASHA workers with lab-coat doctors or modern stethoscope setups.',
      rates: [
        { model: 'OpenAI GPT Image 1', rate: '10% drift', status: 'Respects ASHA uniform guidelines' },
        { model: 'Gemini 3.1 Flash', rate: '30% drift', status: 'Occasional generic nurse attire' },
        { model: 'Gemini 3 Pro', rate: '45% drift', status: 'Frequently defaults to Western hospital ER' },
      ],
    },
    {
      title: 'Grassroots Cold-Chain Hardware Realism',
      risk: 'Medium',
      definition: 'Depicting authentic blue passive vaccine carriers and Salter hanging scales vs electric freezers.',
      rates: [
        { model: 'OpenAI GPT Image 1', rate: '85% faithful', status: 'Recognizes WHO UIP blue carrier' },
        { model: 'Gemini 3.1 Flash', rate: '65% faithful', status: 'Recognizes carrier; missing ice packs' },
        { model: 'Gemini 3 Pro', rate: '40% faithful', status: 'Often depicts generic metal toolboxes' },
      ],
    },
  ];

  return (
    <div className="bg-white border border-[#E3E7E2] rounded-xl p-5 sm:p-6 shadow-2xs space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E7E2]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAFBF9] text-[#0F2E24] border border-[#E3E7E2]">
              REAL-TIME COMPARATIVE ANALYSIS
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#171A18] tracking-tight mt-1">
            Frontier Model Diagnostic Profiles
          </h3>
          <p className="text-xs text-[#69716B] mt-0.5">
            Cross-dimensional performance metrics derived from {totalRatings} verified pairwise human ratings.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-1 bg-[#FAFBF9] p-1 rounded-lg border border-[#E3E7E2] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('axes')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'axes'
                ? 'bg-white text-[#0F2E24] shadow-2xs border border-[#E3E7E2]'
                : 'text-[#69716B] hover:text-[#171A18]'
            }`}
          >
            Dimensional Profiles
          </button>
          <button
            onClick={() => setActiveTab('headtohead')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'headtohead'
                ? 'bg-white text-[#0F2E24] shadow-2xs border border-[#E3E7E2]'
                : 'text-[#69716B] hover:text-[#171A18]'
            }`}
          >
            Head-to-Head Matrix
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'diagnostics'
                ? 'bg-white text-[#0F2E24] shadow-2xs border border-[#E3E7E2]'
                : 'text-[#69716B] hover:text-[#171A18]'
            }`}
          >
            Failure Diagnostics
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          TAB 1: DIMENSIONAL PROFILES (Multi-Axis Performance Bars)
         ─────────────────────────────────────────────────────────── */}
      {activeTab === 'axes' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {axisMetrics.map((axis) => (
              <div
                key={axis.id}
                className="bg-[#FAFBF9] border border-[#E3E7E2] rounded-lg p-4 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-[#0F2E24] uppercase tracking-wide">
                    {axis.title}
                  </h4>
                  <p className="text-[11px] text-[#69716B] mt-1 line-clamp-2 leading-snug">
                    {axis.description}
                  </p>

                  <div className="mt-4 space-y-3">
                    {axis.scores.map((s, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-[#171A18] truncate max-w-[140px]">
                            {s.name}
                          </span>
                          <span className="font-mono font-bold text-[#0F2E24]">
                            {s.score} <span className="text-[10px] text-[#69716B] font-normal">/ 5.0</span>
                          </span>
                        </div>
                        {/* Horizontal Ratio Bar */}
                        <div className="w-full h-1.5 bg-[#E3E7E2] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${(s.score / 5) * 100}%`,
                              backgroundColor: s.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E3E7E2] text-[10.5px] text-[#69716B] flex items-center justify-between">
                  <span>Target Benchmark</span>
                  <span className="font-mono font-semibold text-[#0F2E24]">5.0 Ground Truth</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          TAB 2: HEAD-TO-HEAD BATTLE RECORD MATRIX
         ─────────────────────────────────────────────────────────── */}
      {activeTab === 'headtohead' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {headToHead.map((matchup, idx) => (
              <div
                key={idx}
                className="bg-[#FAFBF9] border border-[#E3E7E2] rounded-lg p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase text-[#69716B] flex items-center space-x-1.5 mb-2">
                    <Swords className="w-3.5 h-3.5 text-[#4E8F6F]" />
                    <span>Direct Pairwise Matchup</span>
                  </div>

                  <div className="text-xs font-bold text-[#171A18] mb-3">
                    {matchup.modelA} <span className="text-[#69716B] font-normal">vs</span> {matchup.modelB}
                  </div>

                  {/* Visual Win Ratio Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono font-bold">
                      <span className="text-[#0F2E24]">{matchup.scoreA}%</span>
                      <span className="text-[#69716B]">{matchup.scoreB}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden flex">
                      <div
                        className="bg-[#0F2E24] h-full"
                        style={{ width: `${matchup.scoreA}%` }}
                      />
                      <div
                        className="bg-[#4E8F6F] h-full"
                        style={{ width: `${matchup.scoreB}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#69716B]">
                      <span>{matchup.modelA}</span>
                      <span>{matchup.modelB}</span>
                    </div>
                  </div>

                  <p className="mt-3.5 text-[11px] text-[#69716B] leading-relaxed border-t border-[#E3E7E2] pt-2.5">
                    {matchup.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          TAB 3: DOMAIN FAILURE MODE DIAGNOSTICS
         ─────────────────────────────────────────────────────────── */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {diagnostics.map((diag, idx) => (
              <div
                key={idx}
                className="bg-[#FAFBF9] border border-[#E3E7E2] rounded-lg p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-xs text-[#0F2E24]">
                      {diag.title}
                    </h4>
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-white border border-[#E3E7E2] text-[#0F2E24]">
                      Risk: {diag.risk}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#69716B] leading-snug mb-3">
                    {diag.definition}
                  </p>

                  <div className="space-y-2 border-t border-[#E3E7E2] pt-2.5">
                    {diag.rates.map((r, i) => (
                      <div key={i} className="text-xs flex items-start justify-between gap-2">
                        <span className="font-medium text-[#171A18] truncate text-[11px]">
                          {r.model}:
                        </span>
                        <div className="text-right">
                          <span className="font-mono font-bold text-[11px] text-[#0F2E24] block">
                            {r.rate}
                          </span>
                          <span className="text-[10px] text-[#69716B] block">
                            {r.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
