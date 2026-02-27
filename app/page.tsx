import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 items-center">
      <h1 className="text-2xl font-semibold">Verdio</h1>
      <p className="mt-2 text-neutral-600">
        Smart plant tracking and care management for modern gardeners.
      </p>
      <Link
        href="/garden"
        className="mt-6 inline-block rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
      >
        Your Garden
      </Link>
    </main>
  );
}
