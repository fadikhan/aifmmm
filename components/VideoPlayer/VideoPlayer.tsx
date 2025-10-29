'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, MessageCircle, Clock } from 'lucide-react'
import { GlassCard } from '../UI/GlassCard'
import { Button } from '../UI/Button'
import { Input } from '../UI/Input'

interface TimestampComment {
  id: string
  timestamp: number
  text: string
  author: string
  authorColor: string
  createdAt: string
}

interface VideoPlayerProps {
  videoUrl: string
  projectId: string
  assetId?: string
}

// Predefined colors for users
const USER_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Orange
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
  '#F8B739', // Gold
  '#52B788', // Green
]

// Get a consistent color for a user
const getUserColor = (userName: string): string => {
  const hash = userName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return USER_COLORS[hash % USER_COLORS.length]
}

export function VideoPlayer({ videoUrl, projectId, assetId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [comments, setComments] = useState<TimestampComment[]>([])
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [currentUser, setCurrentUser] = useState(() => {
    // Get or create user identity
    const stored = localStorage.getItem('aura_user')
    if (stored) return JSON.parse(stored)
    
    const user = {
      name: `User ${Math.floor(Math.random() * 1000)}`,
      color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
    }
    localStorage.setItem('aura_user', JSON.stringify(user))
    return user
  })

  // Get user from Supabase auth
  useEffect(() => {
    const getUserFromAuth = async () => {
      const { supabase } = await import('@/lib/supabaseClient')
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous'
        const userColor = getUserColor(userName)
        const authUser = { name: userName, color: userColor }
        
        setCurrentUser(authUser)
        localStorage.setItem('aura_user', JSON.stringify(authUser))
      }
    }
    
    getUserFromAuth()
  }, [])
  const [uniqueUsers, setUniqueUsers] = useState<Array<{name: string, color: string}>>([])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const seekTo = (seconds: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = seconds
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Load comments on mount
  useEffect(() => {
    if (assetId) {
      loadComments()
    }
  }, [assetId])

  // Update unique users when comments change
  useEffect(() => {
    const users = Array.from(new Set(comments.map(c => c.author)))
      .map(name => ({
        name,
        color: comments.find(c => c.author === name)?.authorColor || getUserColor(name)
      }))
    setUniqueUsers(users)
  }, [comments])

  const loadComments = async () => {
    if (!assetId) return
    
    try {
      const response = await fetch(`/api/video-comments?asset_id=${assetId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Failed to load comments:', error)
    }
  }

  const addComment = async () => {
    if (!newComment.trim()) return

    const comment: TimestampComment = {
      id: Date.now().toString(),
      timestamp: currentTime,
      text: newComment,
      author: currentUser.name,
      authorColor: currentUser.color,
      createdAt: new Date().toISOString(),
    }

    // Optimistically add to UI
    setComments([...comments, comment])
    setNewComment('')
    setShowCommentInput(false)

    // Save to database
    if (assetId) {
      try {
        await fetch('/api/video-comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assetId,
            projectId,
            userName: currentUser.name,
            userColor: currentUser.color,
            timestampSeconds: currentTime,
            commentText: newComment,
          }),
        })
      } catch (error) {
        console.error('Failed to save comment:', error)
      }
    }
  }

  const getCommentsAtTime = (time: number) => {
    return comments.filter(c => Math.abs(c.timestamp - time) < 2)
  }

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <GlassCard borderHue="orange" className="p-4">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full rounded-lg"
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Video Controls */}
        <div className="flex items-center gap-4 mt-4">
          <Button onClick={togglePlay} variant="secondary" size="sm">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <span className="text-sm text-white/70">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <div className="flex-1 bg-white/10 rounded-full h-2 relative">
            <div
              className="bg-accent h-full rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>
      </GlassCard>

      {/* Comments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Add Comment */}
        <GlassCard borderHue="orange" className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Comments</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowCommentInput(!showCommentInput)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Add Comment at {formatTime(currentTime)}
            </Button>
          </div>

          {showCommentInput && (
            <div className="mb-4">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                onKeyDown={(e) => e.key === 'Enter' && addComment()}
              />
              <div className="flex gap-2 mt-2">
                <Button variant="accent" size="sm" onClick={addComment}>
                  Post
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowCommentInput(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-sm text-white/50">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ 
                    backgroundColor: `${comment.authorColor}20`,
                    borderLeft: `3px solid ${comment.authorColor}`
                  }}
                  onClick={() => seekTo(comment.timestamp)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3 h-3" style={{ color: comment.authorColor }} />
                    <span className="text-xs font-medium" style={{ color: comment.authorColor }}>
                      {formatTime(comment.timestamp)}
                    </span>
                    <span className="text-xs text-white/60">by {comment.author}</span>
                  </div>
                  <p className="text-sm text-white/80">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        {/* Comments Timeline */}
        <GlassCard borderHue="orange" className="p-4">
          <h3 className="font-semibold text-white mb-4">Comments Timeline</h3>
          <div className="relative bg-white/5 rounded-lg p-2 h-64">
            {comments.map((comment) => {
              const position = (comment.timestamp / duration) * 100
              return (
                <div
                  key={comment.id}
                  className="absolute top-0 bottom-0 cursor-pointer"
                  style={{ left: `${position}%` }}
                  onClick={() => seekTo(comment.timestamp)}
                >
                  <div 
                    className="w-1 h-full" 
                    style={{ backgroundColor: comment.authorColor }}
                  />
                  <div className="absolute top-0 -translate-y-full -translate-x-1/2">
                    <div 
                      className="text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                      style={{ backgroundColor: comment.authorColor }}
                    >
                      {comment.author}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>

      {/* User Legend */}
      {uniqueUsers.length > 0 && (
        <GlassCard borderHue="orange" className="p-4 mt-4">
          <h3 className="font-semibold text-white mb-3 text-sm">Team Members</h3>
          <div className="flex flex-wrap gap-3">
            {uniqueUsers.map((user, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: user.color }}
                />
                <span className="text-sm text-white/80">{user.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}

