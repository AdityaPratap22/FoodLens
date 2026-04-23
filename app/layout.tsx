import "./globals.css";
import Link from "next/link";
import React from "react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "FoodLens",
  description: "Food identification and nutrition assistant powered by AI",
  openGraph: {
    title: "FoodLens | AI Nutrition Assistant",
    description: "Scan your food, understand nutrition, and make healthier choices.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        
        {/* Glow effect at the top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-gradient-to-b from-emerald-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* Header */}
        <header className="sticky top-0 z-50 glass-panel border-b border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between h-16">
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent transform hover:scale-105 transition-transform"
                >
                  <span className="mr-2">🍽️</span>FoodLens
                </Link>

                <div className="hidden md:flex items-center gap-2">
                  <NavLink href="/">Home</NavLink>
                  <NavLink href="/scan">Scan</NavLink>
                  <NavLink href="/scan/image">Image</NavLink>
                  <NavLink href="/history">History</NavLink>
                  <NavLink href="/profile">Profile</NavLink>
                </div>
              </div>

              <div className="hidden md:block">
                <NavLink href="/about">About</NavLink>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 relative z-0">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-white/5 py-8 text-center text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} FoodLens Core. Making nutrition transparent.</p>
        </footer>
      </body>
    </html>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
    >
      {children}
    </Link>
  );
}
