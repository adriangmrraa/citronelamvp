'use client';

import { Users, Clock, ShieldCheck, Sprout, ShoppingBag, Coins, MessageSquare, CalendarDays } from 'lucide-react';
import StatsCard from './StatsCard';

interface KpiStats {
  totalUsuarios?: number;
  pendientes?: number;
  tasaVerificacion?: number;
  totalParcelas?: number;
  ordenes?: number;
  tokensCirculacion?: number;
  postsSemana?: number;
  eventos?: number;
}

interface KpiGridProps {
  stats: KpiStats;
}

export default function KpiGrid({ stats }: KpiGridProps) {
  const cards = [
    {
      title: 'Total Usuarios',
      value: stats.totalUsuarios ?? '—',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Pendientes',
      value: stats.pendientes ?? '—',
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Tasa Verificación',
      value: stats.tasaVerificacion !== undefined ? `${stats.tasaVerificacion}%` : '—',
      icon: ShieldCheck,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Total Parcelas',
      value: stats.totalParcelas ?? '—',
      icon: Sprout,
      color: 'text-green-700 dark:text-green-300',
    },
    {
      title: 'Órdenes',
      value: stats.ordenes ?? '—',
      icon: ShoppingBag,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Tokens en Circulación',
      value: stats.tokensCirculacion ?? '—',
      icon: Coins,
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Posts esta Semana',
      value: stats.postsSemana ?? '—',
      icon: MessageSquare,
      color: 'text-blue-500 dark:text-blue-300',
    },
    {
      title: 'Eventos',
      value: stats.eventos ?? '—',
      icon: CalendarDays,
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatsCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
        />
      ))}
    </div>
  );
}
