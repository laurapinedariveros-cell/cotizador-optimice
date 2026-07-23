import { createClient } from "@supabase/supabase-js";

// OJO: este archivo usa la Service Role Key y SOLO debe importarse desde
// código que corre en el servidor (rutas app/api/**/route.js). Nunca lo
// importes desde un componente "use client".
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
