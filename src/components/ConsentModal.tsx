'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, User, Mail, Calendar, Sparkles } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onConsentComplete: (participant: { name: string; email: string; age: number }) => void;
  onClose?: () => void;
}

export function ConsentModal({ isOpen, onConsentComplete, onClose }: ConsentModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number | ''>(24);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!age || age < 18) {
      setError('Participants must be 18 years or older as required by the study protocol.');
      return;
    }
    if (!agreed) {
      setError('Please accept the consent statement to proceed with the evaluation.');
      return;
    }

    setError('');
    onConsentComplete({
      name: name.trim(),
      email: email.trim(),
      age: Number(age),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/5 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title="Explore website first"
          >
            ✕
          </button>
        )}

        {/* Modal Badge */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Participant Consent & Onboarding</h2>
            <p className="text-xs text-slate-400">Drishti-Health • Josh Talks AI Evaluator Study</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-5 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          Welcome to the <strong>Drishti-Health Visual Benchmark</strong>. You will participate in a blind side-by-side human evaluation comparing outputs from 3 advanced image generation models across 10 rural Indian public health scenarios.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-400 bg-red-950/30 border border-red-800/50 rounded-lg">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Age (Must be 18+) <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min={18}
                max={99}
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                placeholder="24"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Mandatory Task Consent Statement */}
          <div className="pt-2">
            <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 hover:border-emerald-800/50 transition-colors">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
              />
              <span className="text-xs text-slate-300 leading-snug">
                <strong>Mandatory Consent:</strong> I confirm that I am 18 years or older. I voluntarily participate in this evaluation. I consent to my name, email, and responses/ratings being included in this assignment submission for hiring evaluation purposes.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center space-x-2 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Enter Blind Evaluation Arena</span>
          </button>
        </form>
      </div>
    </div>
  );
}
