'use client';

import React from 'react';
import { Download, Scale, CheckCircle2, Shield, Users, Type, FileText } from 'lucide-react';

export function MethodologyView() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#171A18] font-sans">
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

        {/* 5. Mathematical Formulation: Bradley-Terry & Elo */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0F2E24] tracking-tight">
            5. Mathematical Model: Bradley-Terry &amp; Elo System
          </h2>
          <p className="text-[#69716B]">
            To eliminate individual score inflation and subjective calibration shifts across annotators, JANEVAL operationalizes the <strong>Bradley-Terry (1952)</strong> paired comparison formulation via the <strong>Elo (1978)</strong> rating system with logistic win probabilities.
          </p>

          <div className="bg-[#FAFBF9] border border-[#E3E7E2] rounded-lg p-5 font-mono text-xs space-y-4 shadow-2xs">
            <div>
              <div className="text-[#69716B] text-[11px] mb-1 font-sans font-semibold">
                1. Expected Score Formulation (Logistic Curve):
              </div>
              <div className="bg-white p-2.5 rounded border border-[#E3E7E2] text-[#0F2E24]">
                E_A = 1 / (1 + 10^((R_B - R_A) / 400))
              </div>
              <p className="text-[11px] text-[#69716B] mt-1 font-sans">
                Where <code>R_A</code> and <code>R_B</code> represent prior ratings, and <code>E_A</code> is the expected win probability for Model A.
              </p>
            </div>

            <div>
              <div className="text-[#69716B] text-[11px] mb-1 font-sans font-semibold">
                2. Rating Update Rule (Direct Pairwise Outcome):
              </div>
              <div className="bg-white p-2.5 rounded border border-[#E3E7E2] text-[#0F2E24]">
                R_A(new) = R_A(old) + K * (S_A - E_A)
              </div>
              <p className="text-[11px] text-[#69716B] mt-1 font-sans">
                Sensitivity factor <code>K = 32</code>, baseline rating <code>R_0 = 1200</code>, with outcome <code>S_A ∈ &#123;1.0 (Win), 0.5 (Tie), 0.0 (Loss)&#125;</code>.
              </p>
            </div>

            <div>
              <div className="text-[#69716B] text-[11px] mb-1 font-sans font-semibold">
                3. 95% Confidence Interval Derivation:
              </div>
              <div className="bg-white p-2.5 rounded border border-[#E3E7E2] text-[#0F2E24]">
                CI_95 = ± 1.96 * (350 / sqrt(N_matches * 3))
              </div>
              <p className="text-[11px] text-[#69716B] mt-1 font-sans">
                Confidence intervals dynamically narrow as the sample size of completed evaluator batteries increases.
              </p>
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
