"use client"

import { ToolHeader } from "@/components/tool-header"
import { RelatedTools } from "@/components/related-tools"
import { Paintbrush } from "lucide-react"

export default function BackgroundRemoverPage() {
  return (
    <div>
      <ToolHeader
        icon={Paintbrush}
        label="AI Tool"
        title="Background Remover"
        description="Remove backgrounds from images using AI. Coming soon — check back shortly."
      />
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-12 text-center">
        <Paintbrush className="h-10 w-10 text-white/10 mx-auto mb-3" />
        <p className="text-sm text-[#A0A0A0]">This tool is currently under maintenance. Check back soon.</p>
      </div>
      <RelatedTools currentTool="background-remover" />
    </div>
  )
}
