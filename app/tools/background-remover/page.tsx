"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { Paintbrush, Info, Loader2, Sparkles, Download, Image as ImageIcon, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { removeBackground } from "@imgly/background-removal"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const LoadingAnimation = ({ progress }: { progress: string }) => (
  <Card className="border-2 border-primary/20">
    <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-muted-foreground/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
        </div>
      </div>
      <div className="space-y-3 text-center w-full">
        <p className="font-semibold text-lg">Removing Background</p>
        <p className="text-sm text-muted-foreground">{progress || "Processing with AI..."}</p>
        <Progress value={undefined} className="w-full" />
      </div>
    </CardContent>
  </Card>
)

export default function BackgroundRemoverPage() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [progress, setProgress] = useState<string>("")

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setResult(null)
    setResultBlob(null)
    setProgress("")
    
    // Create preview URL
    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
  }

  const handleProcess = async () => {
    if (!file) {
      toast.error("Please upload an image first")
      return
    }

    setIsProcessing(true)
    setProgress("Loading AI model...")

    try {
      const imageUrl = URL.createObjectURL(file)
      setProgress("Processing image with AI...")

      const blob = await removeBackground(imageUrl)

      const resultUrl = URL.createObjectURL(blob)
      setResult(resultUrl)
      setResultBlob(blob)

      URL.revokeObjectURL(imageUrl)

      toast.success("Background removed successfully!")
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to remove background")
    } finally {
      setIsProcessing(false)
      setProgress("")
    }
  }

  const handleDownload = () => {
    if (!result || !resultBlob) return

    const originalName = file?.name ?? "image"
    const baseName = originalName.replace(/\.[^/.]+$/, "")
    const downloadName = `${baseName}-no-bg.png`

    const a = document.createElement("a")
    a.href = result
    a.download = downloadName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    toast.success("Image downloaded!")
  }

  const handleReset = () => {
    setFile(null)
    setPreviewUrl(null)
    setResult(null)
    setResultBlob(null)
    setProgress("")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-2">
          <Paintbrush className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Background Remover</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Remove backgrounds from images using AI-powered processing. Perfect for product photos, portraits, and creating
            transparent PNGs.
          </p>
        </div>
      </div>

      {/* Features Alert */}
      <Alert className="border-primary/20 bg-primary/5">
        <Sparkles className="h-5 w-5 text-primary" />
        <AlertTitle className="text-base">AI-Powered & Free</AlertTitle>
        <AlertDescription className="text-sm">
          Advanced AI removes backgrounds directly in your browser. No uploads to external servers,
          completely free, and no API key required. First use downloads a ~50MB model (one-time).
        </AlertDescription>
      </Alert>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upload Section */}
        <Card className="border-2">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Upload Image</h2>
            </div>

            <FileUpload accept="image/*" maxSize={10} onFileSelect={handleFileSelect} />

            {previewUrl && !result && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Preview:</p>
                <div className="relative rounded-lg overflow-hidden border-2 border-dashed">
                  <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-64 object-contain bg-muted" />
                </div>
              </div>
            )}

            <Button
              onClick={handleProcess}
              disabled={!file || isProcessing}
              className="w-full h-12 text-base"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Remove Background
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Result Section */}
        <Card className="border-2">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Result</h2>
              </div>
              {result && (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Reset
                </Button>
              )}
            </div>

            {isProcessing ? (
              <LoadingAnimation progress={progress} />
            ) : result ? (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border-2 border-primary/20">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] dark:bg-[linear-gradient(45deg,#2a2a2a_25%,transparent_25%,transparent_75%,#2a2a2a_75%,#2a2a2a),linear-gradient(45deg,#2a2a2a_25%,transparent_25%,transparent_75%,#2a2a2a_75%,#2a2a2a)]"></div>
                  <img src={result} alt="Result" className="relative w-full h-auto max-h-96 object-contain" />
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleDownload}
                    className="flex-1 h-12 text-base"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download PNG
                  </Button>
                </div>

                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Background removed successfully! The transparent areas are shown with a checkered pattern.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/5 min-h-[300px]">
                <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-center">
                  Upload an image and click "Remove Background" to see the result.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold">How to use</h2>
          <ol className="space-y-3 ml-6">
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
              <span className="pt-0.5">Upload your image by dragging and dropping or clicking the upload area</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
              <span className="pt-0.5">Click "Remove Background" to process your image with AI</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
              <span className="pt-0.5">Wait for the AI model to process (first use downloads the model, ~50MB)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">4</span>
              <span className="pt-0.5">Click "Download PNG" to save your transparent image</span>
            </li>
          </ol>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>First Time Use</AlertTitle>
            <AlertDescription>
              The first time you use this tool, it will download an AI model (~50MB). This is a one-time download
              and subsequent uses will be much faster. All processing happens in your browser.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <RelatedTools currentTool="background-remover" />
    </div>
  )
}
