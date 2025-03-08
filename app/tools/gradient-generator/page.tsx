"use client"

import { useState } from "react"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { Paintbrush, Copy, Info, RotateCcw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GradientStop {
  color: string
  position: number
}

export default function GradientGeneratorPage() {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear')
  const [angle, setAngle] = useState(90)
  const [stops, setStops] = useState<GradientStop[]>([
    { color: '#FF0000', position: 0 },
    { color: '#0000FF', position: 100 }
  ])

  const generateGradientCSS = () => {
    if (gradientType === 'linear') {
      const stopsCSS = stops.map(stop => `${stop.color} ${stop.position}%`).join(', ')
      return `linear-gradient(${angle}deg, ${stopsCSS})`
    } else {
      const stopsCSS = stops.map(stop => `${stop.color} ${stop.position}%`).join(', ')
      return `radial-gradient(circle, ${stopsCSS})`
    }
  }

  const handleStopColorChange = (index: number, color: string) => {
    const newStops = [...stops]
    newStops[index] = { ...newStops[index], color }
    setStops(newStops)
  }

  const handleStopPositionChange = (index: number, position: number) => {
    const newStops = [...stops]
    newStops[index] = { ...newStops[index], position }
    setStops(newStops)
  }

  const addStop = () => {
    if (stops.length >= 5) {
      toast.error("Maximum 5 color stops allowed")
      return
    }
    const lastStop = stops[stops.length - 1]
    setStops([...stops, { color: '#FFFFFF', position: lastStop.position + 20 }])
  }

  const removeStop = (index: number) => {
    if (stops.length <= 2) {
      toast.error("Minimum 2 color stops required")
      return
    }
    setStops(stops.filter((_, i) => i !== index))
  }

  const copyCSS = async (format: 'css' | 'tailwind') => {
    try {
      const gradient = generateGradientCSS()
      let textToCopy = ''

      if (format === 'css') {
        textToCopy = `background: ${gradient};`
      } else {
        textToCopy = `bg-[${gradient}]`
      }

      await navigator.clipboard.writeText(textToCopy)
      toast.success(`Copied ${format.toUpperCase()} code to clipboard!`)
    } catch (error) {
      toast.error("Failed to copy gradient code")
    }
  }

  const randomizeColors = () => {
    const newStops = stops.map(stop => ({
      ...stop,
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    }))
    setStops(newStops)
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Paintbrush className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Gradient Generator</h1>
        </div>
        <p className="text-muted-foreground">
          Create beautiful gradients for your designs. Customize colors, angles, and positions to create the perfect gradient.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Live Preview</AlertTitle>
        <AlertDescription>
          Changes are previewed in real-time. Copy the generated CSS code to use in your projects.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Gradient Settings</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Gradient Type</Label>
                <Select
                  value={gradientType}
                  onValueChange={(value: 'linear' | 'radial') => setGradientType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear Gradient</SelectItem>
                    <SelectItem value="radial">Radial Gradient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {gradientType === 'linear' && (
                <div className="space-y-2">
                  <Label>Angle: {angle}°</Label>
                  <Slider
                    value={[angle]}
                    onValueChange={(value) => setAngle(value[0])}
                    min={0}
                    max={360}
                    step={1}
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Color Stops</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={randomizeColors}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Randomize
                  </Button>
                </div>
                
                {stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Input
                      type="color"
                      value={stop.color}
                      onChange={(e) => handleStopColorChange(index, e.target.value)}
                      className="w-20 h-10"
                    />
                    <div className="flex-1">
                      <Slider
                        value={[stop.position]}
                        onValueChange={(value) => handleStopPositionChange(index, value[0])}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div className="w-12 text-sm text-muted-foreground">
                      {stop.position}%
                    </div>
                    {stops.length > 2 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeStop(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}

                {stops.length < 5 && (
                  <Button
                    variant="outline"
                    onClick={addStop}
                    className="w-full"
                  >
                    Add Color Stop
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Preview</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyCSS('css')}
                >
                  Copy CSS
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyCSS('tailwind')}
                >
                  Copy Tailwind
                </Button>
              </div>
            </div>

            <div 
              className="h-64 rounded-lg shadow-inner"
              style={{ background: generateGradientCSS() }}
            />

            <Tabs defaultValue="css">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
              </TabsList>
              <TabsContent value="css" className="mt-2">
                <div className="p-4 bg-muted rounded-lg font-mono text-sm">
                  background: {generateGradientCSS()};
                </div>
              </TabsContent>
              <TabsContent value="tailwind" className="mt-2">
                <div className="p-4 bg-muted rounded-lg font-mono text-sm">
                  bg-[{generateGradientCSS()}]
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">How to use</h2>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>Choose between linear or radial gradient</li>
          <li>Adjust the angle for linear gradients</li>
          <li>Add, remove, or modify color stops</li>
          <li>Use the sliders to adjust color positions</li>
          <li>Click "Randomize" for random color combinations</li>
          <li>Copy the generated code in CSS or Tailwind format</li>
        </ol>
      </div>

      <RelatedTools currentTool="gradient-generator" />
    </div>
  )
}