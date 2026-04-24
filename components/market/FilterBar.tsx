'use client';

import { Input } from '@/components/ui/input';

const CATEGORIES = ['Todas', 'Flores', 'Parafernalia', 'Genéticas'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Más nuevo' },
  { value: 'price_asc', label: 'Precio ↑' },
  { value: 'price_desc', label: 'Precio ↓' },
];

interface FilterBarProps {
  category: string;
  sort: string;
  search: string;
  onCategoryChange: (cat: string) => void;
  onSortChange: (sort: string) => void;
  onSearchChange: (search: string) => void;
}

export default function FilterBar({
  category,
  sort,
  search,
  onCategoryChange,
  onSortChange,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 glass-surface p-3 rounded-2xl">
      {/* Search */}
      <div className="flex-1 min-w-[180px]">
        <Input
          type="search"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 text-sm bg-white/[0.04] border-white/[0.08] text-zinc-300 placeholder:text-zinc-500 focus:border-lime-400/50"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-1.5 overflow-x-auto flex-nowrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              category === cat
                ? 'bg-lime-400 text-[#07120b] shadow-sm'
                : 'bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort select */}
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="h-9 rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-300 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/50"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#07120b] text-zinc-300">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
