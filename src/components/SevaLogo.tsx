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
  { script: 'सेवा', lang: 'Hindi / Sanskrit / Marathi', code: 'HI' },
  { script: 'சேவை', lang: 'Tamil', code: 'TA' },
  { script: 'సేవ', lang: 'Telugu', code: 'TE' },
  { script: 'সেবা', lang: 'Bengali / Assamese', code: 'BN' },
  { script: 'ಸೇವೆ', lang: 'Kannada', code: 'KN' },
  { script: 'സേവന', lang: 'Malayalam', code: 'ML' },
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

  // Rapid rotation when hovered
  useEffect(() => {
    if (isHovered) {
      intervalRef.current = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % SEVA_SCRIPTS.length);
          setIsFading(false);
        }, 120);
      }, 550);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Gentle idle transition every 4.5 seconds
      intervalRef.current = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % SEVA_SCRIPTS.length);
          setIsFading(false);
        }, 150);
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
      className="group flex items-center space-x-2.5 cursor-pointer select-none py-1"
      title={`Frontline Healthcare Service (${current.lang})`}
    >
      {/* Precision Icon Container - Material 3 Tonal Elevation */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 group-hover:bg-blue-700 transition-all duration-200">
        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform duration-200 group-hover:rotate-12" />
        {/* Subtle status indicator dot */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-200"></span>
      </div>

      {/* Typography & Morphing Script */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-1.5">
          {/* Animated Morphing Word: Seva */}
          <span
            className={`font-black text-lg sm:text-xl text-blue-600 tracking-tight transition-all duration-150 inline-block min-w-[50px] ${
              isFading ? 'opacity-30 translate-y-0.5 scale-95' : 'opacity-100 translate-y-0 scale-100'
            }`}
          >
            {current.script}
          </span>

          {/* Static Anchor: Eval */}
          <span className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight">
            Eval
          </span>

          {/* Micro Language Badge */}
          <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80 transition-opacity">
            {current.code}
          </span>
        </div>

        {showSubtitle && (
          <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium tracking-tight -mt-0.5 hidden xs:block">
            Frontline Health AI Benchmark
          </p>
        )}
      </div>
    </div>
  );
}
