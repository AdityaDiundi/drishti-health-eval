'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ConsentModal } from '@/components/ConsentModal';
import { ArenaView } from '@/components/ArenaView';
import { LeaderboardView } from '@/components/LeaderboardView';
import { GalleryView } from '@/components/GalleryView';
import { MethodologyView } from '@/components/MethodologyView';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'arena' | 'leaderboard' | 'gallery' | 'methodology'>('leaderboard');
  const [participant, setParticipant] = useState<{ name: string; email: string; age: number } | null>(null);
  const [showConsentModal, setShowConsentModal] = useState<boolean>(false);

  useEffect(() => {
    // Check localStorage for existing consent
    const stored = localStorage.getItem('drishti_participant');
    let hasConsent = false;
    if (stored) {
      try {
        setParticipant(JSON.parse(stored));
        hasConsent = true;
      } catch (e) {
        // fallback
      }
    }

    // Check URL parameters: e.g. ?tab=arena or ?tab=eval
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'arena' || tabParam === 'eval') {
        setActiveTab('arena');
        if (!hasConsent) {
          setShowConsentModal(true);
        }
      } else if (tabParam === 'leaderboard' || tabParam === 'gallery' || tabParam === 'methodology') {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  const handleConsentComplete = (data: { name: string; email: string; age: number }) => {
    setParticipant(data);
    localStorage.setItem('drishti_participant', JSON.stringify(data));
    setShowConsentModal(false);
    setActiveTab('arena');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        participantName={participant?.name}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'arena' && (
          participant ? (
            <ArenaView
              participant={participant}
              onEvaluationFinished={() => setActiveTab('leaderboard')}
            />
          ) : (
            <div className="max-w-xl mx-auto px-4 py-24 text-center">
              <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Participant Onboarding Required</h3>
                <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                  To participate in the blind pairwise evaluation study as mandated by the study protocol, please complete the 18+ consent verification.
                </p>
                <button
                  onClick={() => setShowConsentModal(true)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
                >
                  Complete Consent &amp; Start
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            onStartEvaluation={() => {
              if (participant) {
                setActiveTab('arena');
              } else {
                setShowConsentModal(true);
              }
            }}
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

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Drishti-Health Visual Benchmark • Built for Josh Talks AI Product Evaluation</span>
          <div className="flex items-center space-x-4 text-gray-600">
            <button onClick={() => setActiveTab('arena')} className="hover:text-blue-600">Arena</button>
            <button onClick={() => setActiveTab('leaderboard')} className="hover:text-amber-600">Leaderboard</button>
            <button onClick={() => setActiveTab('gallery')} className="hover:text-gray-900">30-Images</button>
            <button onClick={() => setActiveTab('methodology')} className="hover:text-purple-600">Methodology</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
