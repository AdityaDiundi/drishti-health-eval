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

export function LeaderboardView() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [totalRatings, setTotalRatings] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ratings')
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) setLeaderboard(data.leaderboard);
        if (data.totalRatings) setTotalRatings(data.totalRatings);
        if (data.totalParticipants) setTotalParticipants(data.totalParticipants);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching leaderboard:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 text-sm">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Loading live Drishti-Health benchmark data...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Leaderboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Live Human Preference
            </span>
            <span className="text-xs text-slate-400">• Blind Pairwise Elo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Indian Public Health Visual AI Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Independent human evaluation comparing foundation models on rural Indian context fidelity, Primary Health Centre equipment accuracy, and Devanagari Hindi typography.
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-right">
            <div className="text-[10px] uppercase font-bold text-slate-500">Evaluators</div>
            <div className="text-base font-extrabold text-white flex items-center justify-end space-x-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>{totalParticipants}</span>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-right">
            <div className="text-[10px] uppercase font-bold text-slate-500">Total Votes</div>
            <div className="text-base font-extrabold text-white flex items-center justify-end space-x-1.5">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>{totalRatings}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Leaderboard Table / Cards */}
      <div className="grid grid-cols-1 gap-4 mb-10">
        {leaderboard.map((item, index) => {
          const isFirst = index === 0;
          return (
            <div
              key={item.modelId}
              className={`relative bg-slate-900 border rounded-2xl p-5 sm:p-6 transition-all duration-200 ${
                isFirst
                  ? 'border-amber-500/50 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Rank & Model Info */}
                <div className="flex items-start sm:items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg shrink-0 ${
                    index === 0
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : index === 1
                      ? 'bg-slate-700/30 text-slate-300 border border-slate-700'
                      : 'bg-amber-900/20 text-amber-700 border border-amber-800/40'
                  }`}>
                    {index === 0 ? <Trophy className="w-6 h-6 text-amber-400" /> : `#${index + 1}`}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{item.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${item.badgeColor}`}>
                        {item.company}
                      </span>
                      <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {item.codename}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Standardized Evaluation: 10 Prompts across 3 Evaluation Dimensions
                    </p>
                  </div>
                </div>

                {/* Right: Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shrink-0">
                  {/* Elo Rating */}
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Arena Elo</div>
                    <div className="text-lg font-extrabold text-amber-400">{item.eloRating}</div>
                    <div className="text-[10px] text-slate-400">Score</div>
                  </div>

                  {/* Win Rate */}
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Win Rate</div>
                    <div className="text-lg font-extrabold text-emerald-400">{item.winRate}%</div>
                    <div className="text-[10px] text-slate-400">{item.wins} Wins</div>
                  </div>

                  {/* Cultural Score */}
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Cultural Score</div>
                    <div className="text-lg font-extrabold text-white">{item.avgCultural}<span className="text-xs text-slate-500">/5</span></div>
                    <div className="text-[10px] text-slate-400">Rural Context</div>
                  </div>

                  {/* Typography Score */}
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Typography</div>
                    <div className="text-lg font-extrabold text-white">{item.avgTypography}<span className="text-xs text-slate-500">/5</span></div>
                    <div className="text-[10px] text-slate-400">Hindi/Devanagari</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Evaluation Findings Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">Key Empirical Findings for India</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h4 className="font-bold text-emerald-400 mb-2">1. The ASHA Uniform Paradox (P01)</h4>
            <p className="leading-relaxed">
              Google Gemini 3 Pro reliably captures the pastel pink cotton saree with dark blue border. OpenAI GPT Image 1 often enhances saturation, making it resemble festival silk rather than daily cotton workwear.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h4 className="font-bold text-amber-400 mb-2">2. Devanagari Script Hurdle (P03)</h4>
            <p className="leading-relaxed">
              Rendering legible Hindi characters (<span className="text-white font-serif">&lsquo;साफ पानी, स्वस्थ जीवन&rsquo;</span>) remains a critical bottleneck. OpenAI shows stronger character legibility, while faster models occasionally collapse conjunctive ligatures.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h4 className="font-bold text-blue-400 mb-2">3. Cold-Chain & Diagnostic Tools (P04, P05)</h4>
            <p className="leading-relaxed">
              All models recognized the blue hanging Salter scale and vaccine carrier box, but Gemini 3 Pro showed higher fidelity in depicting rural baramda and PHC clinic environments without defaulting to high-tech western clinics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
