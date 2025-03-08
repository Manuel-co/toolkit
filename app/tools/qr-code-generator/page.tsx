"use client"

import { useState } from "react"
import { ToolResult } from "@/components/tool-result"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { QrCode, Info, Share2, Download, Copy, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toDataURL, QRCodeToDataURLOptions } from 'qrcode'
import { toast } from "sonner"

export default function QrCodeGeneratorPage() {
  const [content, setContent] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [contentType, setContentType] = useState("url")
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("M")
  const [isCopied, setIsCopied] = useState(false)

  const formatContent = (content: string, type: string) => {
    switch (type) {
      case 'url':
        // Add https:// if no protocol is specified
        return content.match(/^https?:\/\//) ? content : `https://${content}`
      case 'contact':
        // Format as vCard
        const [name = '', email = '', phone = ''] = content.split(',').map(s => s.trim())
        return `BEGIN:VCARD
VERSION:3.0
FN:${name}
EMAIL:${email}
TEL:${phone}
END:VCARD`
      default:
        return content
    }
  }

  const handleGenerate = async () => {
    if (!content) return

    try {
      setIsProcessing(true)
      const formattedContent = formatContent(content, contentType)
      
      // Generate QR code as data URL
      const options: QRCodeToDataURLOptions = {
        errorCorrectionLevel: errorCorrection,
        margin: 1,
        width: 300,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      }
      
      const qrCodeDataUrl = await toDataURL(formattedContent, options)
      setResult(qrCodeDataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Failed to generate QR code')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleShare = async () => {
    if (!result) return

    try {
      if (navigator.share) {
        // Convert base64 to blob
        const response = await fetch(result)
        const blob = await response.blob()
        const file = new File([blob], 'qr-code.png', { type: 'image/png' })

        await navigator.share({
          title: 'QR Code',
          text: 'Check out this QR code I generated!',
          files: [file]
        })
        toast.success('Shared successfully!')
      } else {
        // Fallback to copy to clipboard
        await navigator.clipboard.writeText(result)
        setIsCopied(true)
        toast.success('Copied to clipboard!')
        setTimeout(() => setIsCopied(false), 2000)
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast.error('Failed to share QR code')
    }
  }

  const handleDownload = () => {
    if (!result) return

    const link = document.createElement('a')
    link.href = result
    link.download = 'qr-code.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Downloaded successfully!')
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <QrCode className="h-6 w-6" />
          <h1 className="text-3xl font-bold">QR Code Generator</h1>
        </div>
        <p className="text-muted-foreground">
          Generate QR codes for URLs, text, and more. Customizable QR codes with options for color and error correction.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Free to use</AlertTitle>
        <AlertDescription>
          This tool is completely free to use with no login required. Your data is processed securely and is not stored
          on our servers.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Create QR Code</h2>

          <Tabs defaultValue="url" value={contentType} onValueChange={setContentType}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </TabsContent>
            <TabsContent value="text" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="text">Text Content</Label>
                <Input
                  id="text"
                  placeholder="Enter your text here"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </TabsContent>
            <TabsContent value="contact" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Information</Label>
                <Input
                  id="contact"
                  placeholder="Name, Email, Phone"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Format: Name, Email, Phone</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* <div className="space-y-3">
            <h3 className="font-medium">Error Correction Level</h3>
            <RadioGroup defaultValue="M" value={errorCorrection} onValueChange={(value) => setErrorCorrection(value as "L" | "M" | "Q" | "H")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="L" id="L" />
                <Label htmlFor="L">Low (7%)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="M" id="M" />
                <Label htmlFor="M">Medium (15%)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Q" id="Q" />
                <Label htmlFor="Q">Quartile (25%)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="H" id="H" />
                <Label htmlFor="H">High (30%)</Label>
              </div>
            </RadioGroup>
          </div> */}

          <Button onClick={handleGenerate} disabled={!content || isProcessing} className="w-full">
            {isProcessing ? "Generating..." : "Generate QR Code"}
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Result</h2>
          {result ? (
            <ToolResult 
              title="QR Code Generated" 
              resultImage={result} 
              resultType="image"
              actions={
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="flex items-center gap-2"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4" />
                        Share
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              }
            />
          ) : (
            <div className="border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                Enter your content and click "Generate QR Code" to see the result.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">How to use</h2>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>Select the type of content you want to encode (URL, text, or contact information).</li>
          <li>Enter your content in the input field.</li>
          <li>Choose an error correction level (optional).</li>
          <li>Click the "Generate QR Code" button.</li>
          <li>Download or share your QR code.</li>
        </ol>
      </div>

      <RelatedTools currentTool="qr-code-generator" />
    </div>
  )
}

