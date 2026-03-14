"use client"

import { useState } from "react"
import { RelatedTools } from "@/components/related-tools"
import { ToolHeader } from "@/components/tool-header"
import { QrCode, Share2, Download, Check } from "lucide-react"
import { toDataURL, QRCodeToDataURLOptions } from "qrcode"
import { toast } from "sonner"

const TABS = ["url", "text", "contact"] as const
type Tab = typeof TABS[number]

const TAB_LABELS: Record<Tab, string> = { url: "URL", text: "Text", contact: "Contact" }
const PLACEHOLDERS: Record<Tab, string> = {
  url: "https://example.com",
  text: "Enter your text here",
  contact: "Name, Email, Phone",
}

export default function QrCodeGeneratorPage() {
  const [content, setContent] = useState("")
  const [tab, setTab] = useState<Tab>("url")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const formatContent = (val: string, type: Tab) => {
    if (type === "url") return val.match(/^https?:\/\//) ? val : `https://${val}`
    if (type === "contact") {
      const [name = "", email = "", phone = ""] = val.split(",").map(s => s.trim())
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nEMAIL:${email}\nTEL:${phone}\nEND:VCARD`
    }
    return val
  }

  const handleGenerate = async () => {
    if (!content.trim()) return
    setIsProcessing(true)
    try {
      const opts: QRCodeToDataURLOptions = { errorCorrectionLevel: "M", margin: 1, width: 320, color: { dark: "#000000", light: "#ffffff" } }
      setResult(await toDataURL(formatContent(content, tab), opts))
    } catch { toast.error("Failed to generate QR code") }
    finally { setIsProcessing(false) }
  }

  const handleShare = async () => {
    if (!result) return
    try {
      if (navigator.share) {
        const blob = await (await fetch(result)).blob()
        await navigator.share({ title: "QR Code", files: [new File([blob], "qr-code.png", { type: "image/png" })] })
        toast.success("Shared!")
      } else {
        await navigator.clipboard.writeText(result)
        setIsCopied(true); toast.success("Copied!")
        setTimeout(() => setIsCopied(false), 2000)
      }
    } catch { toast.error("Failed to share") }
  }

  const handleDownload = () => {
    if (!result) return
    const a = document.createElement("a"); a.href = result; a.download = "qr-code.png"; a.click()
    toast.success("Downloaded!")
  }

  return (
    <div>
      <ToolHeader icon={QrCode} label="Utility" title="QR Code Generator" description="Generate QR codes for URLs, plain text, or contact cards. Instant, free, no account needed." />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input */}
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Content</p>

          {/* Tab switcher */}
          <div className="flex gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] p-1">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setContent("") }}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
                  tab === t ? "bg-white text-black" : "text-[#A0A0A0] hover:text-white"
                }`}
              >
                {TAB_LABELS[t]}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <input
              placeholder={PLACEHOLDERS[tab]}
              value={content}
              onChange={e => setContent(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleGenerate()}
              className="h-11 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white placeholder:text-[#A0A0A0]/50 outline-none focus:border-[#4D9FFF]/40 transition-colors"
            />
            {tab === "contact" && (
              <p className="text-[11px] text-[#A0A0A0]/60">Format: Name, Email, Phone</p>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={!content.trim() || isProcessing}
            className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-[#E5E5E5] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Generating…" : "Generate QR Code"}
          </button>
        </div>

        {/* Result */}
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 flex flex-col items-center justify-center min-h-[280px]">
          {result ? (
            <div className="flex flex-col items-center gap-5 w-full">
              <div className="rounded-xl overflow-hidden border border-white/10 p-3 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result} alt="QR Code" className="w-56 h-56" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-[#E5E5E5] transition-all hover:border-white/20 hover:text-white"
                >
                  {isCopied ? <><Check className="h-3.5 w-3.5" />Copied</> : <><Share2 className="h-3.5 w-3.5" />Share</>}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-[#E5E5E5] transition-all hover:border-white/20 hover:text-white"
                >
                  <Download className="h-3.5 w-3.5" />Download
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <QrCode className="h-10 w-10 text-white/10 mx-auto" />
              <p className="text-sm text-[#A0A0A0]">Your QR code will appear here</p>
            </div>
          )}
        </div>
      </div>

      <RelatedTools currentTool="qr-code-generator" />
    </div>
  )
}
