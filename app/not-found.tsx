import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-neutral-600">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Go home
        </Link>
        <Link
          href="/plants"
          className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
        >
          Open plants
        </Link>
      </div>
    </main>
  );
}
