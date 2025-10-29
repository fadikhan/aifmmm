'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/Tabs'
import { StoryboardAnalyzer } from '@/components/StoryboardAnalyzer/StoryboardAnalyzer'
import { VideoPlayer } from '@/components/VideoPlayer/VideoPlayer'
import { GlassCard } from '@/components/UI/GlassCard'
import { Button } from '@/components/UI/Button'

export default function StudioPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  // Mock video URL - replace with actual video from database
  const mockVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

  return (
    <div className="min-h-screen bg-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.push(`/projects/${projectId}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project
          </Button>
          <h1 className="text-3xl font-bold text-white">Studio</h1>
        </div>

        <div className="space-y-6">
        <Tabs defaultValue="storyboard">
          <TabsList className="bg-white/5 p-1 rounded-lg">
            <TabsTrigger value="storyboard">Storyboard Analysis</TabsTrigger>
            <TabsTrigger value="video">Video Review</TabsTrigger>
          </TabsList>

          <TabsContent value="storyboard">
            <StoryboardAnalyzer projectId={projectId} />
          </TabsContent>

          <TabsContent value="video">
            <VideoPlayer videoUrl={mockVideoUrl} projectId={projectId} />
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  )
}

