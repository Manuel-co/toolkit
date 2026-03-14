import type { Metadata } from "next"
import { ToolJsonLd } from "@/components/tool-json-ld"

const URL = "https://tools.manuchim.site/tools/text-extractor"

export const metadata: Metadata = {
  title: "Text Extractor Online Free — ToolKit",
  description:
    "Extract text from TXT, HTML, JSON, CSV and more online for free. No login, no server uploads. Pull plain text from any file instantly in your browser.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Text Extractor Online Free — ToolKit",
    description: "Extract text from TXT, HTML, JSON, CSV and more. Free, no login, runs in your browser.",
    url: URL,
    images: [{ url: "/og-text-extractor.jpg", width: 1200, height: 630, alt: "ToolKit Text Extractor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Extractor Online Free — ToolKit",
    description: "Extract text from TXT, HTML, JSON, CSV and more. Free, no login, runs in your browser.",
    images: ["/og-text-extractor.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Text Extractor"
        url={URL}
        description="Extract plain text from TXT, HTML, JSON, CSV and other file formats online for free."
        features={["Supports TXT, HTML, JSON, CSV, XML formats", "Client-side extraction, no server upload", "Copy extracted text with one click"]}
      />
      {children}
    </>
  )
}
