'use client';

import React from 'react';
import { Eye, Trophy, Swords, Grid, BookOpen, Download } from 'lucide-react';
import { SevaLogo } from './SevaLogo';

interface HeaderProps {
  activeTab: 'arena' | 'leaderboard' | 'gallery' | 'methodology';
  setActiveTab: (tab: 'arena' | 'leaderboard' | 'gallery' | 'methodology') => void;
  participantName?: string | null;
}

export function Header({ activeTab, setActiveTab, participantName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Dynamic Indic Animated Logo: SevaEval */}
          <div className="shrink-0">
            <SevaLogo onClick={() => setActiveTab('leaderboard')} />
          </div>

          {/* Navigation Tabs - Disciplined Geometric Bar */}
          <nav className="flex items-center space-x-0.5 sm:space-x-1 bg-slate-100 p-0.5 sm:p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('arena')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'arena'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-slate-700" />
              <span>Arena</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden xs:inline">Leaderboard</span>
              <span className="xs:hidden">Rank</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'gallery'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Gallery"
            >
              <Grid className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Gallery</span>
            </button>

            <button
              onClick={() => setActiveTab('methodology')}
              className={`flex items-center space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'methodology'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Methodology"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Method</span>
            </button>
          </nav>

          {/* Action Button: Export Benchmark Dataset (Hidden on mobile to save space) */}
          <div className="hidden md:flex items-center space-x-2">
            <a
              href="/api/export?format=csv"
              download="seva_eval_benchmark_dataset.csv"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors"
              title="Download public benchmark scenarios & images (anonymized, zero personal data)"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Dataset CSV</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
