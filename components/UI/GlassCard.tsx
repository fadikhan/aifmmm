'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  elevation?: 'none' | 'low' | 'medium' | 'high'
  borderHue?: 'orange' | 'blue' | 'green' | 'none'
  onClick?: () => void
  onDragOver?: (e: React.DragEvent) => void
  onDragLeave?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent) => void
}

export function GlassCard({ 
  children, 
  className, 
  elevation = 'medium', 
  borderHue = 'none',
  onClick,
  onDragOver,
  onDragLeave,
  onDrop
}: GlassCardProps) {
  const elevationClasses = {
    none: '',
    low: 'shadow-lg',
    medium: 'shadow-glass',
    high: 'shadow-glass shadow-2xl',
  }

  const borderClasses = {
    none: 'border-white/10',
    orange: 'border-purple-400/30',
    blue: 'border-blue-400/30',
    green: 'border-green-400/30',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      className={cn(
        'rounded-xl border backdrop-blur-md',
        'bg-panel',
        elevationClasses[elevation],
        borderClasses[borderHue],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {children}
    </motion.div>
  )
}

