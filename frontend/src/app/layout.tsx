import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HireIn",
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
          <Toaster position="top-center" richColors />
          {/* Subtle animated gradient background */}
          <div className="fixed inset-0 -z-10 h-full w-full bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
          
          <Navbar />
          
          <main className="max-w-6xl mx-auto px-6 py-12">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
