'use client';

import React from 'react';

export function HeroArchitectureDiagram() {
  const scenarios = [
    { id: 'P01', y: 44, active: false },
    { id: 'P02', y: 64, active: false },
    { id: 'P03', y: 84, active: false },
    { id: 'P04', y: 104, active: true },
    { id: 'P05', y: 124, active: false },
    { id: 'P06', y: 144, active: false },
    { id: 'P07', y: 164, active: false },
    { id: 'P08', y: 184, active: false },
    { id: 'P09', y: 204, active: false },
    { id: 'P10', y: 224, active: false },
  ];

  return (
    <div className="w-full flex items-center justify-center select-none">
      <svg
        viewBox="0 0 520 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[500px]"
      >
        <defs>
          {/* Extremely quiet, sparse dot pattern directly on the #F7F8F5 background */}
          <pattern id="quiet-dot-pattern" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="9" cy="9" r="0.55" fill="#94A3B8" opacity="0.3" />
          </pattern>
        </defs>

        {/* Quiet Background Dot Grid */}
        <rect width="520" height="250" fill="url(#quiet-dot-pattern)" />

        {/* ==============================================================
            STAGE 1: 10 SCENARIOS
            ============================================================== */}
        <text
          x="12"
          y="20"
          className="font-mono text-[8.5px] font-bold fill-[#8A948E] tracking-widest uppercase"
        >
          10 SCENARIOS
        </text>

        {/* Scenario Labels, Dots, and Subtle Flow Curves */}
        {scenarios.map((s) => (
          <g key={s.id}>
            {/* Scenario ID Text */}
            <text
              x="12"
              y={s.y + 3}
              className={`font-mono text-[9px] ${
                s.active ? 'font-bold fill-[#0F2E24]' : 'font-medium fill-[#8A948E]'
              }`}
            >
              {s.id}
            </text>

            {/* Scenario Status Dot */}
            <circle
              cx="42"
              cy={s.y}
              r={s.active ? 3.2 : 2.4}
              fill={s.active ? '#C85A32' : '#A2B4A8'}
            />

            {/* Flow Curves towards Blind Comparison */}
            {s.active ? (
              // Active P04 Highlighted Path
              <path
                d={`M 46 ${s.y} L 118 ${s.y}`}
                stroke="#C85A32"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.9"
              />
            ) : (
              // Subtle flow curves converging gracefully into comparison box
              <path
                d={`M 46 ${s.y} C 86 ${s.y}, 108 76, 144 76`}
                stroke="#D2DDD6"
                strokeWidth="0.75"
                fill="none"
                opacity="0.6"
              />
            )}
          </g>
        ))}

        {/* ==============================================================
            STAGE 2: BLIND COMPARISON
            ============================================================== */}
        <text
          x="215"
          y="20"
          textAnchor="middle"
          className="font-mono text-[8.5px] font-bold fill-[#8A948E] tracking-widest uppercase"
        >
          BLIND COMPARISON
        </text>

        {/* Quiet Dashed Comparison Boundary */}
        <rect
          x="152"
          y="30"
          width="126"
          height="205"
          rx="10"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="0.75"
          strokeDasharray="3 3"
          opacity="0.8"
        />

        {/* Model A Card */}
        <g transform="translate(166, 60)">
          <rect
            width="32"
            height="32"
            rx="7"
            fill="#FFFFFF"
            stroke="#D5DDD7"
            strokeWidth="0.75"
          />
          <text
            x="16"
            y="20"
            textAnchor="middle"
            className="font-sans font-bold text-xs fill-[#0F2E24]"
          >
            A
          </text>
          {/* Anchor Dot */}
          <circle cx="16" cy="32" r="1.2" fill="#0F2E24" opacity="0.6" />
        </g>

        {/* Comparison Slash */}
        <text
          x="215"
          y="80"
          textAnchor="middle"
          className="font-mono text-xs fill-[#94A3B8]"
        >
          /
        </text>

        {/* Model B Card */}
        <g transform="translate(232, 60)">
          <rect
            width="32"
            height="32"
            rx="7"
            fill="#FFFFFF"
            stroke="#D5DDD7"
            strokeWidth="0.75"
          />
          <text
            x="16"
            y="20"
            textAnchor="middle"
            className="font-sans font-bold text-xs fill-[#0F2E24]"
          >
            B
          </text>
          {/* Anchor Dot */}
          <circle cx="16" cy="32" r="1.2" fill="#0F2E24" opacity="0.6" />
        </g>

        {/* Convergence Lines below Cards to Human Evaluation */}
        <path
          d="M 182 94 C 182 110, 215 110, 215 122"
          stroke="#CBD5E1"
          strokeWidth="0.75"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M 248 94 C 248 110, 215 110, 215 122"
          stroke="#CBD5E1"
          strokeWidth="0.75"
          fill="none"
          opacity="0.7"
        />

        {/* Human Evaluation Node (Quiet 3 connected nodes icon) */}
        <g transform="translate(215, 134)">
          <line x1="0" y1="-6" x2="-5" y2="4" stroke="#0F2E24" strokeWidth="1" opacity="0.7" />
          <line x1="0" y1="-6" x2="5" y2="4" stroke="#0F2E24" strokeWidth="1" opacity="0.7" />
          <line x1="-5" y1="4" x2="5" y2="4" stroke="#0F2E24" strokeWidth="1" opacity="0.7" />
          <circle cx="0" cy="-6" r="1.8" fill="#0F2E24" />
          <circle cx="-5" cy="4" r="1.8" fill="#0F2E24" />
          <circle cx="5" cy="4" r="1.8" fill="#0F2E24" />
        </g>

        {/* Label: HUMAN EVALUATION */}
        <text
          x="215"
          y="152"
          textAnchor="middle"
          className="font-mono text-[7.5px] font-bold fill-[#4A5550] tracking-wider uppercase"
        >
          HUMAN
        </text>
        <text
          x="215"
          y="161.5"
          textAnchor="middle"
          className="font-mono text-[7.5px] font-bold fill-[#4A5550] tracking-wider uppercase"
        >
          EVALUATION
        </text>

        {/* Line leading down to Pairwise Elo */}
        <line x1="215" y1="168" x2="215" y2="188" stroke="#CBD5E1" strokeWidth="0.75" opacity="0.7" />

        {/* PAIRWISE ELO Badge */}
        <g transform="translate(168, 188)">
          <rect
            width="94"
            height="23"
            rx="6"
            fill="#EEF3EF"
            stroke="#D5DDD7"
            strokeWidth="0.75"
          />
          {/* Mini Bar Chart Glyph */}
          <g transform="translate(13, 7)">
            <rect x="0" y="5" width="1.5" height="4" rx="0.5" fill="#0F2E24" opacity="0.8" />
            <rect x="3.5" y="2.5" width="1.5" height="6.5" rx="0.5" fill="#0F2E24" opacity="0.8" />
            <rect x="7" y="0" width="1.5" height="9" rx="0.5" fill="#0F2E24" opacity="0.8" />
          </g>
          <text
            x="52"
            y="14.5"
            textAnchor="middle"
            className="font-mono text-[7.5px] font-bold fill-[#0F2E24] tracking-wider uppercase"
          >
            PAIRWISE ELO
          </text>
        </g>

        {/* ==============================================================
            STAGE 3: 3 EVALUATION AXES
            ============================================================== */}
        <text
          x="424"
          y="20"
          textAnchor="middle"
          className="font-mono text-[8.5px] font-bold fill-[#8A948E] tracking-widest uppercase"
        >
          3 EVALUATION AXES
        </text>

        {/* Branch 1: Cultural Fidelity */}
        <path
          d="M 278 76 C 320 76, 338 52, 372 52"
          stroke="#D2DDD6"
          strokeWidth="0.75"
          fill="none"
          opacity="0.7"
        />
        <circle cx="378" cy="52" r="2.8" fill="#4E8F6F" />
        <text
          x="390"
          y="55"
          className="font-mono text-[8.5px] font-bold fill-[#333E37] tracking-wider uppercase"
        >
          CULTURAL FIDELITY
        </text>

        {/* Branch 2: Medical Accuracy */}
        <path
          d="M 278 76 C 320 76, 338 94, 372 94"
          stroke="#D2DDD6"
          strokeWidth="0.75"
          fill="none"
          opacity="0.7"
        />
        <circle cx="378" cy="94" r="2.8" fill="#88A795" />
        <text
          x="390"
          y="97"
          className="font-mono text-[8.5px] font-bold fill-[#333E37] tracking-wider uppercase"
        >
          MEDICAL ACCURACY
        </text>

        {/* Branch 3: Indic Typography */}
        <path
          d="M 278 76 C 320 76, 338 136, 372 136"
          stroke="#C85A32"
          strokeWidth="0.85"
          strokeDasharray="2 2"
          fill="none"
          opacity="0.8"
        />
        <circle cx="378" cy="136" r="2.8" fill="#C85A32" />
        <text
          x="390"
          y="139"
          className="font-mono text-[8.5px] font-bold fill-[#333E37] tracking-wider uppercase"
        >
          INDIC TYPOGRAPHY
        </text>
      </svg>
    </div>
  );
}
