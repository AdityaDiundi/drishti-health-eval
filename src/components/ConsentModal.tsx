'use client';

import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

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
      setError('Participants must be 18 years or older as required by the human evaluation protocol.');
      return;
    }
    if (!agreed) {
      setError('Please accept the participant consent statement to proceed.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            title="Explore website first"
          >
            ✕
          </button>
        )}

        {/* Modal Badge - Disciplined Header */}
        <div className="flex items-center space-x-3 mb-4 pr-8">
          <div className="w-9 h-9 shrink-0 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-white">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate sm:whitespace-normal">Participant Consent</h2>
            <p className="text-xs text-slate-500 truncate">Human Evaluation Protocol (18+)</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-5 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          Welcome to the <strong>Seva-Eval Benchmark</strong>. You will participate in a double-blind human evaluation comparing frontier vision AI outputs across 10 frontline Indian public health scenarios.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg font-medium">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-slate-900">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Priya Sharma"
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address <span className="text-slate-900">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                required
              />
            </div>
          </div>

          {/* Age Verification */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Age (18+ Verification) <span className="text-slate-900">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="18"
                max="99"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                required
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300 cursor-pointer"
              />
              <span className="text-xs text-slate-600 leading-snug">
                I confirm I am 18 years or older and voluntarily agree to provide blind evaluation ratings for Indian public health visual AI research.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Enter Evaluation Arena</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
