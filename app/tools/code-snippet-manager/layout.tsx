import type { Metadata } from "next"
import { ToolJsonLd } from "@/components/tool-json-ld"

const URL = "https://tools.manuchim.site/tools/code-snippet-manager"

export const metadata: Metadata = {
  title: "Code Snippet Manager Online Free — ToolKit",
  description:
    "Store and organize code snippets online for free. Syntax highlighting, tags, and search. No login needed. Saved locally in your browser.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Code Snippet Manager Online Free — ToolKit",
    description: "Store and organize code snippets with syntax highlighting. Free, no login, saved in your browser.",
    url: URL,
    images: [{ url: "/og-code-snippet-manager.jpg", width: 1200, height: 630, alt: "ToolKit Code Snippet Manager" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Snippet Manager Online Free — ToolKit",
    description: "Store and organize code snippets with syntax highlighting. Free, no login, saved in your browser.",
    images: ["/og-code-snippet-manager.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Code Snippet Manager"
        url={URL}
        description="Store and organize code snippets with syntax highlighting online for free. Saved to browser localStorage."
        features={["Syntax highlighting for 13+ languages", "Tag-based organization and search", "Saved locally, no account required"]}
      />
      {children}
    </>
  )
}
