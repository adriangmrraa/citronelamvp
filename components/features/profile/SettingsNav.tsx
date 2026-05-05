'use client';

import React from 'react';

interface SettingsNavProps {
  activeSubTab: string;
  onSubTabChange: (tab: string) => void;
}

const SUB_TABS = [
  { id: 'cuenta', label: 'Cuenta' },
  { id: 'perfil', label: 'Perfil' },
  { id: 'privacidad', label: 'Privacidad' },
  { id: 'preferencias', label: 'Preferencias' },
  { id: 'notificaciones', label: 'Notificaciones' },
  { id: 'correo', label: 'Correo electrónico' },
];

export function SettingsNav({ activeSubTab, onSubTabChange }: SettingsNavProps) {
  return (
    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-white/5 mb-8">
      {SUB_TABS.map((tab) => {
        const isActive = activeSubTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSubTabChange(tab.id)}
            className={`py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative shrink-0 ${
              isActive ? 'text-[#A3E635]' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.label}
            {isActive && (
              <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[#A3E635] shadow-[0_0_8px_rgba(163,230,53,0.5)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
