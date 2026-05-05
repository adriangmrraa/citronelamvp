'use client';

import React from 'react';
import { Wallet, Plus, Minus, Award, ShieldCheck } from 'lucide-react';

interface ProfileWalletProps {
  user: any;
}

export default function ProfileWallet({ user }: ProfileWalletProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wallet size={120} className="text-lime-400" />
            </div>
            
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">Balance Citronela</p>
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-6xl md:text-8xl font-black text-white tracking-tighter">
                {user.tokens.toLocaleString()}
              </span>
              <span className="text-xl md:text-2xl font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
            </div>
            
            <div className="flex gap-4">
              <button className="bg-lime-400 text-[#07120b] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-lime-300 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                Cargar Tokens
              </button>
              <button className="bg-white/5 text-white border border-white/10 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                Enviar a un Amigo
              </button>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">Historial de Movimientos</p>
            <div className="space-y-3">
              {(user.history || []).map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.amount > 0 ? 'bg-lime-400/10 text-lime-400' : 'bg-rose-400/10 text-rose-400'}`}>
                      {tx.amount > 0 ? <Plus size={20} /> : <Minus size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-white uppercase tracking-tight">{tx.description}</p>
                        <span className="text-[9px] font-black text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded uppercase tracking-widest">{tx.id}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{new Date(tx.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <p className={`text-xl font-black tracking-tighter ${tx.amount > 0 ? 'text-white' : 'text-zinc-400'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                    <span className="ml-2 text-[10px] font-black text-[#A3E635] uppercase tracking-tight">TOKENS</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-lime-400/[0.03] border border-lime-400/10 rounded-[2.5rem] p-8">
            <Award className="text-lime-400 mb-4" size={32} />
            <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Beneficios Premium</h4>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">Como miembro verificado, tenés acceso a descuentos exclusivos en el Market y preventa de eventos.</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black text-lime-400 uppercase tracking-widest">
                <ShieldCheck size={14} /> 10% OFF en Genéticas
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-lime-400 uppercase tracking-widest">
                <ShieldCheck size={14} /> Envío gratis en Citromarket
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
