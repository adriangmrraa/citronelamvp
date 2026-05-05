import React from 'react';
import { Mail, Bell, MessageCircle } from 'lucide-react';

export function SettingsEmail() {
  const emailOptions = [
    {
      title: 'Likes a tus publicaciones',
      description: 'Recibir avisos cuando alguien valore tu contenido.',
      icon: <Bell className="w-5 h-5 text-[#A3E635]" />,
      enabled: true
    },
    {
      title: 'Likes a tus comentarios',
      description: 'Notificaciones sobre reacciones en tus hilos.',
      icon: <MessageCircle className="w-5 h-5 text-[#A3E635]" />,
      enabled: true
    },
    {
      title: 'Notificaciones',
      description: 'Alertas generales del sistema y administración.',
      icon: <Mail className="w-5 h-5 text-[#A3E635]" />,
      enabled: false
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">
      <h3 className="text-2xl font-avigea text-[#A3E635] uppercase tracking-wider">Correo Electrónico</h3>
      <div className="py-4 border-b border-[#A3E635]/20 mb-4">
        <p className="text-sm text-zinc-400 font-medium leading-relaxed">
          Elegí qué tipo de alertas querés recibir en tu casilla vinculada. Las notificaciones críticas de seguridad no se pueden desactivar.
        </p>
      </div>

      <div className="grid gap-2">
        {emailOptions.map((option, i) => (
          <div key={i} className="flex items-center justify-between py-6 border-b border-white/5">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-zinc-900 border border-white/5 flex items-center justify-center rounded-xl">
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
