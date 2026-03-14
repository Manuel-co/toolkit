import type { Metadata } from "next"
import { ToolJsonLd } from "@/components/tool-json-ld"

const URL = "https://tools.manuchim.site/tools/image-to-favicon"

export const metadata: Metadata = {
  title: "Image to Favicon Generator Online Free — ToolKit",
  description:
    "Convert any image to a favicon ICO file online for free. No login, no server uploads. Generate 16x16, 32x32 and 64x64 favicons instantly.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Image to Favicon Generator Online Free — ToolKit",
    description: "Convert images to favicon ICO files. Multiple sizes. Free, no login, runs in your browser.",
    url: URL,
    images: [{ url: "/og-image-to-favicon.jpg", width: 1200, height: 630, alt: "ToolKit Image to Favicon" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to Favicon Generator Online Free — ToolKit",
    description: "Convert images to favicon ICO files. Multiple sizes. Free, no login, runs in your browser.",
    images: ["/og-image-to-favicon.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Image to Favicon Generator"
        url={URL}
        description="Convert any image to a favicon ICO file online for free. Generates multiple sizes."
        features={["Generates 16x16, 32x32 and 64x64 sizes", "Client-side conversion, no server upload", "Download as .ico file instantly"]}
      />
      {children}
    </>
  )
}
