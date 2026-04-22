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
    <Card className="border-2 border-green-500 dark:border-green-600">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
            <Ticket className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide mb-0.5">
              Reserva confirmada
            </p>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-snug">{eventTitle}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{categoryName}</p>
          </div>
        </div>

        {/* QR Code display */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">Código QR</p>
          {/* Simple QR text representation — in prod would use a QR library */}
          <div className="font-mono text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 break-all text-gray-700 dark:text-gray-300">
            {qrCode}
          </div>
          <p className="text-xs text-gray-400">Presentá este código al ingresar al evento</p>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
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
