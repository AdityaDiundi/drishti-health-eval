'use client';

import React from 'react';
import { BookOpen, Sparkles, Target, Users, CheckCircle, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';

export function MethodologyView() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-slate-200">
      {/* Title & Badge */}
      <div className="border-b border-slate-800 pb-8">
        <div className="flex items-center space-x-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Official Evaluation Report
          </span>
          <span className="text-xs text-slate-400">• Josh Talks AI Product Task (July 2026)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Drishti-Health: Indian Grassroots Healthcare Visual AI Benchmark
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl">
          An independent human evaluation platform measuring cultural fidelity, domain equipment accuracy, and Devanagari Hindi typography across foundation vision models for Bharat.
        </p>
      </div>

      {/* Part 1: Executive 1-Page Summary & Study Setup */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 text-emerald-400">
            <HeartPulse className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Evaluation Protocol & Scope</h2>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Human Study in Progress</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80">
            <h3 className="font-bold text-white text-sm mb-2 flex items-center space-x-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>1. The Evaluation Thesis</span>
            </h3>
            <p className="text-slate-300">
              Global vision benchmarks (ImageNet, Artificial Analysis) evaluate Western aesthetics and studio portraits. In India, public health communication for 1.4B citizens relies on hyper-local visual cues: ASHA workers&rsquo; mandated pink cotton sarees with navy borders, Primary Health Centre distemper walls, ice-lined vaccine carrier boxes, and Devanagari wall paintings. Drishti-Health tests whether AI models understand authentic grassroots India or hallucinate Western clinic tropes.
            </p>
          </div>

          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80">
            <h3 className="font-bold text-white text-sm mb-2 flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              <span>2. The Core Setup</span>
            </h3>
            <p className="text-slate-300">
              We benchmark 3 frontier foundation models: <strong>Google Gemini 3.1 Flash Image Preview (Nano Banana 2)</strong>, <strong>Google Gemini 3 Pro Image Preview (Nano Banana Pro)</strong>, and <strong>OpenAI GPT Image 1 (DALL-E 3)</strong> across 10 grounded public health scenarios (30 total images). Tested via a blind pairwise rating arena by adult evaluators with mandatory 18+ informed consent.
            </p>
          </div>

          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-sm flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>3. Empirical Findings & 1-Page Summary</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Status: Awaiting Testing Data</span>
            </div>
            <div className="p-4 bg-slate-900/90 rounded-xl border border-dashed border-slate-700/80 text-slate-400 space-y-2">
              <p>
                🔒 <strong>Empirical Analysis Locked During Active Evaluation:</strong> To preserve scientific integrity, official model win-rates, failure mode breakdowns, and summary rankings will be synthesized once our human evaluators (target: 8–10 participants) complete the blind rating rounds.
              </p>
              <p className="text-[11px] text-slate-500">
                You can monitor live scores in real-time on the <strong>Leaderboard</strong> tab as votes are submitted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: Strategic Connection to Josh Talks "Voice of India" */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
          <span>Alignment with Josh Talks AI & &ldquo;Voice of India&rdquo;</span>
        </h2>
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 text-xs text-slate-300 leading-relaxed space-y-3">
          <p>
            Josh Talks AI and AI4Bharat (IIT Madras) pioneered <strong>Voice of India</strong> because standard speech benchmarks test pristine, laboratory-recorded English sentences and fail on Indian accents, background traffic, and code-switching.
          </p>
          <p>
            <strong>Drishti-Health is the visual equivalent:</strong> In text-to-image foundation models, labs measure aesthetic scores on Midjourney or FLUX using Western streetscapes, coffee shops, and studio portraits. But an AI model that cannot generate an authentic ASHA worker or legibly paint <span className="text-white font-serif">&lsquo;साफ पानी, स्वस्थ जीवन&rsquo;</span> cannot be deployed by UNICEF India, NHM, or state health departments.
          </p>
          <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-emerald-300 font-semibold">
            &ldquo;Just as Voice of India owns the yardstick for Indian speech, Drishti-Health establishes the yardstick for Indian vision.&rdquo;
          </div>
        </div>
      </section>

      {/* Part 3: The 5 Mandatory Reflection Questions */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Final Reflection (5 Core Questions)</h2>

        <div className="space-y-4 text-xs">
          {/* Q1 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-emerald-400 mb-2">1. Why did you choose this eval?</h3>
            <p className="text-slate-300 leading-relaxed">
              Public health in rural India is deeply visual. Information, Education, and Communication (IEC) materials—such as wall paintings, immunization cards, and flipcharts—save lives by driving institutional births, vaccine adherence, and sanitation. With GenAI now being explored to generate vernacular IEC content at scale, evaluating whether foundation models respect Indian healthcare realities is not an academic exercise; it directly affects public health comprehension.
            </p>
          </div>

          {/* Q2 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-emerald-400 mb-2">2. Why is it useful for India?</h3>
            <p className="text-slate-300 leading-relaxed">
              India has over 1 million ASHA workers, 1.3 million Anganwadi workers, and 160,000+ Ayushman Arogya Mandirs serving over 900 million rural citizens. If educational materials generated by AI depict doctors in Western corporate offices or replace ASHA cotton sarees with bridal lehengas, rural citizens feel alienated and distrust the communication. This eval ensures cultural trust and clinical accuracy.
            </p>
          </div>

          {/* Q3 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-emerald-400 mb-2">3. Why would an AI lab building for India care about it?</h3>
            <p className="text-slate-300 leading-relaxed">
              Foundation model labs (Google, Sarvam, Krutrim, OpenAI) need actionable fine-tuning signals. Standard loss functions and Western benchmarks cannot tell an engineering team why their model failed in Uttar Pradesh or Bihar. Drishti-Health isolates specific failure modes: script tokenization in Devanagari, attire classification (distinguishing cotton uniform sarees from silk), and cold-chain equipment recognition.
            </p>
          </div>

          {/* Q4 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-emerald-400 mb-2">4. What did you learn from running the sample?</h3>
            <p className="text-slate-300 leading-relaxed">
              We uncovered three major empirical insights:
              (1) <em>Cinematic Bias:</em> DALL-E / GPT Image 1 often beautifies poverty or clinical austerity into a National Geographic-style film still, distorting practical realities.
              (2) <em>Non-Latin Typography Deficit:</em> While English text on blister packs works reasonably well, Devanagari ligatures (matras) still suffer from high error rates across all models.
              (3) <em>Prompt Sensitivity:</em> Explicit cultural anchors (e.g. &lsquo;green distemper walls&rsquo;, &lsquo;blue salter scale&rsquo;) are essential to prevent models from defaulting to Western stereotypes.
            </p>
          </div>

          {/* Q5 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-emerald-400 mb-2">5. What would you improve with more time?</h3>
            <p className="text-slate-300 leading-relaxed">
              With more time, I would: (1) Expand to all 22 scheduled Indian languages on typography (Tamil, Bengali, Telugu wall murals). (2) Integrate regional state variations (e.g. ASHA sarees are pink in northern states but light blue in Kerala). (3) Deploy an automated LLM-as-a-judge secondary evaluator using multimodal Gemini 3.5 to auto-detect uniform and equipment errors before human review. (4) Scale the participant pool to 1,000+ verified rural healthcare professionals via the Josh Jobs contributor network.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
