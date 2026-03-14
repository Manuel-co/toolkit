"use client"

import { useState, useRef, useEffect } from "react"
import { RelatedTools } from "@/components/related-tools"
import { ToolHeader } from "@/components/tool-header"
import { Crop, Share2, Download, Upload } from "lucide-react"
import ReactCrop, { Crop as CropType, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { toast } from "sonner"

function centerAspectCrop(w: number, h: number, aspect?: number): CropType {
  if (!aspect) return { unit: "px", x: 0, y: 0, width: w, height: h }
  return centerCrop(makeAspectCrop({ unit: "px", width: w * 0.8 }, aspect, w, h), w, h)
}

const RATIOS: { label: string; value: number | undefined }[] = [
  { label: "Free", value: undefined },
  { label: "Square", value: 1 },
  { label: "16:9", value: 16/9 },
  { label: "3:4", value: 3/4 },
]

export default function ImageCropperPage() {
  const [src, setSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<CropType>()
  const [result, setResult] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined)
  const [activeRatio, setActiveRatio] = useState("Free")
  const imageRef = useRef<HTMLImageElement | null>(null)
  const imgSizeRef = useRef({ width: 0, height: 0 })

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    imgSizeRef.current = { width, height }
    setCrop(centerAspectCrop(width, height, aspectRatio))
  }

  useEffect(() => {
    if (imgSizeRef.current.width) setCrop(centerAspectCrop(imgSizeRef.current.width, imgSizeRef.current.height, aspectRatio))
  }, [aspectRatio])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file"); return }
    const reader = new FileReader()
    reader.onload = () => { setSrc(reader.result as string); setResult(null); setCrop(undefined) }
    reader.readAsDataURL(file)
  }

  const handleCrop = async () => {
    if (!imageRef.current || !crop) { toast.error("Select an area to crop"); return }
    setIsProcessing(true)
    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height
      canvas.width = Math.floor(crop.width * scaleX)
      canvas.height = Math.floor(crop.height * scaleY)
      ctx.imageSmoothingQuality = "high"; ctx.imageSmoothingEnabled = true
      ctx.drawImage(imageRef.current, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, canvas.width, canvas.height)
      setResult(canvas.toDataURL("image/jpeg", 0.9))
      toast.success("Cropped!")
    } catch { toast.error("Failed to crop") }
    finally { setIsProcessing(false) }
  }

  const handleDownload = () => {
    if (!result) return
    const a = document.createElement("a"); a.href = result; a.download = "cropped-image.jpg"; a.click()
    toast.success("Downloaded!")
  }

  const handleShare = async () => {
    if (!result) return
    try {
      const blob = await (await fetch(result)).blob()
      const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" })
      if (navigator.share) { await navigator.share({ title: "Cropped Image", files: [file] }); toast.success("Shared!") }
      else { await navigator.clipboard.writeText(result); toast.success("Copied!") }
    } catch { toast.error("Failed to share") }
  }

  return (
    <div className="space-y-8">
      <ToolHeader icon={Crop} label="Image" title="Image Cropper" description="Crop and resize images with precision. Supports free-form and preset aspect ratios." />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Upload Image</p>
            <label className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] p-8 cursor-pointer hover:border-white/20 transition-colors">
              <Upload className="h-8 w-8 text-white/20" />
              <div className="text-center">
                <p className="text-sm text-[#A0A0A0]">Click to upload an image</p>
                <p className="text-xs text-[#A0A0A0]/50 mt-1">PNG, JPG, WebP supported</p>
              </div>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="sr-only" />
            </label>
          </div>

          {src && (
            <>
              <div className="flex gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
                {RATIOS.map(r => (
                  <button key={r.label} onClick={() => { setActiveRatio(r.label); setAspectRatio(r.value) }}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-medium uppercase tracking-wider transition-all ${activeRatio === r.label ? "bg-white text-black" : "text-[#A0A0A0] hover:text-white"}`}>
                    {r.label}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3">
                <ReactCrop crop={crop} onChange={c => setCrop(c)} aspect={aspectRatio} minWidth={100}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img ref={imageRef} src={src} alt="Upload" className="max-w-full h-auto" onLoad={onImageLoad} />
                </ReactCrop>
              </div>

              <button onClick={handleCrop} disabled={isProcessing || !crop}
                className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-black transition-all hover:bg-[#E5E5E5] disabled:opacity-30 disabled:cursor-not-allowed">
                {isProcessing ? "Processing…" : "Crop Image"}
              </button>
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 min-h-[280px] flex flex-col justify-center">
            {result ? (
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Result</p>
                <div className="rounded-lg overflow-hidden border border-white/[0.08]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result} alt="Cropped" className="w-full h-auto" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 text-xs font-medium text-[#E5E5E5] transition-all hover:border-white/20 hover:text-white">
                    <Share2 className="h-3.5 w-3.5" />Share
                  </button>
                  <button onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 text-xs font-medium text-[#E5E5E5] transition-all hover:border-white/20 hover:text-white">
                    <Download className="h-3.5 w-3.5" />Download
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <Crop className="h-10 w-10 text-white/10 mx-auto" />
                <p className="text-sm text-[#A0A0A0]">Upload and crop an image to see the result</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <RelatedTools currentTool="image-cropper" />
    </div>
  )
}
