import type { Metadata } from "next"
import { ToolJsonLd } from "@/components/tool-json-ld"

const URL = "https://tools.manuchim.site/tools/text-to-pdf"

export const metadata: Metadata = {
  title: "Text to PDF Converter Online Free — ToolKit",
  description:
    "Convert text to PDF online for free. Add headings, paragraphs and lists then export as a polished PDF. No login, no server uploads needed.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Text to PDF Converter Online Free — ToolKit",
    description: "Convert rich text to PDF with headings and lists. Free, no login, runs in your browser.",
    url: URL,
    images: [{ url: "/og-text-to-pdf.jpg", width: 1200, height: 630, alt: "ToolKit Text to PDF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text to PDF Converter Online Free — ToolKit",
    description: "Convert rich text to PDF with headings and lists. Free, no login, runs in your browser.",
    images: ["/og-text-to-pdf.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Text to PDF Converter"
        url={URL}
        description="Convert rich text documents to PDF online for free. Supports headings, paragraphs and lists."
        features={["Block-based editor with headings and lists", "Customizable font, page size and margins", "Client-side PDF generation, no server upload"]}
      />
      {children}
    </>
  )
}
