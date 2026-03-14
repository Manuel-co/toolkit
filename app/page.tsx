import type { Metadata } from "next"
import HomeClient from "./_home-client"
import { HomepageJsonLd } from "./page-metadata"

const BASE_URL = "https://tools.manuchim.site"

export const metadata: Metadata = {
  title: "Free Online Tools — ToolKit",
  description:
    "Free browser-based tools for developers and creators. No login, no file uploads, no limits. Image editing, QR codes, color tools and more — try them now.",
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "Free Online Tools — ToolKit",
    description:
      "Free browser-based tools for developers and creators. No login, no file uploads, no limits.",
    url: BASE_URL,
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "ToolKit — Free Online Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Tools — ToolKit",
    description:
      "Free browser-based tools for developers and creators. No login, no file uploads, no limits.",
    images: ["/og-default.jpg"],
  },
}

export default function Page() {
  return (
    <>
      <HomepageJsonLd />
      <HomeClient />
    </>
  )
}
