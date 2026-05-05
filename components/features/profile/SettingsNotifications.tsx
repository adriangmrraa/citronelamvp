import React from 'react';
import { Hammer } from 'lucide-react';

export function SettingsNotifications() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-12 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-28 h-28 bg-[#A3E635]/10 rounded-full flex items-center justify-center border border-[#A3E635]/20 shadow-[0_0_50px_-12px_rgba(163,230,53,0.3)]">
        <Hammer className="w-12 h-12 text-[#A3E635]" />
      </div>
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-avigea text-[#A3E635] uppercase tracking-wider">Página en mantenimiento</h3>
        <p className="text-zinc-500 max-w-md mx-auto font-medium text-lg leading-relaxed">
          Estamos reconstruyendo el sistema de notificaciones para que sea funcional desde la barra de navegación.
        </p>
      </div>
      <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse delay-75" />
        <div className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse delay-150" />
      </div>
    </div>
  );
}
