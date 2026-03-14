"use client"

import { useState, useEffect } from "react"
import { RelatedTools } from "@/components/related-tools"
import { ToolHeader } from "@/components/tool-header"
import { Link as LinkIcon, Copy, Check, Trash2, ExternalLink, BarChart3 } from "lucide-react"
import { toast } from "sonner"

interface ShortenedURL {
  id: string
  originalUrl: string
  shortCode: string
  shortUrl: string
  clicks: number
  createdAt: string
}

function generateCode() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

function isValidUrl(s: string) {
  try { const u = new URL(s); return u.protocol === "http:" || u.protocol === "https:" } catch { return false }
}

export default function URLShortenerPage() {
  const [url, setUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [urls, setUrls] = useState<ShortenedURL[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("shortenedUrls")
    if (saved) setUrls(JSON.parse(saved))
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) localStorage.setItem("shortenedUrls", JSON.stringify(urls))
  }, [urls, isLoading])

  const handleShorten = () => {
    if (!url.trim()) { toast.error("Enter a URL"); return }
    if (!isValidUrl(url)) { toast.error("Enter a valid URL (http:// or https://)"); return }
    if (customSlug && urls.some(u => u.shortCode === customSlug)) { toast.error("Slug already in use"); return }
    const shortCode = customSlug || generateCode()
    const shortUrl = `${window.location.origin}/s/${shortCode}`
    setUrls(p => [{ id: Date.now().toString(), originalUrl: url, shortCode, shortUrl, clicks: 0, createdAt: new Date().toISOString() }, ...p])
    setUrl(""); setCustomSlug(""); toast.success("URL shortened!")
  }

  const copyUrl = (id: string, text: string) => {
    navigator.clipboard.writeText(text); setCopiedId(id); toast.success("Copied!")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const deleteUrl = (id: string) => { setUrls(p => p.filter(u => u.id !== id)); toast.success("Deleted") }
  const trackClick = (id: string) => setUrls(p => p.map(u => u.id === id ? { ...u, clicks: u.clicks + 1 } : u))

  return (
    <div className="space-y-8">
      <ToolHeader icon={LinkIcon} label="Utility" title="URL Shortener" description="Create short, memorable links. Track clicks and manage all your shortened URLs locally." />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* Form */}
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4 h-fit lg:sticky lg:top-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Shorten URL</p>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Long URL</label>
            <input type="url" placeholder="https://example.com/very/long/url" value={url} onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleShorten()}
              className="h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white placeholder:text-[#A0A0A0]/40 outline-none focus:border-[#4D9FFF]/40 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Custom Slug (Optional)</label>
            <input placeholder="my-custom-link" value={customSlug}
              onChange={e => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              onKeyDown={e => e.key === "Enter" && handleShorten()}
              className="h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white placeholder:text-[#A0A0A0]/40 outline-none focus:border-[#4D9FFF]/40 transition-colors" />
            <p className="text-[11px] text-[#A0A0A0]/50">Leave empty for a random code</p>
          </div>
          <button onClick={handleShorten}
            className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-black transition-all hover:bg-[#E5E5E5] flex items-center justify-center gap-2">
            <LinkIcon className="h-4 w-4" />Shorten URL
          </button>
        </div>

        {/* List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Your Links</p>
            {urls.length > 0 && <span className="text-xs text-[#A0A0A0]/60">{urls.length} {urls.length === 1 ? "link" : "links"}</span>}
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-8 flex justify-center">
              <div className="animate-spin h-6 w-6 border-2 border-white/20 border-t-white rounded-full" />
            </div>
          ) : urls.length > 0 ? (
            <div className="space-y-3">
              {urls.map(item => (
                <div key={item.id} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-2 hover:border-white/[0.12] transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#4D9FFF] truncate">{item.shortUrl}</p>
                      <p className="text-xs text-[#A0A0A0] truncate mt-0.5">{item.originalUrl}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => copyUrl(item.id, item.shortUrl)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#A0A0A0] hover:text-white transition-all">
                        {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <a href={item.originalUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#A0A0A0] hover:text-white transition-all">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button onClick={() => deleteUrl(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#A0A0A0] hover:text-red-400 transition-all">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#A0A0A0]/60">
                    <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" />{item.clicks} clicks</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-10 text-center space-y-2">
              <LinkIcon className="h-10 w-10 text-white/10 mx-auto" />
              <p className="text-sm text-[#A0A0A0]">No shortened URLs yet</p>
            </div>
          )}
        </div>
      </div>

      <RelatedTools currentTool="url-shortener" />
    </div>
  )
}
