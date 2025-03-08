import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RelatedToolsProps {
  currentTool: string
}

const toolRelations: Record<string, string[]> = {
  "image-compressor": ["image-converter", "image-cropper", "background-remover"],
  "image-converter": ["image-compressor", "image-cropper", "image-to-favicon"],
  "image-cropper": ["image-compressor", "image-converter", "background-remover"],
  "background-remover": ["image-compressor", "image-cropper", "image-converter"],
  "color-extractor": ["color-palette-generator", "gradient-generator"],
  "gradient-generator": ["color-palette-generator", "color-extractor"],
  "color-palette-generator": ["color-extractor", "gradient-generator"],
  "qr-code-generator": ["image-converter", "image-compressor"],
  "password-generator": ["project-idea-generator"],
  "project-idea-generator": ["password-generator"],
  "text-extractor": ["pdf-converter", "image-converter"],
  "pdf-converter": ["text-extractor", "image-converter"],
  "image-to-favicon": ["image-converter", "image-compressor"],
}

const toolDetails: Record<string, { title: string; description: string }> = {
  "image-compressor": {
    title: "Image Compressor",
    description: "Compress images without losing quality",
  },
  "image-converter": {
    title: "Image Converter",
    description: "Convert images between different formats",
  },
  "image-cropper": {
    title: "Image Cropper",
    description: "Crop and resize images to your desired dimensions",
  },
  "background-remover": {
    title: "Background Remover",
    description: "Remove backgrounds from images with a single click",
  },
  "color-extractor": {
    title: "Color Extractor",
    description: "Extract color palettes from any image",
  },
  "gradient-generator": {
    title: "Gradient Generator",
    description: "Create beautiful CSS gradients for your website",
  },
  "color-palette-generator": {
    title: "Color Palette Generator",
    description: "Create harmonious color palettes for your designs",
  },
  "qr-code-generator": {
    title: "QR Code Generator",
    description: "Generate QR codes for URLs, text, and more",
  },
  "password-generator": {
    title: "Password Generator",
    description: "Generate secure, random passwords",
  },
  "project-idea-generator": {
    title: "Project Idea Generator",
    description: "Get inspiration for your next front-end project",
  },
  "text-extractor": {
    title: "Text Extractor",
    description: "Extract text from images using OCR technology",
  },
  "pdf-converter": {
    title: "PDF Converter",
    description: "Convert PDF files to images or text",
  },
  "image-to-favicon": {
    title: "Image to Favicon",
    description: "Convert any image to a favicon for your website",
  },
}

export function RelatedTools({ currentTool }: RelatedToolsProps) {
  const relatedTools = toolRelations[currentTool] || []

  if (relatedTools.length === 0) return null

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Related Tools</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedTools.map((tool) => (
          <Card key={tool}>
            <CardHeader>
              <CardTitle className="text-lg">{toolDetails[tool].title}</CardTitle>
              <CardDescription>{toolDetails[tool].description}</CardDescription>
              <Link href={`/tools/${tool}`} className="mt-2">
                <Button variant="outline" size="sm">
                  Try it
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

