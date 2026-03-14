import type { Metadata } from "next"
import { ToolJsonLd } from "@/components/tool-json-ld"

const URL = "https://tools.manuchim.site/tools/image-converter"

export const metadata: Metadata = {
  title: "Image Converter Online Free — ToolKit",
  description:
    "Convert images between JPG, PNG, WEBP and more online for free. No login, no server uploads. Fast browser-based image format conversion.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Image Converter Online Free — ToolKit",
    description: "Convert images between JPG, PNG, WEBP and more. Free, no login, runs in your browser.",
    url: URL,
    images: [{ url: "/og-image-converter.jpg", width: 1200, height: 630, alt: "ToolKit Image Converter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Converter Online Free — ToolKit",
    description: "Convert images between JPG, PNG, WEBP and more. Free, no login, runs in your browser.",
    images: ["/og-image-converter.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Image Converter"
        url={URL}
        description="Convert images between JPG, PNG, WEBP and other formats online for free. Runs in your browser."
        features={["Supports JPG, PNG, WEBP, GIF formats", "Client-side conversion, no server upload", "Batch conversion support"]}
      />
      {children}
    </>
  )
}
