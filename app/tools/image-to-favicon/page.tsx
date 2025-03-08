"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { ToolResult } from "@/components/tool-result"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { FileImage, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function ImageToFaviconPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [format, setFormat] = useState("ico")

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setResult(null)
  }

  const handleProcess = () => {
    if (!file) return

    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      // In a real app, this would call an API to process the image
      // For demo purposes, we'll just use a placeholder
      setResult("/placeholder.svg?height=64&width=64&text=Favicon")
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileImage className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Image to Favicon</h1>
        </div>
        <p className="text-muted-foreground">
          Convert any image to a favicon for your website. Creates favicons in multiple sizes for all devices and
          browsers.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Free to use</AlertTitle>
        <AlertDescription>
          This tool is completely free to use with no login required. Your images are processed securely and are not
          stored on our servers.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Upload Image</h2>
          <FileUpload accept="image/*" maxSize={5} onFileSelect={handleFileSelect} />

          <div className="space-y-3">
            <h3 className="font-medium">Favicon Format</h3>
            <RadioGroup defaultValue="ico" value={format} onValueChange={setFormat}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ico" id="ico" />
                <Label htmlFor="ico">ICO (Standard Favicon)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="png" id="png" />
                <Label htmlFor="png">PNG (Modern Browsers)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Formats (ZIP Package)</Label>
              </div>
            </RadioGroup>
          </div>

          <Button onClick={handleProcess} disabled={!file || isProcessing} className="w-full">
            {isProcessing ? "Processing..." : "Generate "}
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Result</h2>
          {result ? (
            <ToolResult title="Favicon Generated" resultImage={result} resultType="download" />
          ) : (
            <div className="border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Upload an image and click "Generate Favicon" to see the result.</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">How to use</h2>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>Upload a square image (ideally 512x512 pixels or larger).</li>
          <li>Select your preferred favicon format.</li>
          <li>Click the "Generate Favicon" button to process your image.</li>
          <li>Download the favicon file(s) and add them to your website.</li>
          <li>For best results, use a simple image with clear details that will be visible at small sizes.</li>
        </ol>
      </div>

      <RelatedTools currentTool="image-to-favicon" />
    </div>
  )
}

