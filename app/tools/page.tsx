import type { Metadata } from "next"
import ToolsClient from "./_tools-client"

const BASE_URL = "https://tools.manuchim.site"

export const metadata: Metadata = {
  title: "All Free Online Tools — ToolKit",
  description:
    "Browse all free browser-based tools. Image editing, QR codes, color palettes, password generator and more. No login, no limits, works instantly.",
  alternates: { canonical: `${BASE_URL}/tools` },
  openGraph: {
    title: "All Free Online Tools — ToolKit",
    description:
      "Browse all free browser-based tools. No login, no limits, works instantly.",
    url: `${BASE_URL}/tools`,
    images: [{ url: "/og-tools.jpg", width: 1200, height: 630, alt: "ToolKit — All Free Online Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Free Online Tools — ToolKit",
    description: "Browse all free browser-based tools. No login, no limits, works instantly.",
    images: ["/og-tools.jpg"],
  },
}

export default function Page() {
  return <ToolsClient />
}
