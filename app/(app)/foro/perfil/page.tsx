'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ForoPerfilRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/profile?tab=foro');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07120b]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-lime-400 uppercase tracking-[0.3em]">Redireccionando al Centro de Control...</p>
      </div>
    </div>
  );
}
