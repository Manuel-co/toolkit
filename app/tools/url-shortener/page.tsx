"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link as LinkIcon, Copy, Check, Trash2, ExternalLink, BarChart3, Sparkles, Info, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"

interface ShortenedURL {
  id: string
  originalUrl: string
  shortCode: string
  shortUrl: string
  clicks: number
  createdAt: string
}

export default function URLShortenerPage() {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedURL[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load saved URLs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('shortenedUrls')
    if (saved) {
      setShortenedUrls(JSON.parse(saved))
    }
    setIsLoading(false)
  }, [])

  // Save URLs to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls))
    }
  }, [shortenedUrls, isLoading])

  // Validate URL
  const isValidUrl = (urlString: string) => {
    try {
      const url = new URL(urlString)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  // Generate random short code
  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  // Shorten URL
  const handleShorten = () => {
    if (!url.trim()) {
      toast.error("Please enter a URL")
      return
    }

    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL (must start with http:// or https://)")
      return
    }

    // Check if custom slug is already used
    if (customSlug && shortenedUrls.some(u => u.shortCode === customSlug)) {
      toast.error("This custom slug is already in use")
      return
    }

    const shortCode = customSlug || generateShortCode()
    const baseUrl = window.location.origin
    const shortUrl = `${baseUrl}/s/${shortCode}`

    const newUrl: ShortenedURL = {
      id: Date.now().toString(),
      originalUrl: url,
      shortCode,
      shortUrl,
      clicks: 0,
      createdAt: new Date().toISOString(),
    }

    setShortenedUrls([newUrl, ...shortenedUrls])
    setUrl("")
    setCustomSlug("")
    toast.success("URL shortened successfully!")
  }

  // Copy to clipboard
  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Delete URL
  const deleteUrl = (id: string) => {
    setShortenedUrls(shortenedUrls.filter(u => u.id !== id))
    toast.success("URL deleted")
  }

  // Simulate click tracking (in a real app, this would be server-side)
  const trackClick = (id: string) => {
    setShortenedUrls(urls => 
      urls.map(u => u.id === id ? { ...u, clicks: u.clicks + 1 } : u)
    )
  }

  return (
    <div className="relative space-y-8">
      {/* Coming Soon Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
        <Card className="max-w-md mx-4 border-2 border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-4">
              <LinkIcon className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl">Coming Soon</CardTitle>
            <CardDescription className="text-base">
              We're working hard to bring you the URL Shortener tool
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              This feature is currently under development and will be available soon. Stay tuned!
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">In Development</span>
            </div>
            <Button 
              onClick={() => router.push('/tools')} 
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tools
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Blurred Content Below */}
      <div className="pointer-events-none select-none">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-2">
          <LinkIcon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">URL Shortener</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create short, memorable links for your long URLs. Track clicks and manage all your shortened links in one place.
          </p>
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="border-primary/20 bg-primary/5">
        <Sparkles className="h-5 w-5 text-primary" />
        <AlertTitle className="text-base">Free & Private</AlertTitle>
        <AlertDescription className="text-sm">
          All shortened URLs are stored locally in your browser. No account required, completely free, and your links stay private.
        </AlertDescription>
      </Alert>

      <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
        {/* URL Shortener Form */}
        <Card className="h-fit lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle>Shorten URL</CardTitle>
            <CardDescription>
              Enter a long URL and get a short link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Long URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customSlug">Custom Slug (Optional)</Label>
              <Input
                id="customSlug"
                placeholder="my-custom-link"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for a random short code
              </p>
            </div>

            <Button 
              onClick={handleShorten} 
              className="w-full h-12"
              size="lg"
            >
              <LinkIcon className="mr-2 h-5 w-5" />
              Shorten URL
            </Button>
          </CardContent>
        </Card>

        {/* Shortened URLs List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Shortened URLs</h2>
            {shortenedUrls.length > 0 && (
              <Badge variant="secondary">
                {shortenedUrls.length} {shortenedUrls.length === 1 ? 'link' : 'links'}
              </Badge>
            )}
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center p-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </CardContent>
            </Card>
          ) : shortenedUrls.length > 0 ? (
            <div className="space-y-4">
              {shortenedUrls.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-primary" />
                          <CardTitle className="text-lg break-all">{item.shortUrl}</CardTitle>
                        </div>
                        <CardDescription className="break-all">
                          {item.originalUrl}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(item.id, item.shortUrl)}
                        >
                          {copiedId === item.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteUrl(item.id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <BarChart3 className="h-4 w-4" />
                          <span>{item.clicks} clicks</span>
                        </div>
                        <div className="text-muted-foreground">
                          Created {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <a
                        href={item.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackClick(item.id)}
                      >
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <LinkIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No shortened URLs yet</h3>
                <p className="text-muted-foreground mb-4">
                  Enter a long URL to create your first short link
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Features Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Features & Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold">Custom Slugs</h3>
              <p className="text-sm text-muted-foreground">
                Create memorable short links with custom slugs instead of random codes
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Click Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track how many times your shortened links have been clicked
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Local Storage</h3>
              <p className="text-sm text-muted-foreground">
                All your links are stored locally in your browser for privacy
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Easy Sharing</h3>
              <p className="text-sm text-muted-foreground">
                Copy shortened URLs to clipboard with one click for easy sharing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 ml-6">
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
              <span className="pt-0.5">Paste your long URL into the input field</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
              <span className="pt-0.5">Optionally add a custom slug to make it memorable</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
              <span className="pt-0.5">Click "Shorten URL" to generate your short link</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">4</span>
              <span className="pt-0.5">Copy and share your shortened URL anywhere</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      <RelatedTools currentTool="url-shortener" />
      </div>
    </div>
  )
}
