"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";

export default function NavBar() {
  const { uid, loading, signInWithGoogle, signOutUser } = useAuth();

  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-semibold">
          Verdio
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-neutral-700 hover:text-neutral-900"
          >
            Dashboard
          </Link>
          <Link
            href="/plants"
            className="text-sm text-neutral-700 hover:text-neutral-900"
          >
            Plants
          </Link>

          {loading ? (
            <span className="text-sm text-neutral-500">…</span>
          ) : uid ? (
            <button
              onClick={signOutUser}
              className="rounded-xl px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
