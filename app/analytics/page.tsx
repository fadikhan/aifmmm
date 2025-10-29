'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Film, Clock, DollarSign, TrendingUp, CheckCircle, Users, ArrowLeft } from 'lucide-react'
import { GlassCard } from '@/components/UI/GlassCard'
import { Button } from '@/components/UI/Button'

export default function AnalyticsPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalScenes: 0,
    totalTasks: 0,
    totalAssets: 0,
    aiRequestsToday: 0,
    estimatedCost: 0,
  })

  useEffect(() => {
    // TODO: Fetch analytics from API
    // Mock data for now
    setStats({
      totalProjects: 3,
      activeProjects: 2,
      completedProjects: 1,
      totalScenes: 15,
      totalTasks: 42,
      totalAssets: 128,
      aiRequestsToday: 23,
      estimatedCost: 0.45,
    })
  }, [])

  const metrics = [
    {
      icon: <Film className="w-6 h-6" />,
      label: 'Total Projects',
      value: stats.totalProjects,
      change: '+2',
      color: 'text-blue-400',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Active Projects',
      value: stats.activeProjects,
      change: '+1',
      color: 'text-yellow-400',
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      label: 'Completed',
      value: stats.completedProjects,
      change: '+1',
      color: 'text-green-400',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'AI Requests Today',
      value: stats.aiRequestsToday,
      change: '+5',
      color: 'text-purple-400',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: 'Est. AI Cost',
      value: `$${stats.estimatedCost.toFixed(2)}`,
      change: '',
      color: 'text-green-400',
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Team Members',
      value: '8',
      change: '+2',
      color: 'text-blue-400',
    },
  ]

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
          </div>
          <p className="text-white/60 text-sm">
            Track your production metrics and AI usage
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard borderHue="orange" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-white/5 ${metric.color}`}>
                    {metric.icon}
                  </div>
                  {metric.change && (
                    <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded">
                      {metric.change}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold mb-1">{metric.value}</p>
                <p className="text-sm text-white/60">{metric.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Charts Section (Placeholder) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard borderHue="orange" className="p-6">
            <h3 className="text-lg font-semibold mb-4">Project Progress</h3>
            <div className="h-64 flex items-center justify-center text-white/40">
              Chart placeholder - integrate Chart.js or Recharts
            </div>
          </GlassCard>

          <GlassCard borderHue="orange" className="p-6">
            <h3 className="text-lg font-semibold mb-4">AI Usage</h3>
            <div className="h-64 flex items-center justify-center text-white/40">
              Chart placeholder - AI requests over time
            </div>
          </GlassCard>

          <GlassCard borderHue="orange" className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cost Tracking</h3>
            <div className="h-64 flex items-center justify-center text-white/40">
              Chart placeholder - AI cost estimates
            </div>
          </GlassCard>

          <GlassCard borderHue="orange" className="p-6">
            <h3 className="text-lg font-semibold mb-4">Team Activity</h3>
            <div className="h-64 flex items-center justify-center text-white/40">
              Chart placeholder - Team productivity metrics
            </div>
          </GlassCard>
        </div>

        {/* Info Card */}
        <GlassCard borderHue="orange" className="mt-6 p-6">
          <h3 className="font-semibold mb-2">Analytics Features</h3>
          <p className="text-sm text-white/70 mb-4">
            Track your filmmaking production with detailed metrics:
          </p>
          <ul className="space-y-2 text-sm text-white/60">
            <li>• Project completion rates and timelines</li>
            <li>• AI usage and cost tracking</li>
            <li>• Team productivity and activity</li>
            <li>• Asset management insights</li>
            <li>• Export reports for stakeholders</li>
          </ul>
        </GlassCard>
      </main>
    </div>
  )
}

