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
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center text-gray-500 text-xs">
      Initializing Drishti-Health Evaluation Arena...
    </div>
  );
}
