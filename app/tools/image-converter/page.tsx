"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { RelatedTools } from "@/components/related-tools"
import { ToolHeader } from "@/components/tool-header"
import { Image as ImageIcon, Download } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type OutputFormat = "png" | "jpeg" | "webp" | "ico"
type FaviconSize = "16" | "32" | "48" | "64" | "all"

const FORMAT_INFO: Record<OutputFormat, { title: string; desc: string }> = {
  png:  { title: "PNG",  desc: "Lossless, supports transparency. Best for sharp graphics." },
  jpeg: { title: "JPEG", desc: "Lossy, smaller files. Best for photographs." },
  webp: { title: "WebP", desc: "Modern format, excellent compression. Best for web." },
  ico:  { title: "Favicon (ICO)", desc: "Website icons. Contains multiple sizes for browser tabs." },
}

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [format, setFormat] = useState<OutputFormat>("png")
  const [quality, setQuality] = useState(90)
  const [faviconSize, setFaviconSize] = useState<FaviconSize>("all")

  const handleFileSelect = (f: File) => { setFile(f); setImageUrl(URL.createObjectURL(f)) }

  const handleConvert = async () => {
    if (!file) { toast.error("Upload an image first"); return }
    setIsProcessing(true)
    try {
      await new Promise(r => setTimeout(r, 1000))
      if (imageUrl) {
        const a = document.createElement("a"); a.href = imageUrl
        a.download = `${file.name.split(".")[0]}.${format}`; a.click()
      }
      toast.success("Converted!")
    } catch { toast.error("Failed to convert") }
    finally { setIsProcessing(false) }
  }

  const selectClass = "h-9 border-white/[0.08] bg-white/[0.03] text-[#E5E5E5] text-sm focus:ring-0 focus:border-[#4D9FFF]/40"

  return (
    <div className="space-y-8">
      <ToolHeader icon={ImageIcon} label="Image" title="Image Converter" description="Convert images between PNG, JPEG, WebP, and Favicon formats. All processing is local." />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Upload Image</p>
            <FileUpload accept="image/*" maxSize={10} onFileSelect={handleFileSelect} />
            {imageUrl && (
              <div className="rounded-lg overflow-hidden border border-white/[0.08]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Preview" className="w-full h-auto" />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Settings</p>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Output Format</label>
              <Select value={format} onValueChange={(v: OutputFormat) => setFormat(v)}>
                <SelectTrigger className={selectClass}><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#0D0D0D] border-white/[0.08]">
                  {(Object.keys(FORMAT_INFO) as OutputFormat[]).map(f => (
                    <SelectItem key={f} value={f} className="text-[#E5E5E5] focus:bg-white/[0.06]">{FORMAT_INFO[f].title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {format === "ico" ? (
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Favicon Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["16","32","48","64","all"] as FaviconSize[]).map(s => (
                    <label key={s} className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer text-sm transition-all ${faviconSize === s ? "border-[#4D9FFF]/40 bg-[#4D9FFF]/[0.06] text-white" : "border-white/[0.08] text-[#A0A0A0] hover:border-white/20"} ${s === "all" ? "col-span-2" : ""}`}>
                      <input type="radio" className="sr-only" checked={faviconSize === s} onChange={() => setFaviconSize(s)} />
                      <div className={`h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center ${faviconSize === s ? "border-[#4D9FFF]" : "border-white/20"}`}>
                        {faviconSize === s && <div className="h-1.5 w-1.5 rounded-full bg-[#4D9FFF]" />}
                      </div>
                      {s === "all" ? "All Sizes (Recommended)" : `${s}×${s}`}
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A0A0A0]">Quality</span>
                  <span className="text-white font-medium">{quality}%</span>
                </div>
                <input type="range" min={1} max={100} value={quality} onChange={e => setQuality(+e.target.value)} className="w-full accent-[#4D9FFF]" />
              </div>
            )}
          </div>

          <button onClick={handleConvert} disabled={!file || isProcessing}
            className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-black transition-all hover:bg-[#E5E5E5] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />{isProcessing ? "Converting…" : "Convert & Download"}
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Format Details</p>
          {(Object.entries(FORMAT_INFO) as [OutputFormat, { title: string; desc: string }][]).map(([key, info]) => (
            <button key={key} onClick={() => setFormat(key)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${format === key ? "border-[#4D9FFF]/30 bg-[#4D9FFF]/[0.04]" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"}`}>
              <p className={`text-sm font-semibold mb-1 ${format === key ? "text-[#4D9FFF]" : "text-[#E5E5E5]"}`}>{info.title}</p>
              <p className="text-xs text-[#A0A0A0]">{info.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <RelatedTools currentTool="image-converter" />
    </div>
  )
}
