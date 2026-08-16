"use client";

import { Search, X } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function GalleryToolbar({
  search,
  setSearch,
}: Props) {
  return (
    <div className="mb-8">

      <div
        className="
          relative
          w-full
          max-w-xl
          mx-auto
        "
      >

        {/* SEARCH ICON */}

        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-zinc-500
            pointer-events-none
          "
        />

        {/* INPUT */}

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search photos or videos..."
          aria-label="Search gallery"
          className="
            w-full
            rounded-full
            border
            border-white/10
            bg-white/5
            py-3
            pl-11
            pr-12
            text-sm
            text-white
            placeholder:text-zinc-600
            outline-none
            backdrop-blur-md
            transition-all
            duration-300
            focus:border-white/20
            focus:bg-white/[0.08]
          "
        />

        {/* CLEAR */}

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              text-zinc-500
              hover:bg-white/10
              hover:text-white
              transition
            "
          >
            <X size={16} />
          </button>
        )}

      </div>

    </div>
  );
}