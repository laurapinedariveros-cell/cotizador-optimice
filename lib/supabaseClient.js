import { createClient } from "@supabase/supabase-js";

function safeUrl(value) {
  if (!value) return null;
  try {
    // eslint-disable-next-line no-new
    new URL(value.trim());
    return value.trim();
  } catch {
    return null;
  }
}

const supabaseUrl = safeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) || "https://placeholder.supabase.co";
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseAnonKey = rawKey && rawKey.trim() ? rawKey.trim() : "placeholder-key";

if (supabaseUrl.includes("placeholder") || supabaseAnonKey === "placeholder-key") {
  console.warn(
    "Faltan o son inválidas las variables NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "La app va a cargar, pero guardar/leer cuestionarios va a fallar hasta que las configures bien."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
