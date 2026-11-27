import type { NextConfig } from "next";

function publishedEnv(key: string, fallbackKey: string): string {
  return process.env[key] ?? process.env[fallbackKey] ?? "";
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: publishedEnv(
      "SUPABASE_PROJECT_URL",
      "NEXT_PUBLIC_SUPABASE_URL"
    ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: publishedEnv(
      "SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    ),
    NEXT_PUBLIC_APP_URL: publishedEnv("APP_PUBLIC_URL", "NEXT_PUBLIC_APP_URL"),
  },
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
