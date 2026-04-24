'use client';

import { useRouter } from 'next/navigation';
import { Sprout, ChevronRight } from 'lucide-react';
import type { Crop } from '@/db/schema';

interface CropCardProps {
  crop: Crop;
  logCount?: number;
}

const STATUS_STYLES: Record<string, string> = {
  Verde: 'bg-lime-400/10 text-lime-400 border border-lime-400/20',
  Amarillo: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  Rojo: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

const ACTIVE_STATUSES = new Set(['Verde', 'growing', 'active', 'Activo', 'Creciendo']);

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

  const status = crop.status ?? 'Verde';
  const statusStyle = ACTIVE_STATUSES.has(status)
    ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20'
    : (STATUS_STYLES[status] ?? 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20');

  return (
    <div
      onClick={() => router.push(`/cultivo/${crop.id}`)}
      className="group rounded-2xl glass-surface transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/[0.20] hover:shadow-lg hover:shadow-lime-400/[0.05] p-5 cursor-pointer overflow-hidden"
    >
      {/* Image or placeholder */}
      {crop.imageUrl ? (
        <div className="w-full h-32 mb-4 rounded-xl overflow-hidden">
          <img
            src={crop.imageUrl}
            alt={crop.bucketName}
            className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="w-full h-32 mb-4 rounded-xl bg-gradient-to-br from-lime-400/10 to-green-500/10 flex items-center justify-center">
          <Sprout className="w-8 h-8 text-lime-400/40" />
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-zinc-50 text-base leading-tight">
          {crop.bucketName}
        </h3>
        <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle}`}>
          {status}
        </span>
      </div>

      <div className="space-y-1.5 text-sm text-zinc-400">
        <p className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-lime-400/60"></span>
          {METHOD_LABELS[crop.cultivationMethod ?? 'Organico']}
        </p>
        <p>{logCount} {logCount === 1 ? 'registro' : 'registros'}</p>
        <p className="text-xs text-zinc-500">Creado {formatDate(crop.createdAt)}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-xs font-medium text-lime-400 group-hover:underline">
          Ver detalle
        </span>
        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-lime-400 transition-colors" />
      </div>
    </div>
  );
}
