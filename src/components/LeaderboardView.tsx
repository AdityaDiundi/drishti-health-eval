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
      {/* Sleek, Minimal Hero Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
        {/* Subtle Category Pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
          <span>Indian Public Health Visual AI Benchmark</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500 font-normal">Blind Pairwise Human Evaluation</span>
        </div>

        {/* Clean, Impactful Headline */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Evaluating Frontier Vision AI for Indian Public Health
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 mt-2.5 max-w-2xl leading-relaxed">
          Comparing how OpenAI and Google Gemini models depict rural India — evaluating ASHA worker attire, Primary Health Centre equipment, and Devanagari Hindi typography.
        </p>

        {/* 3 Minimalist Focus Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
          <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/70">
            <span className="text-base select-none">🩺</span>
            <div>
              <div className="text-xs font-bold text-gray-900">ASHA Attire &amp; Identity</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Government pink cotton saree vs western lab coats</div>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/70">
            <span className="text-base select-none">🏥</span>
            <div>
              <div className="text-xs font-bold text-gray-900">Rural PHC Realism</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Ice-lined vaccine carriers &amp; Salter hanging scales</div>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/70">
            <span className="text-base select-none">✍️</span>
            <div>
              <div className="text-xs font-bold text-gray-900">Devanagari Script</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Legible Hindi wall murals vs distorted matras</div>
            </div>
          </div>
        </div>

        {/* Action CTAs & Telemetry Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-2.5">
            {onStartEvaluation && (
              <button
                onClick={onStartEvaluation}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Evaluation →</span>
              </button>
            )}
            {onNavigateTab && (
              <>
                <button
                  onClick={() => onNavigateTab('gallery')}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold text-xs shadow-2xs transition-all cursor-pointer"
                >
                  Gallery (30 Images)
                </button>
                <button
                  onClick={() => onNavigateTab('methodology')}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold text-xs shadow-2xs transition-all cursor-pointer"
                >
                  Methodology
                </button>
              </>
            )}
          </div>

          {/* Right: Live Telemetry Badges */}
          <div className="flex items-center space-x-2.5 self-start sm:self-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-right">
              <div className="text-[10px] uppercase font-bold text-gray-400">Evaluators</div>
              <div className="text-sm font-extrabold text-gray-900 flex items-center justify-end space-x-1">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>{totalParticipants}</span>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-right">
              <div className="text-[10px] uppercase font-bold text-gray-400">Total Votes</div>
              <div className="text-sm font-extrabold text-gray-900 flex items-center justify-end space-x-1">
                <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
                <span>{totalRatings}</span>
              </div>
            </div>
            <a
              href="/api/export?type=ratings&format=csv"
              download="drishti_health_eval_ratings_anonymized.csv"
              className="flex items-center space-x-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 shadow-2xs transition-colors"
              title="Download verified ratings (100% anonymized, zero personal data)"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>Ratings CSV</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Leaderboard Cards */}
      <div className="grid grid-cols-1 gap-4 mb-10">
        {leaderboard.map((item, index) => {
          const isFirst = index === 0 && totalRatings > 0;
          return (
            <div
              key={item.modelId}
              className={`bg-white border rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-xs ${
                isFirst
                  ? 'border-amber-300 ring-2 ring-amber-100 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Rank & Model Info */}
                <div className="flex items-start sm:items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-base shrink-0 ${
                    index === 0
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : index === 1
                      ? 'bg-gray-100 text-gray-700 border border-gray-300'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {index === 0 ? <Trophy className="w-6 h-6 text-amber-600" /> : `#${index + 1}`}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">{item.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${item.badgeColor}`}>
                        {item.company}
                      </span>
                      <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 font-mono">
                        {item.codename}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {item.company} • 10 Grounded Public Health Scenarios
                    </p>
                  </div>
                </div>

                {/* Right: Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shrink-0">
                  {/* Elo Rating */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Arena Elo</div>
                    <div className="text-lg font-extrabold text-gray-900">{totalRatings > 0 ? item.eloRating : '1200'}</div>
                    <div className="text-[10px] text-gray-500">{totalRatings > 0 ? 'Live Score' : 'Baseline'}</div>
                  </div>

                  {/* Win Rate */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Win Rate</div>
                    <div className="text-lg font-extrabold text-blue-700">{totalRatings > 0 ? `${item.winRate}%` : '—'}</div>
                    <div className="text-[10px] text-gray-500">{item.wins} Wins</div>
                  </div>

                  {/* Cultural Score */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Attire &amp; Context</div>
                    <div className="text-lg font-extrabold text-gray-900">
                      {item.avgCultural > 0 ? <>{item.avgCultural}<span className="text-xs text-gray-400 font-normal">/5</span></> : '—'}
                    </div>
                    <div className="text-[10px] text-gray-500">Cultural Fidelity</div>
                  </div>

                  {/* Typography Score */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Devanagari Script</div>
                    <div className="text-lg font-extrabold text-gray-900">
                      {item.avgTypography > 0 ? <>{item.avgTypography}<span className="text-xs text-gray-400 font-normal">/5</span></> : '—'}
                    </div>
                    <div className="text-[10px] text-gray-500">Hindi Legibility</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Core Evaluation Dimensions Tested */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-gray-900 tracking-tight">Core Evaluation Dimensions Tested</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h4 className="font-bold text-blue-700 mb-2">1. Grassroots Attire &amp; Identity (P01)</h4>
            <p className="leading-relaxed">
              Evaluating whether models accurately render the official pastel pink cotton saree with dark blue border mandated for India&rsquo;s 1M+ ASHA workers, rather than generic wedding sarees or western lab coats.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h4 className="font-bold text-amber-700 mb-2">2. Vernacular Hindi Typography (P03)</h4>
            <p className="leading-relaxed">
              Assessing non-Latin script generation by testing whether village public health wall murals correctly render legible Devanagari text (<span className="text-gray-900 font-serif font-bold">&lsquo;साफ पानी, स्वस्थ जीवन&rsquo;</span>) without matra distortion.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h4 className="font-bold text-purple-700 mb-2">3. Cold-Chain &amp; PHC Equipment (P02, P04, P05)</h4>
            <p className="leading-relaxed">
              Testing public clinic realism: blue hanging Salter growth monitoring scales, blue ice-lined vaccine carrier boxes, and PHC green distemper walls versus western clinic tropes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
