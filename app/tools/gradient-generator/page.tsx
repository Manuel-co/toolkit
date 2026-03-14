"use client"

import { useState } from "react"
import { RelatedTools } from "@/components/related-tools"
import { ToolHeader } from "@/components/tool-header"
import { Paintbrush, Copy, RotateCcw, Plus, X } from "lucide-react"
import { toast } from "sonner"

interface GradientStop { color: string; position: number }

export default function GradientGeneratorPage() {
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear")
  const [angle, setAngle] = useState(90)
  const [stops, setStops] = useState<GradientStop[]>([
    { color: "#4D9FFF", position: 0 },
    { color: "#8B5CF6", position: 100 },
  ])
  const [activeTab, setActiveTab] = useState<"css" | "tailwind">("css")

  const css = gradientType === "linear"
    ? `linear-gradient(${angle}deg, ${stops.map(s => `${s.color} ${s.position}%`).join(", ")})`
    : `radial-gradient(circle, ${stops.map(s => `${s.color} ${s.position}%`).join(", ")})`

  const updateStop = (i: number, key: keyof GradientStop, val: string | number) =>
    setStops(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: val } : s))

  const addStop = () => {
    if (stops.length >= 5) { toast.error("Max 5 stops"); return }
    setStops(p => [...p, { color: "#FFFFFF", position: p[p.length - 1].position + 20 }])
  }

  const removeStop = (i: number) => {
    if (stops.length <= 2) { toast.error("Min 2 stops"); return }
    setStops(p => p.filter((_, idx) => idx !== i))
  }

  const randomize = () => setStops(p => p.map(s => ({ ...s, color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") })))

  const copyCss = (format: "css" | "tailwind") => {
    const text = format === "css" ? `background: ${css};` : `bg-[${css}]`
    navigator.clipboard.writeText(text); toast.success(`Copied ${format.toUpperCase()}!`)
  }

  const tabClass = (active: boolean) => `flex-1 py-1.5 text-xs font-medium uppercase tracking-wider rounded-md transition-all ${active ? "bg-white text-black" : "text-[#A0A0A0] hover:text-white"}`

  return (
    <div className="space-y-8">
      <ToolHeader icon={Paintbrush} label="Design" title="Gradient Generator" description="Create beautiful CSS gradients. Customize colors, angles, and stops — copy as CSS or Tailwind." />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Controls */}
        <div className="space-y-5">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Settings</p>

            {/* Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Type</label>
              <div className="flex gap-1 rounded-lg border border-white/[0.08] bg-white/[0.02] p-1">
                {(["linear","radial"] as const).map(t => (
                  <button key={t} onClick={() => setGradientType(t)} className={tabClass(gradientType === t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Angle */}
            {gradientType === "linear" && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A0A0A0]">Angle</span>
                  <span className="text-white font-medium">{angle}°</span>
                </div>
                <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(+e.target.value)} className="w-full accent-[#4D9FFF]" />
              </div>
            )}

            {/* Color stops */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A0]">Color Stops</label>
                <button onClick={randomize} className="flex items-center gap-1.5 text-xs text-[#A0A0A0] hover:text-white transition-colors">
                  <RotateCcw className="h-3 w-3" />Randomize
                </button>
              </div>
              {stops.map((stop, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input type="color" value={stop.color} onChange={e => updateStop(i, "color", e.target.value)}
                    className="h-9 w-12 rounded-lg border border-white/[0.08] bg-transparent cursor-pointer" />
                  <input type="range" min={0} max={100} value={stop.position} onChange={e => updateStop(i, "position", +e.target.value)}
                    className="flex-1 accent-[#4D9FFF]" />
                  <span className="w-10 text-right text-xs text-[#A0A0A0] tabular-nums">{stop.position}%</span>
                  {stops.length > 2 && (
                    <button onClick={() => removeStop(i)} className="text-[#A0A0A0] hover:text-white transition-colors"><X className="h-4 w-4" /></button>
                  )}
                </div>
              ))}
              {stops.length < 5 && (
                <button onClick={addStop}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-white/[0.12] py-2 text-xs text-[#A0A0A0] hover:border-white/20 hover:text-white transition-all">
                  <Plus className="h-3.5 w-3.5" />Add Stop
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] overflow-hidden">
            <div className="h-48 w-full" style={{ background: css }} />
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-1 rounded-lg border border-white/[0.08] bg-white/[0.02] p-1">
                {(["css","tailwind"] as const).map(t => (
                  <button key={t} onClick={() => setActiveTab(t)} className={tabClass(activeTab === t)}>{t}</button>
                ))}
              </div>
              <button onClick={() => copyCss(activeTab)}
                className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-[#A0A0A0] hover:border-white/20 hover:text-white transition-all">
                <Copy className="h-3.5 w-3.5" />Copy
              </button>
            </div>
            <div className="rounded-lg bg-black/30 border border-white/[0.06] p-3 font-mono text-xs text-[#E5E5E5] break-all">
              {activeTab === "css" ? `background: ${css};` : `bg-[${css}]`}
            </div>
          </div>
        </div>
      </div>

      <RelatedTools currentTool="gradient-generator" />
    </div>
  )
}
