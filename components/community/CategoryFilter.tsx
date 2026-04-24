'use client';

const CATEGORIES = [
  'Todos',
  'Clases',
  'Investigaciones',
  'FAQ',
  'Debates',
  'Papers',
  'Noticias',
  'Anuncios',
] as const;

interface CategoryFilterProps {
  active: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
            active === cat
              ? 'bg-lime-400 text-[#07120b] font-semibold'
              : 'bg-white/[0.04] border border-white/[0.08] text-zinc-400 font-medium hover:text-zinc-200 hover:bg-white/[0.06]'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
