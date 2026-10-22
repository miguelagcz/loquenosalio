"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "lqnsb-likes";

/**
 * Favoritos guardados en el navegador del visitante (persisten al recargar).
 * Las llaves son "p-<id>" para fotos y "v-<id>" para videos.
 */
export function useLikes() {
  const [liked, setLiked] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLiked(new Set(JSON.parse(raw) as string[]));
    } catch {}
  }, []);

  const toggle = useCallback((key: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  return { liked, toggle };
}