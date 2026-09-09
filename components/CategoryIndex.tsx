"use client";

interface CategoryIndexProps {
  categories: { name: string; count: number }[];
  onSelect?: (category: string) => void;
}
export function CategoryIndex({ categories, onSelect }: CategoryIndexProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-0 overflow-x-auto whitespace-nowrap border-t border-white/10 px-4 py-4 sm:px-6">
      {categories.map((cat, i) => (
        <span key={cat.name} className="flex items-center">
          <button
            type="button"
            onClick={() => onSelect?.(cat.name)}
            className="px-3 py-1 font-voice text-[13px] text-zinc-400 transition-colors duration-200 hover:text-white"
          >
            {cat.name} <span className="text-[10px] text-zinc-600">{cat.count}</span>
          </button>
          {i < categories.length - 1 && (
            <span className="text-[11px] text-zinc-700">/</span>
          )}
        </span>
      ))}
    </div>
  );
}