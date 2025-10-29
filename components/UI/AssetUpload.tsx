'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, File, Image, Video, CheckCircle, Loader2 } from 'lucide-react'
import { GlassCard } from './GlassCard'
import { Button } from './Button'

interface AssetUploadProps {
  projectId: string
  onUploadComplete?: (asset: any) => void
  accept?: string
  label?: string
}

interface UploadProgress {
  filename: string
  progress: number
  status: 'uploading' | 'complete' | 'error'
}

export function AssetUpload({ 
  projectId, 
  onUploadComplete,
  accept = 'image/*,video/*,.pdf,.docx',
  label = 'Drop files here or click to upload'
}: AssetUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = async (files: File[]) => {
    setUploading(true)
    
    // Initialize progress for each file
    const initialProgress: UploadProgress[] = files.map(file => ({
      filename: file.name,
      progress: 0,
      status: 'uploading'
    }))
    setUploadProgress(initialProgress)
    
    try {
      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('project_id', projectId)
        formData.append('type', getFileType(file))

        // Simulate progress (since fetch doesn't support upload progress easily)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => prev.map((p, i) => 
            i === index && p.progress < 90
              ? { ...p, progress: p.progress + 10 }
              : p
          ))
        }, 200)

        try {
          const response = await fetch('/api/assets/upload', {
            method: 'POST',
            body: formData,
          })

          clearInterval(progressInterval)

          if (!response.ok) {
            setUploadProgress(prev => prev.map((p, i) => 
              i === index ? { ...p, status: 'error', progress: 100 } : p
            ))
            throw new Error('Upload failed')
          }

          const result = await response.json()
          
          // Mark as complete
          setUploadProgress(prev => prev.map((p, i) => 
            i === index ? { ...p, status: 'complete', progress: 100 } : p
          ))

          return result
        } catch (error) {
          clearInterval(progressInterval)
          throw error
        }
      })

      const results = await Promise.all(uploadPromises)
      setUploadedFiles([...uploadedFiles, ...results])
      
      if (onUploadComplete && results.length > 0) {
        onUploadComplete(results[0])
      }

      // Clear progress after 2 seconds
      setTimeout(() => {
        setUploadProgress([])
      }, 2000)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const getFileType = (file: File): string => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('video/')) return 'video'
    if (file.type.startsWith('audio/')) return 'audio'
    return 'document'
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-6 h-6 text-blue-400" />
      case 'video': return <Video className="w-6 h-6 text-purple-400" />
      default: return <File className="w-6 h-6 text-white/60" />
    }
  }

  return (
    <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

      <GlassCard
        borderHue={isDragging ? 'orange' : 'none'}
        className={`p-6 border-dashed transition-colors ${
          isDragging ? 'border-accent bg-accent/10' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-center cursor-pointer">
                <Upload className="w-12 h-12 text-accent mx-auto mb-4" />
                <p className="text-white font-medium mb-2">
                  {label}
                </p>
                <p className="text-sm text-white/60">
                  Supports images, videos, audio, and documents
                </p>
        </div>
      </GlassCard>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadProgress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {uploadProgress.map((file, index) => (
              <GlassCard key={index} borderHue="orange" className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  {file.status === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-accent animate-spin" />
                  )}
                  {file.status === 'complete' && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  {file.status === 'error' && (
                    <X className="w-5 h-5 text-red-400" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{file.filename}</p>
                    <p className="text-xs text-white/50">
                      {file.status === 'uploading' && `Uploading... ${file.progress}%`}
                      {file.status === 'complete' && 'Upload complete'}
                      {file.status === 'error' && 'Upload failed'}
                    </p>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${file.progress}%` }}
                    transition={{ duration: 0.3 }}
                    className={`h-full rounded-full ${
                      file.status === 'complete' ? 'bg-green-400' :
                      file.status === 'error' ? 'bg-red-400' :
                      'bg-accent'
                    }`}
                  />
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white/70">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          {uploadedFiles.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
            >
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{file.filename}</p>
                <p className="text-xs text-white/50">{file.type}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

