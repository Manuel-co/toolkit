"use client"

import Image from "next/image"

interface ToolResultProps {
  title: string
  resultImage?: string
  resultText?: string
  resultType: "image" | "text" | "download"
  actions?: React.ReactNode
}

export function ToolResult({ title, resultImage, resultText, resultType, actions }: ToolResultProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted px-4 py-2 border-b">
        <h3 className="font-medium">{title}</h3>
      </div>

      <div className="p-4">
        {resultType === "image" && resultImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-md mb-4">
            <Image src={resultImage || "/placeholder.svg"} alt="Result" fill className="object-contain" />
          </div>
        )}

        {resultType === "text" && resultText && (
          <div className="bg-muted/50 p-3 rounded-md mb-4 max-h-[200px] overflow-y-auto">
            <pre className="text-sm whitespace-pre-wrap">{resultText}</pre>
          </div>
        )}

        {actions && (
          <div className="flex justify-end gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

