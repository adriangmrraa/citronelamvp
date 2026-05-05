'use client';

import React from 'react';
import { UserSettings } from '@/types/profile';

interface SettingsGridProps {
  settings: UserSettings;
  onUpdate: (newSettings: Partial<UserSettings>) => void;
}

export function SettingsGrid({ settings, onUpdate }: SettingsGridProps) {
  const options = [
    { 
      id: 'notifications', 
      label: 'Notificaciones', 
      icon: 'notifications', 
      value: settings.notifications,
      description: 'Alertas de cultivo y eventos'
    },
    { 
      id: 'darkMode', 
      label: 'Modo Oscuro', 
      icon: 'dark_mode', 
      value: settings.darkMode,
      description: 'Interfaz ciber-industrial'
    },
    { 
      id: 'newsletter', 
      label: 'Newsletter', 
      icon: 'mail', 
      value: settings.newsletter,
      description: 'Novedades de la comunidad'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onUpdate({ [option.id]: !option.value } as any)}
          className="flex flex-col gap-4 p-6 rounded-[2rem] bg-zinc-900/40 border border-white/5 hover:border-[#A3E635]/20 transition-all text-left group"
        >
          <div className="flex justify-between items-center w-full">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-black/40 group-hover:bg-[#A3E635]/10 transition-colors`}>
              <span className={`material-symbols-outlined text-[24px] ${option.value ? 'text-[#A3E635]' : 'text-zinc-500'}`}>
                {option.icon}
              </span>
            </div>
            {/* Toggle Switch UI */}
            <div className={`w-10 h-5 rounded-full relative transition-colors ${option.value ? 'bg-[#A3E635]' : 'bg-zinc-800'}`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${option.value ? 'right-1' : 'left-1'}`} />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-white mb-1">{option.label}</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">{option.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
