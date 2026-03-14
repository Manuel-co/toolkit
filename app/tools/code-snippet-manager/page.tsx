"use client"

import { useState, useEffect } from "react"
import { RelatedTools } from "@/components/related-tools"
import { ToolHeader } from "@/components/tool-header"
import { Copy, Check, Search, Code, Trash2, Plus, X, FileCode, Save } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeSnippet {
  id: string; title: string; code: string; language: string
  tags: string[]; description: string; createdAt: string
}

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" }, { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" }, { value: "java", label: "Java" },
  { value: "cpp", label: "C++" }, { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" }, { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" }, { value: "rust", label: "Rust" },
  { value: "html", label: "HTML" }, { value: "css", label: "CSS" }, { value: "sql", label: "SQL" },
]

export default function CodeSnippetManagerPage() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [langFilter, setLangFilter] = useState("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: "", code: "", language: "javascript", tags: [] as string[], description: "" })

  useEffect(() => {
    const saved = localStorage.getItem("codeSnippets")
    if (saved) {
      const loaded = JSON.parse(saved)
      setSnippets(loaded)
      if (loaded.length > 0) setSelectedId(loaded[0].id)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) localStorage.setItem("codeSnippets", JSON.stringify(snippets))
  }, [snippets, isLoading])

  const filtered = snippets.filter(s => {
    const q = search.toLowerCase()
    return (s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q)))
      && (langFilter === "all" || s.language === langFilter)
  })

  const selected = snippets.find(s => s.id === selectedId)

  const addSnippet = () => {
    if (!form.title || !form.code) { toast.error("Fill in title and code"); return }
    const s: CodeSnippet = { id: Date.now().toString(), ...form, createdAt: new Date().toISOString() }
    setSnippets(p => [s, ...p]); setSelectedId(s.id)
    setForm({ title: "", code: "", language: "javascript", tags: [], description: "" })
    setShowForm(false); toast.success("Snippet saved!")
  }

  const deleteSnippet = (id: string) => {
    const idx = snippets.findIndex(s => s.id === id)
    const next = snippets.filter(s => s.id !== id)
    setSnippets(next)
    setSelectedId(next[idx]?.id ?? next[idx - 1]?.id ?? null)
    toast.success("Deleted")
  }

  const copySnippet = (code: string, id: string) => {
    navigator.clipboard.writeText(code); setCopiedId(id); toast.success("Copied!")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const addTag = () => {
    if (!tagInput.trim() || form.tags.includes(tagInput.trim())) return
    setForm(p => ({ ...p, tags: [...p.tags, tagInput.trim()] })); setTagInput("")
  }

  const selectClass = "h-9 border-white/[0.08] bg-white/[0.03] text-[#E5E5E5] text-sm focus:ring-0 focus:border-[#4D9FFF]/40"

  return (
    <div className="space-y-6">
      <ToolHeader icon={Code} label="Developer" title="Code Snippet Manager" description="Store, organize, and copy code snippets. Saved locally in your browser — no account needed." />

      {/* Actions bar */}
      <div className="flex gap-3">
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#E5E5E5]">
          <Plus className="h-4 w-4" />Add Snippet
        </button>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-5">
        {/* Sidebar */}
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] flex flex-col max-h-[calc(100vh-280px)] lg:sticky lg:top-6">
          <div className="p-3 space-y-2 border-b border-white/[0.06]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A0A0A0]" />
              <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                className="h-8 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] pl-8 pr-3 text-xs text-white placeholder:text-[#A0A0A0]/40 outline-none focus:border-[#4D9FFF]/40 transition-colors" />
            </div>
            <Select value={langFilter} onValueChange={setLangFilter}>
              <SelectTrigger className={selectClass + " h-8 text-xs"}><SelectValue placeholder="All Languages" /></SelectTrigger>
              <SelectContent className="bg-[#0D0D0D] border-white/[0.08]">
                <SelectItem value="all" className="text-[#E5E5E5] focus:bg-white/[0.06]">All Languages</SelectItem>
                {LANGUAGES.map(l => <SelectItem key={l.value} value={l.value} className="text-[#E5E5E5] focus:bg-white/[0.06]">{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isLoading ? <div className="flex justify-center p-6"><div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" /></div>
              : filtered.length > 0 ? filtered.map(s => (
                <button key={s.id} onClick={() => setSelectedId(s.id)}
                  className={`w-full text-left p-2.5 rounded-lg transition-colors ${selectedId === s.id ? "bg-white/[0.08] text-white" : "text-[#A0A0A0] hover:bg-white/[0.04] hover:text-white"}`}>
                  <p className="text-xs font-medium truncate">{s.title}</p>
                  <p className="text-[10px] mt-0.5 opacity-60">{LANGUAGES.find(l => l.value === s.language)?.label ?? s.language}</p>
                </button>
              )) : <p className="text-xs text-[#A0A0A0]/50 text-center p-4">{search || langFilter !== "all" ? "No snippets found" : "No snippets yet"}</p>}
          </div>
        </div>

        {/* Main */}
        <div className="min-w-0">
          {selected ? (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <h2 className="text-lg font-semibold text-white">{selected.title}</h2>
                  <span className="inline-block rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-[#A0A0A0]">
                    {LANGUAGES.find(l => l.value === selected.language)?.label ?? selected.language}
                  </span>
                  {selected.description && <p className="text-sm text-[#A0A0A0]">{selected.description}</p>}
                  {selected.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selected.tags.map((t, i) => <span key={i} className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] text-[#A0A0A0]">{t}</span>)}
                    </div>
                  )}
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => copySnippet(selected.code, selected.id)}
                    className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-[#E5E5E5] hover:border-white/20 transition-all">
                    {copiedId === selected.id ? <><Check className="h-3.5 w-3.5 text-green-400" />Copied</> : <><Copy className="h-3.5 w-3.5" />Copy</>}
                  </button>
                  <button onClick={() => deleteSnippet(selected.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#A0A0A0] hover:text-red-400 transition-all">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-white/[0.06] text-xs min-w-0">
                <SyntaxHighlighter
                  language={selected.language}
                  style={oneDark}
                  customStyle={{ margin: 0, borderRadius: 0, background: "rgba(0,0,0,0.4)", fontSize: "0.75rem", overflowX: "auto" }}
                >
                  {selected.code}
                </SyntaxHighlighter>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-12 text-center space-y-3">
              <FileCode className="h-10 w-10 text-white/10 mx-auto" />
              <p className="text-sm text-[#A0A0A0]">{snippets.length === 0 ? "Add your first snippet to get started" : "Select a snippet from the sidebar"}</p>
              {snippets.length === 0 && (
                <button onClick={() => setShowForm(true)} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-[#E5E5E5] transition-all">
                  Add Snippet
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add snippet modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0D0D0D] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <p className="text-sm font-semibold text-white">Add New Snippet</p>
              <button onClick={() => setShowForm(false)} className="text-[#A0A0A0] hover:text-white transition-colors"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Title</label>
                <input placeholder="e.g., Array sorting function" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white placeholder:text-[#A0A0A0]/40 outline-none focus:border-[#4D9FFF]/40 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Language</label>
                <Select value={form.language} onValueChange={v => setForm(p => ({ ...p, language: v }))}>
                  <SelectTrigger className={selectClass}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0D0D0D] border-white/[0.08]">
                    {LANGUAGES.map(l => <SelectItem key={l.value} value={l.value} className="text-[#E5E5E5] focus:bg-white/[0.06]">{l.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Code</label>
                <textarea placeholder="Paste your code here..." value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} rows={10}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] p-3 font-mono text-sm text-[#E5E5E5] placeholder:text-[#A0A0A0]/40 outline-none focus:border-[#4D9FFF]/40 transition-colors resize-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Description (Optional)</label>
                <textarea placeholder="Describe what this code does..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] p-3 text-sm text-[#E5E5E5] placeholder:text-[#A0A0A0]/40 outline-none focus:border-[#4D9FFF]/40 transition-colors resize-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Tags (Optional)</label>
                <div className="flex gap-2">
                  <input placeholder="Add a tag" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
                    className="flex-1 h-9 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white placeholder:text-[#A0A0A0]/40 outline-none focus:border-[#4D9FFF]/40 transition-colors" />
                  <button onClick={addTag} className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-[#A0A0A0] hover:text-white transition-all"><Plus className="h-4 w-4" /></button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.map((t, i) => (
                      <span key={i} className="flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-xs text-[#A0A0A0]">
                        {t}<button onClick={() => setForm(p => ({ ...p, tags: p.tags.filter((_, j) => j !== i) }))} className="hover:text-white"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 justify-end p-5 border-t border-white/[0.06]">
              <button onClick={() => setShowForm(false)} className="rounded-lg border border-white/[0.08] bg-transparent px-4 py-2 text-sm text-[#E5E5E5] hover:border-white/20">Cancel</button>
              <button onClick={addSnippet} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-[#E5E5E5] transition-all">
                <Save className="h-4 w-4" />Save Snippet
              </button>
            </div>
          </div>
        </div>
      )}

      <RelatedTools currentTool="code-snippet-manager" />
    </div>
  )
}
