import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RelatedToolsProps {
  currentTool: string
  limit?: number
}

export function RelatedTools({ currentTool, limit = 3 }: RelatedToolsProps) {
  // Filter out the current tool and limit the number of related tools
  const filteredTools = tools.filter((tool) => tool.slug !== currentTool).slice(0, limit)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Related Tools</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filteredTools.map((tool) => (
          <Card key={tool.slug} className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{tool.name}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-4">
              <Link href={`/tools/${tool.slug}`} className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  Use Tool
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

const tools = [
  {
    name: "Background Remover",
    description: "Remove backgrounds from images with a single click",
    slug: "background-remover",
  },
  {
    name: "Image to Favicon",
    description: "Convert any image to a favicon for your website",
    slug: "image-to-favicon",
  },
  {
    name: "Image Cropper",
    description: "Crop and resize images to your desired dimensions",
    slug: "image-cropper",
  },
  {
    name: "Color Extractor",
    description: "Extract color palettes from any image",
    slug: "color-extractor",
  },
  {
    name: "Image Compressor",
    description: "Compress images without losing quality",
    slug: "image-compressor",
  },
  {
    name: "Text Extractor",
    description: "Extract text from images using OCR technology",
    slug: "text-extractor",
  },
  {
    name: "QR Code Generator",
    description: "Generate QR codes for URLs, text, and more",
    slug: "qr-code-generator",
  },
  {
    name: "Image Converter",
    description: "Convert images between different formats",
    slug: "image-converter",
  },
]

