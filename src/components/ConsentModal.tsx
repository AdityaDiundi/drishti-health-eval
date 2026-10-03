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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title="Explore website first"
          >
            ✕
          </button>
        )}

        {/* Modal Badge - Google M3 Header */}
        <div className="flex items-center space-x-3 mb-4 pr-8">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight truncate sm:whitespace-normal">Participant Consent</h2>
            <p className="text-xs text-gray-500 truncate">Human Evaluation Protocol (18+)</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-5 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-200">
          Welcome to the <strong>Seva-Eval Benchmark</strong>. You will participate in a double-blind human evaluation comparing frontier vision AI outputs across 10 frontline Indian public health scenarios.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Name <span className="text-blue-600">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Priya Sharma"
                className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address <span className="text-blue-600">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>
          </div>

          {/* Age Verification */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Age (18+ Verification) <span className="text-blue-600">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="18"
                max="99"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
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
                className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
              />
              <span className="text-xs text-gray-600 leading-snug">
                I confirm I am 18 years or older and voluntarily agree to provide blind evaluation ratings for Indian public health visual AI research.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Enter Evaluation Arena</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
