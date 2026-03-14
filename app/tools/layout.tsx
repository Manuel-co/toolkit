import type React from "react"
import Link from "next/link"
import { Layers, ChevronRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#080808] text-white">
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#080808]/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
            <Link href="/" className="flex items-center gap-2 font-semibold text-white hover:text-[#4D9FFF] transition-colors">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
                <Layers className="h-4 w-4 text-black" />
              </div>
              TOOLKIT
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-white/20" />
            <Link href="/tools" className="text-xs uppercase tracking-widest hover:text-white transition-colors">
              Tools
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-10">
          {children}
        </div>
      </main>

      <footer className="border-t border-white/[0.06] bg-[#080808] py-6">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-center justify-between gap-3 md:flex-row">
          <Link href="/" className="flex items-center gap-2 font-semibold text-white">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-white">
              <Layers className="h-3.5 w-3.5 text-black" />
            </div>
            TOOLKIT
          </Link>
          <p className="text-xs text-[#A0A0A0]">© {new Date().getFullYear()} ToolKit. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-[#A0A0A0]">
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
