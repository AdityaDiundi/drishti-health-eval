'use client';

import React from 'react';
import { ShieldCheck, BookOpen, Calculator, Layers, FileText, CheckCircle2, Sparkles, Scale } from 'lucide-react';

export function MethodologyView() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-800">
      {/* Header */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <div className="flex items-center space-x-2 mb-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Study Protocol &amp; Scientific Methodology
          </span>
          <span className="text-xs text-gray-500">• Version 2.0 (Criteria-Grounded Evaluation)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Benchmark Methodology &amp; Mathematical Formulation
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-3xl leading-relaxed">
          The Drishti-Health Visual Benchmark establishes an empirical, reproducible human preference framework for evaluating foundation vision models on rural Indian public health scenarios.
        </p>
      </div>

      <div className="space-y-10">
        {/* Section 1: Core Mathematical Formulation */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center space-x-2.5 mb-4">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">1. Mathematical Rating Model (Bradley-Terry &amp; Elo System)</h2>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
            To rank models without human subjective score inflation or scale calibration drift, Drishti-Health employs the <strong>Bradley-Terry (1952) paired comparison model</strong>, operationalized through the <strong>Elo (1978) rating system</strong> with logistic win probability distribution, following the methodology popularized by LMSYS Chatbot Arena.
          </p>

          {/* Formula Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-5 font-mono text-xs space-y-4">
            <div>
              <div className="text-gray-500 text-[11px] mb-1 font-sans font-semibold">1. Expected Score Formulation:</div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-gray-900 overflow-x-auto">
                E_A = 1 / (1 + 10^((R_B - R_A) / 400))
              </div>
              <p className="text-[11px] text-gray-500 mt-1 font-sans">
                Where <code>R_A</code> and <code>R_B</code> represent the prior ratings of Model A and Model B, and <code>E_A</code> represents the expected probability of Model A winning.
              </p>
            </div>

            <div>
              <div className="text-gray-500 text-[11px] mb-1 font-sans font-semibold">2. Elo Rating Update Rule:</div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-gray-900 overflow-x-auto">
                R_A(new) = R_A(old) + K * (S_A - E_A)
              </div>
              <p className="text-[11px] text-gray-500 mt-1 font-sans">
                Where <code>K = 32</code> (update sensitivity coefficient), initial baseline <code>R_0 = 1200</code>, and actual outcome <code>S_A ∈ &#123;1.0 (Win), 0.5 (Tie), 0.0 (Loss)&#125;</code>.
              </p>
            </div>

            <div>
              <div className="text-gray-500 text-[11px] mb-1 font-sans font-semibold">3. Multi-Model Decomposition:</div>
              <p className="text-[11px] text-gray-600 font-sans leading-relaxed">
                When an evaluator evaluates 3 models (A, B, C) and chooses Model A, the match decomposes into two independent head-to-head pairwise contests: <strong>(A &gt; B)</strong> and <strong>(A &gt; C)</strong>. If a tie is selected, all three pairwise combinations resolve with <code>S = 0.5</code>.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Updated Evaluation Logic (Prompt-Specific Clarifying Criteria) */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center space-x-2.5 mb-4">
            <Scale className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-900">2. Evaluation Logic Update: Prompt-Specific Clarifying Criteria</h2>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 mb-5">
            <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs mb-1">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Methodology Evolution: From Generic Sliders to Scenario-Specific Verification</span>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              Standard 1–5 generic Likert sliders suffer from severe evaluator variance (different evaluators define &quot;4/5&quot; inconsistently). Drishti-Health v2.0 replaces arbitrary generic sliders with <strong>3 prompt-specific clarifying verification questions</strong> for each scenario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-gray-600 mb-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <span className="font-bold text-gray-900 block mb-1">Cultural &amp; Uniform Fidelity (5 / 3 / 1 pts)</span>
              <p className="leading-relaxed">
                Evaluates compliance with government uniforms (mandated ASHA pastel pink saree with dark blue border), authentic regional attire (farmer gamchha/kurta), and village domestic architecture.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <span className="font-bold text-gray-900 block mb-1">Clinical &amp; Equipment Realism (5 / 3 / 1 pts)</span>
              <p className="leading-relaxed">
                Assesses accurate grassroots medical devices: blue ice-lined vaccine carriers, spring Salter weighing scales, and blister medicine strips, penalizing Western hospital tropes.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <span className="font-bold text-gray-900 block mb-1">Devanagari Script &amp; Dignity (5 / 3 / 1 pts)</span>
              <p className="leading-relaxed">
                Directly scores non-Latin typography for Hindi wall paintings (<span className="font-serif font-bold text-gray-900">&lsquo;साफ पानी, स्वस्थ जीवन&rsquo;</span>) and ensures dignified human representation without poverty caricature.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Study Protocol & Controls */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center space-x-2.5 mb-4">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">3. Experimental Controls &amp; Bias Mitigation</h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900">Double-Blind Randomization:</strong> Model identities (Google Gemini 3.1 Flash, Gemini 3 Pro, OpenAI GPT Image 1) are masked as Model A, B, and C. Positions are dynamically shuffled to eliminate left-to-right positional selection bias.
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900">18+ Informed Consent:</strong> All evaluators verify eligibility and voluntary participation under academic evaluation standards before receiving an arena token.
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900">Zero-Mock Empirical Integrity:</strong> The platform maintains zero artificial pilot votes. Rankings, win rates, and Elo points are calculated dynamically in real-time from human evaluator submissions.
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Academic & Institutional References */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center space-x-2.5 mb-4">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">4. Academic References &amp; Standards</h2>
          </div>

          <ol className="list-decimal list-inside space-y-3 text-xs text-gray-600 leading-relaxed font-sans">
            <li>
              <strong>Zheng, L., Chiang, W. L., Sheng, Y., et al. (2023).</strong> <em>Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena.</em> Large Model Systems Organization (LMSYS). arXiv:2306.05685.
            </li>
            <li>
              <strong>Bradley, R. A., &amp; Terry, M. E. (1952).</strong> <em>Rank Analysis of Incomplete Block Designs: I. The Method of Paired Comparisons.</em> Biometrika, 39(3/4), 324–345.
            </li>
            <li>
              <strong>Elo, A. E. (1978).</strong> <em>The Rating of Chess Players, Past and Present.</em> Arco Publishing, New York.
            </li>
            <li>
              <strong>Ministry of Health and Family Welfare (MoHFW), Government of India (2019).</strong> <em>Operational Guidelines on National ASHA Mentoring Group: Uniformity Standards and Grassroots Communication Norms.</em> New Delhi.
            </li>
            <li>
              <strong>National Health Mission (NHM), Govt. of India (2021).</strong> <em>Cold Chain Logistics &amp; Universal Immunization Programme (UIP) Vaccine Management Protocols.</em> Nirman Bhawan, New Delhi.
            </li>
            <li>
              <strong>Josh Talks AI (2025–2026).</strong> <em>Voice of India Benchmark for Vernacular and Grassroots AI Evaluation.</em> Gurgaon, India.
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
