"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { RelatedTools } from "@/components/related-tools"
import { ToolHeader } from "@/components/tool-header"
import { Image as ImageIcon, Download, ArrowRight } from "lucide-react"
import { toast } from "sonner"

interface CompressionResult {
  url: string
  originalSize: number
  compressedSize: number
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024, sizes = ["B","KB","MB","GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<CompressionResult | null>(null)
  const [quality, setQuality] = useState(80)
  const [maxWidth, setMaxWidth] = useState(1920)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setImageUrl(URL.createObjectURL(selectedFile))
    setResult(null)
  }

  const handleCompress = async () => {
    if (!file || !imageUrl) { toast.error("Upload an image first"); return }
    setIsProcessing(true)
    try {
      const img = new Image()
      img.src = imageUrl
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej })
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      let w = img.width, h = img.height
      if (w > maxWidth) { h = (maxWidth * h) / w; w = maxWidth }
      canvas.width = w; canvas.height = h
      ctx.drawImage(img, 0, 0, w, h)
      const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), "image/jpeg", quality / 100))
      setResult({ url: URL.createObjectURL(blob), originalSize: file.size, compressedSize: blob.size })
      toast.success("Compressed!")
    } catch { toast.error("Failed to compress") }
    finally { setIsProcessing(false) }
  }

  const handleDownload = () => {
    if (!result) return
    const a = document.createElement("a"); a.href = result.url; a.download = `compressed_${file!.name}`; a.click()
  }

  const savings = result ? (((result.originalSize - result.compressedSize) / result.originalSize) * 100).toFixed(1) : null

  return (
    <div className="space-y-8">
      <ToolHeader icon={ImageIcon} label="Image" title="Image Compressor" description="Compress images while maintaining visual quality. All processing is done locally in your browser." />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Upload Image</p>
            <FileUpload accept="image/*" maxSize={10} onFileSelect={handleFileSelect} />
            {imageUrl && (
              <div className="rounded-lg overflow-hidden border border-white/[0.08]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Original" className="w-full h-auto" />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Settings</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#A0A0A0]">Quality</span>
                <span className="text-white font-medium">{quality}%</span>
              </div>
              <input type="range" min={1} max={100} value={quality} onChange={e => setQuality(+e.target.value)} className="w-full accent-[#4D9FFF]" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#A0A0A0]">Max Width</span>
                <span className="text-white font-medium">{maxWidth}px</span>
              </div>
              <input type="range" min={800} max={3840} step={160} value={maxWidth} onChange={e => setMaxWidth(+e.target.value)} className="w-full accent-[#4D9FFF]" />
            </div>
          </div>

          <button onClick={handleCompress} disabled={!file || isProcessing}
            className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-black transition-all hover:bg-[#E5E5E5] disabled:opacity-30 disabled:cursor-not-allowed">
            {isProcessing ? "Compressing…" : "Compress Image"}
          </button>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 min-h-[200px] flex flex-col justify-center">
            {result ? (
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Result</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-[#A0A0A0]">Original</p>
                    <p className="text-xl font-bold text-white">{formatBytes(result.originalSize)}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#A0A0A0]" />
                  <div className="flex-1 space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-[#A0A0A0]">Compressed</p>
                    <p className="text-xl font-bold text-white">{formatBytes(result.compressedSize)}</p>
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-[#A0A0A0]">Saved</p>
                    <p className="text-xl font-bold text-green-400">{savings}%</p>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden border border-white/[0.08]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.url} alt="Compressed" className="w-full h-auto" />
                </div>
                <button onClick={handleDownload}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 text-sm font-medium text-[#E5E5E5] transition-all hover:border-white/20 hover:text-white flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />Download Compressed
                </button>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <ImageIcon className="h-10 w-10 text-white/10 mx-auto" />
                <p className="text-sm text-[#A0A0A0]">Upload an image and compress it to see the result</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <RelatedTools currentTool="image-compressor" />
    </div>
  )
}
