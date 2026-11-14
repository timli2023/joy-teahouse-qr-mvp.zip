import { createClient } from "@supabase/supabase-js";

export function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase environment variables are missing.");
  return createClient(url, key, { auth: { persistSession: false } });
}

export function validAdmin(pin: unknown) {
  return typeof pin === "string" && !!process.env.ADMIN_PIN &&
    pin.length > 0 && pin === process.env.ADMIN_PIN;
}
