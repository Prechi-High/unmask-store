import Link from "next/link";

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { slug } = await params;
  const { order } = await searchParams;
  return (
    <main className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-3xl font-light">Thank you</h1>
      <p className="mt-4 text-neutral-600">Order {order ?? ""} has been recorded.</p>
      <Link href={`/s/${slug}`} className="mt-8 inline-block underline text-sm">
        Back to store
      </Link>
    </main>
  );
}
