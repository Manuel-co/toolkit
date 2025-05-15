"use client"

import { useState, useEffect } from "react"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, RefreshCw, Palette, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"

interface Color {
  hex: string
  rgb: string
  hsl: string
}

interface Palette {
  id: string
  name: string
  colors: Color[]
  createdAt: string
}

export default function ColorPaletteGeneratorPage() {
  const [palettes, setPalettes] = useState<Palette[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [currentPalette, setCurrentPalette] = useState<Color[]>([])
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(50)
  const [lightness, setLightness] = useState(50)
  const [paletteName, setPaletteName] = useState("")

  // Load palettes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('colorPalettes')
    if (saved) {
      setPalettes(JSON.parse(saved))
    }
    setIsLoading(false)
    generateNewPalette()
  }, [])

  // Save palettes to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('colorPalettes', JSON.stringify(palettes))
    }
  }, [palettes, isLoading])

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100
    l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): string => {
    s /= 100
    l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color)
    }
    return `rgb(${f(0)}, ${f(8)}, ${f(4)})`
  }

  // Generate a new color palette
  const generateNewPalette = () => {
    const baseHue = Math.floor(Math.random() * 360)
    const newPalette: Color[] = []

    for (let i = 0; i < 5; i++) {
      const h = (baseHue + i * 72) % 360
      const s = Math.floor(Math.random() * 30) + 60
      const l = Math.floor(Math.random() * 20) + 40

      newPalette.push({
        hex: hslToHex(h, s, l),
        rgb: hslToRgb(h, s, l),
        hsl: `hsl(${h}, ${s}%, ${l}%)`,
      })
    }

    setCurrentPalette(newPalette)
  }

  // Save current palette
  const savePalette = () => {
    if (!paletteName.trim()) return

    const palette: Palette = {
      id: Date.now().toString(),
      name: paletteName,
      colors: currentPalette,
      createdAt: new Date().toISOString(),
    }

    setPalettes([...palettes, palette])
    setPaletteName("")
  }

  // Copy color to clipboard
  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Delete palette
  const deletePalette = (id: string) => {
    setPalettes(palettes.filter(palette => palette.id !== id))
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Palette className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Color Palette Generator</h1>
        </div>
        <p className="text-muted-foreground">
          Generate beautiful color palettes for your projects. Save your favorite combinations and copy color values in different formats.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Free to use</AlertTitle>
        <AlertDescription>
          This tool is completely free to use with no login required. Your palettes are saved locally in your browser.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Palette</CardTitle>
              <CardDescription>Create a new color palette with complementary colors.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Hue</Label>
                <Slider
                  value={[hue]}
                  onValueChange={(value) => setHue(value[0])}
                  max={360}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Saturation</Label>
                <Slider
                  value={[saturation]}
                  onValueChange={(value) => setSaturation(value[0])}
                  max={100}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Lightness</Label>
                <Slider
                  value={[lightness]}
                  onValueChange={(value) => setLightness(value[0])}
                  max={100}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paletteName">Palette Name</Label>
                <Input
                  id="paletteName"
                  value={paletteName}
                  onChange={(e) => setPaletteName(e.target.value)}
                  placeholder="Enter a name for your palette"
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={generateNewPalette} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate New
              </Button>
              <Button onClick={savePalette} className="flex-1" disabled={!paletteName.trim()}>
                <Palette className="mr-2 h-4 w-4" />
                Save Palette
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-5 gap-2">
            {currentPalette.map((color, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg cursor-pointer relative group"
                style={{ backgroundColor: color.hex }}
                onClick={() => copyColor(color.hex)}
              >
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {color.hex}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Saved Palettes</h2>
          {isLoading ? (
            <div className="border rounded-lg p-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading palettes...</p>
            </div>
          ) : palettes.length > 0 ? (
            <div className="space-y-4">
              {palettes.map((palette) => (
                <Card key={palette.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{palette.name}</CardTitle>
                        <CardDescription className="mt-2">
                          Created {new Date(palette.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => deletePalette(palette.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-x"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-2">
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-lg cursor-pointer relative group"
                          style={{ backgroundColor: color.hex }}
                          onClick={() => copyColor(color.hex)}
                        >
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            {color.hex}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center">
              <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No palettes saved yet. Generate a palette and save it to get started!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Color Theory Tips</h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Use complementary colors (opposite on the color wheel) for high contrast.</li>
          <li>Analogous colors (next to each other) create harmonious designs.</li>
          <li>Triadic colors (equally spaced) provide balanced contrast.</li>
          <li>Consider color accessibility and contrast ratios.</li>
          <li>Use color to create visual hierarchy and guide attention.</li>
          <li>Test your palette in both light and dark modes.</li>
        </ul>
      </div>

      <RelatedTools currentTool="color-palette-generator" />
    </div>
  )
} 