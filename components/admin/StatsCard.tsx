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

export default function StatsCard({ title, value, icon: Icon, color = 'text-green-600 dark:text-green-400', trend }: StatsCardProps) {
  const bgColor = color.includes('blue')
    ? 'bg-blue-50 dark:bg-blue-900/20'
    : color.includes('amber') || color.includes('yellow')
    ? 'bg-amber-50 dark:bg-amber-900/20'
    : color.includes('red')
    ? 'bg-red-50 dark:bg-red-900/20'
    : color.includes('purple')
    ? 'bg-purple-50 dark:bg-purple-900/20'
    : color.includes('orange')
    ? 'bg-orange-50 dark:bg-orange-900/20'
    : 'bg-green-50 dark:bg-green-900/20';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 truncate">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
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
