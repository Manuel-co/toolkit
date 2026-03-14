"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Crop, Palette, FileText, QrCode, Layers, ArrowRight,
  Zap, Shield, Download, Sparkles, Cloud, Code,
  BookOpen, Key, ImageIcon, FileIcon, Link as LinkIcon,
} from "lucide-react"

/* ── data ─────────────────────────────────────────────────────────────── */
const NAV = ["Tools", "Features", "FAQ"]

const TOOLS = [
  { name: "Markdown Editor",     desc: "Write & preview markdown live",        icon: BookOpen,  slug: "markdown-editor",         badge: "New" },
  { name: "QR Code Generator",   desc: "Generate QR codes instantly",           icon: QrCode,    slug: "qr-code-generator",       badge: null },
  { name: "Text to PDF",         desc: "Rich documents exported as PDF",        icon: FileIcon,  slug: "text-to-pdf",             badge: null },
  { name: "Color Palette",       desc: "Generate harmonious color palettes",    icon: Palette,   slug: "color-palette-generator", badge: "New" },
  { name: "Image Cropper",       desc: "Crop & resize images precisely",        icon: Crop,      slug: "image-cropper",           badge: null },
  { name: "Password Generator",  desc: "Secure random passwords",               icon: Key,       slug: "password-generator",      badge: null },
  { name: "Image Compressor",    desc: "Shrink images without quality loss",    icon: ImageIcon, slug: "image-compressor",        badge: null },
  { name: "Code Snippets",       desc: "Store & organise your code snippets",   icon: Code,      slug: "code-snippet-manager",    badge: "New" },
  { name: "Gradient Generator",  desc: "Build beautiful CSS gradients",         icon: Palette,   slug: "gradient-generator",      badge: "New" },
  { name: "Image Converter",     desc: "Convert between image formats",         icon: Layers,    slug: "image-converter",         badge: null },
  { name: "Text Extractor",      desc: "Pull text from files instantly",        icon: FileText,  slug: "text-extractor",          badge: "New" },
  { name: "URL Shortener",       desc: "Create short, shareable links",         icon: LinkIcon,  slug: "url-shortener",           badge: "New" },
]

const FEATURES = [
  { icon: Zap,      title: "Lightning Fast",   body: "All tools run client-side — no server round-trips, no waiting." },
  { icon: Shield,   title: "100% Private",     body: "Files are processed in your browser and never leave your device." },
  { icon: Download, title: "No Install",       body: "Everything runs in the browser. Nothing to download or set up." },
  { icon: Sparkles, title: "Always Free",      body: "Every feature is free with no hidden costs or premium tiers." },
  { icon: Cloud,    title: "No Account",       body: "Start using any tool immediately — no sign-up, no email." },
  { icon: Layers,   title: "Growing Library",  body: "New tools added regularly based on what the community needs." },
]

const FAQS = [
  { q: "Are these tools really free?",            a: "Yes — completely free, no hidden costs, no usage limits, ever." },
  { q: "Do I need to create an account?",         a: "No. Open any tool and start using it immediately." },
  { q: "Can I use them for commercial projects?", a: "Absolutely. Personal and commercial use are both welcome." },
  { q: "Are my files stored on your servers?",    a: "No. Processing happens locally in your browser." },
  { q: "Is there a file size or usage limit?",    a: "No limits. Process as many files as you need." },
]

