"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface FileUploadProps {
  accept?: string
  maxSize?: number
  onFileSelect?: (file: File) => void
  className?: string
}

export function FileUpload({
  accept = "image/*",
  maxSize = 5, // in MB
  onFileSelect,
  className = "",
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)

    if (!selectedFile) return

    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`)
      return
    }

    setFile(selectedFile)

    // Create preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }

    if (onFileSelect) {
      onFileSelect(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFile = e.dataTransfer.files?.[0]
    if (!droppedFile) return

    // Check file type
    if (!accept.includes("*")) {
      const fileType = droppedFile.type
      const acceptTypes = accept.split(",").map((type) => type.trim())
      const isAccepted = acceptTypes.some((type) => {
        if (type.endsWith("/*")) {
          const mainType = type.split("/")[0]
          return fileType.startsWith(`${mainType}/`)
        }
        return type === fileType
      })

      if (!isAccepted) {
        setError(`File type not accepted. Please upload ${accept}`)
        return
      }
    }

    // Check file size
    if (droppedFile.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`)
      return
    }

    setFile(droppedFile)

    // Create preview for images
    if (droppedFile.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(droppedFile)
    } else {
      setPreview(null)
    }

    if (onFileSelect) {
      onFileSelect(droppedFile)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`w-full ${className}`}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={accept} className="hidden" />

      {!file ? (
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <h3 className="font-medium">Drag & drop or click to upload</h3>
            <p className="text-sm text-muted-foreground">Max file size: {maxSize}MB</p>
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
              <span className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)}MB</span>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {preview && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Button size="sm" onClick={triggerFileInput}>
              Change File
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

