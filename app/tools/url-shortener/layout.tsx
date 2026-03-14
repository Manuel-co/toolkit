import type { Metadata } from "next"
import { ToolJsonLd } from "@/components/tool-json-ld"

const URL = "https://tools.manuchim.site/tools/url-shortener"

export const metadata: Metadata = {
  title: "URL Shortener Online Free — ToolKit",
  description:
    "Shorten long URLs online for free. No login or account needed. Create short, shareable links instantly with no usage limits.",
  alternates: { canonical: URL },
  openGraph: {
    title: "URL Shortener Online Free — ToolKit",
    description: "Shorten long URLs and create shareable links instantly. Free, no login, no usage limits.",
    url: URL,
    images: [{ url: "/og-url-shortener.jpg", width: 1200, height: 630, alt: "ToolKit URL Shortener" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Shortener Online Free — ToolKit",
    description: "Shorten long URLs and create shareable links instantly. Free, no login, no usage limits.",
    images: ["/og-url-shortener.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="URL Shortener"
        url={URL}
        description="Shorten long URLs and create shareable links online for free. No login required."
        features={["Instant URL shortening", "No account or login required", "No usage limits"]}
      />
      {children}
    </>
  )
}
