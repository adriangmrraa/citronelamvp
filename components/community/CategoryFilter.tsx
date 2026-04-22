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
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            active === cat
              ? 'bg-green-600 text-white shadow-sm'
              : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-green-400 hover:text-green-700 dark:hover:text-green-400'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
