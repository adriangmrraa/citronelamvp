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
    <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
      {/* Search */}
      <div className="flex-1 min-w-[180px]">
        <Input
          type="search"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 text-sm"
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
                ? 'bg-[#16A34A] text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-[#16A34A]'
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
        className="h-9 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
