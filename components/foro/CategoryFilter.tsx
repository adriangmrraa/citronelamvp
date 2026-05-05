'use client';

import { ForumCategory } from '@/types/forum';
import { COMMUNITIES } from '@/constants/communities';

interface CategoryFilterProps {
  currentCategory: ForumCategory;
  onCategoryChange: (category: ForumCategory) => void;
}

export default function CategoryFilter({ currentCategory, onCategoryChange }: CategoryFilterProps) {
  const categoryValues = Object.keys(COMMUNITIES) as ForumCategory[];

  return (
    <div className="flex gap-6 overflow-x-auto pb-1 hide-scrollbar snap-x snap-mandatory items-center">
      {categoryValues.map((value) => {
        const community = COMMUNITIES[value];
        const isActive = currentCategory === value;
        
        return (
          <button
            key={value}
            onClick={() => onCategoryChange(value)}
            className={`flex items-center gap-2 text-sm font-black tracking-tight transition-all duration-500 snap-start whitespace-nowrap py-2 px-1 border-b-2 relative group`}
            style={{ 
              color: isActive ? '#07120b' : 'rgba(7, 18, 11, 0.4)',
              borderColor: isActive ? '#07120b' : 'transparent'
            }}
          >
            <span 
              className={`material-symbols-outlined text-[18px] transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-[#07120b]/60'}`}
              style={{ color: isActive ? '#07120b' : undefined }}
            >
              {community.icon}
            </span>
            {community.id === 'Todo' ? 'Todos' : community.id}
            
            {isActive && (
              <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[#07120b] animate-in fade-in slide-in-from-left-2" />
            )}
          </button>
        );
      })}
    </div>
  );
}
