"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { RelatedTools } from "@/components/related-tools"
import { ToolHeader } from "@/components/tool-header"
import { Palette, Copy } from "lucide-react"
import { toast } from "sonner"
import ColorThief from "colorthief"

interface Color { rgb: [number, number, number]; hex: string }

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")
}

export default function ColorExtractorPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [dominant, setDominant] = useState<Color | null>(null)
  const [palette, setPalette] = useState<Color[]>([])

  const handleFileSelect = (file: File) => {
    setIsProcessing(true)
    setImageUrl(null); setDominant(null); setPalette([])
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    const img = new Image()
    img.crossOrigin = "Anonymous"; img.src = url
    img.onload = () => {
      try {
        const ct = new ColorThief()
        const dom = ct.getColor(img) as [number, number, number]
        const pal = ct.getPalette(img, 8) as [number, number, number][]
        setDominant({ rgb: dom, hex: rgbToHex(...dom) })
        setPalette(pal.map(rgb => ({ rgb, hex: rgbToHex(...rgb) })))
        toast.success("Colors extracted!")
      } catch { toast.error("Failed to extract colors") }
      setIsProcessing(false)
    }
    img.onerror = () => { toast.error("Failed to load image"); setIsProcessing(false) }
  }

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success(`Copied ${text}!`) }

  const copyPalette = (format: "hex" | "css" | "tailwind") => {
    if (!palette.length) return
    let text = ""
    if (format === "hex") text = palette.map(c => c.hex).join(", ")
    else if (format === "css") text = palette.map((c, i) => `--color-${i + 1}: ${c.hex};`).join("\n")
    else text = `{\n${palette.map((c, i) => `  '${i + 1}': '${c.hex}'`).join(",\n")}\n}`
    navigator.clipboard.writeText(text); toast.success(`Copied as ${format.toUpperCase()}!`)
  }

  const btnClass = "rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[#A0A0A0] transition-all hover:border-white/20 hover:text-white"

  return (
    <div className="space-y-8">
      <ToolHeader icon={Palette} label="Color" title="Color Extractor" description="Extract dominant colors and palettes from any image. Perfect for finding brand colors and design schemes." />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Upload Image</p>
            <FileUpload accept="image/*" maxSize={10} onFileSelect={handleFileSelect} />
            {imageUrl && (
              <div className="rounded-lg overflow-hidden border border-white/[0.08]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Uploaded" className="w-full h-auto" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {/* Dominant color */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Dominant Color</p>
            {isProcessing ? (
              <div className="animate-pulse h-16 rounded-lg bg-white/[0.05]" />
            ) : dominant ? (
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl border border-white/10 shrink-0" style={{ backgroundColor: dominant.hex }} />
                <div className="flex-1">
                  <p className="font-mono text-sm text-white">{dominant.hex}</p>
                  <p className="text-xs text-[#A0A0A0] mt-0.5">RGB({dominant.rgb.join(", ")})</p>
                </div>
                <button onClick={() => copy(dominant.hex)} className={btnClass}><Copy className="h-3.5 w-3.5" /></button>
              </div>
            ) : (
              <p className="text-sm text-[#A0A0A0]/50">Upload an image to extract its dominant color</p>
            )}
          </div>

          {/* Palette */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Color Palette</p>
              {palette.length > 0 && (
                <div className="flex gap-1">
                  <button onClick={() => copyPalette("hex")} className={btnClass}>HEX</button>
                  <button onClick={() => copyPalette("css")} className={btnClass}>CSS</button>
                  <button onClick={() => copyPalette("tailwind")} className={btnClass}>Tailwind</button>
                </div>
              )}
            </div>
            {isProcessing ? (
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="animate-pulse aspect-square rounded-lg bg-white/[0.05]" />)}
              </div>
            ) : palette.length > 0 ? (
              <>
                <div className="grid grid-cols-4 gap-2">
                  {palette.map((color, i) => (
                    <button key={i} onClick={() => copy(color.hex)} title={color.hex}
                      className="group relative aspect-square rounded-lg border border-white/[0.06] transition-transform hover:scale-105"
                      style={{ backgroundColor: color.hex }}>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg transition-opacity">
                        <span className="text-[10px] font-mono text-white">{color.hex}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#A0A0A0]/50 text-center">Click a color to copy its hex code</p>
              </>
            ) : (
              <p className="text-sm text-[#A0A0A0]/50">Upload an image to extract its color palette</p>
            )}
          </div>
        </div>
      </div>

      <RelatedTools currentTool="color-extractor" />
    </div>
  )
}
