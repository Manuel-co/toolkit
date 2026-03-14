"use client"

import { useState, useRef, useCallback } from "react"
import { RelatedTools } from "@/components/related-tools"
import { ToolHeader } from "@/components/tool-header"
import { FileIcon, Download, Loader2, Heading1, Heading2, Heading3, AlignLeft, List } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { jsPDF } from "jspdf"

interface PDFSettings {
  fontSize: number
  fontName: "helvetica" | "courier" | "times"
  pageSize: "a4" | "letter" | "legal"
  orientation: "portrait" | "landscape"
  margins: number
  lineSpacing: number
  title: string
  includeTimestamp: boolean
}

type BlockType = "h1" | "h2" | "h3" | "p" | "ul"

interface Block {
  id: string
  type: BlockType
  content: string
}

const BLOCK_STYLES: Record<BlockType, { label: string }> = {
  h1: { label: "Heading 1" },
  h2: { label: "Heading 2" },
  h3: { label: "Heading 3" },
  p:  { label: "Paragraph" },
  ul: { label: "Bullet List" },
}

function uid() {
  return Math.random().toString(36).slice(2)
}

const selectClass = "h-9 border-white/[0.08] bg-white/[0.03] text-[#E5E5E5] text-sm focus:ring-0 focus:border-[#4D9FFF]/40"
const selectContentClass = "bg-[#0D0D0D] border-white/[0.08]"
const selectItemClass = "text-[#E5E5E5] focus:bg-white/[0.06]"

