"use client"

import { useState } from "react"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { FileIcon, Download, Info, Settings2, FileText } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { jsPDF } from "jspdf"

interface PDFSettings {
  fontSize: number
  fontName: 'helvetica' | 'courier' | 'times'
  pageSize: 'a4' | 'letter' | 'legal'
  orientation: 'portrait' | 'landscape'
  margins: number
  lineSpacing: number
  title: string
  includeTimestamp: boolean
}

export default function TextToPDFPage() {
  const [text, setText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [settings, setSettings] = useState<PDFSettings>({
    fontSize: 12,
    fontName: 'helvetica',
    pageSize: 'a4',
    orientation: 'portrait',
    margins: 20,
    lineSpacing: 1.15,
    title: '',
    includeTimestamp: true
  })

  const fontOptions = [
    { value: 'helvetica', label: 'Helvetica' },
    { value: 'courier', label: 'Courier' },
    { value: 'times', label: 'Times New Roman' }
  ]

  const pageSizeOptions = [
    { value: 'a4', label: 'A4' },
    { value: 'letter', label: 'Letter' },
    { value: 'legal', label: 'Legal' }
  ]

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text first")
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: settings.orientation,
        unit: 'mm',
        format: settings.pageSize
      })

      // Set font and size
      doc.setFont(settings.fontName)
      doc.setFontSize(settings.fontSize)

      // Add title if provided
      let yPosition = settings.margins
      if (settings.title) {
        doc.setFont(settings.fontName, 'bold')
        doc.setFontSize(settings.fontSize + 4)
        doc.text(settings.title, settings.margins, yPosition)
        yPosition += 10
        doc.setFont(settings.fontName, 'normal')
        doc.setFontSize(settings.fontSize)
      }

      // Add timestamp if enabled
      if (settings.includeTimestamp) {
        const timestamp = new Date().toLocaleString()
        doc.setFontSize(settings.fontSize - 2)
        doc.text(timestamp, settings.margins, yPosition)
        yPosition += 10
        doc.setFontSize(settings.fontSize)
      }

      // Calculate page width for text wrapping
      const pageWidth = doc.internal.pageSize.getWidth()
      const maxWidth = pageWidth - (settings.margins * 2)

      // Split text into lines with proper wrapping
      const lines = doc.splitTextToSize(text, maxWidth)

      // Add text with line spacing
      lines.forEach((line: string, index: number) => {
        if (yPosition > doc.internal.pageSize.getHeight() - settings.margins) {
          doc.addPage()
          yPosition = settings.margins
        }
        doc.text(line, settings.margins, yPosition)
        yPosition += settings.fontSize * settings.lineSpacing * 0.35
        setProgress(((index + 1) / lines.length) * 100)
      })

      // Save the PDF
      const filename = settings.title ? 
        `${settings.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf` : 
        'generated-document.pdf'
      doc.save(filename)

      toast.success("PDF generated successfully!")
    } catch (error) {
      console.error("PDF generation error:", error)
      toast.error("Failed to generate PDF")
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileIcon className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Text to PDF</h1>
        </div>
        <p className="text-muted-foreground">
          Convert text to beautifully formatted PDF documents with custom styling and layout options.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Local Processing</AlertTitle>
        <AlertDescription>
          All PDF generation is done locally in your browser. Your text is not uploaded to any server.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Document Content</h2>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Document Title (Optional)</Label>
                <Input
                  placeholder="Enter document title"
                  value={settings.title}
                  onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  placeholder="Enter your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">PDF Settings</h2>
              <Settings2 className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Font</Label>
                  <Select
                    value={settings.fontName}
                    onValueChange={(value: PDFSettings['fontName']) => 
                      setSettings(prev => ({ ...prev, fontName: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map(font => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select
                    value={settings.fontSize.toString()}
                    onValueChange={(value) => 
                      setSettings(prev => ({ ...prev, fontSize: parseInt(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 11, 12, 14, 16, 18, 20].map(size => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}pt
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Page Size</Label>
                  <Select
                    value={settings.pageSize}
                    onValueChange={(value: PDFSettings['pageSize']) => 
                      setSettings(prev => ({ ...prev, pageSize: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pageSizeOptions.map(size => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Orientation</Label>
                  <Select
                    value={settings.orientation}
                    onValueChange={(value: PDFSettings['orientation']) => 
                      setSettings(prev => ({ ...prev, orientation: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Line Spacing</Label>
                <Select
                  value={settings.lineSpacing.toString()}
                  onValueChange={(value) => 
                    setSettings(prev => ({ ...prev, lineSpacing: parseFloat(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Single</SelectItem>
                    <SelectItem value="1.15">Comfortable</SelectItem>
                    <SelectItem value="1.5">1.5 Lines</SelectItem>
                    <SelectItem value="2">Double</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Include Timestamp</Label>
                <Switch
                  checked={settings.includeTimestamp}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, includeTimestamp: checked }))
                  }
                />
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={!text.trim() || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Settings2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate PDF
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Preview</h2>
            {isProcessing ? (
              <div className="space-y-4 p-8 border rounded-lg">
                <p className="text-center text-muted-foreground">Generating PDF...</p>
                <Progress value={progress} />
              </div>
            ) : text ? (
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Document Settings</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Font: {fontOptions.find(f => f.value === settings.fontName)?.label}</p>
                        <p>Size: {settings.fontSize}pt</p>
                        <p>Page: {pageSizeOptions.find(p => p.value === settings.pageSize)?.label}</p>
                        <p>Orientation: {settings.orientation}</p>
                        <p>Line Spacing: {settings.lineSpacing}x</p>
                        {settings.title && <p>Title: {settings.title}</p>}
                        <p>Timestamp: {settings.includeTimestamp ? 'Included' : 'Not included'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Content Preview</h3>
                      <div 
                        className="p-4 border rounded bg-muted/50 max-h-[300px] overflow-y-auto"
                        style={{
                          fontFamily: settings.fontName === 'helvetica' ? 'Arial' : 
                                    settings.fontName === 'times' ? 'Times New Roman' : 
                                    'Courier New',
                          fontSize: `${settings.fontSize}px`,
                          lineHeight: settings.lineSpacing
                        }}
                      >
                        {settings.title && (
                          <div className="font-bold text-lg mb-2">{settings.title}</div>
                        )}
                        {settings.includeTimestamp && (
                          <div className="text-sm text-muted-foreground mb-2">
                            {new Date().toLocaleString()}
                          </div>
                        )}
                        <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">
                  Enter text and configure settings to see a preview.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">How to use</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Enter your text in the content area</li>
              <li>Add an optional document title</li>
              <li>Choose your preferred font and size</li>
              <li>Select page size and orientation</li>
              <li>Adjust line spacing and other settings</li>
              <li>Click "Generate PDF" to create and download your document</li>
            </ol>
          </div>
        </div>
      </div>

      <RelatedTools currentTool="text-to-pdf" />
    </div>
  )
} 