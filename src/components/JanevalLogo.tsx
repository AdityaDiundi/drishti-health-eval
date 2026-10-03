'use client';

import React from 'react';

interface JanevalLogoProps {
  onClick?: () => void;
  showSubtitle?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function JanevalLogo({
  onClick,
  showSubtitle = false,
  className = '',
  size = 'md',
}: JanevalLogoProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group transition-opacity hover:opacity-90 ${className}`}
      title="JANEVAL v1.0 • Frontier Vision AI Benchmark for Indian Public-Health Representation"
    >
      {/* Brand Geometric J Mark */}
      <div className="shrink-0 relative flex items-center justify-center">
        <svg
          viewBox="0 0 40 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isSm ? 'w-6 h-6.5' : isLg ? 'w-9 h-10' : 'w-7.5 h-8'}
        >
          {/* Top-Right Vertical Stem (Dark Forest Green) */}
          <rect
            x="22"
            y="3"
            width="12"
            height="21"
            rx="6"
            fill="#0F2E24"
          />
          {/* Bottom-Left Vertical / Curve (Dark Forest Green) */}
          <rect
            x="6"
            y="17"
            width="12"
            height="22"
            rx="6"
            fill="#0F2E24"
          />
          {/* Bottom-Right Terminal Circle (Sage Green Accent) */}
          <circle
            cx="28"
            cy="33"
            r="6"
            fill="#4E8F6F"
          />
        </svg>
      </div>

      {/* Wordmark and Version Badge */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-2">
          <span
            className={`font-extrabold tracking-tight text-[#0F2E24] font-sans ${
              isSm ? 'text-base' : isLg ? 'text-2xl' : 'text-lg sm:text-xl'
            }`}
          >
            JANEVAL
          </span>
          <span className="font-mono text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DDEBE3]/70 text-[#0F2E24] border border-[#C6DDD1] tracking-wider uppercase">
            v1.0
          </span>
        </div>

        {showSubtitle && (
          <p className="text-[11px] text-[#69716B] font-medium tracking-normal mt-1 truncate">
            Public-Health Vision Benchmark
          </p>
        )}
      </div>
    </div>
  );
}

// Re-export as SevaLogo for backwards compatibility
export const SevaLogo = JanevalLogo;
