import type { LucideIcon } from "lucide-react"

interface ToolHeaderProps {
  icon: LucideIcon
  label?: string
  title: string
  description: string
}

export function ToolHeader({ icon: Icon, label, title, description }: ToolHeaderProps) {
  return (
    <div className="mb-10 space-y-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#4D9FFF]">
        {label ?? "Free Tool"}
      </p>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[#E5E5E5]">
          <Icon className="h-6 w-6" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">{title}</h1>
      </div>
      <p className="max-w-xl text-[16px] font-light leading-relaxed text-[#A0A0A0]">{description}</p>
    </div>
  )
}
