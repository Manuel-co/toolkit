import type { Metadata } from "next"
import { ToolJsonLd } from "@/components/tool-json-ld"

const URL = "https://tools.manuchim.site/tools/gradient-generator"

export const metadata: Metadata = {
  title: "CSS Gradient Generator Online Free — ToolKit",
  description:
    "Create beautiful CSS gradients online for free. Linear, radial and conic gradients with live preview. No login needed. Copy CSS code instantly.",
  alternates: { canonical: URL },
  openGraph: {
    title: "CSS Gradient Generator Online Free — ToolKit",
    description: "Create CSS gradients with live preview. Linear, radial, conic. Free, no login, copy code instantly.",
    url: URL,
    images: [{ url: "/og-gradient-generator.jpg", width: 1200, height: 630, alt: "ToolKit CSS Gradient Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSS Gradient Generator Online Free — ToolKit",
    description: "Create CSS gradients with live preview. Linear, radial, conic. Free, no login, copy code instantly.",
    images: ["/og-gradient-generator.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="CSS Gradient Generator"
        url={URL}
        description="Create beautiful CSS gradients online for free. Linear, radial and conic with live preview."
        features={["Linear, radial and conic gradient types", "Live CSS code preview and copy", "Custom color stops and angle control"]}
      />
      {children}
    </>
  )
}
