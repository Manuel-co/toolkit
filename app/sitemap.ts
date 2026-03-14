import type { MetadataRoute } from "next"

const BASE = "https://tools.manuchim.site"

const TOOLS = [
  "image-cropper",
  "color-extractor",
  "qr-code-generator",
  "image-converter",
  "image-compressor",
  "color-palette-generator",
  "gradient-generator",
  "markdown-editor",
  "password-generator",
  "text-extractor",
  "url-shortener",
  "code-snippet-manager",
  "text-to-pdf",
  "image-to-favicon",
  "project-idea-generator",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().split("T")[0]

  return [
    { url: BASE,          lastModified: today, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/tools`, lastModified: today, changeFrequency: "weekly",  priority: 0.9 },
    ...TOOLS.map(slug => ({
      url: `${BASE}/tools/${slug}`,
      lastModified: today,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
