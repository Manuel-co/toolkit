"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { Palette, Copy, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import ColorThief from "colorthief"

interface Color {
  rgb: [number, number, number]
  hex: string
}

export default function ColorExtractorPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [colors, setColors] = useState<Color[]>([])
  const [palette, setPalette] = useState<Color[]>([])

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true)
    setImageUrl(null)
    setColors([])
    setPalette([])

    try {
      // Create URL for the uploaded image
      const url = URL.createObjectURL(file)
      setImageUrl(url)

      // Create an image element for color-thief
      const img = new Image()
      img.crossOrigin = "Anonymous"
      img.src = url

      img.onload = async () => {
        try {
          const colorThief = new ColorThief()
          
          // Get dominant color
          const dominantColor = colorThief.getColor(img) as [number, number, number]
          const dominantHex = rgbToHex(...dominantColor)
          
          // Get color palette
          const colorPalette = colorThief.getPalette(img, 8) as [number, number, number][]
          
          // Convert colors to our format
          setColors([{
            rgb: dominantColor,
            hex: dominantHex
          }])
          
          setPalette(colorPalette.map(rgb => ({
            rgb,
            hex: rgbToHex(...rgb)
          })))

          toast.success("Colors extracted successfully!")
        } catch (error) {
          console.error("Error extracting colors:", error)
          toast.error("Failed to extract colors from image")
        }
        setIsProcessing(false)
      }

      img.onerror = () => {
        toast.error("Failed to load image")
        setIsProcessing(false)
      }
    } catch (error) {
      console.error("Error processing file:", error)
      toast.error("Failed to process image")
      setIsProcessing(false)
    }
  }

  const copyColor = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color)
      toast.success(`Copied ${color} to clipboard!`)
    } catch (error) {
      toast.error("Failed to copy color")
    }
  }

  const copyPalette = async (format: 'hex' | 'css' | 'tailwind') => {
    if (palette.length === 0) {
      toast.error("Generate a palette first")
      return
    }

    try {
      let textToCopy = ''
      
      switch (format) {
        case 'hex':
          textToCopy = palette.map(c => c.hex).join(', ')
          break
        case 'css':
          textToCopy = palette.map(c => `--color-${palette.indexOf(c) + 1}: ${c.hex};`).join('\n')
          break
        case 'tailwind':
          textToCopy = palette
            .map(c => `'${palette.indexOf(c) + 1}': '${c.hex}'`)
            .join(',\n')
          textToCopy = `{\n${textToCopy}\n}`
          break
      }

      await navigator.clipboard.writeText(textToCopy)
      toast.success(`Copied palette as ${format.toUpperCase()} format!`)
    } catch (error) {
      toast.error("Failed to copy palette")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Palette className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Color Extractor</h1>
        </div>
        <p className="text-muted-foreground">
          Extract dominant colors and color palettes from any image. Perfect for finding color schemes and brand colors.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Local Processing</AlertTitle>
        <AlertDescription>
          All color extraction is done locally in your browser. Your images are not uploaded to any server.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
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
                alt="Uploaded image" 
                className="w-full h-auto"
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Dominant Color</h2>
            {isProcessing ? (
              <div className="animate-pulse h-20 bg-muted rounded-lg" />
            ) : colors.length > 0 ? (
              <div className="grid gap-4">
                {colors.map((color, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div 
                      className="w-16 h-16 rounded-lg shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1 space-y-2">
                      <div className="font-mono">{color.hex}</div>
                      <div className="text-sm text-muted-foreground">
                        RGB({color.rgb.join(", ")})
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => copyColor(color.hex)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">
                  Upload an image to extract its dominant color.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Color Palette</h2>
              {palette.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyPalette('hex')}
                  >
                    Copy HEX
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyPalette('css')}
                  >
                    Copy CSS
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyPalette('tailwind')}
                  >
                    Copy Tailwind
                  </Button>
                </div>
              )}
            </div>
            {isProcessing ? (
              <div className="grid grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse h-16 bg-muted rounded-lg" />
                ))}
              </div>
            ) : palette.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  {palette.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => copyColor(color.hex)}
                      className="group relative aspect-square rounded-lg shadow-inner transition-transform hover:scale-105"
                      style={{ backgroundColor: color.hex }}
                      title="Click to copy HEX code"
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg transition-opacity">
                        <div className="text-xs font-mono text-white">
                          {color.hex}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  Click individual colors to copy or use buttons above to copy the entire palette
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">
                  Upload an image to extract its color palette.
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
          <li>Wait for the color extraction to complete</li>
          <li>View the dominant color and color palette</li>
          <li>Click individual colors to copy their HEX codes</li>
          <li>Use the buttons above the palette to copy all colors in different formats</li>
          <li>Use the colors in your designs or projects</li>
        </ol>
      </div>

      <RelatedTools currentTool="color-extractor" />
    </div>
  )
}