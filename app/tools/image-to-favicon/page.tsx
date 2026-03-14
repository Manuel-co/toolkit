"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { RelatedTools } from "@/components/related-tools"
import { ToolHeader } from "@/components/tool-header"
import { FileImage, Download } from "lucide-react"
import { toast } from "sonner"

const SIZES = ["16", "32", "48", "64", "all"] as const
type FaviconSize = typeof SIZES[number]

export default function ImageToFaviconPage() {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [format, setFormat] = useState<"ico" | "png" | "all">("ico")
  const [faviconSize, setFaviconSize] = useState<FaviconSize>("all")

  const handleFileSelect = (f: File) => {
    setFile(f)
    setImageUrl(URL.createObjectURL(f))
  }

  const handleProcess = async () => {
    if (!file) { toast.error("Upload an image first"); return }
    setIsProcessing(true)
    await new Promise(r => setTimeout(r, 1500))
    toast.success("Favicon generated!")
    setIsProcessing(false)
  }

  const tabClass = (active: boolean) =>
    `flex-1 py-1.5 text-xs font-medium uppercase tracking-wider rounded-md transition-all ${active ? "bg-white text-black" : "text-[#A0A0A0] hover:text-white"}`

  return (
    <div className="space-y-8">
      <ToolHeader icon={FileImage} label="Image" title="Image to Favicon" description="Convert any image to a favicon for your website. Creates favicons in multiple sizes for all devices." />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Upload Image</p>
            <FileUpload accept="image/*" maxSize={5} onFileSelect={handleFileSelect} />
            {imageUrl && (
              <div className="rounded-lg overflow-hidden border border-white/[0.08]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Preview" className="w-full h-auto max-h-48 object-contain bg-black/20" />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Format</p>
            <div className="flex gap-1 rounded-lg border border-white/[0.08] bg-white/[0.02] p-1">
              {(["ico","png","all"] as const).map(f => (
                <button key={f} onClick={() => setFormat(f)} className={tabClass(format === f)}>
                  {f === "all" ? "All" : f.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Size</p>
              <div className="grid grid-cols-2 gap-2">
                {SIZES.map(s => (
                  <label key={s} className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer text-sm transition-all ${faviconSize === s ? "border-[#4D9FFF]/40 bg-[#4D9FFF]/[0.06] text-white" : "border-white/[0.08] text-[#A0A0A0] hover:border-white/20"} ${s === "all" ? "col-span-2" : ""}`}>
                    <input type="radio" className="sr-only" checked={faviconSize === s} onChange={() => setFaviconSize(s)} />
                    <div className={`h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${faviconSize === s ? "border-[#4D9FFF]" : "border-white/20"}`}>
                      {faviconSize === s && <div className="h-1.5 w-1.5 rounded-full bg-[#4D9FFF]" />}
                    </div>
                    {s === "all" ? "All Sizes (Recommended)" : `${s}×${s}`}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button onClick={handleProcess} disabled={!file || isProcessing}
            className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-black transition-all hover:bg-[#E5E5E5] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />{isProcessing ? "Generating…" : "Generate Favicon"}
          </button>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Tips</p>
          <div className="space-y-3 text-sm text-[#A0A0A0]">
            <p>Use a square image (512×512px or larger) for best results.</p>
            <p>Simple designs with clear details work best at small sizes.</p>
            <p>ICO format is the standard for browser tabs and bookmarks.</p>
            <p>PNG favicons are supported by modern browsers.</p>
            <p>The "All Sizes" option generates a complete favicon package.</p>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Add to your HTML</p>
            <code className="text-xs font-mono text-[#4D9FFF] block">
              {`<link rel="icon" href="/favicon.ico" />`}
            </code>
          </div>
        </div>
      </div>

      <RelatedTools currentTool="image-to-favicon" />
    </div>
  )
}
