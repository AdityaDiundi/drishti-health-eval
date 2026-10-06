'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EvidencePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/?tab=evidence');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F7F8F5] flex items-center justify-center text-[#69716B] text-xs font-mono">
      Loading JANEVAL Visual Evidence...
    </div>
  );
}
