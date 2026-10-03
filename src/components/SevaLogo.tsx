'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ScriptItem {
  script: string;
  lang: string;
}

const SEVA_SCRIPTS: ScriptItem[] = [
  { script: 'Seva', lang: 'English' },
  { script: 'सेवा', lang: 'Hindi / Marathi' },
  { script: 'சேவை', lang: 'Tamil' },
  { script: 'సేవ', lang: 'Telugu' },
  { script: 'সেবা', lang: 'Bengali' },
  { script: 'ಸೇವೆ', lang: 'Kannada' },
  { script: 'സേവ', lang: 'Malayalam' },
  { script: 'સેવા', lang: 'Gujarati' },
  { script: 'ਸੇਵਾ', lang: 'Punjabi' },
  { script: 'ସେବା', lang: 'Odia' },
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
      setIndex(1); // Start with Hindi immediately on hover
      intervalRef.current = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setIndex((prev) => {
            const next = prev + 1;
            return next >= SEVA_SCRIPTS.length ? 1 : next;
          });
          setIsFading(false);
        }, 80);
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
      className="flex flex-col cursor-pointer select-none py-1 shrink-0"
      title={isHovered ? `Language: ${current.lang}` : 'SevaEval • Frontline Health AI Benchmark'}
    >
      <div className="flex items-center text-lg sm:text-xl leading-none">
        {/* Animated Morphing Word: Seva (No overflow clipping, full glyph display) */}
        <span
          className={`font-black tracking-tight text-blue-600 transition-opacity duration-100 ${
            isFading ? 'opacity-20' : 'opacity-100'
          }`}
        >
          {current.script}
        </span>

        {/* Static 'Eval' Anchor */}
        <span className="font-extrabold text-slate-900 tracking-tight">
          Eval
        </span>
      </div>

      {showSubtitle && (
        <p className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5 truncate hidden xs:block">
          {isHovered ? current.lang.split('/')[0].trim() : 'Health AI Benchmark'}
        </p>
      )}
    </div>
  );
}
