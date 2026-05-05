import React from 'react';
import { Languages, Moon, Volume2 } from 'lucide-react';

export function SettingsPreferences() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">
      <h3 className="text-2xl font-avigea text-[#A3E635] uppercase tracking-wider">Idioma</h3>
      <div className="py-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex gap-6">
          <div className="w-12 h-12 bg-blue-400/10 flex items-center justify-center rounded-xl">
            <Languages className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h4 className="font-bold text-white text-lg">Idioma del Sistema</h4>
            <p className="text-sm text-zinc-500">Seleccioná tu lenguaje de preferencia.</p>
          </div>
        </div>
        <select className="bg-zinc-900 border border-white/10 text-white text-xs font-black p-3 rounded-lg focus:outline-none uppercase tracking-widest">
          <option>Español (Rioplatense)</option>
          <option>English</option>
          <option>Português</option>
        </select>
      </div>

      <h3 className="text-2xl font-avigea text-[#A3E635] uppercase tracking-wider mt-12">Interfaz</h3>
      <div className="grid gap-2">
        <div className="flex items-center justify-between py-6 border-b border-white/5">
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-[#A3E635]/10 flex items-center justify-center rounded-xl">
              <Moon className="w-6 h-6 text-[#A3E635]" />
            </div>
            <div>
              <h4 className="font-bold text-white text-lg">Modo Industrial Oscuro</h4>
              <p className="text-sm text-zinc-500">Activa la interfaz de alto contraste.</p>
            </div>
          </div>
          <div className="w-12 h-6 bg-[#A3E635] rounded-full p-1 flex justify-end">
            <div className="w-4 h-4 bg-black rounded-full" />
          </div>
        </div>

        <div className="flex items-center justify-between py-6 border-b border-white/5">
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-purple-400/10 flex items-center justify-center rounded-xl">
              <Volume2 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-lg">Efectos de Sonido</h4>
              <p className="text-sm text-zinc-500">Feedback auditivo en interacciones.</p>
            </div>
          </div>
          <div className="w-12 h-6 bg-zinc-900 rounded-full p-1 flex justify-start">
            <div className="w-4 h-4 bg-zinc-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
