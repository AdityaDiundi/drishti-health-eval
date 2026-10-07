'use client';

import React, { useState } from 'react';
import { JanevalLogo } from './JanevalLogo';
import { Download, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  activeTab: 'arena' | 'leaderboard' | 'evidence' | 'gallery' | 'methodology';
  setActiveTab: (tab: 'arena' | 'leaderboard' | 'evidence' | 'gallery' | 'methodology') => void;
  participantName?: string | null;
}

export function Header({ activeTab, setActiveTab, participantName }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const navItems: { id: 'arena' | 'leaderboard' | 'evidence' | 'gallery' | 'methodology'; label: string }[] = [
    { id: 'arena', label: 'Arena' },
    { id: 'leaderboard', label: 'Rankings' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'methodology', label: 'Methodology' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#F7F8F5]/90 backdrop-blur-md border-b border-[#E3E7E2] transition-colors w-full max-w-full min-w-0">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: JANEVAL Brand Logo */}
            <div className="shrink-0">
              <JanevalLogo onClick={() => setActiveTab('leaderboard')} />
            </div>

            {/* Center: Desktop Navigation Bar */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3.5 py-1.5 text-xs sm:text-[13px] font-medium transition-all rounded-md cursor-pointer ${
                      isActive
                        ? 'text-[#0F2E24] font-semibold bg-[#DDEBE3]/50 border border-[#C6DDD1]/80'
                        : 'text-[#69716B] hover:text-[#171A18] hover:bg-[#E3E7E2]/40'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              <button
                onClick={() => setShowAboutModal(true)}
                className="px-3.5 py-1.5 text-xs sm:text-[13px] font-medium text-[#69716B] hover:text-[#171A18] hover:bg-[#E3E7E2]/40 rounded-md transition-all cursor-pointer"
              >
                About
              </button>
            </nav>

            {/* Right: Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="h-6 w-px bg-[#E3E7E2]"></div>
              <a
                href="/api/export?format=csv"
                download="janeval_benchmark_dataset.csv"
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#0F2E24] bg-white hover:bg-[#FAFBF9] border border-[#CBD5E1] shadow-2xs transition-colors"
                title="Download public benchmark scenarios & images (anonymized, zero personal data)"
              >
                <Download className="w-3.5 h-3.5 text-[#4E8F6F]" />
                <span>Download Dataset</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <a
                href="/api/export?format=csv"
                download="janeval_benchmark_dataset.csv"
                className="p-2 rounded-lg text-[#0F2E24] bg-white border border-[#E3E7E2]"
                title="Download Dataset"
              >
                <Download className="w-4 h-4 text-[#4E8F6F]" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#171A18] hover:bg-[#E3E7E2]/50 border border-[#E3E7E2]"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#E3E7E2] bg-white px-4 py-3 space-y-1 shadow-xs">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium ${
                  activeTab === item.id
                    ? 'text-[#0F2E24] font-semibold bg-[#DDEBE3]/50'
                    : 'text-[#69716B] hover:text-[#171A18]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setShowAboutModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-xs font-medium text-[#69716B] hover:text-[#171A18]"
            >
              About JANEVAL
            </button>
            <div className="pt-2 border-t border-[#E3E7E2]">
              <a
                href="/api/export?format=csv"
                download="janeval_benchmark_dataset.csv"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-[#0F2E24] bg-[#FAFBF9] border border-[#E3E7E2]"
              >
                <Download className="w-3.5 h-3.5 text-[#4E8F6F]" />
                <span>Download Dataset (CSV)</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* About Benchmark Dialog */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E3E7E2] rounded-xl max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E7E2]">
              <div className="flex items-center gap-2">
                <JanevalLogo size="sm" />
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-[#69716B] hover:text-[#171A18] p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-[#171A18] leading-relaxed">
              <p className="font-semibold text-sm text-[#0F2E24]">
                Frontier Vision AI Benchmark for Indian Public-Health Representation
              </p>
              <p>
                <strong>JANEVAL v1.1</strong> evaluates frontier vision foundation models (OpenAI GPT Image 1, Google Gemini 3 Pro, Google Gemini 3.1 Flash) on their capacity to represent frontline rural Indian public-health realities authentically and faithfully.
              </p>
              <div className="bg-[#F7F8F5] border border-[#E3E7E2] p-3 rounded-lg space-y-1.5 font-mono text-[11px]">
                <div className="text-[#69716B]">PRINCIPLES:</div>
                <div>• Representation fidelity over aesthetic preference</div>
                <div>• Double-blind pairwise human evaluation (Elo)</div>
                <div>• Zero demographic profiling, fully anonymized voting</div>
              </div>
              <p className="text-[#69716B]">
                Developed for the Josh Talks AI Product Task (July 2026). All scenarios, images, and anonymized ratings are open and reproducible.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAboutModal(false)}
                className="px-4 py-2 rounded-lg bg-[#0F2E24] text-white text-xs font-semibold hover:bg-[#163d30] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
