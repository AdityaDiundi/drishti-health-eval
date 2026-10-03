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
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('arena')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-teal-400 p-[2px] flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Eye className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">DRISHTI</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  HEALTH EVAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Indian Grassroots Public Health Visual Benchmark • Josh Talks AI
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('arena')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'arena'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Blind Arena</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'gallery'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">30-Image</span>
              <span>Gallery</span>
            </button>

            <button
              onClick={() => setActiveTab('methodology')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'methodology'
                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">About & </span>
              <span>Methodology</span>
            </button>
          </nav>

          {/* Export Action */}
          <div className="flex items-center space-x-2">
            <a
              href="/api/export?format=csv"
              download="drishti_health_eval_dataset.csv"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
              title="Download full evaluation dataset as CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden lg:inline">Export CSV</span>
            </a>

            {participantName && (
              <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-slate-800 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="truncate max-w-[100px]">{participantName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
