import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface RelatedToolsProps { currentTool: string }

const toolRelations: Record<string, string[]> = {
  "image-compressor":        ["image-converter", "image-cropper", "background-remover"],
  "image-converter":         ["image-compressor", "image-cropper", "image-to-favicon"],
  "image-cropper":           ["image-compressor", "image-converter", "background-remover"],
  "background-remover":      ["image-compressor", "image-cropper", "image-converter"],
  "color-extractor":         ["color-palette-generator", "gradient-generator"],
  "gradient-generator":      ["color-palette-generator", "color-extractor"],
  "color-palette-generator": ["color-extractor", "gradient-generator"],
  "qr-code-generator":       ["image-converter", "image-compressor", "text-to-pdf"],
  "password-generator":      ["qr-code-generator", "url-shortener"],
  "text-extractor":          ["text-to-pdf", "markdown-editor"],
  "text-to-pdf":             ["text-extractor", "markdown-editor"],
  "markdown-editor":         ["text-to-pdf", "text-extractor", "code-snippet-manager"],
  "image-to-favicon":        ["image-converter", "image-compressor"],
  "url-shortener":           ["qr-code-generator", "password-generator"],
  "code-snippet-manager":    ["markdown-editor", "text-extractor"],
}

const toolDetails: Record<string, { title: string; description: string }> = {
  "image-compressor":        { title: "Image Compressor",    description: "Compress images without quality loss" },
  "image-converter":         { title: "Image Converter",     description: "Convert between image formats" },
  "image-cropper":           { title: "Image Cropper",       description: "Crop & resize images precisely" },
  "background-remover":      { title: "Background Remover",  description: "Remove image backgrounds with AI" },
  "color-extractor":         { title: "Color Extractor",     description: "Extract palettes from any image" },
  "gradient-generator":      { title: "Gradient Generator",  description: "Build beautiful CSS gradients" },
  "color-palette-generator": { title: "Color Palette",       description: "Generate harmonious color palettes" },
  "qr-code-generator":       { title: "QR Code Generator",   description: "Generate QR codes instantly" },
  "password-generator":      { title: "Password Generator",  description: "Secure random passwords" },
  "text-extractor":          { title: "Text Extractor",      description: "Pull text from files instantly" },
  "text-to-pdf":             { title: "Text to PDF",         description: "Export rich documents as PDF" },
  "markdown-editor":         { title: "Markdown Editor",     description: "Write & preview markdown live" },
  "image-to-favicon":        { title: "Image to Favicon",    description: "Convert images to favicons" },
  "url-shortener":           { title: "URL Shortener",       description: "Create short, shareable links" },
  "code-snippet-manager":    { title: "Code Snippets",       description: "Store & organise code snippets" },
}

export function RelatedTools({ currentTool }: RelatedToolsProps) {
  const related = (toolRelations[currentTool] || []).filter(t => toolDetails[t])
  if (related.length === 0) return null

  return (
    <div className="mt-12 space-y-4 border-t border-white/[0.06] pt-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#4D9FFF]">Related tools</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map(slug => (
          <Link
            key={slug}
            href={`/tools/${slug}`}
            className="group flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 transition-all duration-300 hover:border-white/[0.16] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(77,159,255,0.06)]"
          >
            <div>
              <p className="text-sm font-semibold text-[#E5E5E5]">{toolDetails[slug].title}</p>
              <p className="mt-0.5 text-xs text-[#A0A0A0]">{toolDetails[slug].description}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 ml-3 text-[#A0A0A0] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#4D9FFF]" />
          </Link>
        ))}
      </div>
    </div>
  )
}
