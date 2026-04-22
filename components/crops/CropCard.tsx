'use client';

import { useRouter } from 'next/navigation';
import type { Crop } from '@/db/schema';

interface CropCardProps {
  crop: Crop;
  logCount?: number;
}

const STATUS_STYLES: Record<string, string> = {
  Verde: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Amarillo: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Rojo: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const METHOD_LABELS: Record<string, string> = {
  Hidroponia: 'Hidroponia',
  Organico: 'Orgánico',
  SalesMinerales: 'Sales Minerales',
  Mixto: 'Mixto',
};

function formatDate(date: Date | string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function CropCard({ crop, logCount = 0 }: CropCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/cultivo/${crop.id}`)}
      className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:shadow-gray-100 dark:hover:shadow-gray-900/50 hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image placeholder or actual image */}
      {crop.imageUrl ? (
        <div className="w-full h-32 mb-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={crop.imageUrl}
            alt={crop.bucketName}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-32 mb-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
          <svg className="w-12 h-12 text-green-400 dark:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1m20 0h1M4.22 19.778l.707-.707M18.364 5.636l.707-.707" />
            <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
          </svg>
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-tight">
          {crop.bucketName}
        </h3>
        <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[crop.status ?? 'Verde']}`}>
          {crop.status ?? 'Verde'}
        </span>
      </div>

      <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
        <p className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#16A34A]"></span>
          {METHOD_LABELS[crop.cultivationMethod ?? 'Organico']}
        </p>
        <p>{logCount} {logCount === 1 ? 'registro' : 'registros'}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Creado {formatDate(crop.createdAt)}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <span className="text-xs font-medium text-[#16A34A] group-hover:underline">
          Ver detalle
        </span>
        <svg className="w-4 h-4 text-gray-400 group-hover:text-[#16A34A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
