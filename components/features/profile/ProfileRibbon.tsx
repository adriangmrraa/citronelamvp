'use client';

import React from 'react';

interface ProfileRibbonProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'stats', label: 'Dashboard', icon: 'dashboard' },
  { id: 'wallet', label: 'Wallet', icon: 'account_balance_wallet' },
  { id: 'activity', label: 'Actividad', icon: 'history' },
  { id: 'settings', label: 'Ajustes', icon: 'settings' },
];

export function ProfileRibbon({ activeTab, onTabChange }: ProfileRibbonProps) {
  return (
    <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex items-center gap-2 py-4 relative group shrink-0"
          >
            <span className={`material-symbols-outlined text-[20px] transition-colors ${
              isActive ? 'text-[#07120b]' : 'text-[#07120b]/50 group-hover:text-[#07120b]'
            }`}>
              {tab.icon}
            </span>
            <span className={`text-sm font-black uppercase tracking-widest transition-colors ${
              isActive ? 'text-[#07120b]' : 'text-[#07120b]/50 group-hover:text-[#07120b]'
            }`}>
              {tab.label}
            </span>
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#07120b]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
