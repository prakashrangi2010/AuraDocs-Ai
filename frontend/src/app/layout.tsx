import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { BookOpen, MessagesSquare, Upload } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Aura Docs | AI Document Intelligence",
  description: "Upload and chat with your books powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#050511] text-zinc-200 selection:bg-indigo-500/30 relative overflow-x-hidden">
        
        {/* Animated Background Layers */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-orbit pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen animate-orbit pointer-events-none" style={{ animationDelay: '-10s', animationDuration: '30s' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050511]/80 to-[#050511]" />
        </div>

        {/* Global Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050511]/60 backdrop-blur-xl supports-[backdrop-filter]:bg-[#050511]/40">
          <div className="container mx-auto flex h-20 items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-3 group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 blur-lg group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ring-1 ring-white/20">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-outfit text-xl font-bold tracking-tight text-white">
                Aura<span className="text-indigo-400">Docs</span>
              </span>
            </Link>
            <nav className="flex gap-1 md:gap-4">
              <Link
                href="/qa"
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
               >
                <MessagesSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Ask AI</span>
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 flex flex-col relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
