"use client";

import { useState } from "react";

interface CategoryIndexProps {
  categories: { name: string; count: number }[];
  onSelect?: (category: string) => void;
}

export function CategoryIndex({ categories, onSelect }: CategoryIndexProps) {
  const [active, setActive] = useState("All");

  return (
    <div className="flex flex-wrap items-center justify-center gap-0 overflow-x-auto whitespace-nowrap border-t border-black/10 px-4 py-4 dark:border-white/10 sm:px-6">
      {categories.map((cat, i) => (
        <span key={cat.name} className="flex items-center">
          <button
            type="button"
            onClick={() => {
              setActive(cat.name);
              onSelect?.(cat.name);
            }}
            className={`px-3 py-1 font-voice text-[13px] transition-colors duration-200 ${
              active === cat.name
                ? "text-black dark:text-white"
                : "text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white"
            }`}
          >
            {cat.name === "All" ? "Todas" : cat.name}{" "}
            <span className="text-[10px] text-neutral-400 dark:text-neutral-600">
              {cat.count}
            </span>
          </button>
          {i < categories.length - 1 && (
            <span className="text-[11px] text-neutral-300 dark:text-neutral-700">/</span>
          )}
        </span>
      ))}
    </div>
  );
}