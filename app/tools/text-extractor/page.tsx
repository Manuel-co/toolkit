"use client"

import { useState } from "react"
import { RelatedTools } from "@/components/related-tools"
import { ToolHeader } from "@/components/tool-header"
import { FileText, Copy, Check, Download, Upload } from "lucide-react"
import { toast } from "sonner"

export default function TextExtractorPage() {
  const [extractedText, setExtractedText] = useState("")
  const [copied, setCopied] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const extractText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => { setExtractedText(ev.target?.result as string) }
    reader.readAsText(file)
  }

  const copyText = () => {
    navigator.clipboard.writeText(extractedText)
    setCopied(true); toast.success("Copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "extracted-text.txt"; a.click()
    URL.revokeObjectURL(url)
  }

  const wordCount = extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0
  const charCount = extractedText.length

  return (
    <div className="space-y-8">
      <ToolHeader icon={FileText} label="Utility" title="Text Extractor" description="Extract text from TXT, MD, HTML, CSS, JS, JSON, XML, and CSV files. Processed locally in your browser." />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Upload File</p>
            <label className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] p-10 cursor-pointer hover:border-white/20 transition-colors">
              <Upload className="h-8 w-8 text-white/20" />
              <div className="text-center">
                <p className="text-sm text-[#A0A0A0]">{fileName ?? "Click to upload a file"}</p>
                <p className="text-xs text-[#A0A0A0]/50 mt-1">TXT, MD, HTML, CSS, JS, JSON, XML, CSV</p>
              </div>
              <input type="file" accept=".txt,.md,.html,.css,.js,.json,.xml,.csv" onChange={extractText} className="sr-only" />
            </label>
          </div>
        </div>

        {/* Result */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Extracted Text</p>
              {extractedText && (
                <span className="text-[10px] text-[#A0A0A0]/60">{charCount} chars · {wordCount} words</span>
              )}
            </div>
            <textarea
              value={extractedText}
              onChange={e => setExtractedText(e.target.value)}
              placeholder="Extracted text will appear here..."
              className="w-full min-h-[200px] rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 font-mono text-sm text-[#E5E5E5] placeholder:text-[#A0A0A0]/30 outline-none focus:border-[#4D9FFF]/40 transition-colors resize-none"
            />
            <div className="flex gap-2">
              <button onClick={copyText} disabled={!extractedText}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#E5E5E5] disabled:opacity-30 disabled:cursor-not-allowed">
                {copied ? <><Check className="h-4 w-4" />Copied!</> : <><Copy className="h-4 w-4" />Copy</>}
              </button>
              <button onClick={downloadText} disabled={!extractedText}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 text-sm font-medium text-[#E5E5E5] transition-all hover:border-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">
                <Download className="h-4 w-4" />Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools currentTool="text-extractor" />
    </div>
  )
}