export default function TextToPDFPage() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: uid(), type: "h1", content: "" },
    { id: uid(), type: "p",  content: "" },
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const [settings, setSettings] = useState<PDFSettings>({
    fontSize: 12,
    fontName: "helvetica",
    pageSize: "a4",
    orientation: "portrait",
    margins: 20,
    lineSpacing: 1.4,
    title: "",
    includeTimestamp: false,
  })

  const inputRefs = useRef<Record<string, HTMLElement | null>>({})

  const addBlock = useCallback((type: BlockType, afterId?: string) => {
    const newBlock: Block = { id: uid(), type, content: "" }
    setBlocks(prev => {
      if (!afterId) return [...prev, newBlock]
      const idx = prev.findIndex(b => b.id === afterId)
      const next = [...prev]
      next.splice(idx + 1, 0, newBlock)
      return next
    })
    setTimeout(() => inputRefs.current[newBlock.id]?.focus(), 0)
  }, [])

  const updateBlock = useCallback((id: string, content: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b))
  }, [])

  const changeBlockType = useCallback((id: string, type: BlockType) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, type } : b))
  }, [])

  const removeBlock = useCallback((id: string) => {
    setBlocks(prev => prev.length <= 1 ? prev : prev.filter(b => b.id !== id))
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, block: Block) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      addBlock("p", block.id)
    } else if (e.key === "Backspace" && block.content === "") {
      e.preventDefault()
      removeBlock(block.id)
    }
  }, [addBlock, removeBlock])

  const handleGenerate = async () => {
    if (!blocks.some(b => b.content.trim())) {
      toast.error("Please add some content first")
      return
    }
    setIsProcessing(true)
    try {
      const doc = new jsPDF({ orientation: settings.orientation, unit: "mm", format: settings.pageSize })
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const maxWidth = pageWidth - settings.margins * 2
      let y = settings.margins

      const checkPage = (needed: number) => {
        if (y + needed > pageHeight - settings.margins) { doc.addPage(); y = settings.margins }
      }

      if (settings.title) {
        doc.setFont(settings.fontName, "bold"); doc.setFontSize(settings.fontSize + 8)
        checkPage(14); doc.text(settings.title, settings.margins, y); y += 14
      }
      if (settings.includeTimestamp) {
        doc.setFont(settings.fontName, "normal"); doc.setFontSize(settings.fontSize - 2)
        checkPage(6); doc.text(new Date().toLocaleString(), settings.margins, y); y += 8
      }

      for (const block of blocks) {
        if (!block.content.trim()) { y += 4; continue }
        switch (block.type) {
          case "h1":
            doc.setFont(settings.fontName, "bold"); doc.setFontSize(settings.fontSize + 10); checkPage(14)
            doc.splitTextToSize(block.content, maxWidth).forEach((l: string) => { checkPage(12); doc.text(l, settings.margins, y); y += 12 })
            y += 4; break
          case "h2":
            doc.setFont(settings.fontName, "bold"); doc.setFontSize(settings.fontSize + 6); checkPage(11)
            doc.splitTextToSize(block.content, maxWidth).forEach((l: string) => { checkPage(10); doc.text(l, settings.margins, y); y += 10 })
            y += 3; break
          case "h3":
            doc.setFont(settings.fontName, "bold"); doc.setFontSize(settings.fontSize + 3); checkPage(9)
            doc.splitTextToSize(block.content, maxWidth).forEach((l: string) => { checkPage(8); doc.text(l, settings.margins, y); y += 8 })
            y += 2; break
          case "ul":
            doc.setFont(settings.fontName, "normal"); doc.setFontSize(settings.fontSize)
            block.content.split("\n").filter(Boolean).forEach(item => {
              doc.splitTextToSize(`• ${item}`, maxWidth - 4).forEach((l: string, i: number) => {
                checkPage(settings.fontSize * settings.lineSpacing * 0.35 + 1)
                doc.text(l, settings.margins + (i > 0 ? 4 : 0), y)
                y += settings.fontSize * settings.lineSpacing * 0.35
              })
            })
            y += 3; break
          default:
            doc.setFont(settings.fontName, "normal"); doc.setFontSize(settings.fontSize)
            doc.splitTextToSize(block.content, maxWidth).forEach((l: string) => {
              checkPage(settings.fontSize * settings.lineSpacing * 0.35 + 1)
              doc.text(l, settings.margins, y); y += settings.fontSize * settings.lineSpacing * 0.35
            })
            y += 3
        }
      }

      const filename = settings.title
        ? `${settings.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.pdf`
        : "document.pdf"
      doc.save(filename)
      toast.success("PDF downloaded!")
    } catch (err) {
      console.error(err); toast.error("Failed to generate PDF")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div>
      <ToolHeader icon={FileIcon} label="Utility" title="Text to PDF" description="Write rich documents with headings, paragraphs, and lists — then export as a polished PDF." />

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        {/* Editor */}
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 p-2 rounded-xl border border-white/[0.08] bg-white/[0.03]">
            {([
              { type: "h1" as BlockType, icon: <Heading1 className="h-4 w-4" />, label: "H1" },
              { type: "h2" as BlockType, icon: <Heading2 className="h-4 w-4" />, label: "H2" },
              { type: "h3" as BlockType, icon: <Heading3 className="h-4 w-4" />, label: "H3" },
              { type: "p"  as BlockType, icon: <AlignLeft className="h-4 w-4" />, label: "P" },
              { type: "ul" as BlockType, icon: <List className="h-4 w-4" />, label: "List" },
            ]).map(({ type, icon, label }) => (
              <button
                key={type}
                onClick={() => addBlock(type)}
                title={`Add ${BLOCK_STYLES[type].label}`}
                className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[#A0A0A0] transition-all hover:border-white/20 hover:text-white"
              >
                {icon}{label}
              </button>
            ))}
          </div>

          {/* Blocks */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] divide-y divide-white/[0.05] min-h-[400px]">
            {blocks.map((block) => (
              <BlockRow
                key={block.id}
                block={block}
                inputRefs={inputRefs}
                onKeyDown={handleKeyDown}
                onChange={updateBlock}
                onTypeChange={changeBlockType}
              />
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isProcessing}
            className="w-full rounded-lg bg-white py-3 text-sm font-semibold text-black transition-all hover:bg-[#E5E5E5] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing
              ? <><Loader2 className="h-4 w-4 animate-spin" />Generating…</>
              : <><Download className="h-4 w-4" />Download PDF</>
            }
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">PDF Settings</p>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Document Title</label>
              <input
                placeholder="Optional title"
                value={settings.title}
                onChange={e => setSettings(p => ({ ...p, title: e.target.value }))}
                className="h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white placeholder:text-[#A0A0A0]/50 outline-none focus:border-[#4D9FFF]/40 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Font</label>
              <Select value={settings.fontName} onValueChange={(v: PDFSettings["fontName"]) => setSettings(p => ({ ...p, fontName: v }))}>
                <SelectTrigger className={selectClass}><SelectValue /></SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="helvetica" className={selectItemClass}>Helvetica</SelectItem>
                  <SelectItem value="times" className={selectItemClass}>Times New Roman</SelectItem>
                  <SelectItem value="courier" className={selectItemClass}>Courier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Font Size</label>
              <Select value={settings.fontSize.toString()} onValueChange={v => setSettings(p => ({ ...p, fontSize: parseInt(v) }))}>
                <SelectTrigger className={selectClass}><SelectValue /></SelectTrigger>
                <SelectContent className={selectContentClass}>
                  {[10, 11, 12, 14, 16].map(s => (
                    <SelectItem key={s} value={s.toString()} className={selectItemClass}>{s}pt</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Page Size</label>
              <Select value={settings.pageSize} onValueChange={(v: PDFSettings["pageSize"]) => setSettings(p => ({ ...p, pageSize: v }))}>
                <SelectTrigger className={selectClass}><SelectValue /></SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="a4" className={selectItemClass}>A4</SelectItem>
                  <SelectItem value="letter" className={selectItemClass}>Letter</SelectItem>
                  <SelectItem value="legal" className={selectItemClass}>Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Orientation</label>
              <Select value={settings.orientation} onValueChange={(v: PDFSettings["orientation"]) => setSettings(p => ({ ...p, orientation: v }))}>
                <SelectTrigger className={selectClass}><SelectValue /></SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="portrait" className={selectItemClass}>Portrait</SelectItem>
                  <SelectItem value="landscape" className={selectItemClass}>Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Line Spacing</label>
              <Select value={settings.lineSpacing.toString()} onValueChange={v => setSettings(p => ({ ...p, lineSpacing: parseFloat(v) }))}>
                <SelectTrigger className={selectClass}><SelectValue /></SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="1" className={selectItemClass}>Single</SelectItem>
                  <SelectItem value="1.4" className={selectItemClass}>Comfortable</SelectItem>
                  <SelectItem value="1.5" className={selectItemClass}>1.5 Lines</SelectItem>
                  <SelectItem value="2" className={selectItemClass}>Double</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Include Timestamp</label>
              <button
                onClick={() => setSettings(p => ({ ...p, includeTimestamp: !p.includeTimestamp }))}
                className={`relative h-5 w-9 rounded-full transition-colors ${settings.includeTimestamp ? "bg-[#4D9FFF]" : "bg-white/10"}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${settings.includeTimestamp ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Tips</p>
            <p className="text-xs text-[#A0A0A0]/70">Press <kbd className="rounded bg-white/[0.06] px-1 py-0.5 text-[10px]">Enter</kbd> to add a paragraph.</p>
            <p className="text-xs text-[#A0A0A0]/70">Press <kbd className="rounded bg-white/[0.06] px-1 py-0.5 text-[10px]">Backspace</kbd> on empty block to remove.</p>
            <p className="text-xs text-[#A0A0A0]/70">Use toolbar to insert blocks anywhere.</p>
          </div>
        </div>
      </div>

      <RelatedTools currentTool="text-to-pdf" />
    </div>
  )
}

// ── Block row ────────────────────────────────────────────────────────────────

interface BlockRowProps {
  block: Block
  inputRefs: React.MutableRefObject<Record<string, HTMLElement | null>>
  onKeyDown: (e: React.KeyboardEvent, block: Block) => void
  onChange: (id: string, content: string) => void
  onTypeChange: (id: string, type: BlockType) => void
}

const TYPE_ICONS: Record<BlockType, React.ReactNode> = {
  h1: <Heading1 className="h-3.5 w-3.5" />,
  h2: <Heading2 className="h-3.5 w-3.5" />,
  h3: <Heading3 className="h-3.5 w-3.5" />,
  p:  <AlignLeft className="h-3.5 w-3.5" />,
  ul: <List className="h-3.5 w-3.5" />,
}

function BlockRow({ block, inputRefs, onKeyDown, onChange, onTypeChange }: BlockRowProps) {
  const isMultiline = block.type === "ul"

  const inputClass = [
    "w-full bg-transparent focus:outline-none resize-none placeholder:text-white/20 py-2.5 px-3 text-white",
    block.type === "h1" ? "text-3xl font-bold" :
    block.type === "h2" ? "text-2xl font-semibold" :
    block.type === "h3" ? "text-xl font-semibold" :
    "text-base",
  ].join(" ")

  return (
    <div className="flex items-start gap-1 px-2 group hover:bg-white/[0.02] transition-colors">
      <div className="pt-2.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Select value={block.type} onValueChange={(v: BlockType) => onTypeChange(block.id, v)}>
          <SelectTrigger className="h-6 w-6 p-0 border-0 bg-transparent text-[#A0A0A0] hover:text-white [&>svg]:hidden">
            {TYPE_ICONS[block.type]}
          </SelectTrigger>
          <SelectContent className="bg-[#0D0D0D] border-white/[0.08]">
            {(Object.keys(BLOCK_STYLES) as BlockType[]).map(t => (
              <SelectItem key={t} value={t} className="text-[#E5E5E5] focus:bg-white/[0.06]">
                <span className="flex items-center gap-2">{TYPE_ICONS[t]}{BLOCK_STYLES[t].label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isMultiline ? (
        <textarea
          ref={el => { inputRefs.current[block.id] = el }}
          className={inputClass + " min-h-[80px]"}
          placeholder="- List item (one per line)"
          value={block.content}
          onChange={e => onChange(block.id, e.target.value)}
          rows={3}
        />
      ) : (
        <input
          ref={el => { inputRefs.current[block.id] = el }}
          className={inputClass}
          placeholder={BLOCK_STYLES[block.type].label}
          value={block.content}
          onChange={e => onChange(block.id, e.target.value)}
          onKeyDown={e => onKeyDown(e, block)}
        />
      )}
    </div>
  )
}
