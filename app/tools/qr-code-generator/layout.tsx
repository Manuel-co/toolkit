import type { Metadata } from "next"
import { ToolJsonLd } from "@/components/tool-json-ld"

const URL = "https://tools.manuchim.site/tools/qr-code-generator"

export const metadata: Metadata = {
  title: "QR Code Generator Online Free — ToolKit",
  description:
    "Generate QR codes for URLs, text and contact cards online for free. No login, no account needed. Download as PNG instantly.",
  alternates: { canonical: URL },
  openGraph: {
    title: "QR Code Generator Online Free — ToolKit",
    description: "Generate QR codes for URLs, text and contact cards. Free, no login, download as PNG instantly.",
    url: URL,
    images: [{ url: "/og-qr-code-generator.jpg", width: 1200, height: 630, alt: "ToolKit QR Code Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator Online Free — ToolKit",
    description: "Generate QR codes for URLs, text and contact cards. Free, no login, download as PNG instantly.",
    images: ["/og-qr-code-generator.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="QR Code Generator"
        url={URL}
        description="Generate QR codes for URLs, plain text, or contact cards online for free. No login required."
        features={["QR codes for URLs, text and vCards", "Downloadable PNG output", "No account or login required"]}
      />
      {children}
    </>
  )
}
