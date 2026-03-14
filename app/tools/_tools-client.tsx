"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowRight, Search, ImageIcon, Crop, Palette, FileText, QrCode, Layers, Code, Key, FileIcon, Link as LinkIcon, BookOpen } from "lucide-react"

const tools = [
  { name: "Code Snippet Manager",    description: "Store, organize, and share your code snippets",          details: "Save reusable code with syntax highlighting and tags.",              icon: Code,      badge: "New",  slug: "code-snippet-manager",    category: "developer" },
  { name: "Color Extractor",         description: "Extract color palettes from any image",                  details: "Identifies dominant colors and creates harmonious palettes.",        icon: Palette,   badge: null,   slug: "color-extractor",         category: "design"    },
  { name: "Color Palette Generator", description: "Generate beautiful color palettes for your projects",    details: "Create harmonious color combinations with HSL controls.",            icon: Palette,   badge: "New",  slug: "color-palette-generator", category: "design"    },
  { name: "Gradient Generator",      description: "Create beautiful CSS gradients for your website",        details: "Design linear, radial, and conic gradients with custom colors.",     icon: Palette,   badge: "New",  slug: "gradient-generator",      category: "design"    },
  { name: "Image Compressor",        description: "Compress images without losing quality",                 details: "Reduce file size while maintaining visual quality.",                 icon: ImageIcon, badge: "New",  slug: "image-compressor",        category: "image"     },
  { name: "Image Converter",         description: "Convert images between different formats",               details: "Supports JPG, PNG, WEBP, SVG, and more.",                           icon: Layers,    badge: null,   slug: "image-converter",         category: "image"     },
  { name: "Image Cropper",           description: "Crop and resize images to your desired dimensions",      details: "Supports custom aspect ratios and precise pixel dimensions.",        icon: Crop,      badge: null,   slug: "image-cropper",           category: "image"     },
  { name: "Markdown Editor",         description: "Write and preview markdown documents",                   details: "Save locally and export as .md files with live preview.",           icon: BookOpen,  badge: "New",  slug: "markdown-editor",         category: "text"      },
  { name: "Password Generator",      description: "Generate secure, random passwords",                      details: "Customizable length and character types.",                           icon: Key,       badge: null,   slug: "password-generator",      category: "utility"   },
  { name: "QR Code Generator",       description: "Generate QR codes for URLs, text, and more",            details: "Customizable QR codes with error correction options.",               icon: QrCode,    badge: null,   slug: "qr-code-generator",       category: "utility"   },
  { name: "Text Extractor",          description: "Extract text from various file formats",                 details: "Supports TXT, MD, HTML, CSS, JS, JSON, XML, and CSV.",              icon: FileText,  badge: "New",  slug: "text-extractor",          category: "text"      },
  { name: "Text to PDF",             description: "Convert rich text to PDF",                               details: "Headings, paragraphs, lists — exported as a polished PDF.",         icon: FileIcon,  badge: null,   slug: "text-to-pdf",             category: "text"      },
  { name: "URL Shortener",           description: "Create short, memorable links for your long URLs",       details: "Track clicks and manage shortened URLs with custom slugs.",          icon: LinkIcon,  badge: "New",  slug: "url-shortener",           category: "utility"   },
]

export default function ToolsPage() {
  const [query, setQuery] = useState("")
  const [cat, setCat] = useState("all")

  const categories = useMemo(() => ["all", ...Array.from(new Set(tools.map(t => t.category)))], [])

  const filtered = useMemo(() =>
    tools.filter(t => {
      const q = query.toLowerCase()
      return (cat === "all" || t.category === cat) &&
        (!q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    }), [query, cat])

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#4D9FFF]">Free · No Login · Browser-Based</p>
        <h1 className="text-5xl font-extrabold tracking-[-0.03em] text-white sm:text-6xl">
          All Tools.
        </h1>
        <p className="max-w-lg text-[17px] font-light leading-relaxed text-[#A0A0A0]">
          {tools.length} browser-based tools for developers and creators. No limits, no account.
        </p>
      </div>

      {/* Search + filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A0A0]" />
          <input
            placeholder="Search tools..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-11 pr-4 text-sm text-white placeholder:text-[#A0A0A0]/50 outline-none focus:border-[#4D9FFF]/40 transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
                cat === c
                  ? "bg-white text-black"
                  : "border border-white/[0.08] bg-transparent text-[#A0A0A0] hover:border-white/20 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        {query && (
          <p className="text-xs text-[#A0A0A0]">
            {filtered.length} {filtered.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(tool => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
              <div className="h-full rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/[0.16] hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(77,159,255,0.07)]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-[#E5E5E5] transition-colors duration-300 group-hover:border-[#4D9FFF]/30 group-hover:text-[#4D9FFF]">
                    <tool.icon className="h-[18px] w-[18px]" />
                  </div>
                  {tool.badge && (
                    <span className="rounded-full border border-[#4D9FFF]/30 bg-[#4D9FFF]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#4D9FFF]">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-[#E5E5E5]">{tool.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#A0A0A0]">{tool.description}</p>
                <p className="mt-1 text-xs text-[#A0A0A0]/60">{tool.details}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded border border-white/[0.06] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#A0A0A0]/60">
                    {tool.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-[#4D9FFF] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Open <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-[#A0A0A0]">No tools found.</p>
          <button onClick={() => { setQuery(""); setCat("all") }} className="mt-3 text-xs text-[#4D9FFF] hover:underline">
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
