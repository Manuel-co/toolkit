import type { Metadata } from "next"
import { ToolJsonLd } from "@/components/tool-json-ld"

const URL = "https://tools.manuchim.site/tools/project-idea-generator"

export const metadata: Metadata = {
  title: "Project Idea Generator Online Free — ToolKit",
  description:
    "Generate creative project ideas for developers and designers online for free. No login needed. Get instant inspiration for your next build.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Project Idea Generator Online Free — ToolKit",
    description: "Generate creative project ideas for developers and designers. Free, no login, instant inspiration.",
    url: URL,
    images: [{ url: "/og-project-idea-generator.jpg", width: 1200, height: 630, alt: "ToolKit Project Idea Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Idea Generator Online Free — ToolKit",
    description: "Generate creative project ideas for developers and designers. Free, no login, instant inspiration.",
    images: ["/og-project-idea-generator.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Project Idea Generator"
        url={URL}
        description="Generate creative project ideas for developers and designers online for free."
        features={["Curated ideas for developers and designers", "Filter by skill level and category", "No login or account required"]}
      />
      {children}
    </>
  )
}
