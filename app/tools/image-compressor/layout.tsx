import type { Metadata } from "next"
import { ToolJsonLd } from "@/components/tool-json-ld"

const URL = "https://tools.manuchim.site/tools/image-compressor"

export const metadata: Metadata = {
  title: "Image Compressor Online Free — ToolKit",
  description:
    "Compress images online for free without losing quality. No login, no server uploads. Reduce PNG and JPG file size instantly in your browser.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Image Compressor Online Free — ToolKit",
    description: "Compress images without quality loss. Free, no login, runs entirely in your browser.",
    url: URL,
    images: [{ url: "/og-image-compressor.jpg", width: 1200, height: 630, alt: "ToolKit Image Compressor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Compressor Online Free — ToolKit",
    description: "Compress images without quality loss. Free, no login, runs entirely in your browser.",
    images: ["/og-image-compressor.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Image Compressor"
        url={URL}
        description="Compress PNG and JPG images online for free without quality loss. Runs in your browser."
        features={["Lossless and lossy compression modes", "Client-side processing, no server upload", "Supports PNG and JPG formats"]}
      />
      {children}
    </>
  )
}
