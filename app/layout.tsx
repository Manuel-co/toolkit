import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { PageTransition } from "@/components/page-transition"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

const BASE_URL = "https://tools.manuchim.site"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Free Online Tools — ToolKit",
    template: "%s — ToolKit",
  },
  description:
    "Free browser-based tools for developers and creators. No login, no file uploads, no limits. Image editing, QR codes, color tools and more.",
  keywords: ["free online tools", "browser tools", "image tools", "developer tools", "no login tools"],
  authors: [{ name: "ToolKit", url: BASE_URL }],
  creator: "ToolKit",
  publisher: "ToolKit",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "ToolKit",
    title: "Free Online Tools — ToolKit",
    description:
      "Free browser-based tools for developers and creators. No login, no file uploads, no limits.",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "ToolKit — Free Online Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Tools — ToolKit",
    description:
      "Free browser-based tools for developers and creators. No login, no file uploads, no limits.",
    images: ["/og-default.jpg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <PageTransition>{children}</PageTransition>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
