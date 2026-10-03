'use client';

import React from 'react';
import { Download, ExternalLink } from 'lucide-react';

export function MethodologyView() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#171A18] font-sans">
      {/* Publication Masthead */}
      <header className="mb-10 pb-8 border-b border-[#E3E7E2]">
        <div className="flex items-center space-x-2 text-[10px] font-mono uppercase font-bold text-[#69716B] tracking-wider mb-2">
          <span>BENCHMARK SPECIFICATION &amp; STUDY PROTOCOL</span>
          <span>·</span>
          <span className="text-[#0F2E24]">JANEVAL v1.0</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E24] tracking-tight leading-tight">
          Benchmark Methodology &amp; Mathematical Formulation
        </h1>

        <p className="text-sm sm:text-base text-[#69716B] mt-3 leading-relaxed">
          An empirical framework for evaluating representation fidelity of frontier image foundation models across Indian public-health realities.
        </p>

        {/* Key Methodological Manifesto */}
        <div className="mt-6 p-5 rounded-xl bg-[#0F2E24] text-white">
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#DDEBE3]">
            CORE BENCHMARK PRINCIPLE
          </div>
          <p className="text-base sm:text-lg font-bold tracking-tight text-white mt-1">
            &ldquo;JANEVAL measures representation fidelity — not aesthetic preference.&rdquo;
          </p>
          <p className="text-xs text-[#DDEBE3]/90 mt-2 leading-relaxed">
            The benchmark rejects surface-level image polish and photorealism when detached from ground-truth cultural, infrastructural, and orthographic realities.
          </p>
        </div>
      </header>

      {/* Main Research Sections (Typography, Dividers, Whitespace) */}
      <div className="space-y-12 leading-relaxed text-sm text-[#171A18]">
        {/* 1. Benchmark Overview */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0F2E24] tracking-tight">
            1. Benchmark Overview
          </h2>
          <p className="text-[#69716B]">
            Generative vision foundation models are increasingly deployed in global south communication, education, and health awareness pipelines. However, typical evaluation suites benchmark on Western benchmarks (ImageNet, COCO) or open-domain aesthetic preferences. JANEVAL establishes an empirical, reproducible testbed testing whether frontier models can authentically depict rural Indian frontline public-health contexts without falling into colonial stereotyping, westernized clinical tropes, or orthographic hallucination.
          </p>
          <div className="bg-white border border-[#E3E7E2] rounded-lg p-4 font-mono text-xs text-[#0F2E24] space-y-1">
            <div>• Target Domain: Frontline Indian Public Healthcare (ASHA, PHC/Sub-Centres, UIP)</div>
            <div>• Models Evaluated: OpenAI GPT Image 1, Google Gemini 3 Pro, Google Gemini 3.1 Flash</div>
            <div>• Dataset Size: 10 Standardized Scenarios × 3 Foundation Models = 30 Images</div>
          </div>
        </section>

        <hr className="border-[#E3E7E2]" />

        {/* 2. Evaluation Design */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0F2E24] tracking-tight">
            2. Evaluation Design
          </h2>
          <p className="text-[#69716B]">
            Rather than asking annotators for subjective 1–5 aesthetic ratings, JANEVAL employs a double-blind pairwise comparison protocol coupled with criteria-grounded verification. Human evaluators are presented with blinded model outputs for a given standardized prompt and asked to judge representational fidelity against physical reference guidelines.
          </p>
        </section>

        <hr className="border-[#E3E7E2]" />

        {/* 3. Evaluation Axes */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#0F2E24] tracking-tight">
            3. Evaluation Axes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-[#E3E7E2] rounded-lg p-4">
              <span className="font-mono text-[10px] font-bold text-[#0F2E24] block uppercase">
                AXIS 01 · CULTURAL FIDELITY
              </span>
              <p className="font-medium text-xs text-[#171A18] mt-1">People, settings, practices</p>
              <p className="text-xs text-[#69716B] mt-2 leading-relaxed">
                ASHA worker attire (official pink cotton saree with border), identification badges, village registers, maternal postures, and authentic rural domestic triage contexts.
              </p>
            </div>

            <div className="bg-white border border-[#E3E7E2] rounded-lg p-4">
              <span className="font-mono text-[10px] font-bold text-[#0F2E24] block uppercase">
                AXIS 02 · INFRASTRUCTURAL FIDELITY
              </span>
              <p className="font-medium text-xs text-[#171A18] mt-1">Systems, equipment, spaces</p>
              <p className="text-xs text-[#69716B] mt-2 leading-relaxed">
                WHO-standard blue vaccine cold-chain carriers, conditioned hard ice-packs, dial temperature gauges, Salter hanging scales, and Primary Health Sub-Centre architecture.
              </p>
            </div>

            <div className="bg-white border border-[#E3E7E2] rounded-lg p-4">
              <span className="font-mono text-[10px] font-bold text-[#0F2E24] block uppercase">
                AXIS 03 · ORTHOGRAPHIC FIDELITY
              </span>
              <p className="font-medium text-xs text-[#171A18] mt-1">Devanagari &amp; public-health text</p>
              <p className="text-xs text-[#69716B] mt-2 leading-relaxed">
                Continuous unbroken shirorekha (horizontal top line), accurate matras, correct character conjuncts, and legible Hindi awareness messages on clinic murals.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-[#E3E7E2]" />

        {/* 4. Scenarios */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0F2E24] tracking-tight">
            4. Scenario Specification
          </h2>
          <p className="text-[#69716B]">
            The 10 benchmark scenarios were designed in consultation with public-health field workers and vernacular AI practitioners. Each scenario targets specific systemic blind spots of frontier foundation vision models:
          </p>
          <div className="bg-white border border-[#E3E7E2] rounded-lg divide-y divide-[#E3E7E2] text-xs">
            <div className="p-3 flex justify-between">
              <span className="font-mono font-semibold">P01–P03</span>
              <span className="text-[#69716B]">Frontline Community Healthcare (ASHA home triage, village register check, maternity counselling)</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="font-mono font-semibold">P04–P06</span>
              <span className="text-[#69716B]">Cold Chain &amp; Immunization Hardware (Universal Immunization Day, blue cold-boxes, infant weighing)</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="font-mono font-semibold">P07–P10</span>
              <span className="text-[#69716B]">Infrastructure, Telemedicine &amp; Devanagari Signage (PHC triage, Hindi wall murals, digital tablet records)</span>
            </div>
          </div>
        </section>

        <hr className="border-[#E3E7E2]" />

        {/* 5. Pairwise Evaluation & Elo Formulation */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0F2E24] tracking-tight">
            5. Mathematical Model: Bradley-Terry &amp; Elo System
          </h2>
          <p className="text-[#69716B]">
            To eliminate score inflation and subjective calibration shifts across evaluators, JANEVAL operationalizes the <strong>Bradley-Terry (1952)</strong> paired comparison formulation via the <strong>Elo (1978)</strong> rating system with logistic win probabilities.
          </p>

          <div className="bg-[#FAFBF9] border border-[#E3E7E2] rounded-lg p-5 font-mono text-xs space-y-4">
            <div>
              <div className="text-[#69716B] text-[11px] mb-1 font-sans font-semibold">
                1. Expected Score Formulation:
              </div>
              <div className="bg-white p-2.5 rounded border border-[#E3E7E2] text-[#0F2E24]">
                E_A = 1 / (1 + 10^((R_B - R_A) / 400))
              </div>
              <p className="text-[11px] text-[#69716B] mt-1 font-sans">
                Where <code>R_A</code> and <code>R_B</code> represent prior ratings, and <code>E_A</code> is the logistic win expectancy for Model A.
              </p>
            </div>

            <div>
              <div className="text-[#69716B] text-[11px] mb-1 font-sans font-semibold">
                2. Rating Update Rule:
              </div>
              <div className="bg-white p-2.5 rounded border border-[#E3E7E2] text-[#0F2E24]">
                R_A(new) = R_A(old) + K * (S_A - E_A)
              </div>
              <p className="text-[11px] text-[#69716B] mt-1 font-sans">
                Sensitivity coefficient <code>K = 32</code>, baseline initial score <code>R_0 = 1200</code>, with outcome <code>S_A ∈ &#123;1.0 (Win), 0.5 (Tie), 0.0 (Loss)&#125;</code>.
              </p>
            </div>

            <div>
              <div className="text-[#69716B] text-[11px] mb-1 font-sans font-semibold">
                3. Multi-Model Decomposition:
              </div>
              <p className="text-[11px] text-[#69716B] font-sans">
                When an evaluator compares models A, B, and C and selects A, the vote decomposes into two independent pairwise outcomes: (A &gt; B) and (A &gt; C). Ties distribute 0.5 across all pairs.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-[#E3E7E2]" />

        {/* 6. Evaluator Protocol & Experimental Controls */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0F2E24] tracking-tight">
            6. Evaluator Protocol &amp; Controls
          </h2>
          <ul className="space-y-2 text-[#69716B] text-xs sm:text-sm list-disc list-inside">
            <li>
              <strong className="text-[#171A18]">Double-Blind Randomization:</strong> Model names are fully masked (Model A, B, C) and display order is randomized per prompt to eliminate positional bias.
            </li>
            <li>
              <strong className="text-[#171A18]">18+ Voluntary Protocol:</strong> Evaluators undergo explicit consent verification prior to rating.
            </li>
            <li>
              <strong className="text-[#171A18]">Zero-Abandonment Data Sanity:</strong> Only sessions where an evaluator completes all 10 scenario evaluations are committed into the live leaderboard to prevent incomplete voter bias.
            </li>
          </ul>
        </section>

        <hr className="border-[#E3E7E2]" />

        {/* 7. Limitations & Reproducibility */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0F2E24] tracking-tight">
            7. Limitations &amp; Open Reproducibility
          </h2>
          <p className="text-[#69716B]">
            JANEVAL evaluates synthetic generation quality in public health contexts. It does not certify medical diagnosis or therapeutic safety. All prompt scenarios, generated assets, and anonymized pairwise records are openly downloadable for scientific audit and public research.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="/api/export?format=csv"
              download="janeval_benchmark_dataset.csv"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0F2E24] bg-white border border-[#E3E7E2] hover:bg-[#FAFBF9] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Benchmark Scenarios (CSV)</span>
            </a>
            <a
              href="/api/export?type=ratings&format=csv"
              download="janeval_ratings_anonymized.csv"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0F2E24] bg-white border border-[#E3E7E2] hover:bg-[#FAFBF9] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Anonymized Ratings (CSV)</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
