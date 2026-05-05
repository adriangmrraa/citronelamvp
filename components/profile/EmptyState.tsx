import React from 'react';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem]">
    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-zinc-600" />
    </div>
    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{title}</h3>
    <p className="text-zinc-500 text-sm max-w-[200px] leading-relaxed">{description}</p>
  </div>
);
