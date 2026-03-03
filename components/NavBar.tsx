"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, Sprout } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "./ui/utils";

type NavItem = {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPrefix?: boolean;
};

export default function NavBar() {
  const pathname = usePathname() ?? "/";
  const { uid, loading, signInWithGoogle, signOutUser } = useAuth();

  const navItems: NavItem[] = [
    { path: "/", label: "Home", icon: Home },
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      matchPrefix: true,
    },
    { path: "/plants", label: "Plants", icon: Sprout, matchPrefix: true },
  ];

  const isItemActive = (item: NavItem) => {
    if (item.path === "/") return pathname === "/";
    if (item.matchPrefix)
      return pathname === item.path || pathname.startsWith(item.path + "/");
    return pathname === item.path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-emerald-100/70">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-green-500 to-emerald-600">
              <Sprout className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-neutral-900">
              Verdio
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Nav */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors",
                      active
                        ? "bg-green-100 text-green-800"
                        : "text-neutral-600 hover:bg-green-50 hover:text-green-700",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Auth */}
            {loading ? (
              <span className="px-3 text-sm text-neutral-500">…</span>
            ) : uid ? (
              <button
                onClick={signOutUser}
                className="ml-1 rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="ml-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
