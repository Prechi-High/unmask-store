import type { Json } from "@/types/database";

export type ThemeId =
  | "beauty_minimal"
  | "beauty_boutique"
  | "beauty_editorial"
  | "beauty_luxury";

export type SectionType =
  | "hero"
  | "featured_products"
  | "collection"
  | "image_text"
  | "brand_story"
  | "testimonials"
  | "newsletter"
  | "footer";

export type StoreSection = {
  type: SectionType;
  enabled: boolean;
  props: Record<string, unknown>;
};

export const DEFAULT_SECTIONS: StoreSection[] = [
  {
    type: "hero",
    enabled: true,
    props: { headline: "Radiance, refined", subheadline: "Premium beauty, curated for you." },
  },
  { type: "featured_products", enabled: true, props: { title: "Featured" } },
  { type: "brand_story", enabled: true, props: { title: "Our story", body: "" } },
  { type: "newsletter", enabled: true, props: { title: "Stay close" } },
  { type: "footer", enabled: true, props: {} },
];

export const THEME_LABELS: Record<ThemeId, string> = {
  beauty_minimal: "Beauty Minimal",
  beauty_boutique: "Beauty Boutique",
  beauty_editorial: "Beauty Editorial",
  beauty_luxury: "Beauty Luxury",
};

export function parseSections(raw: Json | null): StoreSection[] {
  if (!raw || !Array.isArray(raw)) return DEFAULT_SECTIONS;
  return raw as unknown as StoreSection[];
}
