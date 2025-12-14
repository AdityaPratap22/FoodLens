// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "FoodLens",
  description: "Food identification and nutrition assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <header className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-b dark:border-slate-700">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-white">🍽️ FoodLens</Link>
                <div className="hidden md:flex items-center gap-4 ml-6">
                  <Link href="/" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white">Home</Link>
                  <Link href="/scan" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white">Scan</Link>
                  <Link href="/scan/image" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white">Image</Link>
                  <Link href="/history" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white">History</Link>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/about" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white">About</Link>
              </div>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="mt-12 pb-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FoodLens — Demo project
        </footer>
      </body>
    </html>
  );
}
