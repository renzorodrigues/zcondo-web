'use client';

import { Suspense } from 'react';

export default function RegisterConfirmationLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">Carregando…</div>}>
      {children}
    </Suspense>
  );
}