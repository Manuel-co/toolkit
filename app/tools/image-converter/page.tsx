"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, Download, Info, Settings2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type OutputFormat = 'png' | 'jpeg' | 'webp' | 'ico'
type FaviconSize = '16' | '32' | '48' | '64' | 'all'

interface ConversionSettings {
  format: OutputFormat
  quality: number
  maintainSize: boolean
  faviconSize: FaviconSize
}

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [settings, setSettings] = useState<ConversionSettings>({
    format: 'png',
    quality: 90,
    maintainSize: true,
    faviconSize: 'all'
  })

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setImageUrl(URL.createObjectURL(selectedFile))
  }

  const handleFormatChange = (value: OutputFormat) => {
    setSettings(prev => ({ ...prev, format: value }))
  }

  const handleQualityChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, quality: value[0] }))
  }

  const handleMaintainSizeChange = (checked: boolean) => {
    setSettings(prev => ({ ...prev, maintainSize: checked }))
  }

  const handleFaviconSizeChange = (value: FaviconSize) => {
    setSettings(prev => ({ ...prev, faviconSize: value }))
  }

  const handleConvert = async () => {
    if (!file) {
      toast.error("Please upload an image first")
      return
    }

    setIsProcessing(true)

    try {
      // Create form data
      const formData = new FormData()
      formData.append('file', file)
      formData.append('format', settings.format)
      formData.append('quality', settings.quality.toString())
      formData.append('maintainSize', settings.maintainSize.toString())
      if (settings.format === 'ico') {
        formData.append('faviconSize', settings.faviconSize)
      }

      // In a real implementation, you would send this to your API endpoint
      // For now, we'll simulate the conversion
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simulate download (in real implementation, this would be the converted file)
      const fileName = file.name.split('.')[0]
      const newFileName = `${fileName}.${settings.format}`
      
      if (imageUrl) {
        const link = document.createElement('a')
        link.href = imageUrl
        link.download = newFileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      toast.success("Image converted successfully!")
    } catch (error) {
      console.error("Conversion error:", error)
      toast.error("Failed to convert image")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Image Converter</h1>
        </div>
        <p className="text-muted-foreground">
          Convert images between different formats. Supports PNG, JPEG, WebP, and Favicon (ICO) with quality control.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Local Processing</AlertTitle>
        <AlertDescription>
          All image conversion is done locally in your browser. Your images are not uploaded to any server.
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
                  alt="Preview" 
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Conversion Settings</h2>
              <Settings2 className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select
                  value={settings.format}
                  onValueChange={handleFormatChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                    <SelectItem value="ico">Favicon (ICO)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {settings.format === 'ico' ? (
                <div className="space-y-2">
                  <Label>Favicon Size</Label>
                  <RadioGroup
                    value={settings.faviconSize}
                    onValueChange={handleFaviconSizeChange}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="16" id="size-16" />
                      <Label htmlFor="size-16">16x16</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="32" id="size-32" />
                      <Label htmlFor="size-32">32x32</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="48" id="size-48" />
                      <Label htmlFor="size-48">48x48</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="64" id="size-64" />
                      <Label htmlFor="size-64">64x64</Label>
                    </div>
                    <div className="flex items-center space-x-2 col-span-2">
                      <RadioGroupItem value="all" id="size-all" />
                      <Label htmlFor="size-all">All Sizes (Recommended)</Label>
                    </div>
                  </RadioGroup>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Quality: {settings.quality}%</Label>
                    </div>
                    <Slider
                      value={[settings.quality]}
                      onValueChange={handleQualityChange}
                      min={1}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Maintain Original Size</Label>
                    <Switch
                      checked={settings.maintainSize}
                      onCheckedChange={handleMaintainSizeChange}
                    />
                  </div>
                </>
              )}
            </div>

            <Button 
              onClick={handleConvert} 
              disabled={!file || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Settings2 className="w-4 h-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Convert & Download
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Format Details</h2>
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">PNG</h3>
                <p className="text-sm text-muted-foreground">
                  Best for images with transparency and sharp details. Lossless compression, larger file size.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">JPEG</h3>
                <p className="text-sm text-muted-foreground">
                  Ideal for photographs and complex images with many colors. Lossy compression, smaller file size.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">WebP</h3>
                <p className="text-sm text-muted-foreground">
                  Modern format with excellent compression. Supports both lossy and lossless compression. Best for web use.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Favicon (ICO)</h3>
                <p className="text-sm text-muted-foreground">
                  Special format for website icons. Can contain multiple sizes (16x16 to 64x64). Best for browser tabs and bookmarks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">How to use</h2>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>Upload an image by dragging and dropping or clicking the upload area</li>
          <li>Choose your desired output format (PNG, JPEG, WebP, or Favicon)</li>
          <li>For regular formats, adjust quality settings if needed</li>
          <li>For favicons, select your desired icon size(s)</li>
          <li>Click "Convert & Download" to get your converted image</li>
        </ol>
      </div>

      <RelatedTools currentTool="image-converter" />
    </div>
  )
}