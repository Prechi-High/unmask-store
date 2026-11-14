import Link from "next/link";
import { formatMoney } from "@/lib/utils";
import type { StoreSection } from "@/lib/themes/presets";
import type { Tables } from "@/types/database";

type Product = Pick<
  Tables<"store_products">,
  "id" | "title" | "price" | "currency" | "hero_image_url" | "product_url_slug"
>;

export function StoreRenderer({
  store,
  sections,
  products,
  themeTokens,
}: {
  store: Pick<Tables<"stores">, "name" | "tagline" | "slug" | "logo_url">;
  sections: StoreSection[];
  products: Product[];
  themeTokens: Record<string, string>;
}) {
  const accent = themeTokens.accent ?? "#111";
  const surface = themeTokens.surface ?? "#fafafa";

  return (
    <div style={{ backgroundColor: surface }} className="min-h-screen text-neutral-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">OnMask Store</p>
          <h1 className="text-xl font-medium tracking-tight">{store.name}</h1>
        </div>
        <Link href={`/s/${store.slug}/cart`} className="text-sm text-neutral-600">
          Cart
        </Link>
      </header>

      {sections
        .filter((s) => s.enabled)
        .map((section) => {
          if (section.type === "hero") {
            return (
              <section key="hero" className="mx-auto max-w-6xl px-4 py-12 md:py-20">
                <p className="text-sm text-neutral-500">{store.tagline}</p>
                <h2 className="mt-3 max-w-2xl text-4xl font-light tracking-tight md:text-6xl">
                  {String(section.props.headline ?? store.name)}
                </h2>
                <p className="mt-4 max-w-xl text-neutral-600">
                  {String(section.props.subheadline ?? "")}
                </p>
              </section>
            );
          }
          if (section.type === "featured_products") {
            return (
              <section key="featured" className="mx-auto max-w-6xl px-4 py-10">
                <h3 className="mb-6 text-lg font-medium" style={{ color: accent }}>
                  {String(section.props.title ?? "Featured")}
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {products.map((p) => (
                    <Link
                      key={p.id}
                      href={`/s/${store.slug}/products/${p.product_url_slug}`}
                      className="group rounded-2xl bg-white p-3 shadow-sm transition hover:-translate-y-0.5"
                    >
                      <div className="aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100">
                        {p.hero_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.hero_image_url} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <p className="mt-3 text-sm font-medium">{p.title}</p>
                      <p className="text-sm text-neutral-500">{formatMoney(Number(p.price), p.currency)}</p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          }
          if (section.type === "brand_story") {
            return (
              <section key="story" className="mx-auto max-w-3xl px-4 py-16 text-center">
                <h3 className="text-lg font-medium">{String(section.props.title ?? "Brand story")}</h3>
                <p className="mt-4 text-neutral-600 leading-relaxed">
                  {String(section.props.body ?? store.tagline)}
                </p>
              </section>
            );
          }
          if (section.type === "footer") {
            return (
              <footer key="footer" className="border-t border-neutral-200/80 px-4 py-10 text-center text-sm text-neutral-500">
                © {new Date().getFullYear()} {store.name}
              </footer>
            );
          }
          return null;
        })}
    </div>
  );
}
