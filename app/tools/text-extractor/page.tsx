"use client"

import { useState } from "react"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, FileText, Info, Download, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TextExtractorPage() {
  const [extractedText, setExtractedText] = useState("")
  const [copied, setCopied] = useState(false)

  // Extract text from file
  const extractText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setExtractedText(content)
      }
      reader.readAsText(file)
    }
  }

  // Copy text to clipboard
  const copyText = () => {
    navigator.clipboard.writeText(extractedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Download text as file
  const downloadText = () => {
    const blob = new Blob([extractedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "extracted-text.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Text Extractor</h1>
        </div>
        <p className="text-muted-foreground">
          Extract text from various file formats. Supports plain text files and more.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Free to use</AlertTitle>
        <AlertDescription>
          This tool is completely free to use with no login required. Your files are processed locally in your browser.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>Select a file to extract text from.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".txt,.md,.html,.css,.js,.json,.xml,.csv"
                    onChange={extractText}
                    className="hidden"
                  />
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports TXT, MD, HTML, CSS, JS, JSON, XML, CSV
                    </p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Extracted Text</CardTitle>
              <CardDescription>View and manage the extracted text.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder="Extracted text will appear here..."
                className="font-mono min-h-[200px]"
              />
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={copyText} className="flex-1">
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button onClick={downloadText} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Tips for Text Extraction</h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Use plain text files for best results.</li>
          <li>Large files may take longer to process.</li>
          <li>Some formatting may be lost during extraction.</li>
          <li>Check the extracted text for accuracy.</li>
          <li>Use the copy button for quick sharing.</li>
          <li>Download the text for offline use.</li>
        </ul>
      </div>

      <RelatedTools currentTool="text-extractor" />
    </div>
  )
} 