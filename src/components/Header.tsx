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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('leaderboard')}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-gray-900">Drishti-Health</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Visual AI Benchmark
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">
                Indian Grassroots Public Health Human Evaluation
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Google M3 Pill Style */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-gray-100/80 p-1 rounded-xl border border-gray-200/60">
            <button
              onClick={() => setActiveTab('arena')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'arena'
                  ? 'bg-white text-blue-700 shadow-xs border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Swords className="w-4 h-4 text-blue-600" />
              <span>Evaluation Arena</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-white text-blue-700 shadow-xs border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'gallery'
                  ? 'bg-white text-blue-700 shadow-xs border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Grid className="w-4 h-4 text-gray-600" />
              <span className="hidden sm:inline">30-Image</span>
              <span>Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('methodology')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'methodology'
                  ? 'bg-white text-blue-700 shadow-xs border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span className="hidden md:inline">Math &amp; </span>
              <span>Methodology</span>
            </button>
          </nav>

          {/* Action Button: Export CSV */}
          <div className="flex items-center space-x-2">
            <a
              href="/api/export?format=csv"
              download="drishti_health_eval_dataset.csv"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 shadow-2xs transition-colors"
              title="Download full evaluation dataset as CSV"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden lg:inline">Export CSV</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
