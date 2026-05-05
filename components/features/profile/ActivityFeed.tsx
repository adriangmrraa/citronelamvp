'use client';

import React from 'react';
import { ProfileActivity } from '@/types/profile';
import { ShoppingCart, MessageSquare, PartyPopper, Coins, History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface ActivityFeedProps {
  activities: ProfileActivity[];
  variant?: 'default' | 'minimal';
}

export function ActivityFeed({ activities, variant = 'default' }: ActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'purchase': return ShoppingCart;
      case 'post': return MessageSquare;
      case 'event': return PartyPopper;
      case 'token_earn': 
      case 'token_buy': return Coins;
      default: return History;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'text-amber-400';
      case 'post': return 'text-blue-400';
      case 'event': return 'text-purple-400';
      case 'token_earn':
      case 'token_buy': return 'text-[#A3E635]';
      default: return 'text-zinc-400';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
        <History className="w-12 h-12 text-zinc-500" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Historial Vacío</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = getIcon(activity.type);
        const isPositive = activity.amount?.includes('+');
        
        return (
          <div 
            key={activity.id} 
            className="flex items-center gap-4 py-6 transition-all group border-b border-white/5 last:border-0 rounded-none bg-transparent"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors shrink-0`}>
              <Icon className={`w-5 h-5 ${getIconColor(activity.type)}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black text-white uppercase tracking-tight leading-tight mb-0.5">{activity.title}</h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider leading-none">{activity.description}</p>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-zinc-600 font-black mb-1">{activity.date}</p>
              {activity.amount && (
                <div className="flex items-center justify-end gap-1.5">
                  <span className={`text-xs font-black ${isPositive ? 'text-[#A3E635]' : 'text-white'}`}>
                    {activity.amount.split(' ')[0]}
                  </span>
                  <span className="text-zinc-500 text-[8px] font-black uppercase tracking-tight">TOKENS</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
