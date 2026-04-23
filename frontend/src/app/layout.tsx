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

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} bg-background text-foreground min-h-screen selection:bg-indigo-500/30 transition-colors duration-500`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>
            <Toaster position="top-center" richColors />
            {/* Subtle animated gradient background */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] transition-colors duration-500"></div>
            
            <Navbar />
            
            <main className="max-w-6xl mx-auto px-6 py-12">
              {children}
            </main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
