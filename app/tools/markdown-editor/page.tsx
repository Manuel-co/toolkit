"use client"

import { useState, useEffect, useRef } from "react"
import {
  FileEdit, Bold, Italic, Strikethrough, Code, Heading1,
  Link, List, ListOrdered, Quote, FileCode, Copy, Download, Trash2, BookOpen, X,
} from "lucide-react"
import { toast } from "sonner"
import { RelatedTools } from "@/components/related-tools"
import { ToolHeader } from "@/components/tool-header"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { useIsMobile } from "@/hooks/use-mobile"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

export default function MarkdownEditorPage() {
  const [markdown, setMarkdown] = useState<string>("")
  const [showCheatsheet, setShowCheatsheet] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pendingCursorRef = useRef<number | null>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    try {
      const saved = localStorage.getItem("markdown-editor-content")
      if (saved) setMarkdown(saved)
    } catch {}
  }, [])

  useEffect(() => {
    const id = setTimeout(() => {
      try { localStorage.setItem("markdown-editor-content", markdown) } catch {}
    }, 800)
    return () => clearTimeout(id)
  }, [markdown])

  useEffect(() => {
    if (pendingCursorRef.current !== null && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(pendingCursorRef.current, pendingCursorRef.current)
      pendingCursorRef.current = null
    }
  }, [markdown])

  function applyFormat(before: string, after: string, placeholder: string) {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = markdown.slice(start, end) || placeholder
    const next = markdown.slice(0, start) + before + selected + after + markdown.slice(end)
    setMarkdown(next)
    pendingCursorRef.current = start + before.length + selected.length + after.length
  }

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown)
    toast.success("Copied to clipboard!")
  }

  function downloadMarkdown() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "document.md"; a.click()
    URL.revokeObjectURL(url)
  }

  const btnClass = "flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-xs text-[#A0A0A0] transition-all hover:border-white/20 hover:text-white"
  const iconBtnClass = "flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#A0A0A0] transition-all hover:border-white/20 hover:text-white"

  const toolbar = (
    <div className="flex flex-wrap items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-2">
      <button className={iconBtnClass} onClick={() => applyFormat("**", "**", "bold text")} title="Bold"><Bold className="h-3.5 w-3.5" /></button>
      <button className={iconBtnClass} onClick={() => applyFormat("_", "_", "italic text")} title="Italic"><Italic className="h-3.5 w-3.5" /></button>
      <button className={iconBtnClass} onClick={() => applyFormat("~~", "~~", "strikethrough")} title="Strikethrough"><Strikethrough className="h-3.5 w-3.5" /></button>
      <button className={iconBtnClass} onClick={() => applyFormat("`", "`", "code")} title="Inline Code"><Code className="h-3.5 w-3.5" /></button>
      <button className={iconBtnClass} onClick={() => applyFormat("# ", "", "Heading")} title="Heading"><Heading1 className="h-3.5 w-3.5" /></button>
      <button className={iconBtnClass} onClick={() => applyFormat("[", "](url)", "link text")} title="Link"><Link className="h-3.5 w-3.5" /></button>
      <button className={iconBtnClass} onClick={() => applyFormat("- ", "", "list item")} title="List"><List className="h-3.5 w-3.5" /></button>
      <button className={iconBtnClass} onClick={() => applyFormat("1. ", "", "list item")} title="Ordered List"><ListOrdered className="h-3.5 w-3.5" /></button>
      <button className={iconBtnClass} onClick={() => applyFormat("> ", "", "quote")} title="Blockquote"><Quote className="h-3.5 w-3.5" /></button>
      <button className={iconBtnClass} onClick={() => applyFormat("```\n", "\n```", "code here")} title="Code Block"><FileCode className="h-3.5 w-3.5" /></button>
      <div className="flex-1" />
      <button className={btnClass} onClick={() => setShowCheatsheet(v => !v)}><BookOpen className="h-3.5 w-3.5" />Cheatsheet</button>
      <button className={btnClass} onClick={copyMarkdown}><Copy className="h-3.5 w-3.5" />Copy MD</button>
      <button className={btnClass} onClick={downloadMarkdown}><Download className="h-3.5 w-3.5" />Download</button>
      <button className={btnClass} onClick={() => setShowClearConfirm(true)}><Trash2 className="h-3.5 w-3.5" />Clear</button>
    </div>
  )

  const inputPane = (
    <div className="h-full flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
      <div className="px-4 py-2 border-b border-white/[0.06]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Editor</p>
      </div>
      <textarea
        ref={textareaRef}
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className="flex-1 w-full p-4 font-mono text-sm bg-transparent text-[#E5E5E5] resize-none focus:outline-none placeholder:text-[#A0A0A0]/30"
        placeholder="Type your markdown here..."
        spellCheck={false}
      />
    </div>
  )

  const previewPane = (
    <div className="h-full flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
      <div className="px-4 py-2 border-b border-white/[0.06]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Preview</p>
      </div>
      <div className="flex-1 overflow-auto p-4 text-sm text-[#E5E5E5]">
        {markdown === "" ? (
          <div className="h-full flex items-center justify-center text-[#A0A0A0]/50 text-sm">
            Your preview will appear here as you type...
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-3 border-b border-white/[0.08] pb-2 text-white">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-2 text-white">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-white">{children}</h3>,
              h4: ({ children }) => <h4 className="text-base font-semibold mt-3 mb-1 text-[#E5E5E5]">{children}</h4>,
              p: ({ children }) => <p className="mb-3 leading-7 text-[#A0A0A0]">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 text-[#A0A0A0]">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-[#A0A0A0]">{children}</ol>,
              li: ({ children }) => <li className="ml-4">{children}</li>,
              blockquote: ({ children }) => <blockquote className="border-l-2 border-[#4D9FFF]/50 pl-4 italic my-3 text-[#A0A0A0]">{children}</blockquote>,
              a: ({ children, ...props }) => <a className="text-[#4D9FFF] underline hover:no-underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
              hr: () => <hr className="my-4 border-white/[0.08]" />,
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "")
                if (match) {
                  return (
                    <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div">
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  )
                }
                return (
                  <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-sm font-mono text-[#E5E5E5]" {...props}>
                    {children}
                  </code>
                )
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <ToolHeader icon={FileEdit} label="Editor" title="Markdown Editor" description="Write and preview markdown in real time. Auto-saves to localStorage. Export as .md with no login required." />

      {toolbar}

      {showCheatsheet && (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Cheatsheet</p>
            <button onClick={() => setShowCheatsheet(false)} className="text-[#A0A0A0] hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
            {[
              { label: "Heading 1", syntax: "# H1" }, { label: "Heading 2", syntax: "## H2" },
              { label: "Heading 3", syntax: "### H3" }, { label: "Bold", syntax: "**bold**" },
              { label: "Italic", syntax: "_italic_" }, { label: "Strikethrough", syntax: "~~strike~~" },
              { label: "Link", syntax: "[text](url)" }, { label: "Image", syntax: "![alt](url)" },
              { label: "Inline code", syntax: "`code`" }, { label: "Code block", syntax: "```lang" },
              { label: "Blockquote", syntax: "> quote" }, { label: "Unordered list", syntax: "- item" },
              { label: "Ordered list", syntax: "1. item" }, { label: "Horizontal rule", syntax: "---" },
            ].map(({ label, syntax }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-[#A0A0A0]/70">{label}</span>
                <code className="bg-white/[0.05] px-1.5 py-0.5 rounded font-mono text-[#E5E5E5]">{syntax}</code>
              </div>
            ))}
          </div>
        </div>
      )}

      {isMobile ? (
        <div className="flex flex-col gap-2" style={{ minHeight: 500 }}>
          <div className="flex-1 min-h-[240px]">{inputPane}</div>
          <div className="flex-1 min-h-[240px]">{previewPane}</div>
        </div>
      ) : (
        <PanelGroup direction="horizontal" style={{ minHeight: 500 }}>
          <Panel defaultSize={50} minSize={20}>
            <div className="h-full pr-1">{inputPane}</div>
          </Panel>
          <PanelResizeHandle className="w-2 flex items-center justify-center group">
            <div className="w-0.5 h-12 rounded-full bg-white/[0.08] group-hover:bg-[#4D9FFF]/50 transition-colors" />
          </PanelResizeHandle>
          <Panel defaultSize={50} minSize={20}>
            <div className="h-full pl-1">{previewPane}</div>
          </Panel>
        </PanelGroup>
      )}

      <div className="text-xs text-[#A0A0A0]/50 text-right px-1">
        {markdown.length} chars · {markdown.trim() === "" ? 0 : markdown.trim().split(/\s+/).length} words
      </div>

      {/* Clear confirm dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0D0D0D] p-6 max-w-sm w-full mx-4 space-y-4">
            <p className="text-sm font-semibold text-white">Clear document?</p>
            <p className="text-sm text-[#A0A0A0]">This will permanently delete all your markdown content. This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowClearConfirm(false)} className="rounded-lg border border-white/[0.08] bg-transparent px-4 py-2 text-sm text-[#E5E5E5] hover:border-white/20">Cancel</button>
              <button onClick={() => { setMarkdown(""); setShowClearConfirm(false) }} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-[#E5E5E5]">Clear</button>
            </div>
          </div>
        </div>
      )}

      <RelatedTools currentTool="markdown-editor" />
    </div>
  )
}
