'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EvalRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/?tab=arena');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
      Loading Drishti-Health Evaluation Arena...
    </div>
  );
}
