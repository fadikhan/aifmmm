'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, Film, Upload, Settings } from 'lucide-react'
import { GlassCard } from '@/components/UI/GlassCard'
import { Button } from '@/components/UI/Button'
import { CopilotDock } from '@/components/AI/CopilotDock'
import { CommandPalette } from '@/components/AI/CommandPalette'
import { ShotlistManager } from '@/components/Scenes/ShotlistManager'

interface Project {
  id: string
  title: string
  description: string
  status: string
  settings: any
}

interface Scene {
  id: string
  title: string
  content: string
  order_index: number
}

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [scenes, setScenes] = useState<Scene[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showShotlist, setShowShotlist] = useState(false)
  const [isGeneratingScenes, setIsGeneratingScenes] = useState(false)

  useEffect(() => {
    fetchProject()
  }, [params.id])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}`)
      const data = await res.json()
      setProject(data)
      setScenes(data.scenes || [])
    } catch (error) {
      console.error('Failed to fetch project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAICommand = async (prompt: string) => {
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'generate',
          prompt,
          projectId: params.id,
        }),
      })
      
      if (!res.ok) {
        throw new Error('AI generation failed')
      }
      
      const data = await res.json()
      return data.content
    } catch (error) {
      console.error('AI generation failed:', error)
      return 'Error generating response. Please try again.'
    }
  }

  const handleSaveScenes = async (updatedScenes: Scene[]) => {
    try {
      // Update scenes with new order
      const scenesWithOrder = updatedScenes.map((scene, index) => ({
        ...scene,
        order_index: index,
      }))

      // Save to database
      const response = await fetch('/api/scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: params.id,
          scenes: scenesWithOrder,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setScenes(data.scenes)
        alert('✅ Scenes saved successfully!')
      } else {
        throw new Error('Failed to save scenes')
      }
    } catch (error) {
      console.error('Error saving scenes:', error)
      alert('❌ Failed to save scenes. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-white/70">Loading project...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-white/70">Project not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{project.title}</h1>
            <p className="text-white/60 text-sm">{project.description}</p>
          </div>
          <Button variant="secondary">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Actions */}
        <GlassCard borderHue="orange" className="p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="secondary"
            className="flex-col h-auto py-4"
            onClick={async () => {
              setIsGeneratingScenes(true)
              try {
                // Fetch storyboard analysis for this project
                const response = await fetch(`/api/storyboard-analyses?project_id=${params.id}`)
                
                if (response.ok) {
                  const analysis = await response.json()
                  
                  if (analysis && analysis.scenes) {
                    // Extract scenes from the analysis
                    const generatedScenes: Scene[] = []
                    const analysisScenes = analysis.scenes
                    
                    if (Array.isArray(analysisScenes)) {
                      analysisScenes.forEach((scene: any, index: number) => {
                        generatedScenes.push({
                          id: `scene-${Date.now()}-${index}`,
                          title: scene.title || scene.description || `Scene ${index + 1}`,
                          content: scene.description || scene.dialogue || scene.action || scene.details || 'No description available',
                          order_index: scenes.length + index,
                        })
                      })
                    }
                    
                    if (generatedScenes.length > 0) {
                      setScenes([...scenes, ...generatedScenes])
                      alert(`✅ Generated ${generatedScenes.length} scenes from storyboard!`)
                    } else {
                      alert('⚠️ No scenes found in storyboard analysis. The analysis might not contain scene data.')
                    }
                  } else {
                    alert('⚠️ No storyboard analysis found. Please analyze a storyboard first in the Studio tab.')
                  }
                } else if (response.status === 400) {
                  alert('⚠️ Invalid project ID')
                } else {
                  throw new Error('Failed to fetch analysis')
                }
              } catch (error) {
                console.error('Error generating scenes:', error)
                alert('❌ Failed to generate scenes. Please try again.')
              } finally {
                setIsGeneratingScenes(false)
              }
            }}
            disabled={isGeneratingScenes}
          >
            <Sparkles className="w-6 h-6 mb-2" />
            <span className="text-xs">{isGeneratingScenes ? 'Generating...' : 'Generate Scenes'}</span>
          </Button>
            <Button
              variant="secondary"
              className="flex-col h-auto py-4"
              onClick={() => {
                if (scenes.length === 0) {
                  alert('Please generate or add scenes first!')
                  return
                }
                setShowShotlist(true)
              }}
            >
              <Film className="w-6 h-6 mb-2" />
              <span className="text-xs">Create Shotlist</span>
            </Button>
            <Button
              variant="secondary"
              className="flex-col h-auto py-4"
              onClick={() => router.push(`/projects/${params.id}/studio`)}
            >
              <Film className="w-6 h-6 mb-2" />
              <span className="text-xs">Analyze Storyboard</span>
            </Button>
            <Button
              variant="secondary"
              className="flex-col h-auto py-4"
              onClick={() => router.push(`/projects/${params.id}/review`)}
            >
              <Upload className="w-6 h-6 mb-2" />
              <span className="text-xs">Video Review</span>
            </Button>
          </div>
        </GlassCard>

        {/* Scenes List */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Scenes</h2>

          {scenes.length === 0 ? (
            <GlassCard borderHue="orange" className="p-12 text-center">
              <Film className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No scenes yet</h3>
              <p className="text-white/60 mb-6">
                Start by generating your first scene with AI
              </p>
              <Button
                variant="accent"
                onClick={async () => {
                  try {
                    const scene = await handleAICommand('Write a 90s neo-noir opening scene')
                    console.log('Scene:', scene)
                    alert('Scene generated! Feature coming soon - this will add the scene to your project.')
                  } catch (error) {
                    alert('AI generation is not fully configured yet. Set GOOGLE_AI_API_KEY for full functionality.')
                  }
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {scenes.map((scene, index) => (
                <motion.div
                  key={scene.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard borderHue="orange" className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{scene.title}</h3>
                    <p className="text-white/70 whitespace-pre-line">
                      {scene.content.substring(0, 200)}
                      {scene.content.length > 200 ? '...' : ''}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <CommandPalette onCommand={handleAICommand} />
      <CopilotDock onGenerate={handleAICommand} />
      
      {showShotlist && (
        <ShotlistManager
          projectId={params.id as string}
          scenes={scenes}
          onClose={() => setShowShotlist(false)}
          onSave={handleSaveScenes}
        />
      )}
    </div>
  )
}

