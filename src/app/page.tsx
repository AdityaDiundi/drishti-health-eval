'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ConsentModal } from '@/components/ConsentModal';
import { ArenaView } from '@/components/ArenaView';
import { LeaderboardView } from '@/components/LeaderboardView';
import { GalleryView } from '@/components/GalleryView';
import { MethodologyView } from '@/components/MethodologyView';
import { EvidenceView } from '@/components/EvidenceView';
import { ChatAssistant } from '@/components/ChatAssistant';
import { CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'arena' | 'leaderboard' | 'evidence' | 'gallery' | 'methodology'>('leaderboard');
  const [participant, setParticipant] = useState<{ name: string; email: string; age: number } | null>(null);
  const [showConsentModal, setShowConsentModal] = useState<boolean>(false);
  const [hasCompletedEvaluation, setHasCompletedEvaluation] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [assistantPresetPrompt, setAssistantPresetPrompt] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const forceConsent = params.get('forceConsent') === 'true';

      if (forceConsent) {
        localStorage.removeItem('drishti_participant');
        setParticipant(null);
        setHasCompletedEvaluation(false);
        setShowConsentModal(true);
        setActiveTab('arena');
        return;
      }

      // Check localStorage for existing consent
      const stored = localStorage.getItem('drishti_participant');
      let currentPart = null;
      if (stored) {
        try {
          currentPart = JSON.parse(stored);
          setParticipant(currentPart);
        } catch (e) {
          // fallback
        }
      }

      if (tabParam === 'arena' || tabParam === 'eval') {
        setActiveTab('arena');
        if (!currentPart) {
          setShowConsentModal(true);
        }
      } else if (tabParam === 'leaderboard' || tabParam === 'evidence' || tabParam === 'gallery' || tabParam === 'methodology') {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  const handleConsentComplete = (data: { name: string; email: string; age: number }) => {
    setParticipant(data);
    setHasCompletedEvaluation(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('drishti_participant', JSON.stringify(data));
    }
    setShowConsentModal(false);
    setActiveTab('arena');
  };

  const handleResetParticipant = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('drishti_participant');
    }
    setParticipant(null);
    setHasCompletedEvaluation(false);
    setShowConsentModal(true);
  };

  const handleEvaluationFinished = () => {
    setHasCompletedEvaluation(true);
    setActiveTab('leaderboard');
  };

  const handleStartAnotherEvaluation = () => {
    setHasCompletedEvaluation(false);
    handleResetParticipant();
  };

  const handleAskAboutModel = (model: any) => {
    setAssistantPresetPrompt(`Why is ${model.shortName} ranked with Elo ${model.eloRating}?`);
    setIsAssistantOpen(true);
  };

  const handleAskAboutScenario = (code: string, title: string) => {
    setAssistantPresetPrompt(`How did models perform on scenario ${code} (${title})?`);
    setIsAssistantOpen(true);
  };

  return (
    <div
      className={`min-h-screen bg-[#F7F8F5] text-[#171A18] flex flex-col font-sans selection:bg-[#DDEBE3] selection:text-[#0F2E24] transition-[margin] duration-300 ease-in-out w-full max-w-full overflow-x-hidden min-w-0 ${
        isAssistantOpen && activeTab !== 'arena' ? 'lg:mr-[420px]' : ''
      }`}
    >
      {/* Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        participantName={participant?.name}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full min-w-0 overflow-x-hidden">
        {activeTab === 'arena' && (
          hasCompletedEvaluation ? (
            <div className="max-w-xl mx-auto px-4 py-20 text-center animate-in fade-in duration-200">
              <div className="bg-white border border-[#E3E7E2] rounded-xl p-8 shadow-xs">
                <div className="w-12 h-12 bg-[#DDEBE3] text-[#0F2E24] border border-[#C6DDD1] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#DDEBE3]/60 text-[#0F2E24] border border-[#C6DDD1]">
                  Submission Recorded
                </span>
                <h3 className="text-xl font-bold text-[#0F2E24] mt-3 mb-2">You Have Completed the Benchmark</h3>
                <p className="text-xs text-[#69716B] mb-6 leading-relaxed">
                  Thank you, <strong>{participant?.name || 'Evaluator'}</strong>! Your 10 public health pairwise ratings have been recorded in the benchmark database and are reflected in the live Leaderboard.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#0F2E24] hover:bg-[#163d30] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    View Live Leaderboard →
                  </button>
                  <button
                    onClick={handleStartAnotherEvaluation}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white hover:bg-[#FAFBF9] text-[#171A18] border border-[#E3E7E2] font-semibold text-xs shadow-2xs transition-all cursor-pointer"
                  >
                    Start Another Evaluation
                  </button>
                </div>
              </div>
            </div>
          ) : participant ? (
            <ArenaView
              participant={participant}
              onEvaluationFinished={handleEvaluationFinished}
              onResetParticipant={handleResetParticipant}
            />
          ) : (
            <div className="max-w-xl mx-auto px-4 py-24 text-center">
              <div className="p-8 rounded-xl bg-white border border-[#E3E7E2] shadow-xs">
                <h3 className="text-xl font-bold text-[#0F2E24] mb-2">Evaluator Onboarding Required</h3>
                <p className="text-xs text-[#69716B] mb-6 leading-relaxed">
                  To participate in the blind pairwise evaluation study as mandated by the study protocol, please complete the 18+ consent verification.
                </p>
                <button
                  onClick={() => setShowConsentModal(true)}
                  className="px-6 py-2.5 rounded-lg bg-[#0F2E24] text-white font-semibold text-xs hover:bg-[#163d30] transition-colors cursor-pointer shadow-xs"
                >
                  Complete Consent &amp; Start
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onStartEvaluation={() => {
              if (hasCompletedEvaluation) {
                handleStartAnotherEvaluation();
              } else if (participant) {
                setActiveTab('arena');
              } else {
                setShowConsentModal(true);
              }
            }}
            onAskAboutModel={handleAskAboutModel}
            onAskAboutScenario={handleAskAboutScenario}
          />
        )}
        {activeTab === 'evidence' && (
          <EvidenceView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onStartEvaluation={() => {
              if (hasCompletedEvaluation) {
                handleStartAnotherEvaluation();
              } else if (participant) {
                setActiveTab('arena');
              } else {
                setShowConsentModal(true);
              }
            }}
            onAskAboutScenario={handleAskAboutScenario}
          />
        )}
        {activeTab === 'gallery' && <GalleryView />}
        {activeTab === 'methodology' && <MethodologyView />}
      </main>

      {/* Participant Consent Modal */}
      <ConsentModal
        isOpen={showConsentModal}
        onConsentComplete={handleConsentComplete}
        onClose={() => setShowConsentModal(false)}
      />

      {/* Section 7: Minimal Research Footer */}
      <footer className="border-t border-[#E3E7E2] bg-white py-6 text-xs text-[#69716B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-[#0F2E24] tracking-tight text-sm font-sans">JANEVAL</span>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DDEBE3] text-[#0F2E24] border border-[#C6DDD1]">
              v1.1
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-xs text-[#69716B]">
            <button onClick={() => setActiveTab('arena')} className="hover:text-[#0F2E24] cursor-pointer transition-colors">Arena</button>
            <button onClick={() => setActiveTab('leaderboard')} className="hover:text-[#0F2E24] cursor-pointer transition-colors">Rankings</button>
            <button onClick={() => setActiveTab('evidence')} className="hover:text-[#0F2E24] cursor-pointer transition-colors">Evidence</button>
            <button onClick={() => setActiveTab('gallery')} className="hover:text-[#0F2E24] cursor-pointer transition-colors">Gallery</button>
            <button onClick={() => setActiveTab('methodology')} className="hover:text-[#0F2E24] cursor-pointer transition-colors">Methodology</button>
            <a href="/api/export?format=csv" download="janeval_benchmark_dataset.csv" className="hover:text-[#0F2E24] transition-colors">Download Dataset</a>
          </div>
        </div>
      </footer>

      {/* JANEVAL Assistant Drawer (hidden on blind Arena page) */}
      {activeTab !== 'arena' && (
        <ChatAssistant
          activeTab={activeTab}
          isOpen={isAssistantOpen}
          onOpenChange={setIsAssistantOpen}
          presetPrompt={assistantPresetPrompt}
          onClearPresetPrompt={() => setAssistantPresetPrompt(null)}
          onNavigateTab={setActiveTab}
        />
      )}
    </div>
  );
}
