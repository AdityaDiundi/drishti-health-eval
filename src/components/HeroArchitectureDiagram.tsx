'use client';

import React, { useState, useRef } from 'react';

export function HeroArchitectureDiagram() {
  const [activeScenario, setActiveScenario] = useState<string>('P04');
  const [mobileViewMode, setMobileViewMode] = useState<'fit' | 'pan'>('fit');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleToggleMode = (mode: 'fit' | 'pan') => {
    setMobileViewMode(mode);
    if (mode === 'pan') {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = 0;
        }
      }, 50);
    }
  };

  const scenarios = [
    { id: 'P01', label: 'ASHA Counseling', category: 'Attire & Community', y: 120 },
    { id: 'P02', label: 'PHC Interior', category: 'Infrastructure', y: 148 },
    { id: 'P03', label: 'MCP Card (Hindi)', category: 'Indic Typography', y: 176 },
    { id: 'P04', label: 'Growth Monitoring', category: 'Child Nutrition', y: 204 },
    { id: 'P05', label: 'Cold Chain Carrier', category: 'Immunization', y: 232 },
    { id: 'P06', label: 'IEC Wall Slogan', category: 'Public Messaging', y: 260 },
    { id: 'P07', label: 'Antenatal Checkup', category: 'Maternal Health', y: 288 },
    { id: 'P08', label: 'Doctor Prescription', category: 'Handwriting', y: 316 },
    { id: 'P09', label: 'Home Visit & KMC', category: 'Newborn Care', y: 344 },
    { id: 'P10', label: 'VHSND Village Day', category: 'Grassroots Assembly', y: 372 },
  ];

  const currentScenario = scenarios.find((s) => s.id === activeScenario) || scenarios[3];

  // Central convergence node coordinates
  const convergeX = 352;
  const convergeY = 204;

  return (
    <div className="w-full max-w-full overflow-hidden flex flex-col items-center justify-center select-none py-1 min-w-0">
      {/* Mobile-only View Mode Toggle Bar */}
      <div className="flex md:hidden items-center justify-between w-full mb-2 px-1">
        <span className="font-mono text-[10px] text-[#69716B] uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4E8F6F]"></span>
          Evaluation Architecture
        </span>
        <div className="flex items-center bg-[#F0F4F1] p-0.5 rounded-md border border-[#E3E7E2] text-[10px] font-mono">
          <button
            type="button"
            onClick={() => handleToggleMode('fit')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
              mobileViewMode === 'fit'
                ? 'bg-white font-bold text-[#0F2E24] shadow-2xs'
                : 'text-[#69716B] hover:text-[#0F2E24]'
            }`}
          >
            Fit View
          </button>
          <button
            type="button"
            onClick={() => handleToggleMode('pan')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 ${
              mobileViewMode === 'pan'
                ? 'bg-white font-bold text-[#0F2E24] shadow-2xs'
                : 'text-[#69716B] hover:text-[#0F2E24]'
            }`}
          >
            <span>Pan 100%</span>
            <span className="text-[9px] text-[#C05621]">⇄</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Container (Responsive: fits viewport or smoothly scrolls on mobile within its boundary) */}
      <div
        ref={scrollContainerRef}
        className={`w-full max-w-full ${
          mobileViewMode === 'pan'
            ? 'overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#CBD5E1] block touch-pan-x'
            : 'overflow-hidden flex justify-center'
        }`}
      >
        <div
          className={`${
            mobileViewMode === 'pan'
              ? 'min-w-[720px] w-max'
              : 'w-full flex items-center justify-center lg:justify-end min-w-0'
          }`}
        >
          <svg
            viewBox="16 55 860 345"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${
              mobileViewMode === 'pan'
                ? 'w-[780px] h-auto drop-shadow-2xs touch-manipulation'
                : 'w-full h-auto max-w-[820px] lg:max-w-none drop-shadow-2xs touch-manipulation'
            }`}
          >
            <defs>
              {/* Dot Grid pattern from 01_dot_grid.svg */}
              <pattern id="janeval-hero-grid" width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.15" fill="#4E8F6F" opacity="0.16" />
              </pattern>
            </defs>

            {/* Ambient Dot Grid Canvas */}
            <rect x="16" y="55" width="860" height="345" fill="url(#janeval-hero-grid)" />

            {/* ==============================================================
                STAGE 1: 10 SCENARIOS (LEFT)
                ============================================================== */}
            {/* Section Header with rule (04_scenario_list.svg) */}
            <text
              x="32"
              y="84"
              className="font-mono text-[11px] font-bold fill-[#0F2E24] tracking-widest uppercase"
            >
              10 SCENARIOS
            </text>
            <line x1="140" y1="80" x2="260" y2="80" stroke="#D5E0D7" strokeWidth="1" />

            {/* P01 - P10 scenario rows */}
            {scenarios.map((s) => {
              const isActive = activeScenario === s.id;
              return (
                <g
                  key={s.id}
                  className="cursor-pointer transition-opacity"
                  onMouseEnter={() => setActiveScenario(s.id)}
                  onClick={() => setActiveScenario(s.id)}
                  onTouchStart={() => setActiveScenario(s.id)}
                >
                  {/* Invisible expanded touch hit target for mobile fingers */}
                  <rect
                    x="20"
                    y={s.y - 13}
                    width="230"
                    height="26"
                    fill="transparent"
                    className="cursor-pointer"
                  />

                  {/* Scenario Label */}
                  <text
                    x="32"
                    y={s.y + 3.5}
                    className={`font-mono text-[11.5px] tracking-wider transition-colors select-none ${
                      isActive ? 'font-bold fill-[#0F2E24]' : 'font-medium fill-[#65736D]'
                    }`}
                  >
                    {s.id}
                  </text>

                  {/* Scenario Circle Dot */}
                  <circle
                    cx="80"
                    cy={s.y}
                    r={isActive ? 5.5 : 4.5}
                    fill={isActive ? '#C05621' : '#C5D8CF'}
                    className="transition-colors"
                  />

                  {/* Horizontal Guideline */}
                  <line
                    x1="94"
                    y1={s.y}
                    x2="210"
                    y2={s.y}
                    stroke={isActive ? '#C05621' : '#BFD0C8'}
                    strokeWidth={isActive ? 1.5 : 1}
                    className="transition-colors"
                  />

                  {/* Dotted Flow Curve Converging to Center Funnel Node at (352, 204) */}
                  <path
                    d={`M 210 ${s.y} C 275 ${s.y}, 305 ${convergeY}, ${convergeX} ${convergeY}`}
                    stroke={isActive ? '#C05621' : '#AFC7BC'}
                    strokeWidth={isActive ? 1.5 : 1.1}
                    strokeDasharray={isActive ? '2 2.5' : '1.5 2.5'}
                    fill="none"
                    opacity={isActive ? 1 : 0.65}
                    className="transition-opacity"
                  />
                </g>
              );
            })}

            {/* Funnel Input Node */}
            <circle cx={convergeX} cy={convergeY} r="3" fill="#0F2E24" />
            <line
              x1={convergeX}
              y1={convergeY}
              x2="378"
              y2={convergeY}
              stroke="#0F2E24"
              strokeWidth="1.1"
              strokeDasharray="2 2"
            />

            {/* ==============================================================
                STAGE 2: BLIND COMPARISON (CENTER)
                ============================================================== */}
            {/* Subtle Dashed Frame around center column */}
            <line x1="358" y1="80" x2="384" y2="80" stroke="#D5E0D7" strokeWidth="0.8" strokeDasharray="2 3" />
            <line x1="358" y1="80" x2="358" y2="92" stroke="#D5E0D7" strokeWidth="0.8" strokeDasharray="2 3" />
            <line x1="358" y1="96" x2="358" y2="350" stroke="#D5E0D7" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.6" />

            <line x1="520" y1="80" x2="546" y2="80" stroke="#D5E0D7" strokeWidth="0.8" strokeDasharray="2 3" />
            <line x1="546" y1="80" x2="546" y2="92" stroke="#D5E0D7" strokeWidth="0.8" strokeDasharray="2 3" />
            <line x1="546" y1="96" x2="546" y2="350" stroke="#D5E0D7" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.6" />

            {/* Section Header */}
            <text
              x="452"
              y="84"
              textAnchor="middle"
              className="font-mono text-[11px] font-bold fill-[#0F2E24] tracking-widest uppercase"
            >
              BLIND COMPARISON
            </text>

            {/* Node A (02_ab_nodes.svg) */}
            <g transform="translate(378, 175)">
              <rect
                width="48"
                height="58"
                rx="8"
                fill="#F7F8F5"
                stroke="#BFD0C8"
                strokeWidth="1.2"
              />
              <text
                x="24"
                y="37"
                textAnchor="middle"
                className="font-sans font-medium text-2xl fill-[#0F2E24]"
              >
                A
              </text>
              {/* Card Anchor Dot */}
              <circle cx="24" cy="58" r="2.5" fill="#0F2E24" />
            </g>

            {/* Comparison Slash */}
            <text
              x="452"
              y="211"
              textAnchor="middle"
              className="font-mono text-xl fill-[#65736D]"
            >
              /
            </text>

            {/* Node B (02_ab_nodes.svg) */}
            <g transform="translate(478, 175)">
              <rect
                width="48"
                height="58"
                rx="8"
                fill="#F7F8F5"
                stroke="#BFD0C8"
                strokeWidth="1.2"
              />
              <text
                x="24"
                y="37"
                textAnchor="middle"
                className="font-sans font-medium text-2xl fill-[#0F2E24]"
              >
                B
              </text>
              {/* Card Anchor Dot */}
              <circle cx="24" cy="58" r="2.5" fill="#0F2E24" />
            </g>

            {/* Flow Curves below Cards to Human Evaluation (02_ab_nodes.svg) */}
            <path
              d="M 402 233 C 402 265, 452 248, 452 278 C 452 248, 502 265, 502 233"
              stroke="#0F2E24"
              strokeWidth="1.2"
              fill="none"
            />

            {/* Convergence Black Node */}
            <circle cx="452" cy="278" r="3" fill="#0F2E24" />

            {/* HUMAN EVALUATION Text */}
            <text
              x="452"
              y="298"
              textAnchor="middle"
              className="font-mono text-[9.5px] font-bold fill-[#0F2E24] tracking-widest uppercase"
            >
              HUMAN
            </text>
            <text
              x="452"
              y="310"
              textAnchor="middle"
              className="font-mono text-[9.5px] font-bold fill-[#0F2E24] tracking-widest uppercase"
            >
              EVALUATION
            </text>

            {/* Downward Arrow to Pairwise Elo */}
            <line x1="452" y1="318" x2="452" y2="344" stroke="#AFC7BC" strokeWidth="1.2" />
            <polyline
              points="448,340 452,345 456,340"
              stroke="#AFC7BC"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Bottom Horizontal Guidelines with dots */}
            <line x1="60" y1="375" x2="368" y2="375" stroke="#AFC7BC" strokeWidth="0.8" strokeDasharray="2 4" />
            <circle cx="60" cy="375" r="1.5" fill="#8EADA0" />
            <circle cx="368" cy="375" r="2.2" fill="#0F2E24" />

            <line x1="536" y1="375" x2="860" y2="375" stroke="#AFC7BC" strokeWidth="0.8" strokeDasharray="2 4" />
            <circle cx="536" cy="375" r="2.2" fill="#0F2E24" />
            <circle cx="860" cy="375" r="1.5" fill="#8EADA0" />

            {/* PAIRWISE ELO Pill (05_pairwise_elo.svg) */}
            <g transform="translate(376, 356)">
              <rect
                width="152"
                height="38"
                rx="12"
                fill="#DDEBE3"
                stroke="#BFD0C8"
                strokeWidth="0.9"
              />
              {/* Mini Bar Chart Icon */}
              <g stroke="#0F2E24" strokeWidth="1.6" fill="none" strokeLinecap="round">
                <line x1="19" y1="26" x2="19" y2="18" />
                <line x1="24" y1="26" x2="24" y2="13" />
                <line x1="29" y1="26" x2="29" y2="20" />
                <line x1="34" y1="26" x2="34" y2="10" />
              </g>
              {/* Vertical Separator */}
              <line x1="45" y1="12" x2="45" y2="26" stroke="#AFC7BC" strokeWidth="1" />
              {/* Label */}
              <text
                x="57"
                y="23"
                className="font-mono text-[10px] font-bold fill-[#0F2E24] tracking-widest uppercase"
              >
                PAIRWISE ELO
              </text>
            </g>

            {/* ==============================================================
                STAGE 3: VERIFY (3 DIMENSIONS) (RIGHT)
                ============================================================== */}
            {/* Section Header with rule */}
            <line x1="612" y1="80" x2="674" y2="80" stroke="#D5E0D7" strokeWidth="1" />
            <text
              x="684"
              y="84"
              className="font-mono text-[11px] font-bold fill-[#0F2E24] tracking-widest uppercase"
            >
              VERIFY (3 DIMENSIONS)
            </text>

            {/* Connector from Node B to Fan-out Node at (550, 204) */}
            <line
              x1="526"
              y1={convergeY}
              x2="550"
              y2={convergeY}
              stroke="#0F2E24"
              strokeWidth="1.1"
              strokeDasharray="2 2"
            />
            <circle cx="550" cy={convergeY} r="3" fill="#0F2E24" />

            {/* Dimension 1: 01 CULTURAL FIDELITY (03_axis_markers.svg) */}
            <path
              d={`M 550 ${convergeY} C 590 ${convergeY}, 630 142, 674 142`}
              stroke="#AFC7BC"
              strokeWidth="1.1"
              strokeDasharray="2 3"
              fill="none"
              opacity="0.75"
            />
            <circle cx="678" cy="142" r="5" fill="#4E8F6F" />
            <text
              x="698"
              y="145.5"
              className="font-mono text-[10.5px] font-bold fill-[#4E8F6F]"
            >
              01
            </text>
            <text
              x="728"
              y="145.5"
              className="font-mono text-[10.5px] font-bold fill-[#0F2E24] tracking-wider uppercase"
            >
              CULTURAL FIDELITY
            </text>

            {/* Dimension 2: 02 MEDICAL ACCURACY (03_axis_markers.svg) */}
            <path
              d={`M 550 ${convergeY} L 674 ${convergeY}`}
              stroke="#AFC7BC"
              strokeWidth="1.1"
              strokeDasharray="2 3"
              fill="none"
              opacity="0.75"
            />
            <circle cx="678" cy={convergeY} r="5" fill="#8EADA0" />
            <text
              x="698"
              y="207.5"
              className="font-mono text-[10.5px] font-bold fill-[#8EADA0]"
            >
              02
            </text>
            <text
              x="728"
              y="207.5"
              className="font-mono text-[10.5px] font-bold fill-[#0F2E24] tracking-wider uppercase"
            >
              MEDICAL ACCURACY
            </text>

            {/* Dimension 3: 03 INDIC TYPOGRAPHY (03_axis_markers.svg) */}
            <path
              d={`M 550 ${convergeY} C 590 ${convergeY}, 630 268, 674 268`}
              stroke="#C05621"
              strokeWidth="1.2"
              strokeDasharray="2 3"
              fill="none"
              opacity="0.85"
            />
            <circle cx="678" cy="268" r="5" fill="#C05621" />
            <text
              x="698"
              y="271.5"
              className="font-mono text-[10.5px] font-bold fill-[#C05621]"
            >
              03
            </text>
            <text
              x="728"
              y="271.5"
              className="font-mono text-[10.5px] font-bold fill-[#0F2E24] tracking-wider uppercase"
            >
              INDIC TYPOGRAPHY
            </text>
          </svg>
        </div>
      </div>

      {/* Interactive Scenario Status Strip */}
      <div className="w-full mt-2.5 pt-2 border-t border-[#E3E7E2]/70 flex items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="px-1.5 py-0.5 rounded bg-[#C05621]/10 text-[#C05621] font-bold text-[10.5px]">
            {currentScenario.id}
          </span>
          <span className="font-semibold text-[#0F2E24] text-[11px]">
            {currentScenario.label}
          </span>
          <span className="text-[#69716B] text-[10px] hidden sm:inline">
            · {currentScenario.category}
          </span>
        </div>
        <div className="text-[10px] text-[#69716B] hidden sm:block">
          Hover or tap P01–P10 to trace pipeline
        </div>
        <div className="text-[10px] text-[#C05621] sm:hidden font-medium">
          {mobileViewMode === 'pan' ? '⇄ Swipe to explore' : 'Tap P01–P10 to trace'}
        </div>
      </div>
    </div>
  );
}
