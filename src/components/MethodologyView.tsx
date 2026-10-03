'use client';

import React from 'react';
import { Target, Users, ShieldCheck, HeartPulse, Scale, Download, Award, Layers } from 'lucide-react';
import { MODELS_INFO } from '@/data/prompts';

export function MethodologyView() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-200">
      {/* Title & Badge */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Benchmark Methodology
          </span>
          <span className="text-xs text-slate-400">• Independent Evaluation Platform</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          About the Drishti-Health Visual Benchmark
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          An open, crowd-sourced human evaluation platform designed to benchmark text-to-image foundation models on authentic Indian grassroots healthcare realities, clinical equipment accuracy, and vernacular typography.
        </p>
      </div>

      {/* 1. The Core Benchmark Thesis */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2.5 text-emerald-400">
          <Target className="w-5 h-5" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider">Benchmark Thesis</h2>
        </div>
        <div className="text-xs text-slate-300 leading-relaxed space-y-3">
          <p>
            Mainstream AI vision benchmarks evaluate aesthetic photorealism and Western studio lighting. However, when foundation models are deployed for grassroots healthcare communication in India (e.g. Information, Education, and Communication campaigns by public health missions), they frequently encounter domain-specific failure modes:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-emerald-400 block mb-1">Cultural Hallucinations</span>
              <p className="text-slate-400 text-[11px]">Replacing mandated cotton uniforms with bridal attire or western medical gowns.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-amber-400 block mb-1">Typography Distortion</span>
              <p className="text-slate-400 text-[11px]">Collapsing Devanagari Hindi ligatures and vowel diacritics on village health murals.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-blue-400 block mb-1">Equipment Errors</span>
              <p className="text-slate-400 text-[11px]">Misrepresenting field cold-chain carriers, Salter scales, and Primary Health Centre infrastructure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Models Under Benchmark */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-white font-bold">
          <Layers className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg">Models Under Continuous Evaluation</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MODELS_INFO.map((m) => (
            <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${m.badgeColor}`}>{m.company}</span>
                <span className="text-[10px] text-slate-500 font-mono">{m.codename}</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{m.name}</h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Evaluation Dimensions & Elo Scoring */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Scale className="w-4 h-4" />
            <h3 className="font-bold text-white text-sm">Blind Testing Protocol</h3>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Evaluators view outputs generated from identical prompts without model branding (blinded as <strong>Model A</strong>, <strong>Model B</strong>, and <strong>Model C</strong>). The presentation order is deterministically shuffled across prompts to eliminate brand and positional bias.
          </p>
          <p className="text-slate-400 text-[11px]">
            Every round captures structured 1–5 rubric ratings on <em>Cultural Fidelity</em>, <em>Equipment Realism</em>, and <em>Typography</em>, alongside a discrete pairwise winner vote.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400">
            <Award className="w-4 h-4" />
            <h3 className="font-bold text-white text-sm">Dynamic Elo Rating System</h3>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Rankings and win-rates on the <strong>Leaderboard</strong> are 100% computed from real votes submitted by evaluators in the Blind Arena.
          </p>
          <p className="text-slate-400 text-[11px]">
            Each model begins at a baseline Elo of 1200. As users vote across prompts, Elo points dynamically scale based on relative win probabilities against competitor models.
          </p>
        </div>
      </section>

      {/* 4. Open Data Export */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white mb-1">Open Research Dataset</h3>
          <p className="text-xs text-slate-400">
            Download the complete 30-image evaluation manifest, prompt taxonomy, and metadata for external research.
          </p>
        </div>
        <a
          href="/api/export?format=csv"
          download="drishti_health_eval_dataset.csv"
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Dataset (CSV)</span>
        </a>
      </section>
    </div>
  );
}
