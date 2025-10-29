'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Film, Sparkles, Users, Calendar, Tag } from 'lucide-react'
import { GlassCard } from '@/components/UI/GlassCard'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { Label } from '@/components/UI/Label'

export default function NewProjectPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: Get team_id from user's context or default team
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: '22222222-2222-2222-2222-222222222222', // Default from seed
          title,
          description,
          settings: {
            genre,
          },
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        router.push(`/projects/${data.id}`)
      } else {
        setError(data.error || 'Failed to create project')
        console.error('Failed to create project:', data)
      }
    } catch (error) {
      setError('Network error. Check your connection and try again.')
      console.error('Error creating project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <h1 className="text-2xl font-bold text-white">Create New Project</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard borderHue="orange" className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm font-medium">⚠️ Error</p>
                  <p className="text-red-300 text-sm mt-1">{error}</p>
                  <p className="text-red-300/70 text-xs mt-2">
                    Make sure you've set up Supabase and run the database migrations. See README.md for setup instructions.
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Golden Hour — Short Film"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="A brief description of your project..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-panel border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    type="text"
                    placeholder="neo-noir, drama, comedy..."
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                  />
                </div>
              </div>

              {/* Quick Start Options */}
              <div className="border-t border-white/10 pt-6">
                <Label>Quick Start (Optional)</Label>
                <p className="text-sm text-white/60 mb-4">
                  Start with AI-generated content
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-col h-auto py-4"
                    onClick={async () => {
                      // Generate opening scene with AI
                      try {
                        const response = await fetch('/api/ai/generate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            type: 'generate',
                            prompt: `Create an opening scene for ${title || 'this project'}, genre: ${genre}`,
                          }),
                        })
                        const data = await response.json()
                        console.log('AI generated:', data)
                      } catch (error) {
                        console.error('AI generation failed:', error)
                      }
                    }}
                  >
                    <Sparkles className="w-6 h-6 mb-2" />
                    <span className="text-xs">AI Scene</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-col h-auto py-4"
                  >
                    <Film className="w-6 h-6 mb-2" />
                    <span className="text-xs">Storyboard</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-col h-auto py-4"
                  >
                    <Users className="w-6 h-6 mb-2" />
                    <span className="text-xs">Team Setup</span>
                  </Button>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="accent"
                  isLoading={isLoading}
                  disabled={!title.trim()}
                  className="flex-1"
                >
                  Create Project
                </Button>
              </div>
            </form>
          </GlassCard>

          {/* Info Card */}
          <GlassCard borderHue="orange" className="mt-6 p-6">
            <div className="flex items-start gap-4">
              <Film className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Start your filmmaking journey</h3>
                <p className="text-sm text-white/70">
                  After creating your project, you'll be able to:
                </p>
                <ul className="mt-2 text-sm text-white/60 space-y-1">
                  <li>• Generate scenes with AI</li>
                  <li>• Create storyboards and shotlists</li>
                  <li>• Manage assets and team</li>
                  <li>• Track production in Kanban boards</li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </main>
    </div>
  )
}

