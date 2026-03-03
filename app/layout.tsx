import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Verdio",
  description: "Your personal gardening assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
          <AuthProvider>
            <NavBar />
            <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
