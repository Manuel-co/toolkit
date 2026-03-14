import type { Metadata } from "next"
import { ToolJsonLd } from "@/components/tool-json-ld"

const URL = "https://tools.manuchim.site/tools/color-palette-generator"

export const metadata: Metadata = {
  title: "Color Palette Generator Online Free — ToolKit",
  description:
    "Generate beautiful color palettes for your design projects online for free. No login needed. Create harmonious color schemes with hex codes instantly.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Color Palette Generator Online Free — ToolKit",
    description: "Generate beautiful color palettes for design projects. Free, no login, copy hex codes instantly.",
    url: URL,
    images: [{ url: "/og-color-palette-generator.jpg", width: 1200, height: 630, alt: "ToolKit Color Palette Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Palette Generator Online Free — ToolKit",
    description: "Generate beautiful color palettes for design projects. Free, no login, copy hex codes instantly.",
    images: ["/og-color-palette-generator.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Color Palette Generator"
        url={URL}
        description="Generate harmonious color palettes for design projects online for free. No login required."
        features={["HSL-based color harmony generation", "One-click hex code copy", "Export palettes for design tools"]}
      />
      {children}
    </>
  )
}
