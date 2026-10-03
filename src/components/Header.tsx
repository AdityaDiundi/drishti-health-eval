'use client';

import React from 'react';
import { Eye, Trophy, Swords, Grid, BookOpen, Download } from 'lucide-react';

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
          {/* Logo & Branding */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('leaderboard')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base sm:text-lg font-bold tracking-tight text-gray-900">Drishti-Health</span>
                <span className="hidden sm:inline-flex text-[11px] px-2 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Visual AI Benchmark
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-500 hidden md:block">
                Public Health Foundation Vision Benchmark
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Google M3 Pill Style */}
          <nav className="flex items-center space-x-0.5 sm:space-x-1 bg-gray-100/90 p-0.5 sm:p-1 rounded-xl border border-gray-200/80">
            <button
              onClick={() => setActiveTab('arena')}
              className={`flex items-center space-x-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'arena'
                  ? 'bg-white text-blue-700 shadow-xs border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-blue-600" />
              <span>Arena</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center space-x-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-white text-blue-700 shadow-xs border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden xs:inline">Board</span>
              <span className="xs:hidden">Rank</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'gallery'
                  ? 'bg-white text-blue-700 shadow-xs border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Gallery"
            >
              <Grid className="w-3.5 h-3.5 text-gray-600" />
              <span className="hidden sm:inline">Gallery</span>
            </button>

            <button
              onClick={() => setActiveTab('methodology')}
              className={`flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'methodology'
                  ? 'bg-white text-blue-700 shadow-xs border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Methodology"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Method</span>
            </button>
          </nav>

          {/* Action Button: Export Benchmark Dataset (Hidden on mobile to save space) */}
          <div className="hidden md:flex items-center space-x-2">
            <a
              href="/api/export?format=csv"
              download="drishti_health_eval_benchmark_dataset.csv"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 shadow-2xs transition-colors"
              title="Download public benchmark scenarios & images (anonymized, zero personal data)"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>Benchmark CSV</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
