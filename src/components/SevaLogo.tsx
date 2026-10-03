'use client';

import React from 'react';

interface JanChitraLogoProps {
  onClick?: () => void;
  showSubtitle?: boolean;
}

export function SevaLogo({ onClick, showSubtitle = true }: JanChitraLogoProps) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col cursor-pointer select-none py-0.5 shrink-0 group"
      title="JanChitra • Frontline Healthcare Visual AI Benchmark"
    >
      <div className="flex items-center space-x-1.5">
        <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-tight">
          Jan<span className="text-blue-600">Chitra</span>
        </span>
        <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 tracking-wider">
          BENCH
        </span>
      </div>

      {showSubtitle && (
        <p className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5 truncate hidden xs:block">
          Public Health Visual AI Benchmark
        </p>
      )}
    </div>
  );
}
