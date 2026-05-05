import React from 'react';
import { Shield, Lock, EyeOff } from 'lucide-react';

export function SettingsPrivacy() {
  const privacyOptions = [
    {
      title: 'Perfil Público',
      description: 'Permitir que otros vean tu actividad y estadísticas.',
      icon: <EyeOff className="w-5 h-5 text-[#A3E635]" />,
      enabled: true
    },
    {
      title: 'Mostrar Tokens',
      description: 'Exhibir tu saldo de tokens en el ranking público.',
      icon: <Shield className="w-5 h-5 text-[#A3E635]" />,
      enabled: false
    },
    {
      title: 'Mensajes Directos',
      description: 'Solo usuarios seguidos pueden enviarte mensajes.',
      icon: <Lock className="w-5 h-5 text-[#A3E635]" />,
      enabled: true
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">
      <h3 className="text-2xl font-avigea text-[#A3E635] uppercase tracking-wider">Privacidad</h3>
      <div className="grid gap-2">
        {privacyOptions.map((option, i) => (
          <div key={i} className="flex items-center justify-between py-6 border-b border-white/5 last:border-0">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-[#A3E635]/10 flex items-center justify-center rounded-xl">
                {option.icon}
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">{option.title}</h4>
                <p className="text-sm text-zinc-500">{option.description}</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${option.enabled ? 'bg-[#A3E635]' : 'bg-zinc-800'}`}>
              <div className={`w-4 h-4 rounded-full bg-black transition-transform ${option.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
