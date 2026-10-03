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
}

export function LeaderboardView({ onStartEvaluation }: LeaderboardProps) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Leaderboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Live Human Preference
            </span>
            <span className="text-xs text-gray-500">• Bradley-Terry Elo Rating</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Indian Public Health Visual AI Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
            Independent human evaluation comparing foundation vision models on rural Indian healthcare fidelity, Primary Health Centre equipment accuracy, and Devanagari Hindi typography.
          </p>
        </div>

        {/* Stats Pills - Material 3 Surface */}
        <div className="flex items-center space-x-3">
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-right shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-gray-500">Evaluators</div>
            <div className="text-base font-extrabold text-gray-900 flex items-center justify-end space-x-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              <span>{totalParticipants}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-right shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-gray-500">Total Votes</div>
            <div className="text-base font-extrabold text-gray-900 flex items-center justify-end space-x-1.5">
              <BarChart3 className="w-4 h-4 text-amber-600" />
              <span>{totalRatings}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Action Banner */}
      {onStartEvaluation && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Join the Human Evaluation Benchmark</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Evaluate 10 rural Indian health scenarios blindly (Model A, B, C) using prompt-specific verification criteria.
              </p>
            </div>
          </div>
          <button
            onClick={onStartEvaluation}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            Start Blind Evaluation →
          </button>
        </div>
      )}

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
                      Standardized Evaluation: 10 Prompts across 3 Objective Clarifying Dimensions
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
                    <div className="text-[10px] text-gray-500">Grassroots Fidelity</div>
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
