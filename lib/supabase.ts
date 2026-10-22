import { createClient } from "@supabase/supabase-js";

/**
 * Cliente público (solo lectura, respeta RLS).
 * Úsalo en Server Components y en cualquier fetch de galería/detalle.
 *
 * Variables de entorno necesarias en .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
 *
 * (Las encuentras en tu dashboard de Supabase → Project Settings → API)
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Cliente con service_role, SOLO para el futuro panel de admin
 * (insert/update/delete). NUNCA lo importes en un componente cliente
 * ni expongas SUPABASE_SERVICE_ROLE_KEY con el prefijo NEXT_PUBLIC_.
 * Úsalo solo dentro de Server Actions o Route Handlers.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}