"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

/**
 * Hook en vez de componente: así puedes usar el mismo número de views
 * en varios lugares de tu JSX (como tienes en PhotoDetail: arriba con
 * el 👁 y abajo en la sección "Views") sin duplicar la suscripción.
 *
 * Uso en PhotoDetail.tsx:
 *   const views = useLiveViews("photos", photo.id, photo.views);
 *   // luego reemplazas photo.views.toLocaleString() por views.toLocaleString()
 */
export function useLiveViews(
  table: "photos" | "videos",
  id: number | null,
  initialViews: number,
  openKey?: number | string
): number {
  const [views, setViews] = useState(initialViews);

  // guardKey combina el id con una "ficha de apertura" opcional.
  // Si openKey cambia (ej. reabres el mismo video haciendo clic otra vez
  // después de cerrarlo), el guard deja de bloquear el incremento aunque
  // el id sea el mismo de antes.
  const guardKey = id === null ? null : `${id}:${openKey ?? 0}`;
  const hasIncremented = useRef<string | null>(null);

  // Cuando cambia el id (ej. se abre un video distinto), reseteamos
  // el número base y permitimos un nuevo incremento para ese id.
  useEffect(() => {
    setViews(initialViews);
  }, [id, initialViews]);

  // Incrementa una vez por cada "apertura" real
  useEffect(() => {
    if (id === null || guardKey === null) return;
    if (hasIncremented.current === guardKey) return;
    hasIncremented.current = guardKey;

    const rpcName =
      table === "photos" ? "increment_photo_views" : "increment_video_views";
    const paramName = table === "photos" ? "photo_id" : "video_id";

    supabase.rpc(rpcName, { [paramName]: id }).then(({ error }) => {
      if (error) {
        console.error("No se pudo registrar la vista:");
        console.error("message:", error.message);
        console.error("details:", error.details);
        console.error("hint:", error.hint);
        console.error("code:", error.code);
        return;
      }
      // Subimos el número local de inmediato, sin esperar a que
      // llegue el evento de Realtime (que puede tardar un instante
      // en conectarse la primera vez). Realtime sigue activo para
      // que OTRAS personas viendo el mismo video/foto vean el cambio.
      setViews((v) => v + 1);
    });
  }, [table, id, guardKey]);

  // Escucha cambios en vivo en esa fila (solo si hay id)
  useEffect(() => {
    if (id === null) return;

    const channel = supabase
      .channel(`${table}-${id}-views`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table,
          filter: `id=eq.${id}`,
        },
        (payload) => {
          const newViews = (payload.new as { views: number }).views;
          setViews(newViews);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, id]);

  return views;
}