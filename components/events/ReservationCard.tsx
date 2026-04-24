'use client';

import { Calendar, Ticket, Hash } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReservationCardProps {
  eventTitle: string;
  categoryName: string;
  qrCode: string;
  reservedAt: string;
}

export default function ReservationCard({
  eventTitle,
  categoryName,
  qrCode,
  reservedAt,
}: ReservationCardProps) {
  const formattedDate = new Date(reservedAt).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="border-2 border-lime-400/40">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-lime-400/10 flex items-center justify-center shrink-0">
            <Ticket className="w-5 h-5 text-lime-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-lime-400 uppercase tracking-wide mb-0.5">
              Reserva confirmada
            </p>
            <h3 className="font-bold text-zinc-100 leading-snug">{eventTitle}</h3>
            <p className="text-sm text-zinc-400 mt-0.5">{categoryName}</p>
          </div>
        </div>

        {/* QR Code display */}
        <div className="bg-white/[0.04] rounded-xl p-4 text-center space-y-2">
          <p className="text-xs text-zinc-500">Código QR</p>
          <div className="font-mono text-xs bg-white/[0.03] border border-white/[0.08] rounded-lg p-3 break-all text-zinc-300">
            {qrCode}
          </div>
          <p className="text-xs text-zinc-600">Presentá este código al ingresar al evento</p>
        </div>

        <div className="flex items-center gap-4 text-xs text-zinc-500 border-t border-white/[0.08] pt-3">
          <div className="flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5" />
            <span className="font-mono">{qrCode.slice(0, 8)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Reservado el {formattedDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
