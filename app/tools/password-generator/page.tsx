"use client"

import { useState } from "react"
import { RelatedTools } from "@/components/related-tools"
import { ToolHeader } from "@/components/tool-header"
import { Key, Copy, Check, RefreshCw } from "lucide-react"
import { toast } from "sonner"

const CHARSET = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
}

function strengthLabel(pw: string): { label: string; color: string; width: string } {
  if (!pw) return { label: "", color: "bg-white/10", width: "w-0" }
  let score = 0
  if (pw.length >= 12) score++
  if (pw.length >= 20) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "w-1/4" }
  if (score <= 3) return { label: "Fair", color: "bg-yellow-500", width: "w-2/4" }
  if (score <= 4) return { label: "Strong", color: "bg-green-500", width: "w-3/4" }
  return { label: "Very Strong", color: "bg-[#4D9FFF]", width: "w-full" }
}

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [copied, setCopied] = useState(false)
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true })

  const generate = () => {
    let chars = ""
    if (options.uppercase) chars += CHARSET.uppercase
    if (options.lowercase) chars += CHARSET.lowercase
    if (options.numbers) chars += CHARSET.numbers
    if (options.symbols) chars += CHARSET.symbols
    if (!chars) { toast.error("Select at least one character type"); return }
    let result = ""
    for (let i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)]
    setPassword(result)
  }

  const handleCopy = async () => {
    if (!password) { toast.error("Generate a password first"); return }
    await navigator.clipboard.writeText(password)
    setCopied(true); toast.success("Copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  const toggle = (key: keyof typeof options) => setOptions(p => ({ ...p, [key]: !p[key] }))
  const strength = strengthLabel(password)

  const checkboxClass = (active: boolean) =>
    `flex items-center gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition-all text-sm ${
      active ? "border-[#4D9FFF]/40 bg-[#4D9FFF]/[0.06] text-white" : "border-white/[0.08] bg-white/[0.02] text-[#A0A0A0] hover:border-white/20"
    }`

  return (
    <div className="space-y-8">
      <ToolHeader icon={Key} label="Security" title="Password Generator" description="Generate strong, secure passwords locally in your browser. Nothing is stored or transmitted." />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Controls */}
        <div className="space-y-5">
          {/* Length */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Length</p>
            <div className="flex items-center gap-4">
              <input
                type="range" min={8} max={64} step={1} value={length}
                onChange={e => setLength(+e.target.value)}
                className="flex-1 accent-[#4D9FFF]"
              />
              <span className="w-10 text-right text-lg font-bold text-white tabular-nums">{length}</span>
            </div>
            <div className="flex justify-between text-[10px] text-[#A0A0A0]/50">
              <span>8</span><span>64</span>
            </div>
          </div>

          {/* Character types */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Character Types</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(options) as (keyof typeof options)[]).map(key => (
                <label key={key} className={checkboxClass(options[key])}>
                  <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-all ${options[key] ? "border-[#4D9FFF] bg-[#4D9FFF]" : "border-white/20 bg-transparent"}`}>
                    {options[key] && <Check className="h-2.5 w-2.5 text-black" />}
                  </div>
                  <input type="checkbox" className="sr-only" checked={options[key]} onChange={() => toggle(key)} />
                  <span className="capitalize">{key}</span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={generate} className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-black transition-all hover:bg-[#E5E5E5] flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4" />Generate Password
          </button>
        </div>

        {/* Result */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4 min-h-[200px] flex flex-col justify-center">
            {password ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Generated Password</p>
                <div className="rounded-lg border border-white/[0.08] bg-black/30 px-4 py-3 font-mono text-sm text-white break-all leading-relaxed">
                  {password}
                </div>
                {/* Strength bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A0A0A0]">Strength</span>
                    <span className="text-[#E5E5E5]">{strength.label}</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-white/[0.06]">
                    <div className={`h-1 rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
                  </div>
                </div>
                <button onClick={handleCopy} className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 text-sm font-medium text-[#E5E5E5] transition-all hover:border-white/20 hover:text-white flex items-center justify-center gap-2">
                  {copied ? <><Check className="h-4 w-4 text-green-400" />Copied!</> : <><Copy className="h-4 w-4" />Copy to Clipboard</>}
                </button>
              </>
            ) : (
              <div className="text-center space-y-2">
                <Key className="h-10 w-10 text-white/10 mx-auto" />
                <p className="text-sm text-[#A0A0A0]">Click Generate to create a password</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">Security Note</p>
            <p className="text-xs text-[#A0A0A0]/70 leading-relaxed">All passwords are generated locally in your browser. Nothing is stored or transmitted over the internet.</p>
          </div>
        </div>
      </div>

      <RelatedTools currentTool="password-generator" />
    </div>
  )
}
