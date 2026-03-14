"use client"

import { useState, useEffect } from "react"
import { RelatedTools } from "@/components/related-tools"
import { ToolHeader } from "@/components/tool-header"
import { Copy, RefreshCw, Palette, X } from "lucide-react"
import { toast } from "sonner"

interface Color { hex: string; rgb: string; hsl: string }
interface SavedPalette { id: string; name: string; colors: Color[]; createdAt: string }

function hslToHex(h: number, s: number, l: number) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1))).toString(16).padStart(2, "0") }
  return `#${f(0)}${f(8)}${f(4)}`
}
function hslToRgb(h: number, s: number, l: number) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1))) }
  return `rgb(${f(0)}, ${f(8)}, ${f(4)})`
}

export default function ColorPaletteGeneratorPage() {
  const [palettes, setPalettes] = useState<SavedPalette[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [current, setCurrent] = useState<Color[]>([])
  const [paletteName, setPaletteName] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("colorPalettes")
    if (saved) setPalettes(JSON.parse(saved))
    setIsLoading(false)
    generateNew()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isLoading) localStorage.setItem("colorPalettes", JSON.stringify(palettes))
  }, [palettes, isLoading])

  const generateNew = () => {
    const base = Math.floor(Math.random() * 360)
    setCurrent(Array.from({ length: 5 }, (_, i) => {
      const h = (base + i * 72) % 360
      const s = Math.floor(Math.random() * 30) + 60
      const l = Math.floor(Math.random() * 20) + 40
      return { hex: hslToHex(h, s, l), rgb: hslToRgb(h, s, l), hsl: `hsl(${h}, ${s}%, ${l}%)` }
    }))
  }

  const savePalette = () => {
    if (!paletteName.trim()) return
    setPalettes(p => [...p, { id: Date.now().toString(), name: paletteName, colors: current, createdAt: new Date().toISOString() }])
    setPaletteName(""); toast.success("Palette saved!")
  }

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success(`Copied ${text}!`) }

  return (
    <div className="space-y-8">
      <ToolHeader icon={Palette} label="Color" title="Color Palette Generator" description="Generate beautiful color palettes for your projects. Save favorites and copy in multiple formats." />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Generate Palette</p>

            {/* Color swatches */}
            <div className="grid grid-cols-5 gap-2">
              {current.map((color, i) => (
                <button key={i} onClick={() => copy(color.hex)} title={color.hex}
                  className="group relative aspect-square rounded-xl border border-white/[0.06] transition-transform hover:scale-105"
                  style={{ backgroundColor: color.hex }}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-xl transition-opacity">
                    <span className="text-[9px] font-mono text-white">{color.hex}</span>
                  </div>
                </button>
              ))}
            </div>

            <button onClick={generateNew}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-sm font-medium text-[#E5E5E5] transition-all hover:border-white/20 hover:text-white">
              <RefreshCw className="h-4 w-4" />Generate New
            </button>

            <div className="flex gap-2">
              <input placeholder="Palette name" value={paletteName} onChange={e => setPaletteName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && savePalette()}
                className="flex-1 h-9 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white placeholder:text-[#A0A0A0]/40 outline-none focus:border-[#4D9FFF]/40 transition-colors" />
              <button onClick={savePalette} disabled={!paletteName.trim()}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-[#E5E5E5] disabled:opacity-30 disabled:cursor-not-allowed">
                Save
              </button>
            </div>
          </div>

          {/* Current palette details */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
            {current.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg border border-white/[0.06] shrink-0" style={{ backgroundColor: c.hex }} />
                <span className="font-mono text-xs text-[#E5E5E5] flex-1">{c.hex}</span>
                <span className="text-xs text-[#A0A0A0]">{c.rgb}</span>
                <button onClick={() => copy(c.hex)} className="text-[#A0A0A0] hover:text-white transition-colors"><Copy className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Saved Palettes</p>
          {isLoading ? (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-8 text-center">
              <div className="animate-spin h-6 w-6 border-2 border-white/20 border-t-white rounded-full mx-auto" />
            </div>
          ) : palettes.length > 0 ? (
            <div className="space-y-3">
              {palettes.map(p => (
                <div key={p.id} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#E5E5E5]">{p.name}</p>
                      <p className="text-xs text-[#A0A0A0]/60">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => setPalettes(prev => prev.filter(x => x.id !== p.id))} className="text-[#A0A0A0] hover:text-white transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {p.colors.map((c, i) => (
                      <button key={i} onClick={() => copy(c.hex)} title={c.hex}
                        className="group relative aspect-square rounded-lg border border-white/[0.06] transition-transform hover:scale-105"
                        style={{ backgroundColor: c.hex }}>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg transition-opacity">
                          <span className="text-[9px] font-mono text-white">{c.hex}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-8 text-center space-y-2">
              <Palette className="h-8 w-8 text-white/10 mx-auto" />
              <p className="text-sm text-[#A0A0A0]">No palettes saved yet</p>
            </div>
          )}
        </div>
      </div>

      <RelatedTools currentTool="color-palette-generator" />
    </div>
  )
}
