"use client"

import { useState, useEffect } from "react"
import { FileUpload } from "@/components/file-upload"
import { ToolResult } from "@/components/tool-result"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { Paintbrush, Info, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const LoadingAnimation = () => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4 border rounded-lg bg-muted/5">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-muted-foreground/20 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary rounded-full animate-spin"></div>
    </div>
    <div className="space-y-2 text-center">
      <p className="font-medium">Removing Background</p>
      <p className="text-sm text-muted-foreground">This may take a few seconds...</p>
    </div>
  </div>
)

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
      
      const processImage = async (base64Data: string) => {
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
          if (response.status === 402) {
            throw new Error("Your remove.bg API key has no credits remaining. Please check your account at remove.bg/dashboard")
          } else if (response.status === 401) {
            throw new Error("Invalid API key. Please check your remove.bg API key in the .env file")
          } else {
            const errorData = await response.json().catch(() => null)
            throw new Error(
              errorData?.errors?.[0]?.title || 
              `API Error (${response.status}): Please check your remove.bg account`
            )
          }
        }

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setResult(url)
        toast.success("Background removed successfully!")
      }

      reader.onload = async () => {
        const base64Image = reader.result as string
        const base64Data = base64Image.split(',')[1]
        await processImage(base64Data)
        setIsProcessing(false)
      }

      reader.onerror = () => {
        throw new Error('Failed to read the image file')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to remove background")
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
        <AlertTitle>API Key Required</AlertTitle>
        <AlertDescription>
          This tool uses the remove.bg API which requires credits. Get your API key from{" "}
          <a href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer" className="underline">
            remove.bg
          </a>
          {" "}and make sure you have available credits in your account.
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
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Remove Background"
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Result</h2>
          {isProcessing ? (
            <LoadingAnimation />
          ) : result ? (
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
          {/* <li>Get an API key from <a href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer" className="underline">remove.bg</a> and ensure you have credits</li>
          <li>Add your API key to the .env file as NEXT_PUBLIC_REMOVE_BG_API_KEY</li> */}
          <li>Upload your image by dragging and dropping or clicking the upload area</li>
          <li>Click "Remove Background" to process your image</li>
          <li>Once processing is complete, you can download or share the transparent PNG</li>
        </ol>
      </div>

      <RelatedTools currentTool="background-remover" />
    </div>
  )
}

