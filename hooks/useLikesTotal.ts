"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/** Total de likes del sitio, en vivo (se actualiza cuando cualquiera da like). */
export function useLikesTotal(initial: number): number {
  const [total, setTotal] = useState(initial);

  useEffect(() => {
    let alive = true;

    // valor actual al abrir la página (por si cambió desde que se generó)
    supabase
      .from("site_stats")
      .select("value")
      .eq("key", "likes")
      .maybeSingle()
      .then(({ data }) => {
        if (alive && data) setTotal(Number(data.value) || 0);
      });

    const channel = supabase
      .channel("site-stats-likes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "site_stats", filter: "key=eq.likes" },
        (payload) => setTotal(Number((payload.new as { value: number }).value) || 0)
      )
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return total;
}