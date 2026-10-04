'use client';

import React from 'react';

export function HeroArchitectureDiagram() {
  const scenarios = [
    { id: 'P01', y: 46, active: false },
    { id: 'P02', y: 68, active: false },
    { id: 'P03', y: 90, active: false },
    { id: 'P04', y: 112, active: true },
    { id: 'P05', y: 134, active: false },
    { id: 'P06', y: 156, active: false },
    { id: 'P07', y: 178, active: false },
    { id: 'P08', y: 200, active: false },
    { id: 'P09', y: 222, active: false },
    { id: 'P10', y: 244, active: false },
  ];

  return (
    <div className="w-full relative overflow-hidden rounded-2xl border border-[#E3E7E2] bg-white/70 backdrop-blur-xs p-3 sm:p-5 shadow-2xs">
      <svg
        viewBox="0 0 540 270"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto select-none"
      >
        <defs>
          {/* Subtle dot-grid pattern in the background */}
          <pattern id="hero-dot-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="0.75" fill="#CBD5E1" opacity="0.8" />
          </pattern>
        </defs>

        {/* Background Dot Grid */}
        <rect width="540" height="270" fill="url(#hero-dot-pattern)" />

        {/* ==============================================================
            STAGE 1: 10 SCENARIOS
            ============================================================== */}
        <text
          x="12"
          y="22"
          className="font-mono text-[9px] font-bold fill-[#69716B] tracking-wider uppercase"
        >
          10 SCENARIOS
        </text>

        {/* Scenario Labels, Dots, and Flow Lines */}
        {scenarios.map((s) => (
          <g key={s.id}>
            {/* Scenario ID Text */}
            <text
              x="12"
              y={s.y + 3.5}
              className={`font-mono text-[9.5px] ${
                s.active ? 'font-bold fill-[#171A18]' : 'font-medium fill-[#69716B]'
              }`}
            >
              {s.id}
            </text>

            {/* Scenario Status Dot */}
            <circle
              cx="44"
              cy={s.y}
              r={s.active ? 3.8 : 3}
              fill={s.active ? '#C85A32' : '#88A795'}
            />

            {/* Bezier Flow Curves towards Blind Comparison */}
            {s.active ? (
              // Active P04 Highlighted Path
              <path
                d={`M 48 ${s.y} L 120 ${s.y}`}
                stroke="#C85A32"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              // Other subtle flow curves converging gracefully into the comparison card area
              <path
                d={`M 48 ${s.y} C 90 ${s.y}, 110 83, 144 83`}
                stroke="#C6DDD1"
                strokeWidth="0.85"
                fill="none"
                opacity="0.8"
              />
            )}
          </g>
        ))}

        {/* ==============================================================
            STAGE 2: BLIND COMPARISON
            ============================================================== */}
        <text
          x="220"
          y="22"
          textAnchor="middle"
          className="font-mono text-[9px] font-bold fill-[#69716B] tracking-wider uppercase"
        >
          BLIND COMPARISON
        </text>

        {/* Outer Dashed Comparison Region */}
        <rect
          x="154"
          y="32"
          width="132"
          height="224"
          rx="12"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Model A Card */}
        <g transform="translate(168, 66)">
          <rect
            width="34"
            height="34"
            rx="8"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="1"
          />
          <text
            x="17"
            y="22"
            textAnchor="middle"
            className="font-sans font-bold text-sm fill-[#0F2E24]"
          >
            A
          </text>
          {/* Card Anchor Dot */}
          <circle cx="17" cy="34" r="1.5" fill="#0F2E24" />
        </g>

        {/* Comparison Slash */}
        <text
          x="220"
          y="87"
          textAnchor="middle"
          className="font-mono text-sm fill-[#94A3B8]"
        >
          /
        </text>

        {/* Model B Card */}
        <g transform="translate(238, 66)">
          <rect
            width="34"
            height="34"
            rx="8"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="1"
          />
          <text
            x="17"
            y="22"
            textAnchor="middle"
            className="font-sans font-bold text-sm fill-[#0F2E24]"
          >
            B
          </text>
          {/* Card Anchor Dot */}
          <circle cx="17" cy="34" r="1.5" fill="#0F2E24" />
        </g>

        {/* Convergence Lines below Cards to Human Evaluation */}
        <path
          d="M 185 102 C 185 120, 220 120, 220 134"
          stroke="#CBD5E1"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 255 102 C 255 120, 220 120, 220 134"
          stroke="#CBD5E1"
          strokeWidth="1"
          fill="none"
        />

        {/* Human Evaluation Node (3 interconnected nodes icon) */}
        <g transform="translate(220, 146)">
          {/* Connecting lines of the node */}
          <line x1="0" y1="-7" x2="-6" y2="4" stroke="#0F2E24" strokeWidth="1.2" />
          <line x1="0" y1="-7" x2="6" y2="4" stroke="#0F2E24" strokeWidth="1.2" />
          <line x1="-6" y1="4" x2="6" y2="4" stroke="#0F2E24" strokeWidth="1.2" />
          {/* 3 Nodes */}
          <circle cx="0" cy="-7" r="2.2" fill="#0F2E24" />
          <circle cx="-6" cy="4" r="2.2" fill="#0F2E24" />
          <circle cx="6" cy="4" r="2.2" fill="#0F2E24" />
        </g>

        {/* Label: HUMAN EVALUATION */}
        <text
          x="220"
          y="167"
          textAnchor="middle"
          className="font-mono text-[8.5px] font-bold fill-[#171A18] tracking-wider uppercase"
        >
          HUMAN
        </text>
        <text
          x="220"
          y="178"
          textAnchor="middle"
          className="font-mono text-[8.5px] font-bold fill-[#171A18] tracking-wider uppercase"
        >
          EVALUATION
        </text>

        {/* Line leading down to Pairwise Elo */}
        <line x1="220" y1="184" x2="220" y2="208" stroke="#CBD5E1" strokeWidth="1" />

        {/* PAIRWISE ELO Badge */}
        <g transform="translate(170, 208)">
          <rect
            width="100"
            height="26"
            rx="7"
            fill="#EAEFEA"
            stroke="#D1DDD5"
            strokeWidth="1"
          />
          {/* Mini Bar Chart Icon */}
          <g transform="translate(14, 8)">
            <rect x="0" y="6" width="2" height="4" rx="0.5" fill="#0F2E24" />
            <rect x="4" y="3" width="2" height="7" rx="0.5" fill="#0F2E24" />
            <rect x="8" y="0" width="2" height="10" rx="0.5" fill="#0F2E24" />
          </g>
          <text
            x="56"
            y="16.5"
            textAnchor="middle"
            className="font-mono text-[8.5px] font-bold fill-[#0F2E24] tracking-wider uppercase"
          >
            PAIRWISE ELO
          </text>
        </g>

        {/* ==============================================================
            STAGE 3: 3 EVALUATION AXES
            ============================================================== */}
        <text
          x="440"
          y="22"
          textAnchor="middle"
          className="font-mono text-[9px] font-bold fill-[#69716B] tracking-wider uppercase"
        >
          3 EVALUATION AXES
        </text>

        {/* Branch 1: Cultural Fidelity */}
        <path
          d="M 286 83 C 330 83, 350 56, 386 56"
          stroke="#C6DDD1"
          strokeWidth="1"
          fill="none"
        />
        <circle cx="392" cy="56" r="3.5" fill="#4E8F6F" />
        <text
          x="406"
          y="59.5"
          className="font-mono text-[9px] font-bold fill-[#171A18] tracking-wider uppercase"
        >
          CULTURAL FIDELITY
        </text>

        {/* Branch 2: Medical Accuracy */}
        <path
          d="M 286 83 C 330 83, 350 102, 386 102"
          stroke="#C6DDD1"
          strokeWidth="1"
          fill="none"
        />
        <circle cx="392" cy="102" r="3.5" fill="#88A795" />
        <text
          x="406"
          y="105.5"
          className="font-mono text-[9px] font-bold fill-[#171A18] tracking-wider uppercase"
        >
          MEDICAL ACCURACY
        </text>

        {/* Branch 3: Indic Typography */}
        <path
          d="M 286 83 C 330 83, 350 148, 386 148"
          stroke="#C85A32"
          strokeWidth="1"
          strokeDasharray="2 2"
          fill="none"
        />
        <circle cx="392" cy="148" r="3.5" fill="#C85A32" />
        <text
          x="406"
          y="151.5"
          className="font-mono text-[9px] font-bold fill-[#171A18] tracking-wider uppercase"
        >
          INDIC TYPOGRAPHY
        </text>
      </svg>
    </div>
  );
}
