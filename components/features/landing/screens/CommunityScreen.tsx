import React from 'react';
import { communityPosts } from '../data';

export const CommunityScreen = () => {
  return (
    <div className="h-full px-4 pt-3 text-white text-[11px]">
      <div data-phone-item className="flex items-center justify-between mb-3">
        <p className="text-[14px] font-bold">Comunidad</p>
        <div className="px-2.5 py-1 rounded-lg bg-lime-400/15 text-lime-400 text-[9px] font-semibold">
          + Publicar
        </div>
      </div>
      <div data-phone-item className="flex gap-1.5 mb-3 overflow-hidden">
        {['Todos', 'Tips', 'Investigación', 'Dudas'].map((c, i) => (
          <span
            key={c}
            className={`shrink-0 px-2.5 py-1 rounded-full text-[8px] font-semibold ${
              i === 0 ? 'bg-lime-400 text-[#07120b]' : 'bg-white/5 text-zinc-400 border border-white/5'
            }`}
          >
            {c}
          </span>
        ))}
      </div>
      {communityPosts.map((p) => (
        <div
          data-phone-item
          key={p.title}
          className="p-3 rounded-xl bg-white/[0.03] border border-white/5 mb-2"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-lime-400/30 to-green-600/30 flex items-center justify-center text-[12px]">
              {p.av}
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold">{p.a}</p>
              <p className="text-[8px] text-zinc-500">{p.t}</p>
            </div>
            <span className={`px-1.5 py-0.5 rounded text-[7px] font-semibold ${p.tc}`}>{p.tag}</span>
          </div>
          <p className="text-[10px] font-semibold mb-1">{p.title}</p>
          <p className="text-[9px] text-zinc-400 leading-relaxed line-clamp-2">{p.c}</p>
          <div className="flex items-center gap-4 mt-2 text-[9px] text-zinc-500">
            <span>♥ {p.l}</span>
            <span>💬 {p.cm}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
