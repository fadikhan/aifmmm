'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Sparkles } from 'lucide-react'
import { GlassCard } from '../UI/GlassCard'
import { Button } from '../UI/Button'
import { Input } from '../UI/Input'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface CopilotDockProps {
  onGenerate?: (prompt: string) => Promise<string>
}

const AI_COMMAND_TEMPLATES = [
  { cmd: '/scene', label: 'Write Scene', prompt: 'Write a 2-minute opening scene set in golden hour Karachi with visual motifs and three camera angles.' },
  { cmd: '/shotlist', label: 'Generate Shotlist', prompt: 'Break this scene into 6 shots with camera direction and approximate duration.' },
  { cmd: '/storyboard', label: 'Storyboard', prompt: 'Generate 4 storyboard thumbnails for this scene in cinematic, moody orange lighting.' },
  { cmd: '/rewrite', label: 'Rewrite', prompt: 'Rewrite this dialogue to make it more subtle and ambiguous.' },
]

export function CopilotDock({ onGenerate }: CopilotDockProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      if (onGenerate) {
        const response = await onGenerate(input)
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        // Mock response
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'This is a mock response. Configure GOOGLE_AI_API_KEY to use real AI generation.',
          }])
          setIsLoading(false)
        }, 1000)
      }
    } catch (error) {
      console.error('AI generation error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Error generating response. Please try again.',
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateClick = (template: typeof AI_COMMAND_TEMPLATES[0]) => {
    setInput(template.prompt)
    handleSend()
  }

  return (
    <>
      {/* Floating Dock Button */}
      {!isExpanded && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-accent hover:bg-accent-2 shadow-lg shadow-accent/50 flex items-center justify-center text-white cursor-pointer"
          aria-label="Open AI Copilot"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}

      {/* Expanded Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px]"
          >
            <GlassCard elevation="high" borderHue="orange" className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-white">AI Copilot</h3>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              {/* Quick Templates */}
              <div className="p-4 border-b border-white/10">
                <div className="flex flex-wrap gap-2">
                  {AI_COMMAND_TEMPLATES.slice(0, 2).map((template) => (
                    <Button
                      key={template.cmd}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleTemplateClick(template)}
                      className="text-xs"
                    >
                      {template.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-white/50">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 text-accent/50" />
                    <p>Start a conversation with AI</p>
                    <p className="text-sm mt-2">Use quick templates or type your own prompt</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-accent/20 text-white'
                          : 'bg-white/5 text-white/90'
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 px-4 py-2 rounded-lg text-white/70">
                      <span className="inline-flex gap-1">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce [animation-delay:0.2s]">.</span>
                        <span className="animate-bounce [animation-delay:0.4s]">.</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask AI anything..."
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    variant="accent"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

