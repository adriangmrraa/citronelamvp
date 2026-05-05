import React from 'react';
import { User, Mail, ShieldCheck } from 'lucide-react';

export function SettingsAccount() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <h3 className="text-2xl font-avigea text-[#A3E635] uppercase tracking-wider">General</h3>
      <div className="grid gap-8">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-[#A3E635]/10 flex items-center justify-center rounded-xl">
            <User className="w-6 h-6 text-[#A3E635]" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Usuario</p>
            <p className="text-white font-bold text-xl">CitroUser_2026</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-[#A3E635]/10 flex items-center justify-center rounded-xl">
            <Mail className="w-6 h-6 text-[#A3E635]" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Email</p>
            <p className="text-white font-bold text-xl">user@citronela.app</p>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-avigea text-[#A3E635] uppercase tracking-wider mt-12">Seguridad</h3>
      <div className="flex items-center justify-between py-4 border-b border-white/5">
        <div className="flex gap-6">
          <div className="w-12 h-12 bg-amber-400/10 flex items-center justify-center rounded-xl">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h4 className="font-bold text-white text-lg">Autenticación de dos pasos</h4>
            <p className="text-sm text-zinc-500">Protegé tu cuenta con seguridad adicional.</p>
          </div>
        </div>
        <button className="px-6 py-2 bg-zinc-900 border border-white/10 hover:border-[#A3E635]/50 text-white text-[10px] font-black rounded-lg transition-all uppercase tracking-widest">
          Configurar
        </button>
      </div>
    </div>
  );
}
