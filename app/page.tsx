'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Film, Sparkles, Users, Upload } from 'lucide-react'
import { GlassCard } from '@/components/UI/GlassCard'
import { Button } from '@/components/UI/Button'

export default function Home() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Writing',
      description: 'Generate scenes, scripts, and shotlists with Gemini AI',
    },
    {
      icon: <Film className="w-6 h-6" />,
      title: 'Storyboard Generator',
      description: 'Visualize your scenes with AI-generated storyboards',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Team Collaboration',
      description: 'Invite team members and assign roles with permissions',
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: 'Asset Library',
      description: 'Organize and tag your production assets',
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section with Robot Image Background */}
      <div className="relative min-h-screen h-screen flex flex-col items-center justify-between overflow-hidden">
        {/* Background Image - Full brightness, no overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/hero-robots.jpg')",
          }}
        ></div>

        {/* Top Content - Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center pt-8 sm:pt-12 px-4"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
              AIFS
            </span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-white font-bold mt-2 sm:mt-4 tracking-wide drop-shadow-lg">
            AI FILM STUDIO
          </p>
        </motion.div>

        {/* Bottom Content - Buttons and Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative z-10 pb-12 sm:pb-20 flex flex-col items-center gap-6 sm:gap-8 px-4 w-full"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-md sm:max-w-none">
            <Button
              size="lg"
              variant="accent"
              onClick={() => router.push('/dashboard')}
              className="shadow-2xl shadow-purple-500/50 w-full sm:w-auto"
            >
              Get Started
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="w-6 h-10 border-2 border-purple-300/50 rounded-full flex justify-center p-2 backdrop-blur-sm">
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-purple-400 rounded-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Everything you need to make films
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard borderHue="orange" className="p-6 h-full">
                <div className="text-purple-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-purple-100/60">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-4 relative z-10">
        <GlassCard borderHue="orange" elevation="high" className="max-w-4xl mx-auto p-12 text-center">
          <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Ready to create?</h2>
          <p className="text-xl text-purple-100/70 mb-8">
            Start your AI-powered filmmaking journey today
          </p>
          <Button
            size="lg"
            variant="accent"
            onClick={() => router.push('/dashboard')}
          >
            Get Started
          </Button>
        </GlassCard>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-400/10 py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto text-center text-purple-200/50">
          <p>© 2024 AURA Studio. Built with Next.js, Supabase, and Gemini AI.</p>
        </div>
      </footer>
    </div>
  )
}

