'use client'

import { useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, Film, User, Settings } from 'lucide-react'
import { GlassCard } from '../UI/GlassCard'
import { Input } from '../UI/Input'

interface Command {
  id: string
  label: string
  icon: React.ReactNode
  action: () => void
  category: string
}

interface CommandPaletteProps {
  onCommand?: (command: string) => void
}

export function CommandPalette({ onCommand }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Toggle command palette with / or Cmd+K
  useHotkeys('/', (e) => {
    e.preventDefault()
    setIsOpen(true)
  }, [setIsOpen])

  useHotkeys('ctrl+k, cmd+k', (e) => {
    e.preventDefault()
    setIsOpen(true)
  }, [setIsOpen])

  useHotkeys('escape', () => setIsOpen(false), { enableOnFormTags: true }, [setIsOpen])

  const commands: Command[] = [
    { id: 'ai-scene', label: 'Write Scene', icon: <Sparkles />, action: () => onCommand?.('ai-scene'), category: 'AI' },
    { id: 'ai-storyboard', label: 'Generate Storyboard', icon: <Film />, action: () => onCommand?.('ai-storyboard'), category: 'AI' },
    { id: 'ai-shotlist', label: 'Create Shotlist', icon: <Film />, action: () => onCommand?.('ai-shotlist'), category: 'AI' },
    { id: 'ai-rewrite', label: 'Rewrite with AI', icon: <Sparkles />, action: () => onCommand?.('ai-rewrite'), category: 'AI' },
    { id: 'profile', label: 'Profile Settings', icon: <User />, action: () => onCommand?.('profile'), category: 'Navigation' },
    { id: 'settings', label: 'Workspace Settings', icon: <Settings />, action: () => onCommand?.('settings'), category: 'Navigation' },
  ]

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleSelect = (command: Command) => {
    command.action()
    setIsOpen(false)
    setQuery('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Command Palette */}
          <div className="fixed inset-0 flex items-start justify-center pt-[20vh] z-50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl"
            >
              <GlassCard elevation="high" borderHue="orange">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                    <Search className="w-5 h-5 text-white/70" />
                    <Input
                      autoFocus
                      placeholder="Type a command or search..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="border-none bg-transparent focus:ring-0"
                    />
                    <kbd className="px-2 py-1 text-xs bg-white/10 border border-white/20 rounded">
                      ESC
                    </kbd>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {filteredCommands.length > 0 ? (
                      <div className="space-y-1">
                        {filteredCommands.map((command, index) => (
                          <motion.button
                            key={command.id}
                            onClick={() => handleSelect(command)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`
                              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                              transition-colors
                              ${index === selectedIndex 
                                ? 'bg-accent/20 text-accent' 
                                : 'hover:bg-white/5 text-white/70'
                              }
                            `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="text-white/50">{command.icon}</span>
                            <span className="flex-1">{command.label}</span>
                            <span className="text-xs text-white/40">{command.category}</span>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-white/50">
                        No commands found
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

