'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EvalRedirect() {
  const router = useRouter();

  useEffect(() => {
    // When opening /eval directly, always prompt for participant consent for this evaluation run
    router.replace('/?tab=arena&forceConsent=true');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F7F8F5] flex items-center justify-center text-[#69716B] text-xs font-mono">
      Initializing JANEVAL Evaluation Arena...
    </div>
  );
}
