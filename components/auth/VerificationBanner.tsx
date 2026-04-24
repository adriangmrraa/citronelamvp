'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function VerificationBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-full bg-amber-400/10 border border-amber-400/20 rounded-lg p-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-sm text-amber-300">
          <span className="font-semibold">Cuenta pendiente de aprobación.</span>{' '}
          Tu cuenta está siendo revisada por un administrador. Te notificaremos cuando esté aprobada.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 text-amber-400 hover:text-amber-200 transition-colors"
        aria-label="Cerrar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
