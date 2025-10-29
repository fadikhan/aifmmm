'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Sparkles, Copy, Check, Loader2, CheckCircle, X } from 'lucide-react'
import { GlassCard } from '../UI/GlassCard'
import { Button } from '../UI/Button'

interface Scene {
  number: number
  title: string
  description: string
  location?: string
  timeOfDay?: string
  characters?: string[]
  imagePrompt?: string
  videoPrompt?: string
}

interface AnalysisResult {
  sceneDescription: string
  scenes?: Scene[]
  prompts: {
    imagePrompt: string
    videoPrompt: string
    metadata: any
  }
}

interface UploadProgress {
  filename: string
  progress: number
  status: 'uploading' | 'complete' | 'error'
}

export function StoryboardAnalyzer({ projectId }: { projectId: string }) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [expandedScene, setExpandedScene] = useState<number | null>(null)
  const [generatingPrompts, setGeneratingPrompts] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [savedAnalysisId, setSavedAnalysisId] = useState<string | null>(null)

  // Load saved analysis on mount
  useEffect(() => {
    loadSavedAnalysis()
  }, [projectId])

  const loadSavedAnalysis = async () => {
    try {
      const response = await fetch(`/api/storyboard-analyses?project_id=${projectId}`)
      if (!response.ok) return

      const data = await response.json()
      if (data) {
        console.log('📂 Loaded saved analysis:', data)
        setSavedAnalysisId(data.id)
        setAnalysis({
          sceneDescription: data.overall_description,
          scenes: data.scenes,
          prompts: {
            imagePrompt: '',
            videoPrompt: '',
            metadata: data.metadata
          }
        })
        // Set the filename for display
        if (data.filename) {
          setUploadedFile({ name: data.filename } as File)
        }
        if (data.file_url) {
          setUploadedFileUrl(data.file_url)
        }
      }
    } catch (error) {
      console.error('Failed to load saved analysis:', error)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    
    // Handle different file types
    if (file.type.startsWith('image/')) {
      // For images, show preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setAnalysis(null)
      }
      reader.readAsDataURL(file)
    } else {
      // For PDF/DOCX, just show file info
      setUploadedImage(null)
      setAnalysis(null)
    }
  }

  const analyzeStoryboard = async () => {
    if (!uploadedFile) return

    setIsAnalyzing(true)
    try {
      let fileUrl = uploadedImage
      let filename = uploadedFile.name

      // For non-image files (PDF, DOCX), upload first to get URL
      if (!uploadedImage) {
        setIsUploading(true)
        setUploadProgress({
          filename: uploadedFile.name,
          progress: 0,
          status: 'uploading'
        })

        const formData = new FormData()
        formData.append('file', uploadedFile)
        formData.append('project_id', projectId)
        formData.append('type', uploadedFile.type.includes('pdf') ? 'document' : 'other')

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => 
            prev && prev.progress < 90
              ? { ...prev, progress: prev.progress + 10 }
              : prev
          )
        }, 200)

        const uploadResponse = await fetch('/api/assets/upload', {
          method: 'POST',
          body: formData,
        })

        clearInterval(progressInterval)

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          setUploadProgress({
            filename: uploadedFile.name,
            progress: 100,
            status: 'error'
          })
          setTimeout(() => setUploadProgress(null), 3000)
          throw new Error(errorData.error || 'Failed to upload file')
        }

        const uploadData = await uploadResponse.json()
        fileUrl = uploadData.url
        filename = uploadData.filename || uploadedFile.name
        
        // Store the file URL for saving later
        setUploadedFileUrl(fileUrl)

        setUploadProgress({
          filename: uploadedFile.name,
          progress: 100,
          status: 'complete'
        })

        setTimeout(() => {
          setUploadProgress(null)
          setIsUploading(false)
        }, 2000)
      }

      // Analyze with AI
      const response = await fetch('/api/ai/analyze-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: fileUrl,
          filename: filename,
          fileType: uploadedFile.type,
          projectId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Analysis failed')
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (error: any) {
      console.error('Analysis failed:', error)
      alert(`Analysis failed: ${error.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const generateScenePrompts = async (scene: Scene) => {
    setGeneratingPrompts(scene.number)
    try {
      const response = await fetch('/api/ai/generate-scene-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneNumber: scene.number,
          sceneTitle: scene.title,
          sceneDescription: scene.description,
          location: scene.location,
          timeOfDay: scene.timeOfDay,
          characters: scene.characters,
          projectId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate prompts')
      }

      const data = await response.json()
      
      // Update the scene with prompts
      if (analysis?.scenes) {
        const updatedScenes = analysis.scenes.map(s => 
          s.number === scene.number 
            ? { ...s, imagePrompt: data.imagePrompt, videoPrompt: data.videoPrompt }
            : s
        )
        setAnalysis({ ...analysis, scenes: updatedScenes })
      }

      setExpandedScene(scene.number)
    } catch (error) {
      console.error('Failed to generate prompts:', error)
      alert('Failed to generate prompts. Please try again.')
    } finally {
      setGeneratingPrompts(null)
    }
  }

  const saveAnalysis = async () => {
    if (!analysis || !uploadedFile) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/storyboard-analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          filename: uploadedFile.name,
          fileUrl: uploadedFileUrl,
          overallDescription: analysis.sceneDescription,
          scenes: analysis.scenes,
          metadata: analysis.prompts.metadata
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save analysis')
      }

      const data = await response.json()
      setSavedAnalysisId(data.id)
      alert('✅ Storyboard analysis saved successfully!')
    } catch (error) {
      console.error('Failed to save analysis:', error)
      alert('Failed to save analysis. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard borderHue="orange" className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Storyboard Analysis</h2>
        <p className="text-white/60 mb-6">
          Upload a storyboard image to generate scene descriptions and AI prompts
        </p>

        <input
          type="file"
          accept="image/*,.pdf,.docx"
          onChange={handleImageUpload}
          className="hidden"
          id="storyboard-upload"
        />

        {!uploadedFile ? (
          <label
            htmlFor="storyboard-upload"
            className="block cursor-pointer"
          >
            <div className="border-2 border-dashed border-accent/50 rounded-lg p-12 text-center hover:border-accent transition-colors">
              <Upload className="w-16 h-16 text-accent mx-auto mb-4" />
              <p className="text-white font-medium mb-2">Click to upload storyboard</p>
              <p className="text-sm text-white/60">Supports JPG, PNG, PDF, DOCX</p>
            </div>
          </label>
        ) : (
          <div className="space-y-4">
            {uploadedFile && (uploadedImage ? (
              <img src={uploadedImage} alt="Storyboard" className="rounded-lg max-h-64" />
            ) : (
              <div className="border border-accent/30 rounded-lg p-8 text-center bg-white/5">
                <p className="text-white font-medium mb-2">{uploadedFile.name}</p>
                <p className="text-sm text-white/60">
                  {uploadedFile.size ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
                  {uploadedFile.type?.includes('pdf') && ' • PDF Document'}
                  {uploadedFile.name?.endsWith('.docx') && ' • Word Document'}
                </p>
              </div>
            ))}

            {/* Upload Progress */}
            <AnimatePresence>
              {uploadProgress && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
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
                        {uploadProgress.status === 'uploading' && `Uploading... ${uploadProgress.progress}%`}
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
            <div className="flex gap-4">
              <Button 
                onClick={analyzeStoryboard} 
                isLoading={isAnalyzing || isUploading}
                disabled={isUploading}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Analyze with AI'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setUploadedFile(null)
                  setUploadedImage(null)
                  setAnalysis(null)
                  setUploadProgress(null)
                }}
                disabled={isUploading || isAnalyzing}
              >
                Upload New
              </Button>
            </div>
          </div>
        )}
      </GlassCard>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Overall Description */}
          <GlassCard borderHue="orange" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Overall Story Summary</h3>
              <Button
                variant="accent"
                size="sm"
                onClick={saveAnalysis}
                isLoading={isSaving}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {savedAnalysisId ? 'Update Saved' : 'Save Analysis'}
              </Button>
            </div>
            <p className="text-white/80 whitespace-pre-line">{analysis.sceneDescription}</p>
            {savedAnalysisId && (
              <p className="text-xs text-green-400 mt-3">
                ✓ Saved - You can return anytime to view this analysis
              </p>
            )}
          </GlassCard>

          {/* Individual Scenes */}
          {analysis.scenes && analysis.scenes.length > 0 && (
            <GlassCard borderHue="orange" className="p-6">
              <h3 className="font-semibold text-lg mb-4">
                Scenes Breakdown ({analysis.scenes.length} scenes)
              </h3>
              <div className="space-y-4">
                {analysis.scenes.map((scene, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-accent/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-accent/20 text-accent rounded-full flex items-center justify-center font-bold text-sm">
                        {scene.number}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{scene.title}</h4>
                        <p className="text-sm text-white/70 mb-2">{scene.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs mb-3">
                          {scene.location && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                              📍 {scene.location}
                            </span>
                          )}
                          {scene.timeOfDay && (
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded">
                              🕐 {scene.timeOfDay}
                            </span>
                          )}
                          {scene.characters && scene.characters.length > 0 && (
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                              👥 {scene.characters.join(', ')}
                            </span>
                          )}
                        </div>

                        {/* Generate Prompts Button */}
                        {!scene.imagePrompt && !scene.videoPrompt && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => generateScenePrompts(scene)}
                            isLoading={generatingPrompts === scene.number}
                          >
                            <Sparkles className="w-3 h-3 mr-2" />
                            Generate AI Prompts
                          </Button>
                        )}

                        {/* Show Prompts if Generated */}
                        {(scene.imagePrompt || scene.videoPrompt) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 space-y-2"
                          >
                            {scene.imagePrompt && (
                              <div className="p-3 bg-white/5 rounded border border-accent/20">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-semibold text-accent">Image Prompt</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(scene.imagePrompt!, index * 2)}
                                  >
                                    {copiedIndex === index * 2 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  </Button>
                                </div>
                                <p className="text-xs text-white/70">{scene.imagePrompt}</p>
                              </div>
                            )}
                            {scene.videoPrompt && (
                              <div className="p-3 bg-white/5 rounded border border-accent/20">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-semibold text-accent">Video Prompt</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(scene.videoPrompt!, index * 2 + 1)}
                                  >
                                    {copiedIndex === index * 2 + 1 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  </Button>
                                </div>
                                <p className="text-xs text-white/70">{scene.videoPrompt}</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Prompts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Generation Prompt */}
            <GlassCard borderHue="orange" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Image Prompt (DALL-E/Stable Diffusion)</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(analysis.prompts.imagePrompt, 0)}
                >
                  {copiedIndex === 0 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-sm text-white/70 whitespace-pre-wrap bg-white/5 p-3 rounded">
                {analysis.prompts.imagePrompt}
              </p>
            </GlassCard>

            {/* Video Generation Prompt */}
            <GlassCard borderHue="orange" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Video Prompt (RunwayML/Pika)</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(analysis.prompts.videoPrompt, 1)}
                >
                  {copiedIndex === 1 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-sm text-white/70 whitespace-pre-wrap bg-white/5 p-3 rounded">
                {analysis.prompts.videoPrompt}
              </p>
            </GlassCard>
          </div>

          {/* Metadata */}
          <GlassCard borderHue="orange" className="p-4">
            <h4 className="font-semibold mb-3">Analysis Metadata</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.prompts.metadata.tones?.map((tone: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                  {tone}
                </span>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}

