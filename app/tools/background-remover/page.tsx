"use client"

import { useState, useEffect } from "react"
import { FileUpload } from "@/components/file-upload"
import { ToolResult } from "@/components/tool-result"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { Paintbrush, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function BackgroundRemoverPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")

  useEffect(() => {
    // Load API key from environment variable
    const envApiKey = process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY
    if (envApiKey && envApiKey !== "your_api_key_here") {
      setApiKey(envApiKey)
    }
  }, [])

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setResult(null)
  }

  const handleProcess = async () => {
    if (!file) {
      toast.error("Please upload an image first")
      return
    }

    if (!apiKey) {
      toast.error("Please set the remove.bg API key in your .env file")
      return
    }

    setIsProcessing(true)

    try {
      // Convert file to base64
      const reader = new FileReader()
      reader.readAsDataURL(file)
      
      reader.onload = async () => {
        const base64Image = reader.result as string
        const base64Data = base64Image.split(',')[1]

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
          method: 'POST',
          headers: {
            'X-Api-Key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_file_b64: base64Data,
            size: 'regular',
            type: 'auto',
            format: 'auto',
            bg_color: null,
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setResult(url)
        toast.success("Background removed successfully!")
      }

      reader.onerror = () => {
        throw new Error('Failed to read the image file')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to remove background")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Paintbrush className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Background Remover</h1>
        </div>
        <p className="text-muted-foreground">
          Remove backgrounds from images with a single click using remove.bg API. Perfect for product photos, portraits, and creating
          transparent PNGs.
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
          
          <div className="space-y-4">
            {!apiKey && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertTitle>Missing API Key</AlertTitle>
                <AlertDescription>
                  Please set your remove.bg API key in the .env file to use this tool.
                </AlertDescription>
              </Alert>
            )}
            
            <FileUpload accept="image/*" maxSize={10} onFileSelect={handleFileSelect} />

            <Button 
              onClick={handleProcess} 
              disabled={!file || isProcessing || !apiKey} 
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Remove Background"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Result</h2>
          {result ? (
            <ToolResult 
              title="Background Removed" 
              resultImage={result} 
              resultType="image" 
            />
          ) : (
            <div className="border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Upload an image and click "Remove Background" to see the result.</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">How to use</h2>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>Upload your image by dragging and dropping or clicking the upload area</li>
          <li>Click "Remove Background" to process your image</li>
          <li>Once processing is complete, you can download or share the transparent PNG</li>
        </ol>
      </div>

      <RelatedTools currentTool="background-remover" />
    </div>
  )
}

