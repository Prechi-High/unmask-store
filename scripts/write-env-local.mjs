#!/usr/bin/env node
import { writeFileSync } from "node:fs";

const lines = [
  "NEXT_PUBLIC_SUPABASE_URL=https://uczrdwfzbqwgysbqjuii.supabase.co",
  `NEXT_PUBLIC_SUPABASE_ANON_KEY=${process.env.SUPABASE_ANON_KEY ?? ""}`,
  `SUPABASE_SERVICE_ROLE_KEY=${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""}`,
  `PAYSTACK_SECRET_KEY=${process.env.PAYSTACK_SECRET_KEY ?? ""}`,
  `PAYSTACK_WEBHOOK_SECRET=${process.env.PAYSTACK_WEBHOOK_SECRET ?? ""}`,
  "NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000",
  "NEXT_PUBLIC_PLATFORM_DOMAIN=localhost:3000",
];

if (!process.env.SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY in the environment."
  );
  process.exit(1);
}

writeFileSync(".env.local", lines.join("\n") + "\n");
console.log("Wrote .env.local");