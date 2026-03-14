import type { Metadata } from "next"
import { ToolJsonLd } from "@/components/tool-json-ld"

const URL = "https://tools.manuchim.site/tools/image-cropper"

export const metadata: Metadata = {
  title: "Image Cropper Online Free — ToolKit",
  description:
    "Crop and resize images online for free. No login, no uploads to server. Set custom dimensions or aspect ratios and download instantly.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Image Cropper Online Free — ToolKit",
    description: "Crop and resize images online for free. No login, no uploads to server. Download instantly.",
    url: URL,
    images: [{ url: "/og-image-cropper.jpg", width: 1200, height: 630, alt: "ToolKit Image Cropper" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Cropper Online Free — ToolKit",
    description: "Crop and resize images online for free. No login, no uploads to server.",
    images: ["/og-image-cropper.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Image Cropper"
        url={URL}
        description="Crop and resize images online for free. Runs entirely in your browser — no uploads, no login."
        features={["Custom aspect ratio cropping", "Precise pixel dimension control", "Instant download, no server upload"]}
      />
      {children}
    </>
  )
}
