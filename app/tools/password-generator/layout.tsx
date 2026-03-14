import type { Metadata } from "next"
import { ToolJsonLd } from "@/components/tool-json-ld"

const URL = "https://tools.manuchim.site/tools/password-generator"

export const metadata: Metadata = {
  title: "Password Generator Online Free — ToolKit",
  description:
    "Generate strong, secure random passwords online for free. No login needed. Customize length and character types. Passwords never leave your browser.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Password Generator Online Free — ToolKit",
    description: "Generate strong random passwords. Customizable length and characters. Free, no login, 100% private.",
    url: URL,
    images: [{ url: "/og-password-generator.jpg", width: 1200, height: 630, alt: "ToolKit Password Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Password Generator Online Free — ToolKit",
    description: "Generate strong random passwords. Customizable length and characters. Free, no login, 100% private.",
    images: ["/og-password-generator.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Password Generator"
        url={URL}
        description="Generate strong, secure random passwords online for free. Runs in your browser — passwords never leave your device."
        features={["Customizable length and character sets", "Client-side generation, never sent to server", "One-click copy to clipboard"]}
      />
      {children}
    </>
  )
}
