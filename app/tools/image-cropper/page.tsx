"use client"

import { useState, useRef, useEffect } from "react"
import { ToolResult } from "@/components/tool-result"
import { RelatedTools } from "@/components/related-tools"
import { Button } from "@/components/ui/button"
import { Crop, Info, Share2, Download, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ReactCrop, { Crop as CropType, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number | undefined
): CropType {
  if (!aspect) {
    return {
      unit: 'px',
      x: 0,
      y: 0,
      width: mediaWidth,
      height: mediaHeight,
    }
  }

  const crop = makeAspectCrop(
    {
      unit: 'px',
      width: mediaWidth * 0.8, // Start with 80% of image width
    },
    aspect,
    mediaWidth,
    mediaHeight
  )

  return centerCrop(crop, mediaWidth, mediaHeight)
}

export default function ImageCropperPage() {
  const [src, setSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<CropType>()
  const [result, setResult] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const imgSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 })

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    imgSizeRef.current = { width, height }
    const initialCrop = centerAspectCrop(width, height, aspectRatio)
    setCrop(initialCrop)
  }

  useEffect(() => {
    if (imgSizeRef.current.width && imgSizeRef.current.height) {
      const newCrop = centerAspectCrop(
        imgSizeRef.current.width,
        imgSizeRef.current.height,
        aspectRatio
      )
      setCrop(newCrop)
    }
  }, [aspectRatio])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        setSrc(reader.result as string)
        setResult(null)
        setCrop(undefined)
      }
      reader.onerror = () => {
        toast.error('Failed to read the image file')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCrop = async () => {
    if (!imageRef.current || !crop) {
      toast.error('Please select an area to crop')
      return
    }

    try {
      setIsProcessing(true)

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }

      const pixelRatio = window.devicePixelRatio
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height

      // Set canvas size to match the crop size
      canvas.width = Math.floor(crop.width * scaleX)
      canvas.height = Math.floor(crop.height * scaleY)

      // Enable high-quality scaling
      ctx.imageSmoothingQuality = 'high'
      ctx.imageSmoothingEnabled = true

      // Draw the cropped image
      ctx.drawImage(
        imageRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      )

      // Convert to base64
      const base64Image = canvas.toDataURL('image/jpeg', 0.9)
      setResult(base64Image)
      toast.success('Image cropped successfully!')
    } catch (error) {
      console.error('Error cropping image:', error)
      toast.error('Failed to crop image')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleShare = async () => {
    if (!result) return

    try {
      const response = await fetch(result)
      const blob = await response.blob()
      const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' })

      if (navigator.share) {
        await navigator.share({
          title: 'Cropped Image',
          files: [file]
        })
        toast.success('Shared successfully!')
      } else {
        await navigator.clipboard.writeText(result)
        toast.success('Image URL copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast.error('Failed to share image')
    }
  }

  const handleDownload = () => {
    if (!result) return

    try {
      const link = document.createElement('a')
      link.href = result
      link.download = 'cropped-image.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Downloaded successfully!')
    } catch (error) {
      console.error('Error downloading:', error)
      toast.error('Failed to download image')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Crop className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Image Cropper</h1>
        </div>
        <p className="text-muted-foreground">
          Crop and resize your images with precision. Supports various aspect ratios and free-form cropping.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Free to use</AlertTitle>
        <AlertDescription>
          This tool is completely free to use with no login required. Your images are processed locally and are not uploaded to any server.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Upload Image</h2>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="cursor-pointer"
            />
          </div>

          {src && (
            <>
              <Tabs defaultValue="free" onValueChange={(value) => {
                setAspectRatio(
                  value === 'free' ? undefined :
                  value === 'square' ? 1 :
                  value === 'landscape' ? 16/9 :
                  value === 'portrait' ? 3/4 : undefined
                )
              }}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="free">Free</TabsTrigger>
                  <TabsTrigger value="square">Square</TabsTrigger>
                  <TabsTrigger value="landscape">16:9</TabsTrigger>
                  <TabsTrigger value="portrait">3:4</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="border rounded-lg p-4 bg-muted/50">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  aspect={aspectRatio}
                  minWidth={100}
                >
                  <img
                    ref={imageRef}
                    src={src}
                    alt="Upload"
                    className="max-w-full h-auto"
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>

              <Button 
                onClick={handleCrop} 
                disabled={isProcessing || !crop} 
                className="w-full"
              >
                {isProcessing ? "Processing..." : "Crop Image"}
              </Button>
            </>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Result</h2>
          {result ? (
            <ToolResult 
              title="Cropped Image" 
              resultImage={result} 
              resultType="image"
              actions={
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              }
            />
          ) : (
            <div className="border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                Upload an image and crop it to see the result here.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">How to use</h2>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>Upload an image using the file input.</li>
          <li>Choose a preset aspect ratio or use free-form cropping.</li>
          <li>Drag the crop area to select the desired region.</li>
          <li>Click "Crop Image" to generate the result.</li>
          <li>Download or share your cropped image.</li>
        </ol>
      </div>

      <RelatedTools currentTool="image-cropper" />
    </div>
  )
}