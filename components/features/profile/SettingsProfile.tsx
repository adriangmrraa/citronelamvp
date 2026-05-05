import React from 'react';
import { Camera, AtSign, Globe } from 'lucide-react';

export function SettingsProfile() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">
      <h3 className="text-2xl font-avigea text-[#A3E635] uppercase tracking-wider">Mi Perfil</h3>
      
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="relative group">
          <div className="w-40 h-40 rounded-3xl bg-zinc-900 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden hover:border-[#A3E635]/30 transition-all">
            <Camera className="w-10 h-10 text-zinc-700 group-hover:text-[#A3E635] transition-colors" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#A3E635] rounded-xl flex items-center justify-center cursor-pointer shadow-xl shadow-black/50 hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-black text-lg">edit</span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-8">
          <div className="border-b border-white/5 pb-4">
            <label className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] block mb-3">Nombre Público</label>
            <input 
              type="text" 
              defaultValue="CitroUser"
              className="w-full bg-transparent text-white font-bold text-xl focus:outline-none focus:text-[#A3E635] transition-colors"
            />
          </div>
          <div className="border-b border-white/5 pb-4">
            <label className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] block mb-3">Biografía</label>
            <textarea 
              rows={3}
              placeholder="Contanos algo sobre vos..."
              className="w-full bg-transparent text-zinc-300 font-medium text-lg focus:outline-none focus:text-white transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-avigea text-[#A3E635] uppercase tracking-wider mt-8">Redes Sociales</h3>
        <div className="grid gap-6">
          <div className="flex items-center gap-4 py-4 border-b border-white/5">
            <AtSign className="w-6 h-6 text-zinc-600" />
            <input type="text" placeholder="Twitter / X" className="bg-transparent border-none text-white w-full focus:outline-none font-bold" />
          </div>
          <div className="flex items-center gap-4 py-4 border-b border-white/5">
            <Globe className="w-6 h-6 text-zinc-600" />
            <input type="text" placeholder="Sitio Web / Portfolio" className="bg-transparent border-none text-white w-full focus:outline-none font-bold" />
          </div>
        </div>
      </div>
    </div>
  );
}
