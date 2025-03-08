"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, Download, Info, Settings2, ArrowRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"

interface CompressionResult {
  url: string
  originalSize: number
  compressedSize: number
}

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<CompressionResult | null>(null)
  const [settings, setSettings] = useState({
    quality: 80,
    maxWidth: 1920,
    preserveQuality: true
  })

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const calculateSavings = (original: number, compressed: number): string => {
    const saving = ((original - compressed) / original) * 100
    return saving.toFixed(1)
  }

  const compressImage = (image: HTMLImageElement, canvas: HTMLCanvasElement): Promise<Blob> => {
    return new Promise((resolve) => {
      const ctx = canvas.getContext('2d')!
      
      // Calculate new dimensions while maintaining aspect ratio
      let width = image.width
      let height = image.height
      
      if (width > settings.maxWidth) {
        height = (settings.maxWidth * height) / width
        width = settings.maxWidth
      }

      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx.drawImage(image, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => resolve(blob!),
        'image/jpeg',
        settings.quality / 100
      )
    })
  }

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
    setImageUrl(URL.createObjectURL(selectedFile))
    setResult(null)
  }

  const handleCompress = async () => {
    if (!file || !imageUrl) {
      toast.error("Please upload an image first")
      return
    }

    setIsProcessing(true)

    try {
      // Create image element
      const img = new Image()
      img.src = imageUrl
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      // Create canvas for compression
      const canvas = document.createElement('canvas')
      const compressedBlob = await compressImage(img, canvas)
      const compressedUrl = URL.createObjectURL(compressedBlob)

      setResult({
        url: compressedUrl,
        originalSize: file.size,
        compressedSize: compressedBlob.size
      })

      toast.success("Image compressed successfully!")
    } catch (error) {
      console.error("Compression error:", error)
      toast.error("Failed to compress image")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = async () => {
    if (!result) return

    const link = document.createElement('a')
    link.href = result.url
    link.download = `compressed_${file!.name}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Image Compressor</h1>
        </div>
        <p className="text-muted-foreground">
          Compress your images while maintaining visual quality. Perfect for web images and reducing file size.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Local Processing</AlertTitle>
        <AlertDescription>
          All compression is done locally in your browser. Your images are not uploaded to any server.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Upload Image</h2>
            <FileUpload 
              accept="image/*" 
              maxSize={10} 
              onFileSelect={handleFileSelect}
            />
            
            {imageUrl && (
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="Original" 
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Compression Settings</h2>
              <Settings2 className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Quality: {settings.quality}%</Label>
                </div>
                <Slider
                  value={[settings.quality]}
                  onValueChange={(value) => 
                    setSettings(prev => ({ ...prev, quality: value[0] }))
                  }
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Max Width: {settings.maxWidth}px</Label>
                </div>
                <Slider
                  value={[settings.maxWidth]}
                  onValueChange={(value) => 
                    setSettings(prev => ({ ...prev, maxWidth: value[0] }))
                  }
                  min={800}
                  max={3840}
                  step={160}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Preserve Image Quality</Label>
                <Switch
                  checked={settings.preserveQuality}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, preserveQuality: checked }))
                  }
                />
              </div>
            </div>

            <Button 
              onClick={handleCompress} 
              disabled={!file || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Settings2 className="w-4 h-4 mr-2 animate-spin" />
                  Compressing...
                </>
              ) : (
                "Compress Image"
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Result</h2>
            {isProcessing ? (
              <div className="space-y-4 p-8 border rounded-lg">
                <p className="text-center text-muted-foreground">Compressing image...</p>
                <Progress value={33} />
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Original</p>
                      <p className="text-2xl font-bold">{formatBytes(result.originalSize)}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Compressed</p>
                      <p className="text-2xl font-bold">{formatBytes(result.compressedSize)}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Size Reduction</p>
                    <p className="text-2xl font-bold text-green-500">
                      {calculateSavings(result.originalSize, result.compressedSize)}%
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={result.url} 
                    alt="Compressed" 
                    className="w-full h-auto"
                  />
                </div>

                <Button 
                  onClick={handleDownload}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Compressed Image
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">
                  Upload an image and click "Compress Image" to see the result.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">How to use</h2>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>Upload an image by dragging and dropping or clicking the upload area</li>
          <li>Adjust compression quality (lower = smaller file size)</li>
          <li>Set maximum width if you want to resize the image</li>
          <li>Toggle quality preservation for better results</li>
          <li>Click "Compress Image" to process</li>
          <li>Download the compressed image</li>
        </ol>
      </div>

      <RelatedTools currentTool="image-compressor" />
    </div>
  )
}