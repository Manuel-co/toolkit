"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ImageIcon,
  Paintbrush,
  Crop,
  Palette,
  FileText,
  QrCode,
  Layers,
  ArrowRight,
  Code,
  Key,
  Lightbulb,
  FileIcon,
  Link as LinkIcon,
  BookOpen,
  Search,
  Sparkles,
} from "lucide-react"

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = useMemo(() => {
    const cats = new Set(tools.map(tool => tool.category))
    return ["all", ...Array.from(cats)]
  }, [])

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.details.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          {tools.length} Free Tools Available
        </div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          All Tools
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
          Powerful, free tools for developers and creators. No login required, no limits.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          Found {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
        </p>
      )}

      {/* Tools Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <Card key={tool.name} className="group relative overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] border-2 hover:border-primary/50">
            <CardHeader className="pb-4">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 transition-transform group-hover:scale-110">
                <tool.icon className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                  {tool.badge && (
                    <Badge className="shrink-0" variant={tool.badge === "New" ? "default" : "secondary"}>
                      {tool.badge}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-base">{tool.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{tool.details}</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-4 border-t">
              <div className="flex w-full items-center justify-between">
                <Badge variant="outline" className="text-xs font-normal">
                  {tool.category}
                </Badge>
                <Badge variant="outline" className="text-xs font-normal text-green-600 dark:text-green-400">
                  Free • No Login
                </Badge>
              </div>
              <Link href={`/tools/${tool.slug}`} className="w-full">
                <Button size="lg" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                  Use Tool
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No tools found matching your search.</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
            }}
            className="mt-2"
          >
            Clear filters
          </Button>
        </div>
      )}
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
    category: "image",
  },
  {
    name: "Code Snippet Manager",
    description: "Store, organize, and share your code snippets",
    details: "Save reusable code, examples, and solutions with syntax highlighting and tags.",
    icon: Code,
    badge: "New",
    slug: "code-snippet-manager",
    category: "developer",
  },
  {
    name: "Color Extractor",
    description: "Extract color palettes from any image",
    details: "Identifies dominant colors and creates harmonious palettes.",
    icon: Palette,
    slug: "color-extractor",
    category: "design",
  },
  {
    name: "Color Palette Generator",
    description: "Generate beautiful color palettes for your projects",
    details: "Create harmonious color combinations with HSL controls and save your favorites.",
    icon: Palette,
    badge: "New",
    slug: "color-palette-generator",
    category: "design",
  },
  {
    name: "Gradient Generator",
    description: "Create beautiful CSS gradients for your website",
    details: "Design linear, radial, and conic gradients with custom colors and angles.",
    icon: Palette,
    badge: "New",
    slug: "gradient-generator",
    category: "design",
  },
  {
    name: "Image Compressor",
    description: "Compress images without losing quality",
    details: "Reduce file size while maintaining visual quality for faster websites.",
    icon: ImageIcon,
    badge: "New",
    slug: "image-compressor",
    category: "image",
  },
  {
    name: "Image Converter",
    description: "Convert images between different formats",
    details: "Supports conversion between JPG, PNG, WEBP, SVG, and more.",
    icon: Layers,
    slug: "image-converter",
    category: "image",
  },
  {
    name: "Image Cropper",
    description: "Crop and resize images to your desired dimensions",
    details: "Supports custom aspect ratios and precise pixel dimensions.",
    icon: Crop,
    slug: "image-cropper",
    category: "image",
  },
  {
    name: "Markdown Editor",
    description: "Write and preview markdown documents",
    details: "Save your work locally and export as markdown files with live preview.",
    icon: BookOpen,
    badge: "New",
    slug: "markdown-editor",
    category: "text",
  },
  {
    name: "Password Generator",
    description: "Generate secure, random passwords",
    details: "Create strong passwords with customizable length and character types.",
    icon: Key,
    slug: "password-generator",
    category: "utility",
  },
  // {
  //   name: "Project Idea Generator",
  //   description: "Get inspiration for your next front-end project",
  //   details: "Generate project ideas based on skill level, technologies, and project type.",
  //   icon: Lightbulb,
  //   badge: "New",
  //   slug: "project-idea-generator",
  //   category: "developer",
  // },
  {
    name: "QR Code Generator",
    description: "Generate QR codes for URLs, text, and more",
    details: "Customizable QR codes with options for color and error correction.",
    icon: QrCode,
    slug: "qr-code-generator",
    category: "utility",
  },
  {
    name: "Text Extractor",
    description: "Extract text from various file formats",
    details: "Supports TXT, MD, HTML, CSS, JS, JSON, XML, and CSV files.",
    icon: FileText,
    badge: "New",
    slug: "text-extractor",
    category: "text",
  },
  {
    name: "Text to PDF",
    description: "Convert text to PDF",
    details: "Convert text to PDF with a single click.",
    icon: FileIcon,
    slug: "text-to-pdf",
    category: "text",
  },
  {
    name: "URL Shortener",
    description: "Create short, memorable links for your long URLs",
    details: "Track clicks and manage your shortened URLs with custom slugs.",
    icon: LinkIcon,
    badge: "New",
    slug: "url-shortener",
    category: "utility",
  },
]

