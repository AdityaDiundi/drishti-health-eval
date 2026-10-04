'use client';

import React from 'react';

export function HeroArchitectureDiagram() {
  const scenarios = [
    { id: 'P01', y: 64, active: false },
    { id: 'P02', y: 84, active: false },
    { id: 'P03', y: 104, active: false },
    { id: 'P04', y: 124, active: true },
    { id: 'P05', y: 144, active: false },
    { id: 'P06', y: 164, active: false },
    { id: 'P07', y: 184, active: false },
    { id: 'P08', y: 204, active: false },
    { id: 'P09', y: 224, active: false },
    { id: 'P10', y: 244, active: false },
  ];

  return (
    <div className="w-full flex items-center justify-center select-none py-2">
      <svg
        viewBox="0 0 680 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[680px]"
      >
        {/* ==============================================================
            STAGE 1: 10 SCENARIOS (LEFT)
            ============================================================== */}
        {/* Section Header with rule */}
        <text
          x="20"
          y="36"
          className="font-mono text-[10px] font-bold fill-[#171A18] tracking-widest uppercase"
        >
          10 SCENARIOS
        </text>
        <line x1="108" y1="33" x2="204" y2="33" stroke="#D5E0D7" strokeWidth="0.85" />

        {/* P01 - P10 rows */}
        {scenarios.map((s) => (
          <g key={s.id}>
            {/* Scenario Label */}
            <text
              x="20"
              y={s.y + 3.5}
              className={`font-mono text-[9px] ${
                s.active ? 'font-bold fill-[#0F2E24]' : 'font-medium fill-[#69716B]'
              }`}
            >
              {s.id}
            </text>

            {/* Scenario Circle Dot */}
            <circle
              cx="62"
              cy={s.y}
              r={s.active ? 3.6 : 2.8}
              fill={s.active ? '#C85A32' : '#88A795'}
              opacity={s.active ? 1 : 0.85}
            />

            {/* Solid Horizontal Guideline */}
            <line
              x1="70"
              y1={s.y}
              x2="162"
              y2={s.y}
              stroke={s.active ? '#C85A32' : '#C6DDD1'}
              strokeWidth={s.active ? 1.4 : 0.75}
              opacity={s.active ? 0.95 : 0.65}
            />

            {/* Dotted Flow Curve Converging to Center Funnel Node at (238, 128) */}
            <path
              d={`M 162 ${s.y} C 196 ${s.y}, 216 128, 238 128`}
              stroke={s.active ? '#C85A32' : '#88A795'}
              strokeWidth={s.active ? 1.2 : 0.75}
              strokeDasharray={s.active ? '2 2' : '1.5 2'}
              fill="none"
              opacity={s.active ? 0.9 : 0.55}
            />
          </g>
        ))}

        {/* Funnel Input Node (Black Dot) */}
        <circle cx="238" cy="128" r="2.5" fill="#0F2E24" />
        <line
          x1="238"
          y1="128"
          x2="256"
          y2="128"
          stroke="#0F2E24"
          strokeWidth="0.85"
          strokeDasharray="1.5 2"
        />

        {/* ==============================================================
            STAGE 2: BLIND COMPARISON (CENTER)
            ============================================================== */}
        {/* Subtle Dashed Frame */}
        <path
          d="M 242 45 L 242 33 L 254 33 M 360 33 L 372 33 L 372 45"
          stroke="#D5E0D7"
          strokeWidth="0.75"
          strokeDasharray="2 2"
          fill="none"
        />
        <line
          x1="242"
          y1="45"
          x2="242"
          y2="225"
          stroke="#D5E0D7"
          strokeWidth="0.75"
          strokeDasharray="2 3"
        />
        <line
          x1="372"
          y1="45"
          x2="372"
          y2="225"
          stroke="#D5E0D7"
          strokeWidth="0.75"
          strokeDasharray="2 3"
        />

        {/* Section Header */}
        <text
          x="307"
          y="36"
          textAnchor="middle"
          className="font-mono text-[10px] font-bold fill-[#171A18] tracking-widest uppercase"
        >
          BLIND COMPARISON
        </text>

        {/* Card A */}
        <g transform="translate(256, 108)">
          <rect
            width="38"
            height="38"
            rx="8"
            fill="#FFFFFF"
            stroke="#7D9F8E"
            strokeWidth="1.1"
          />
          <text
            x="19"
            y="24"
            textAnchor="middle"
            className="font-sans font-bold text-sm fill-[#0F2E24]"
          >
            A
          </text>
          {/* Card Anchor Dot */}
          <circle cx="19" cy="38" r="1.6" fill="#0F2E24" />
        </g>

        {/* Comparison Slash */}
        <text
          x="307"
          y="133"
          textAnchor="middle"
          className="font-mono text-sm fill-[#69716B]"
        >
          /
        </text>

        {/* Card B */}
        <g transform="translate(320, 108)">
          <rect
            width="38"
            height="38"
            rx="8"
            fill="#FFFFFF"
            stroke="#7D9F8E"
            strokeWidth="1.1"
          />
          <text
            x="19"
            y="24"
            textAnchor="middle"
            className="font-sans font-bold text-sm fill-[#0F2E24]"
          >
            B
          </text>
          {/* Card Anchor Dot */}
          <circle cx="19" cy="38" r="1.6" fill="#0F2E24" />
        </g>

        {/* Flow Lines below Cards to Human Evaluation */}
        <path
          d="M 275 146 C 275 166, 307 166, 307 176"
          stroke="#7D9F8E"
          strokeWidth="0.85"
          fill="none"
        />
        <path
          d="M 339 146 C 339 166, 307 166, 307 176"
          stroke="#7D9F8E"
          strokeWidth="0.85"
          fill="none"
        />

        {/* Convergence Black Node */}
        <circle cx="307" cy="176" r="2.2" fill="#0F2E24" />

        {/* HUMAN EVALUATION Text */}
        <text
          x="307"
          y="193"
          textAnchor="middle"
          className="font-mono text-[8.5px] font-bold fill-[#171A18] tracking-widest uppercase"
        >
          HUMAN
        </text>
        <text
          x="307"
          y="203"
          textAnchor="middle"
          className="font-mono text-[8.5px] font-bold fill-[#171A18] tracking-widest uppercase"
        >
          EVALUATION
        </text>

        {/* Downward Arrow to Pairwise Elo */}
        <line x1="307" y1="210" x2="307" y2="231" stroke="#7D9F8E" strokeWidth="1" />
        <polyline
          points="304,228 307,232 310,228"
          stroke="#7D9F8E"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom Horizontal Guidelines with dots */}
        <line x1="20" y1="255" x2="246" y2="255" stroke="#D5E0D7" strokeWidth="0.7" strokeDasharray="1.5 3" />
        <circle cx="20" cy="255" r="1.2" fill="#94A3B8" />
        <circle cx="246" cy="255" r="1.5" fill="#0F2E24" />

        <line x1="368" y1="255" x2="650" y2="255" stroke="#D5E0D7" strokeWidth="0.7" strokeDasharray="1.5 3" />
        <circle cx="368" cy="255" r="1.5" fill="#0F2E24" />
        <circle cx="650" cy="255" r="1.2" fill="#94A3B8" />

        {/* PAIRWISE ELO Pill */}
        <g transform="translate(251, 241)">
          <rect
            width="112"
            height="28"
            rx="8"
            fill="#DEEAE2"
            stroke="#D1DDD5"
            strokeWidth="0.8"
          />
          {/* Mini Bar Chart Icon */}
          <g transform="translate(14, 8)">
            <rect x="0" y="6" width="2" height="5" rx="0.5" fill="#0F2E24" />
            <rect x="4" y="3" width="2" height="8" rx="0.5" fill="#0F2E24" />
            <rect x="8" y="0" width="2" height="11" rx="0.5" fill="#0F2E24" />
          </g>
          {/* Vertical Separator */}
          <line x1="33" y1="7" x2="33" y2="21" stroke="#BAC9C0" strokeWidth="0.85" />
          {/* Label */}
          <text
            x="70"
            y="17.5"
            textAnchor="middle"
            className="font-mono text-[9px] font-extrabold fill-[#0F2E24] tracking-wider uppercase"
          >
            PAIRWISE ELO
          </text>
        </g>

        {/* ==============================================================
            STAGE 3: VERIFY (3 DIMENSIONS) (RIGHT)
            ============================================================== */}
        {/* Section Header with rule */}
        <line x1="420" y1="33" x2="456" y2="33" stroke="#D5E0D7" strokeWidth="0.85" />
        <text
          x="466"
          y="36"
          className="font-mono text-[10px] font-bold fill-[#171A18] tracking-widest uppercase"
        >
          VERIFY (3 DIMENSIONS)
        </text>

        {/* Connector from Card B to Fan-out Node at (374, 128) */}
        <line
          x1="358"
          y1="128"
          x2="374"
          y2="128"
          stroke="#0F2E24"
          strokeWidth="0.85"
          strokeDasharray="1.5 2"
        />
        <circle cx="374" cy="128" r="2.5" fill="#0F2E24" />

        {/* Dimension 1: 01 CULTURAL FIDELITY */}
        <path
          d="M 374 128 C 400 128, 424 78, 460 78"
          stroke="#88A795"
          strokeWidth="0.75"
          strokeDasharray="1.5 2"
          fill="none"
          opacity="0.65"
        />
        <circle cx="466" cy="78" r="3.5" fill="#4E8F6F" />
        <text
          x="482"
          y="81.5"
          className="font-mono text-[9.5px] font-bold fill-[#4E8F6F]"
        >
          01
        </text>
        <text
          x="504"
          y="81.5"
          className="font-mono text-[9.5px] font-bold fill-[#0F2E24] tracking-wider uppercase"
        >
          CULTURAL FIDELITY
        </text>

        {/* Dimension 2: 02 MEDICAL ACCURACY */}
        <path
          d="M 374 128 L 460 128"
          stroke="#88A795"
          strokeWidth="0.75"
          strokeDasharray="1.5 2"
          fill="none"
          opacity="0.65"
        />
        <circle cx="466" cy="128" r="3.5" fill="#88A795" />
        <text
          x="482"
          y="131.5"
          className="font-mono text-[9.5px] font-bold fill-[#88A795]"
        >
          02
        </text>
        <text
          x="504"
          y="131.5"
          className="font-mono text-[9.5px] font-bold fill-[#0F2E24] tracking-wider uppercase"
        >
          MEDICAL ACCURACY
        </text>

        {/* Dimension 3: 03 INDIC TYPOGRAPHY */}
        <path
          d="M 374 128 C 400 128, 424 182, 460 182"
          stroke="#C85A32"
          strokeWidth="0.85"
          strokeDasharray="1.5 2"
          fill="none"
          opacity="0.8"
        />
        <circle cx="466" cy="182" r="3.5" fill="#C85A32" />
        <text
          x="482"
          y="185.5"
          className="font-mono text-[9.5px] font-bold fill-[#C85A32]"
        >
          03
        </text>
        <text
          x="504"
          y="185.5"
          className="font-mono text-[9.5px] font-bold fill-[#0F2E24] tracking-wider uppercase"
        >
          INDIC TYPOGRAPHY
        </text>
      </svg>
    </div>
  );
}
