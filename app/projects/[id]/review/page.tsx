'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Upload as UploadIcon, Loader2, CheckCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/UI/GlassCard'
import { Button } from '@/components/UI/Button'
import { VideoPlayer } from '@/components/VideoPlayer/VideoPlayer'

interface Video {
  id: string
  name: string
  url: string
  uploaded_at: string
}

interface UploadProgress {
  filename: string
  progress: number
  status: 'uploading' | 'complete' | 'error'
}

export default function VideoReviewPage() {
  const params = useParams()
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (params.id) {
      console.log('🔄 Component mounted, fetching videos...')
      fetchVideos()
    }
  }, [params.id])

  // Also fetch on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (params.id) {
        console.log('⏰ Auto-refresh after 1 second')
        fetchVideos()
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const fetchVideos = async () => {
    try {
      const projectId = params.id as string
      console.log('🎥 Fetching videos for project:', projectId)
      
      const url = `/api/assets?project_id=${projectId}&type=video`
      console.log('📡 Request URL:', url)
      
      const response = await fetch(url)
      console.log('📥 Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Response error:', errorText)
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Fetched videos:', data)
      console.log('📊 Video count:', data?.length || 0)
      
      const videoList = Array.isArray(data) ? data : []
      setVideos(videoList)
      
      // Auto-select first video if none selected
      if (videoList.length > 0 && !selectedVideo) {
        console.log('🎬 Auto-selecting first video:', videoList[0].name)
        setSelectedVideo(videoList[0])
      }
    } catch (error) {
      console.error('❌ Failed to fetch videos:', error)
      setVideos([])
    }
  }

  const handleUploadComplete = (asset: any) => {
    console.log('✅ Upload complete, refreshing video list...', asset)
    // Add a small delay to ensure database is updated
    setTimeout(() => {
      console.log('🔄 Calling fetchVideos after upload...')
      fetchVideos()
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push(`/projects/${params.id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project
          </Button>
          <h1 className="text-2xl font-bold text-white">Video Review</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Upload & List */}
          <div className="space-y-6">
            <GlassCard borderHue="orange" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Upload Video</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => fetchVideos()}
                >
                  🔄 Refresh
                </Button>
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return

                  setIsUploading(true)
                  setUploadProgress({
                    filename: file.name,
                    progress: 0,
                    status: 'uploading'
                  })

                  const formData = new FormData()
                  formData.append('file', file)
                  formData.append('project_id', params.id as string)
                  formData.append('type', 'video')

                  // Simulate progress
                  const progressInterval = setInterval(() => {
                    setUploadProgress(prev => 
                      prev && prev.progress < 90
                        ? { ...prev, progress: prev.progress + 10 }
                        : prev
                    )
                  }, 300)

                  try {
                    const response = await fetch('/api/assets/upload', {
                      method: 'POST',
                      body: formData,
                    })
                    
                    clearInterval(progressInterval)

                    if (!response.ok) {
                      throw new Error('Upload failed')
                    }

                    const data = await response.json()
                    
                    setUploadProgress({
                      filename: file.name,
                      progress: 100,
                      status: 'complete'
                    })

                    handleUploadComplete(data)
                    e.target.value = ''

                    // Clear progress after 2 seconds
                    setTimeout(() => {
                      setUploadProgress(null)
                    }, 2000)
                  } catch (error) {
                    clearInterval(progressInterval)
                    console.error('Upload failed:', error)
                    setUploadProgress({
                      filename: file.name,
                      progress: 100,
                      status: 'error'
                    })
                    setTimeout(() => {
                      setUploadProgress(null)
                    }, 3000)
                  } finally {
                    setIsUploading(false)
                  }
                }}
                className="hidden"
                id="video-upload"
                disabled={isUploading}
              />
              <label htmlFor="video-upload">
                <div className={`border-2 border-dashed border-accent/50 rounded-lg p-8 text-center hover:border-accent transition-colors ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}>
                  {isUploading ? (
                    <Loader2 className="w-12 h-12 text-accent mx-auto mb-4 animate-spin" />
                  ) : (
                    <UploadIcon className="w-12 h-12 text-accent mx-auto mb-4" />
                  )}
                  <p className="text-white font-medium mb-2">
                    {isUploading ? 'Uploading...' : 'Upload Video'}
                  </p>
                  <p className="text-sm text-white/60">Click to upload MP4, MOV, WebM</p>
                </div>
              </label>

              {/* Upload Progress */}
              <AnimatePresence>
                {uploadProgress && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {uploadProgress.status === 'uploading' && (
                        <Loader2 className="w-5 h-5 text-accent animate-spin" />
                      )}
                      {uploadProgress.status === 'complete' && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                      {uploadProgress.status === 'error' && (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{uploadProgress.filename}</p>
                        <p className="text-xs text-white/50">
                          {uploadProgress.status === 'uploading' && `${uploadProgress.progress}%`}
                          {uploadProgress.status === 'complete' && 'Upload complete!'}
                          {uploadProgress.status === 'error' && 'Upload failed'}
                        </p>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress.progress}%` }}
                        transition={{ duration: 0.3 }}
                        className={`h-full rounded-full ${
                          uploadProgress.status === 'complete' ? 'bg-green-400' :
                          uploadProgress.status === 'error' ? 'bg-red-400' :
                          'bg-accent'
                        }`}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>

            {videos.length > 0 ? (
              <GlassCard borderHue="orange" className="p-6">
                <h2 className="text-xl font-semibold mb-4">Videos ({videos.length})</h2>
                <div className="space-y-2">
                  {videos.map((video) => (
                    <button
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedVideo?.id === video.id
                          ? 'bg-accent/20 border border-accent/50'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <p className="font-medium text-white">{video.name || 'Video'}</p>
                      <p className="text-xs text-white/60">
                        {new Date(video.uploaded_at).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              </GlassCard>
            ) : (
              <GlassCard borderHue="orange" className="p-6">
                <p className="text-white/60 text-sm text-center mb-4">
                  No videos uploaded yet. Upload a video above to get started.
                </p>
                <p className="text-white/40 text-xs text-center mb-4">
                  Project ID: {params.id}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    // Test with a sample video
                    setSelectedVideo({
                      id: 'test',
                      name: 'Test Video',
                      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                      uploaded_at: new Date().toISOString()
                    })
                  }}
                  className="mx-auto"
                >
                  Test with Sample Video
                </Button>
              </GlassCard>
            )}
          </div>

          {/* Video Player */}
          <div className="lg:col-span-2">
            {selectedVideo ? (
              <VideoPlayer 
                videoUrl={selectedVideo.url} 
                projectId={params.id as string}
                assetId={selectedVideo.id}
              />
            ) : (
              <GlassCard borderHue="orange" className="p-12 text-center">
                <p className="text-white/60 mb-4">No video selected</p>
                <p className="text-sm text-white/40">
                  Upload a video above or select from the list
                </p>
              </GlassCard>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

