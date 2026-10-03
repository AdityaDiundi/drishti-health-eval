'use client';

import React, { useState, useEffect, useRef } from 'react';

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

  // ONLY cycle through Indic scripts on hover; stop and reset to English on mouse leave
  useEffect(() => {
    if (isHovered) {
      // Start cycling from next script immediately upon hover
      setIndex(1);
      intervalRef.current = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setIndex((prev) => {
            const next = prev + 1;
            return next >= SEVA_SCRIPTS.length ? 1 : next;
          });
          setIsFading(false);
        }, 90);
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIndex(0); // Immediately reset to default English
      setIsFading(false);
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
      className="flex flex-col cursor-pointer select-none py-1 w-[130px] sm:w-[145px] shrink-0"
      title={isHovered ? `Indic Translation: ${current.lang}` : 'Seva-Eval • Frontline Health AI Benchmark'}
    >
      <div className="flex items-center">
        {/* Wordmark Lockup: Fixed width slot to eliminate any navbar shift */}
        <div className="w-[42px] sm:w-[46px] h-6 shrink-0 flex items-center justify-end overflow-hidden">
          <span
            className={`font-black text-lg sm:text-xl tracking-tight text-blue-600 transition-all duration-100 text-right whitespace-nowrap ${
              isFading ? 'opacity-20 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {current.script}
          </span>
        </div>

        {/* Static 'Eval' Anchor */}
        <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight ml-0.5 shrink-0">
          Eval
        </span>

        {/* Micro Language Indicator: Appears smoothly only on hover */}
        <span
          className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 ml-1.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0 transition-all duration-150 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
          }`}
        >
          {current.code}
        </span>
      </div>

      {showSubtitle && (
        <p className="text-[10px] text-slate-500 font-medium tracking-tight -mt-0.5 truncate hidden xs:block">
          {isHovered ? current.lang.split('/')[0].trim() : 'Health AI Benchmark'}
        </p>
      )}
    </div>
  );
}
