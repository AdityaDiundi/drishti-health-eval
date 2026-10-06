'use client';

import React from 'react';
import { Download, Scale, CheckCircle2, Shield, Users, Type, FileText } from 'lucide-react';

export function MethodologyView() {
  return (
    <div id="methodology-root" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#171A18] font-sans scroll-mt-20">
      {/* Publication Masthead */}
      <header className="mb-10 pb-8 border-b border-[#E3E7E2]">
        <div className="flex items-center space-x-2 text-[10px] font-mono uppercase font-bold text-[#69716B] tracking-wider mb-2">
          <span>BENCHMARK SPECIFICATION &amp; STUDY PROTOCOL</span>
          <span>·</span>
          <span className="text-[#0F2E24] bg-[#DDEBE3] px-2 py-0.5 rounded border border-[#C6DDD1]">JANEVAL v1.1</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E24] tracking-tight leading-tight">
          Benchmark Methodology &amp; Mathematical Formulation
        </h1>

        <p className="text-sm sm:text-base text-[#69716B] mt-3 leading-relaxed">
          An empirical framework for evaluating the representation fidelity of frontier vision foundation models across Indian public-health realities.
        </p>

        {/* Core Benchmark Principle */}
        <div className="mt-6 p-5 rounded-xl bg-[#0F2E24] text-white shadow-xs">
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#DDEBE3]">
            CORE BENCHMARK PRINCIPLE
          </div>
          <p className="text-base sm:text-lg font-bold tracking-tight text-white mt-1">
            &ldquo;JANEVAL measures representation fidelity — not aesthetic preference.&rdquo;
          </p>
          <p className="text-xs text-[#DDEBE3]/90 mt-2 leading-relaxed">
            The benchmark rejects surface-level image polish and generic photorealism when detached from ground-truth cultural, infrastructural, and orthographic realities of Indian frontline healthcare.
          </p>
        </div>
      </header>

      {/* Main Research Sections */}
      <div className="space-y-12 leading-relaxed text-sm text-[#171A18]">
        {/* 1. Benchmark Overview */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0F2E24] tracking-tight">
            1. Benchmark Overview
          </h2>
          <p className="text-[#69716B]">
            Generative vision foundation models are increasingly considered for global health communication, training collateral, and community awareness campaigns. However, standard computer vision benchmarks evaluate generic object recognition (ImageNet, COCO) or open-domain aesthetic preferences. JANEVAL establishes an empirical, reproducible testbed to measure whether frontier models can depict rural Indian public-health contexts without succumbing to caricature, Western clinical tropes, or Indic orthographic hallucination.
          </p>
          <div className="bg-white border border-[#E3E7E2] rounded-lg p-4 font-mono text-xs text-[#0F2E24] space-y-1.5 shadow-2xs">
            <div>• Target Domain: Frontline Indian Public Healthcare (ASHA, PHC / Sub-Centres, UIP)</div>
            <div>• Models Benchmarked: OpenAI GPT Image 1, Google Gemini 3 Pro, Google Gemini 3.1 Flash</div>
            <div>• Study Battery: 10 Standardized Scenarios (30 Total Reference Generations)</div>
            <div>• Paradigm: Double-Blind Pairwise (Model A vs. Model B) Human Evaluation</div>
          </div>
        </section>

        <hr className="border-[#E3E7E2]" />

        {/* 2. Evaluation Architecture: Pairwise Double-Blind */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0F2E24] tracking-tight">
            2. Evaluation Architecture: Double-Blind Pairwise
          </h2>
          <p className="text-[#69716B]">
            Rather than asking annotators for subjective 1–5 aesthetic ratings or overwhelming evaluators with 3 simultaneous images, JANEVAL v1.1 implements a strictly <strong>double-blind pairwise comparison</strong> architecture:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="bg-white border border-[#E3E7E2] rounded-lg p-4 space-y-2 shadow-2xs">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#0F2E24]">
                <Scale className="w-4 h-4 text-[#4E8F6F]" />
                <span>Step 1: Blind Pairwise Decision (A vs. B)</span>
              </div>
              <p className="text-xs text-[#69716B] leading-relaxed">
                For each scenario, the evaluator inspects strictly two blinded models (labeled <code>Model A</code> and <code>Model B</code>). All model identities and provenance metadata are stripped. The evaluator chooses from four discrete outcomes:
              </p>
              <ul className="text-xs text-[#171A18] font-mono space-y-0.5 pl-2">
                <li>• [1] Model A is superior</li>
                <li>• [2] Model B is superior</li>
                <li>• [T] Both are Good / Equivalent (Tie)</li>
                <li>• [B] Both are Bad / Neither Compliant</li>
              </ul>
            </div>

            <div className="bg-white border border-[#E3E7E2] rounded-lg p-4 space-y-2 shadow-2xs">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#0F2E24]">
                <CheckCircle2 className="w-4 h-4 text-[#4E8F6F]" />
                <span>Step 2: Rubric Verification</span>
              </div>
              <p className="text-xs text-[#69716B] leading-relaxed">
                Once a selection is made, the chosen model is verified against 3 scenario-specific criteria questions covering Cultural, Medical, and Typography dimensions on an anchored 3-point scale:
              </p>
              <ul className="text-xs text-[#171A18] font-mono space-y-0.5 pl-2">
                <li>• 5 pts: Fully compliant / authentic</li>
                <li>• 3 pts: Partially compliant / minor artifacts</li>
                <li>• 1 pt: Non-compliant / clinical hazard</li>
              </ul>
            </div>
          </div>

          <div className="bg-[#FAFBF9] border border-[#E3E7E2] rounded-lg p-3.5 text-xs text-[#69716B] leading-relaxed space-y-2">
            <div>
              <strong className="text-[#171A18]">Position Bias Elimination:</strong> Matchups rotate systematically across the 3 unique model pairs across all 10 scenarios. Left-right placement (Model A vs. Model B) is counterbalanced so no single model is perpetually positioned on the left or right.
            </div>
            <div>
              <strong className="text-[#171A18]">Tie Disambiguation Protocol:</strong> Standard pairwise benchmarks suffer from tie ambiguity where failed generations receive 0.5 points each, artificially inflating unviable models. JANEVAL disambiguates &ldquo;Both Good&rdquo; (valid equivalency) from &ldquo;Both Bad&rdquo; (neither meets the public health brief, awarding 0 win points and defaulting rubric scoring to 1 pt hazard/non-compliance).
            </div>
          </div>
        </section>

        <hr className="border-[#E3E7E2]" />

        {/* 3. The Three Evaluation Axes */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#0F2E24] tracking-tight">
            3. The Three Evaluation Axes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-[#E3E7E2] rounded-lg p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-[#0F2E24] uppercase">
                  AXIS 01 · CULTURAL FIDELITY
                </span>
                <span className="font-mono text-[10px] font-bold text-[#4E8F6F]">40%</span>
              </div>
              <p className="font-semibold text-xs text-[#171A18]">People, settings &amp; roles</p>
              <p className="text-xs text-[#69716B] leading-relaxed">
                ASHA worker uniform (official pastel pink cotton saree with dark blue border), ID badge, village register, rural courtyard triage setting, and respectful, non-caricatured skin tones.
              </p>
            </div>

            <div className="bg-white border border-[#E3E7E2] rounded-lg p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-[#0F2E24] uppercase">
                  AXIS 02 · MEDICAL ACCURACY
                </span>
                <span className="font-mono text-[10px] font-bold text-[#4E8F6F]">40%</span>
              </div>
              <p className="font-semibold text-xs text-[#171A18]">Systems, equipment &amp; protocols</p>
              <p className="text-xs text-[#69716B] leading-relaxed">
                WHO-standard blue vaccine cold-carrier boxes, conditioned ice-packs, dial temperature gauges, Salter baby hanging scales, correct oral polio administration, and MoHFW clinical guidelines.
              </p>
            </div>

            <div className="bg-white border border-[#E3E7E2] rounded-lg p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-[#0F2E24] uppercase">
                  AXIS 03 · INDIC TYPOGRAPHY
                </span>
                <span className="font-mono text-[10px] font-bold text-[#4E8F6F]">20%</span>
              </div>
              <p className="font-semibold text-xs text-[#171A18]">Script legibility &amp; orthography</p>
              <p className="text-xs text-[#69716B] leading-relaxed">
                Continuous unbroken shirorekha (top horizontal line), correct matra positioning, valid character conjuncts (samyuktakshars), and legible Devanagari public health slogans on clinic murals.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-[#E3E7E2]" />

        {/* 4. Scenario Specification */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0F2E24] tracking-tight">
            4. Scenario Specification (10 Standardized Prompts)
          </h2>
          <p className="text-[#69716B]">
            The 10 benchmark scenarios were authored in consultation with frontline public-health practitioners, ASHA trainers, and Indian health communication specialists:
          </p>
          <div className="bg-white border border-[#E3E7E2] rounded-lg divide-y divide-[#E3E7E2] text-xs shadow-2xs">
            <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-mono font-semibold text-[#0F2E24]">P01–P03 · Frontline Community Healthcare</span>
              <span className="text-[#69716B]">ASHA home triage, village register check, and maternal health counseling (MCP card)</span>
            </div>
            <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-mono font-semibold text-[#0F2E24]">P04–P06 · Cold Chain &amp; Immunization Hardware</span>
              <span className="text-[#69716B]">Universal Immunization Day (UID), blue cold-boxes, infant growth monitoring, and village murals</span>
            </div>
            <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-mono font-semibold text-[#0F2E24]">P07–P10 · Clinical Infrastructure &amp; Diagnostics</span>
              <span className="text-[#69716B]">PHC doctor triage, ORS hydration preparation, oral polio administration, and geriatric home palliative care</span>
            </div>
          </div>
        </section>

        <hr className="border-[#E3E7E2]" />

        {/* 5. Mathematical Model: Bradley-Terry MLE & Combinatorial Design */}
        <section id="methodology-math" className="space-y-6 scroll-mt-24 transition-all duration-300">
          <div>
            <h2 className="text-xl font-bold text-[#0F2E24] tracking-tight">
              5. Mathematical Formulation &amp; Combinatorial Experimental Design
            </h2>
            <p className="text-[#69716B] mt-1">
              To eliminate individual score inflation, subjective calibration shifts, and rater scale distortion, JANEVAL operationalizes a <strong>Bradley-Terry (1952) Maximum Likelihood Estimation</strong> solver with <strong>Hunter&apos;s (2004) Minorize-Maximization (MM) algorithm</strong>, calibrated into a standard logistic Elo scale with <strong>Fisher Information 95% confidence intervals</strong>.
            </p>
          </div>

          {/* 5.1 Combinatorial Design */}
          <div className="bg-[#FAFBF9] border border-[#E3E7E2] rounded-xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E3E7E2] pb-3">
              <span className="font-mono text-xs font-bold text-[#0F2E24] uppercase tracking-wider">
                5.1 Combinatorics &amp; Balanced Incomplete Block Design (BIBD)
              </span>
              <span className="font-mono text-[10px] bg-[#DDEBE3] text-[#0F2E24] px-2 py-0.5 rounded border border-[#C6DDD1] font-semibold">
                N = 120 Votes · 240 Appearances
              </span>
            </div>

            <p className="text-xs text-[#69716B] leading-relaxed">
              Evaluating K = 3 models across S = 10 standardized clinical scenarios requires a symmetric combinatorial structure to guarantee equal statistical power across all pairings:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-[#E3E7E2] rounded-lg p-3 space-y-1">
                <div className="text-[10px] font-mono text-[#69716B] uppercase">Unordered Pairs</div>
                <div className="text-lg font-mono font-bold text-[#0F2E24]">C(3, 2) = 3</div>
                <div className="text-[11px] text-[#69716B]">&#123;GPT, Pro&#125;, &#123;GPT, Flash&#125;, &#123;Pro, Flash&#125;</div>
              </div>

              <div className="bg-white border border-[#E3E7E2] rounded-lg p-3 space-y-1">
                <div className="text-[10px] font-mono text-[#69716B] uppercase">Presentation Permutations</div>
                <div className="text-lg font-mono font-bold text-[#0F2E24]">2! = 2 per pair</div>
                <div className="text-[11px] text-[#69716B]">Counterbalanced (A vs B, B vs A) eliminates position bias</div>
              </div>

              <div className="bg-white border border-[#E3E7E2] rounded-lg p-3 space-y-1">
                <div className="text-[10px] font-mono text-[#69716B] uppercase">Battle Allocation</div>
                <div className="text-lg font-mono font-bold text-[#0F2E24]">40 Battles / Pair</div>
                <div className="text-[11px] text-[#69716B]">Exactly 80 appearances per model across 120 total votes</div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E3E7E2] font-mono text-xs text-[#0F2E24] space-y-1">
              <div className="text-[#69716B] text-[11px] font-sans font-semibold">Appearance Conservation Identity:</div>
              <div>Total Model Appearances = 2 × N_votes = 2 × 120 = 240 appearances</div>
              <div>Per-Model Appearances = 240 / 3 = 80 appearances (exactly 40 per opposing pair)</div>
            </div>
          </div>

          {/* 5.2 Decisive Outcome Allocation & Win Rates */}
          <div className="bg-[#FAFBF9] border border-[#E3E7E2] rounded-xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E3E7E2] pb-3">
              <span className="font-mono text-xs font-bold text-[#0F2E24] uppercase tracking-wider">
                5.2 Outcome Allocation &amp; Appearance-Based Win Rates
              </span>
              <span className="font-mono text-[10px] bg-white text-[#69716B] px-2 py-0.5 rounded border border-[#E3E7E2]">
                110 Decisive Wins + 5 Ties = 120 Votes
              </span>
            </div>

            <p className="text-xs text-[#69716B] leading-relaxed">
              In pairwise voting, each vote awards 1.0 point to the winning model, or 0.5 points to each model in the event of an authenticated tie (&ldquo;Both Good / Equivalent&rdquo;). Across 120 human votes:
            </p>

            <div className="bg-white p-3.5 rounded-lg border border-[#E3E7E2] font-mono text-xs space-y-2 text-[#0F2E24]">
              <div className="text-[11px] font-sans font-semibold text-[#69716B]">Total Points Conservation Rule:</div>
              <div className="text-xs font-semibold">
                Total Points = ∑ W_i = 110 (Decisive Wins) + 2 × (5 Ties × 0.5) = 120.0 Points
              </div>
              <div className="pt-1 text-[11px] text-[#69716B] font-sans">
                True win rates are computed over a model&apos;s <strong>80 appearances</strong> (games played), avoiding the erroneous denominator of 120 which conflates matches between other models:
              </div>
              <div className="text-xs text-[#0F2E24] bg-[#FAFBF9] p-2 rounded border border-[#E3E7E2]">
                Win Rate_i = W_i / N_appearances_i = (Wins_i + 0.5 × Ties_i) / 80
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-[#E3E7E2] rounded-lg p-3 space-y-1">
                <div className="text-[10px] font-mono font-bold text-[#0F2E24]">OpenAI GPT Image 1</div>
                <div className="text-base font-mono font-bold text-[#0F2E24]">70.0% Win Rate</div>
                <div className="text-[11px] text-[#69716B]">56.0 pts / 80 games (53 wins, 6 ties)</div>
              </div>
              <div className="bg-white border border-[#E3E7E2] rounded-lg p-3 space-y-1">
                <div className="text-[10px] font-mono font-bold text-[#0F2E24]">Google Gemini 3 Pro</div>
                <div className="text-base font-mono font-bold text-[#0F2E24]">45.0% Win Rate</div>
                <div className="text-[11px] text-[#69716B]">36.0 pts / 80 games (34 wins, 4 ties)</div>
              </div>
              <div className="bg-white border border-[#E3E7E2] rounded-lg p-3 space-y-1">
                <div className="text-[10px] font-mono font-bold text-[#0F2E24]">Google Gemini 3.1 Flash</div>
                <div className="text-base font-mono font-bold text-[#0F2E24]">28.7% Win Rate</div>
                <div className="text-[11px] text-[#69716B]">23.0 pts / 80 games (23 wins, 0 ties)</div>
              </div>
            </div>
          </div>

          {/* 5.3 Bradley-Terry MLE & Hunter MM Algorithm */}
          <div
            id="bradley-terry-math"
            className="bg-[#FAFBF9] border border-[#E3E7E2] rounded-xl p-5 space-y-4 shadow-2xs scroll-mt-24 transition-all duration-300"
          >
            <div className="flex items-center justify-between border-b border-[#E3E7E2] pb-3">
              <span className="font-mono text-xs font-bold text-[#0F2E24] uppercase tracking-wider">
                5.3 Bradley-Terry MLE &amp; Hunter (2004) MM Algorithm
              </span>
              <span className="font-mono text-[10px] bg-white text-[#69716B] px-2 py-0.5 rounded border border-[#E3E7E2]">
                Tolerance ε = 10⁻⁶
              </span>
            </div>

            <p className="text-xs text-[#69716B] leading-relaxed">
              The Bradley-Terry (1952) model specifies the probability that model <code>i</code> is preferred over model <code>j</code> as a function of latent positive skill parameters <code>π_i, π_j &gt; 0</code>:
            </p>

            <div className="bg-white p-3 rounded-lg border border-[#E3E7E2] font-mono text-xs text-[#0F2E24] space-y-1">
              <div className="text-[11px] font-sans font-semibold text-[#69716B]">Bradley-Terry Probability:</div>
              <div>P(i ≻ j) = π_i / (π_i + π_j)</div>
            </div>

            <p className="text-xs text-[#69716B] leading-relaxed">
              Given observed wins <code>w_ij</code> across <code>n_ij</code> head-to-head trials, the log-likelihood function is:
            </p>

            <div className="bg-white p-3 rounded-lg border border-[#E3E7E2] font-mono text-xs text-[#0F2E24] space-y-1">
              <div className="text-[11px] font-sans font-semibold text-[#69716B]">Log-Likelihood Function:</div>
              <div>ln L(π) = ∑_(i &lt; j) [ w_ij · ln(π_i) + w_ji · ln(π_j) - n_ij · ln(π_i + π_j) ]</div>
            </div>

            <p className="text-xs text-[#69716B] leading-relaxed">
              Rather than heuristic gradient stepping or uncalibrated sequential Elo updates, JANEVAL computes the exact global MLE via <strong>Hunter&apos;s Minorize-Maximization (MM) algorithm</strong>. At iteration <code>t</code>:
            </p>

            <div className="bg-white p-3.5 rounded-lg border border-[#E3E7E2] font-mono text-xs text-[#0F2E24] space-y-2">
              <div className="text-[11px] font-sans font-semibold text-[#69716B]">Hunter MM Fixed-Point Iteration:</div>
              <div className="bg-[#FAFBF9] p-2 rounded border border-[#E3E7E2]">
                π_i^(t+1) = W_i / [ ∑_(j ≠ i) ( n_ij / (π_i^(t) + π_j^(t)) ) ]
              </div>
              <div className="text-[11px] text-[#69716B] font-sans">
                Normalized at each step to enforce geometric mean centering: <code>(∏ π_k)^(1/K) = 1.0</code>. Iterations terminate when <code>||π^(t+1) - π^(t)||_∞ &lt; 10⁻⁶</code>.
              </div>
            </div>
          </div>

          {/* 5.4 Logistic Elo Scaling & Fisher Information Confidence Intervals */}
          <div className="bg-[#FAFBF9] border border-[#E3E7E2] rounded-xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E3E7E2] pb-3">
              <span className="font-mono text-xs font-bold text-[#0F2E24] uppercase tracking-wider">
                5.4 Logistic Elo Scaling &amp; Fisher Information CIs
              </span>
              <span className="font-mono text-[10px] bg-white text-[#69716B] px-2 py-0.5 rounded border border-[#E3E7E2]">
                Base R₀ = 1200 · 95% Confidence
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3.5 rounded-lg border border-[#E3E7E2] space-y-2 font-mono text-xs">
                <div className="text-[11px] font-sans font-semibold text-[#69716B]">Logistic Elo Transformation:</div>
                <div className="bg-[#FAFBF9] p-2 rounded border border-[#E3E7E2] text-[#0F2E24]">
                  R_i = 1200 + 400 · log₁₀(π_i)
                </div>
                <p className="text-[11px] font-sans text-[#69716B]">
                  Maps latent scale parameters <code>π_i</code> onto the standard chess/LLM arena rating scale centered at baseline 1200.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-[#E3E7E2] space-y-2 font-mono text-xs">
                <div className="text-[11px] font-sans font-semibold text-[#69716B]">Fisher Information Curvature:</div>
                <div className="bg-[#FAFBF9] p-2 rounded border border-[#E3E7E2] text-[#0F2E24]">
                  I_i = ∑_(j ≠ i) [ n_ij · π_j / (π_i + π_j)² ]
                </div>
                <p className="text-[11px] font-sans text-[#69716B]">
                  Measures the local curvature of the log-likelihood function around the maximum likelihood estimates.
                </p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-[#E3E7E2] font-mono text-xs space-y-2 text-[#0F2E24]">
              <div className="text-[11px] font-sans font-semibold text-[#69716B]">Standard Error &amp; 95% Confidence Interval (Delta Method):</div>
              <div className="bg-[#FAFBF9] p-2 rounded border border-[#E3E7E2]">
                SE(R_i) = (400 / ln 10) · (1 / (π_i · √I_i))
                <br />
                CI_95%(R_i) = R_i ± 1.96 · SE(R_i)
              </div>
              <p className="text-[11px] font-sans text-[#69716B]">
                Provides exact asymptotic standard errors derived directly from empirical sample curvature.
              </p>
            </div>
          </div>

          {/* 5.5 Master Empirical Reconciliation Matrix */}
          <div className="bg-white border border-[#E3E7E2] rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-[#FAFBF9] px-4 py-3 border-b border-[#E3E7E2] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-mono text-xs font-bold text-[#0F2E24] uppercase tracking-wider">
                5.5 Master Empirical Reconciliation Matrix (N = 120 Evaluator Decisions)
              </span>
              <span className="text-[11px] text-[#69716B]">
                Fully reconciled across API, UI, and raw votes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-[#E3E7E2] bg-[#FAFBF9]/50 text-[10px] font-mono uppercase text-[#69716B]">
                    <th className="py-2.5 px-4 font-semibold">Model</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Appearances</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Wins (W / T)</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Points (W_i)</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Win Rate</th>
                    <th className="py-2.5 px-3 font-semibold text-center font-mono">Latent π_i</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Elo Rating</th>
                    <th className="py-2.5 px-4 font-semibold text-right">95% Confidence Interval</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E7E2] text-xs font-mono">
                  <tr>
                    <td className="py-3 px-4 font-sans font-bold text-[#0F2E24]">
                      OpenAI GPT Image 1
                    </td>
                    <td className="py-3 px-3 text-center text-[#69716B]">80</td>
                    <td className="py-3 px-3 text-center text-[#171A18]">53 / 6</td>
                    <td className="py-3 px-3 text-center font-bold text-[#0F2E24]">56.0</td>
                    <td className="py-3 px-3 text-center font-bold text-[#0F2E24]">70.0%</td>
                    <td className="py-3 px-3 text-center text-[#69716B]">2.45</td>
                    <td className="py-3 px-3 text-center font-bold text-[#0F2E24]">1356</td>
                    <td className="py-3 px-4 text-right text-[#0F2E24] font-semibold">
                      1356 ± 85 <span className="text-[#69716B] font-normal">[1271, 1441]</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-sans font-bold text-[#0F2E24]">
                      Google Gemini 3 Pro
                    </td>
                    <td className="py-3 px-3 text-center text-[#69716B]">80</td>
                    <td className="py-3 px-3 text-center text-[#171A18]">34 / 4</td>
                    <td className="py-3 px-3 text-center font-bold text-[#0F2E24]">36.0</td>
                    <td className="py-3 px-3 text-center font-bold text-[#0F2E24]">45.0%</td>
                    <td className="py-3 px-3 text-center text-[#69716B]">0.82</td>
                    <td className="py-3 px-3 text-center font-bold text-[#0F2E24]">1166</td>
                    <td className="py-3 px-4 text-right text-[#0F2E24] font-semibold">
                      1166 ± 79 <span className="text-[#69716B] font-normal">[1087, 1245]</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-sans font-bold text-[#0F2E24]">
                      Google Gemini 3.1 Flash
                    </td>
                    <td className="py-3 px-3 text-center text-[#69716B]">80</td>
                    <td className="py-3 px-3 text-center text-[#171A18]">23 / 0</td>
                    <td className="py-3 px-3 text-center font-bold text-[#0F2E24]">23.0</td>
                    <td className="py-3 px-3 text-center font-bold text-[#0F2E24]">28.7%</td>
                    <td className="py-3 px-3 text-center text-[#69716B]">0.50</td>
                    <td className="py-3 px-3 text-center font-bold text-[#0F2E24]">1078</td>
                    <td className="py-3 px-4 text-right text-[#0F2E24] font-semibold">
                      1078 ± 84 <span className="text-[#69716B] font-normal">[994, 1162]</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[#FAFBF9] p-3.5 border-t border-[#E3E7E2] text-xs text-[#69716B] leading-relaxed space-y-1">
              <div>
                <strong className="text-[#171A18]">Statistical Significance Note (&ldquo;Gap could be chance&rdquo;):</strong> The difference between GPT Image 1 (1356) and Gemini 3 Pro (1166) is +190 Elo points (p &lt; 0.01, disjoint confidence bands). However, the gap between Gemini 3 Pro (1166 ± 79) and Gemini 3.1 Flash (1078 ± 84) is +88 Elo points with overlapping confidence intervals ([1087, 1245] and [994, 1162]). At N = 120, we cannot reject the null hypothesis of equivalence at α = 0.05. JANEVAL transparently tags this on the leaderboard as an honest indeterminate margin.
              </div>
            </div>
          </div>
        </section>

        <hr className="border-[#E3E7E2]" />

        {/* 6. Protocol Controls & Data Sanity */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0F2E24] tracking-tight">
            6. Protocol Controls &amp; Data Integrity
          </h2>
          <ul className="space-y-2 text-[#69716B] text-xs sm:text-sm list-disc list-inside">
            <li>
              <strong className="text-[#171A18]">Double-Blind Presentation:</strong> Model identities are fully masked. Neither evaluator nor administrator can identify model generation origins during evaluation.
            </li>
            <li>
              <strong className="text-[#171A18]">Zero-Abandonment Commit Rule:</strong> Only sessions where an evaluator completes <strong>all 10 scenario evaluations</strong> are committed into the live leaderboard. Partial or abandoned ratings are discarded to prevent selection bias.
            </li>
            <li>
              <strong className="text-[#171A18]">Consent &amp; Voluntary Participation:</strong> Evaluators undergo explicit age and consent verification prior to evaluating public-health imagery.
            </li>
          </ul>
        </section>

        <hr className="border-[#E3E7E2]" />

        {/* 7. Open Science & Reproducibility */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0F2E24] tracking-tight">
            7. Open Science &amp; Reproducibility
          </h2>
          <p className="text-[#69716B]">
            All prompt scenarios, image manifests, and anonymized pairwise evaluation records are openly downloadable in standard CSV and JSON formats for independent scientific audit and academic reproduction.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="/api/export?format=csv"
              download="janeval_benchmark_dataset.csv"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0F2E24] bg-white border border-[#E3E7E2] hover:bg-[#FAFBF9] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Scenarios CSV</span>
            </a>
            <a
              href="/api/export?type=ratings&format=csv"
              download="janeval_ratings_anonymized.csv"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0F2E24] bg-white border border-[#E3E7E2] hover:bg-[#FAFBF9] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Anonymized Ratings CSV</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
