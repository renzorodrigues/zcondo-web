'use client';

import { Suspense } from 'react';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">Carregando…</div>}>
      {children}
    </Suspense>
  );
}