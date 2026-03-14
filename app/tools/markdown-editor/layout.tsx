import type { Metadata } from "next"
import { ToolJsonLd } from "@/components/tool-json-ld"

const URL = "https://tools.manuchim.site/tools/markdown-editor"

export const metadata: Metadata = {
  title: "Markdown Editor Online Free — ToolKit",
  description:
    "Write and preview markdown online for free. Live split-pane preview, auto-save to browser, export as .md file. No login or account needed.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Markdown Editor Online Free — ToolKit",
    description: "Write and preview markdown with live split-pane view. Free, no login, auto-saves locally.",
    url: URL,
    images: [{ url: "/og-markdown-editor.jpg", width: 1200, height: 630, alt: "ToolKit Markdown Editor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Editor Online Free — ToolKit",
    description: "Write and preview markdown with live split-pane view. Free, no login, auto-saves locally.",
    images: ["/og-markdown-editor.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Markdown Editor"
        url={URL}
        description="Write and preview markdown online for free with live split-pane view. Auto-saves to localStorage."
        features={["Live split-pane markdown preview", "Auto-save to browser localStorage", "Export as .md file"]}
      />
      {children}
    </>
  )
}
