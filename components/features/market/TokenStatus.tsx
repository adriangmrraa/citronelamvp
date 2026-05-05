'use client';

import React from 'react';
import { Wallet } from 'lucide-react';

import { useUser } from '@/hooks/useUser';

interface TokenStatusProps {
  price: number;
}

export default function TokenStatus({ price }: TokenStatusProps) {
  const { user } = useUser();
  const userBalance = user.tokens;
  const remaining = userBalance - price;
  const isInsufficient = remaining < 0;

  return (
    <div className="space-y-6 py-2">
      {/* User Balance */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 text-zinc-500">
          <Wallet className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-wider">Tu Saldo</span>
        </div>
        <p className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-white tracking-tighter">{userBalance.toLocaleString()}</span>
          <span className="text-xs font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
        </p>
      </div>

      {/* Remaining/Required */}
      <div className="flex items-center justify-between pb-2">
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">
          {isInsufficient ? 'TOKENS FALTANTES' : 'TOKENS RESTANTES'}
        </p>
        <p className="flex items-baseline gap-1">
          <span className={`text-3xl font-black tracking-tighter ${isInsufficient ? 'text-red-500' : 'text-white'}`}>
            {Math.abs(remaining).toLocaleString()}
          </span>
          <span className={`text-xs font-black uppercase tracking-tight ${isInsufficient ? 'text-red-500/80' : 'text-[#A3E635]'}`}>TOKENS</span>
        </p>
      </div>
    </div>
  );
}
