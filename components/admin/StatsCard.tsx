'use client';

import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  trend?: number;
}

export default function StatsCard({ title, value, icon: Icon, color = 'text-lime-400', trend }: StatsCardProps) {
  const bgColor = color.includes('blue')
    ? 'bg-blue-400/10'
    : color.includes('amber') || color.includes('yellow')
    ? 'bg-amber-400/10'
    : color.includes('red')
    ? 'bg-red-400/10'
    : color.includes('purple')
    ? 'bg-purple-400/10'
    : color.includes('orange')
    ? 'bg-orange-400/10'
    : 'bg-lime-400/10';

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-white/[0.06]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-500 mb-1 truncate">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trend >= 0 ? 'text-lime-400' : 'text-red-400'}`}>
                {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{trend >= 0 ? '+' : ''}{trend}%</span>
              </div>
            )}
          </div>
          <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center ml-3 shrink-0`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