/* ── component ────────────────────────────────────────────────────────── */
export default function Home() {
  /* scroll-reveal */
  const revealRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const els = document.querySelectorAll(".reveal")
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible") }),
      { threshold: 0.12 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={revealRef} className="flex min-h-screen flex-col bg-[#080808] text-white selection:bg-[#4D9FFF]/30">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 z-50 w-full">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-white">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
              <Layers className="h-4 w-4 text-black" />
            </div>
            TOOLKIT
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map(n => (
              <Link
                key={n}
                href={`#${n.toLowerCase()}`}
                className="text-xs font-medium uppercase tracking-widest text-[#A0A0A0] hover:text-white transition-colors duration-300"
              >
                {n}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/tools">
              <button className="rounded-md border border-white/20 bg-transparent px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black">
                Browse
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden stars-bg">
          {/* nebula gradients */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4D9FFF]/[0.06] blur-[120px]" />
            <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-violet-600/[0.05] blur-[100px]" />
            <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[#4D9FFF]/[0.04] blur-[80px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6 pt-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* left */}
              <div className="space-y-8">
                <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.25em] text-[#4D9FFF]">
                  Free · No Login · Browser-Based
                </p>

                <h1 className="animate-fade-up delay-1 text-[clamp(3rem,7vw,5.5rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-white">
                  Tools Built<br />
                  for What<br />
                  <span className="text-[#E5E5E5]/60">Comes Next.</span>
                </h1>

                <p className="animate-fade-up delay-2 max-w-md text-[17px] font-light leading-relaxed text-[#A0A0A0]">
                  A growing suite of {TOOLS.length} browser-based tools for developers
                  and creators. Fast, private, and completely free — forever.
                </p>

                <div className="animate-fade-up delay-3 flex flex-col sm:flex-row gap-3">
                  <Link href="/tools">
                    <button className="group flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#E5E5E5]">
                      Get started free
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </Link>
                  <Link href="#tools">
                    <button className="rounded-md border border-white/15 bg-transparent px-6 py-3 text-sm font-medium text-[#A0A0A0] transition-all duration-300 hover:border-white/30 hover:text-white">
                      Explore tools
                    </button>
                  </Link>
                </div>

                {/* stats */}
                <div className="animate-fade-up delay-4 flex items-center gap-8 pt-2">
                  {[
                    { v: `${TOOLS.length}+`, l: "Tools" },
                    { v: "100%",             l: "Free" },
                    { v: "0",                l: "Login needed" },
                  ].map((s, i) => (
                    <div key={s.l} className={i > 0 ? "border-l border-white/10 pl-8" : ""}>
                      <div className="text-3xl font-extrabold tracking-tight text-white">{s.v}</div>
                      <div className="mt-0.5 text-xs text-[#A0A0A0]">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* right — hero image */}
              <div className="animate-fade-in delay-2 relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#4D9FFF]/[0.08] blur-3xl" />
                <div className="relative w-full max-w-[480px] aspect-square">
                  <Image
                    src="/hero.png"
                    alt="ToolKit"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                  {/* floating glass card — top left */}
                  <div className="absolute -left-6 top-10 glass rounded-xl px-4 py-3 animate-fade-up delay-4">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#4D9FFF] shadow-[0_0_6px_#4D9FFF]" />
                      <span className="text-xs font-semibold text-white">All tools free</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#A0A0A0]">No account required</p>
                  </div>
                  {/* floating glass card — bottom right */}
                  <div className="absolute -right-6 bottom-14 glass rounded-xl px-4 py-3 animate-fade-up delay-5">
                    <p className="text-[11px] text-[#A0A0A0] mb-1">Tools available</p>
                    <div className="flex items-end gap-1.5">
                      <span className="text-2xl font-extrabold text-white">{TOOLS.length}+</span>
                      <span className="mb-0.5 text-[11px] text-[#4D9FFF]">↑ growing</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#A0A0A0]/50">
            <div className="h-8 w-px bg-gradient-to-b from-transparent to-[#A0A0A0]/30" />
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          </div>
        </section>

        {/* ── Tools ───────────────────────────────────────────────────────── */}
        <section id="tools" className="w-full py-32 bg-[#080808]">
          <div className="mx-auto max-w-6xl px-6 space-y-14">
            <div className="reveal space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#4D9FFF]">Everything in one place</p>
              <h2 className="text-4xl font-bold tracking-[-0.02em] text-white sm:text-5xl">
                {TOOLS.length} tools.<br />Zero friction.
              </h2>
              <p className="max-w-lg text-[#A0A0A0] text-[17px] font-light leading-relaxed">
                A comprehensive suite designed to enhance your productivity and creativity.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {TOOLS.map((tool, i) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group reveal" style={{ transitionDelay: `${i * 0.04}s` }}>
                  <div className="glass h-full rounded-xl p-5 transition-all duration-500 hover:-translate-y-0.5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-[#E5E5E5] transition-colors duration-300 group-hover:border-[#4D9FFF]/40 group-hover:text-[#4D9FFF]">
                        <tool.icon className="h-[18px] w-[18px]" />
                      </div>
                      {tool.badge && (
                        <span className="rounded-full border border-[#4D9FFF]/30 bg-[#4D9FFF]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#4D9FFF]">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-[#E5E5E5]">{tool.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#A0A0A0]">{tool.desc}</p>
                    <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-[#4D9FFF] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Open tool <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="reveal">
              <Link href="/tools">
                <button className="flex items-center gap-2 rounded-md border border-white/15 bg-transparent px-5 py-2.5 text-sm font-medium text-[#A0A0A0] transition-all duration-300 hover:border-white/30 hover:text-white">
                  View all {TOOLS.length} tools <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Full-bleed cosmic section ────────────────────────────────────── */}
        <section className="relative w-full py-40 overflow-hidden stars-bg">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4D9FFF]/[0.07] blur-[100px]" />
          </div>
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center space-y-6 reveal">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#4D9FFF]">Our mission</p>
            <h2 className="text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] text-white sm:text-6xl">
              Understanding the tools<br />
              <span className="text-[#E5E5E5]/50">you actually need.</span>
            </h2>
            <p className="text-[17px] font-light text-[#A0A0A0] leading-relaxed max-w-xl mx-auto">
              We build browser-native utilities that respect your privacy, require no account,
              and get out of your way. Simple, fast, permanent.
            </p>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────── */}
        <section id="features" className="w-full py-32 bg-[#080808]">
          <div className="mx-auto max-w-6xl px-6 space-y-14">
            <div className="reveal space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#4D9FFF]">Why ToolKit</p>
              <h2 className="text-4xl font-bold tracking-[-0.02em] text-white sm:text-5xl">
                Built for modern<br />workflows.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => (
                <div key={f.title} className="glass reveal rounded-xl p-6 transition-all duration-500" style={{ transitionDelay: `${i * 0.06}s` }}>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#E5E5E5]">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-[#E5E5E5]">{f.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#A0A0A0]">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section id="faq" className="w-full py-32 bg-[#050505]">
          <div className="mx-auto max-w-3xl px-6 space-y-14">
            <div className="reveal space-y-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#4D9FFF]">FAQ</p>
              <h2 className="text-4xl font-bold tracking-[-0.02em] text-white sm:text-5xl">Common questions.</h2>
            </div>

            <div className="reveal divide-y divide-white/[0.06]">
              {FAQS.map(faq => (
                <div key={faq.q} className="py-6 transition-colors duration-300 hover:bg-white/[0.02] px-2 rounded-lg">
                  <p className="font-semibold text-[#E5E5E5]">{faq.q}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#A0A0A0]">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="relative w-full py-40 overflow-hidden stars-bg">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4D9FFF]/[0.08] blur-[100px]" />
          </div>
          <div className="relative z-10 mx-auto max-w-2xl px-6 text-center space-y-8 reveal">
            <h2 className="text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] text-white sm:text-6xl">
              Ready to build<br />something great?
            </h2>
            <p className="text-[17px] font-light text-[#A0A0A0]">
              All tools are free. No account needed. Start right now.
            </p>
            <Link href="/tools">
              <button className="group inline-flex items-center gap-2 rounded-md bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#E5E5E5]">
                Browse all tools
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </Link>
          </div>
        </section>

      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] bg-[#080808] py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link href="/" className="flex items-center gap-2 font-semibold text-white">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-white">
              <Layers className="h-3.5 w-3.5 text-black" />
            </div>
            TOOLKIT
          </Link>
          <p className="text-xs text-[#A0A0A0]">© {new Date().getFullYear()} ToolKit. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-[#A0A0A0]">
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
