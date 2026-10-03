'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';

interface ScriptItem {
  script: string;
  lang: string;
  code: string;
}

const SEVA_SCRIPTS: ScriptItem[] = [
  { script: 'Seva', lang: 'English', code: 'EN' },
  { script: 'सेवा', lang: 'Hindi / Marathi', code: 'HI' },
  { script: 'சேவை', lang: 'Tamil', code: 'TA' },
  { script: 'సేవ', lang: 'Telugu', code: 'TE' },
  { script: 'সেবা', lang: 'Bengali / Assamese', code: 'BN' },
  { script: 'ಸೇವೆ', lang: 'Kannada', code: 'KN' },
  { script: 'സേവ', lang: 'Malayalam', code: 'ML' },
  { script: 'સેવા', lang: 'Gujarati', code: 'GU' },
  { script: 'ਸੇਵਾ', lang: 'Punjabi', code: 'PA' },
  { script: 'ସେବା', lang: 'Odia', code: 'OR' },
];

interface SevaLogoProps {
  onClick?: () => void;
  showSubtitle?: boolean;
}

export function SevaLogo({ onClick, showSubtitle = true }: SevaLogoProps) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fast smooth rotation when hovered
  useEffect(() => {
    if (isHovered) {
      intervalRef.current = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % SEVA_SCRIPTS.length);
          setIsFading(false);
        }, 100);
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % SEVA_SCRIPTS.length);
          setIsFading(false);
        }, 120);
      }, 4500);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered]);

  const current = SEVA_SCRIPTS[index];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex items-center space-x-2.5 cursor-pointer select-none py-1 w-[165px] sm:w-[175px] shrink-0"
      title={`Frontline Healthcare Service (${current.lang})`}
    >
      {/* Precision Icon Container - Disciplined Architectural Radius */}
      <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-600 transition-colors duration-150">
        <Activity className="w-4 h-4 text-white" />
      </div>

      {/* Typography: Tightly Locked with Zero Layout Shift */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center">
          {/* Fixed-Width Script Slot: Right-aligned flush to 'Eval' */}
          <div className="w-[44px] sm:w-[48px] h-5 sm:h-6 shrink-0 flex items-center justify-end overflow-hidden">
            <span
              className={`font-black text-base sm:text-lg text-blue-600 tracking-tight transition-all duration-120 whitespace-nowrap text-right ${
                isFading ? 'opacity-20 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              {current.script}
            </span>
          </div>

          {/* Static Anchor: Eval - Completely Stationary */}
          <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight ml-0.5 shrink-0">
            Eval
          </span>

          {/* Micro Language Badge - Fixed Slot */}
          <span className="font-mono text-[9px] uppercase font-bold w-[20px] text-center ml-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
            {current.code}
          </span>
        </div>

        {showSubtitle && (
          <p className="text-[10px] text-slate-500 font-medium tracking-tight -mt-0.5 truncate hidden xs:block">
            Health AI Benchmark
          </p>
        )}
      </div>
    </div>
  );
}
