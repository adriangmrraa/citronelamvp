'use client';

import React from 'react';
import { Ticket, Calendar } from 'lucide-react';

interface ProfileEventsProps {
  user: any;
  router: any;
  EmptyState: React.FC<any>;
}

export default function ProfileEvents({ user, router, EmptyState }: ProfileEventsProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Mis Próximos Eventos</p>
        <button 
          onClick={() => router.push('/events')}
          className="text-[10px] font-black text-lime-400 uppercase tracking-widest hover:underline"
        >
          Explorar Eventos
        </button>
      </div>

      {(user.reservations || []).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(user.reservations || []).map((res: any) => (
            <div key={res.id} className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 hover:border-lime-400/30 transition-all group relative overflow-hidden">
               <div className="flex items-start justify-between mb-8">
                  <div className="flex gap-5">
                     <div className="w-16 h-16 bg-lime-400/10 rounded-[1.25rem] flex items-center justify-center border border-lime-400/20">
                        <Ticket size={32} className="text-lime-400" />
                     </div>
                     <div>
                        <h4 className="text-2xl font-black text-white group-hover:text-lime-400 transition-colors uppercase italic tracking-tighter leading-none mb-2">{res.categoryName}</h4>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Reserva #{res.id.split('_')[1]}</p>
                     </div>
                  </div>
                  <div className="px-4 py-1.5 bg-lime-400 text-[#07120b] rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                     Confirmada
                  </div>
               </div>
               
               <div className="bg-black/60 backdrop-blur-md rounded-3xl p-6 flex items-center justify-between gap-6 border border-white/10 relative z-10">
                  <div className="flex-1">
                     <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Tu código de acceso</p>
                     <p className="font-mono text-xs text-lime-400/80 break-all leading-tight">{res.qrCode}</p>
                  </div>
                  <div className="w-24 h-24 bg-white p-2 rounded-2xl shrink-0 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                     <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=citro')] bg-cover" />
                  </div>
               </div>
               
               <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3">
                     <Calendar size={16} className="text-zinc-500" />
                     <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Adquirida el {new Date(res.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-4">
                    <button className="text-[10px] font-black text-lime-400 uppercase tracking-widest hover:underline">Ver Mapa</button>
                    <button className="text-[10px] font-black text-white uppercase tracking-widest hover:underline">Info</button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Ticket} title="Sin entradas" description="Tus tickets para eventos aparecerán aquí cuando compres uno." />
      )}
    </div>
  );
}
