import type { Metadata } from "next"
import { ToolJsonLd } from "@/components/tool-json-ld"

const URL = "https://tools.manuchim.site/tools/color-extractor"

export const metadata: Metadata = {
  title: "Color Extractor Online Free — ToolKit",
  description:
    "Extract color palettes from any image online for free. No login required. Get hex codes, RGB values and dominant colors instantly in your browser.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Color Extractor Online Free — ToolKit",
    description: "Extract color palettes from any image. Get hex codes and RGB values instantly. Free, no login.",
    url: URL,
    images: [{ url: "/og-color-extractor.jpg", width: 1200, height: 630, alt: "ToolKit Color Extractor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Extractor Online Free — ToolKit",
    description: "Extract color palettes from any image. Get hex codes and RGB values instantly. Free, no login.",
    images: ["/og-color-extractor.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Color Extractor"
        url={URL}
        description="Extract dominant color palettes from any image online. Runs in your browser — no uploads, no login."
        features={["Dominant color detection from images", "Hex and RGB color code output", "One-click copy for each color"]}
      />
      {children}
    </>
  )
}
