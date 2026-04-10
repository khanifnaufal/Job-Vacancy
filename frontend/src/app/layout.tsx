import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import Link from "next/link";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dicoding Jobs",
  description: "Find your ultimate dream job with premium experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-slate-950 text-slate-100 min-h-screen selection:bg-indigo-500/30`}>
        <Providers>
          {/* Subtle animated gradient background */}
          <div className="fixed inset-0 -z-10 h-full w-full bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
          
          <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/60 border-b border-indigo-500/10 transition-all duration-300">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                  D
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 tracking-tight">
                  Dicoding Jobs
                </h1>
              </Link>
            </div>
          </header>
          <main className="max-w-6xl mx-auto px-6 py-12">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
