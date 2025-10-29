'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Film, Clock, CheckCircle } from 'lucide-react'
import { GlassCard } from '@/components/UI/GlassCard'
import { Button } from '@/components/UI/Button'
import { CommandPalette } from '@/components/AI/CommandPalette'

interface Project {
  id: string
  title: string
  description: string
  status: string
  created_at: string
}

export default function Dashboard() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      setProjects([]) // Ensure it's always an array
    } finally {
      setIsLoading(false)
    }
  }

  const handleCommand = (command: string) => {
    console.log('Command:', command)
    // Handle commands
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-white/70">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">AURA Dashboard</h1>
          <Button
            variant="accent"
            onClick={() => router.push('/projects/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard borderHue="orange">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Total Projects</p>
                  <p className="text-3xl font-bold">{Array.isArray(projects) ? projects.length : 0}</p>
                </div>
                <Film className="w-12 h-12 text-accent" />
              </div>
            </div>
          </GlassCard>

          <GlassCard borderHue="orange">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Active Projects</p>
                  <p className="text-3xl font-bold">
                    {Array.isArray(projects) ? projects.filter(p => p.status === 'active').length : 0}
                  </p>
                </div>
                <Clock className="w-12 h-12 text-accent" />
              </div>
            </div>
          </GlassCard>

          <GlassCard borderHue="orange">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Completed</p>
                  <p className="text-3xl font-bold">
                    {Array.isArray(projects) ? projects.filter(p => p.status === 'complete').length : 0}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-accent" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Projects List */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Your Projects</h2>

          {!Array.isArray(projects) || projects.length === 0 ? (
            <GlassCard borderHue="orange" className="p-12 text-center">
              <Film className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-white/60 mb-6">
                Create your first AI-powered filmmaking project
              </p>
              <Button
                variant="accent"
                onClick={() => router.push('/projects/new')}
              >
                Create Project
              </Button>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard
                    borderHue="orange"
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="p-6 h-full"
                  >
                    <div className="mb-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        project.status === 'active' 
                          ? 'bg-accent/20 text-accent' 
                          : 'bg-white/10 text-white/70'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-white/60 text-sm mb-4">
                      {project.description || 'No description'}
                    </p>
                    <p className="text-xs text-white/40">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <CommandPalette onCommand={handleCommand} />
    </div>
  )
}

