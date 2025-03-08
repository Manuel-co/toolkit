import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ImageIcon,
  Paintbrush,
  FileImage,
  Crop,
  Palette,
  FileText,
  QrCode,
  Layers,
  ArrowRight,
  Code,
  Hash,
  Key,
  Lightbulb,
  FileIcon,
} from "lucide-react"

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">All Tools</h1>
        <p className="text-muted-foreground">
          All tools are completely free to use with no login required. Just select a tool to get started.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.name} className="overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="pb-0">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <tool.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{tool.name}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {tool.badge && (
                <Badge className="mb-2" variant="secondary">
                  {tool.badge}
                </Badge>
              )}
              <p className="text-sm text-muted-foreground">{tool.details}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Badge variant="outline" className="text-xs">
                Free • No Login
              </Badge>
              <Link href={`/tools/${tool.slug}`}>
                <Button size="sm">
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
    details: "Perfect for product photos, portraits, and creating transparent PNGs.",
    icon: Paintbrush,
    badge: "Popular",
    slug: "background-remover",
  },
  {
    name: "Image Cropper",
    description: "Crop and resize images to your desired dimensions",
    details: "Supports custom aspect ratios and precise pixel dimensions.",
    icon: Crop,
    slug: "image-cropper",
  },
  {
    name: "Color Extractor",
    description: "Extract color palettes from any image",
    details: "Identifies dominant colors and creates harmonious palettes.",
    icon: Palette,
    slug: "color-extractor",
  },
  {
    name: "Image Compressor",
    description: "Compress images without losing quality",
    details: "Reduce file size while maintaining visual quality for faster websites.",
    icon: ImageIcon,
    badge: "New",
    slug: "image-compressor",
  },
  {
    name: "Text Extractor",
    description: "Extract text from images using OCR technology",
    details: "Supports multiple languages and maintains text formatting.",
    icon: FileText,
    slug: "text-extractor",
  },
  {
    name: "QR Code Generator",
    description: "Generate QR codes for URLs, text, and more",
    details: "Customizable QR codes with options for color and error correction.",
    icon: QrCode,
    slug: "qr-code-generator",
  },
  {
    name: "Image Converter",
    description: "Convert images between different formats",
    details: "Supports conversion between JPG, PNG, WEBP, SVG, and more.",
    icon: Layers,
    slug: "image-converter",
  },
  {
    name: "Gradient Generator",
    description: "Create beautiful CSS gradients for your website",
    details: "Design linear, radial, and conic gradients with custom colors and angles.",
    icon: Palette,
    badge: "New",
    slug: "gradient-generator",
  },
  {
    name: "Password Generator",
    description: "Generate secure, random passwords",
    details: "Create strong passwords with customizable length and character types.",
    icon: Key,
    slug: "password-generator",
  },
  {
    name: "Project Idea Generator",
    description: "Get inspiration for your next front-end project",
    details: "Generate project ideas based on skill level, technologies, and project type.",
    icon: Lightbulb,
    badge: "New",
    slug: "project-idea-generator",
  },
  {
    name: "Text to PDF",
    description: "Convert text to PDF",
    details: "Convert text to PDF with a single click.",
    icon: FileIcon,
    slug: "text-to-pdf",
  },
]

