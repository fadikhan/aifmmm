'use client'

import { useState } from 'react'
import { GripVertical, Trash2, Edit2, Plus } from 'lucide-react'
import { GlassCard } from '../UI/GlassCard'
import { Button } from '../UI/Button'

interface Shot {
  id: string
  sceneNumber: number
  shotNumber: number
  description: string
  shotType: string
  movement: string
  duration: string
}

interface ShotlistManagerProps {
  projectId: string
  scenes: any[]
  onClose: () => void
  onSave: (updatedScenes: any[]) => void
}

export function ShotlistManager({ projectId, scenes, onClose, onSave }: ShotlistManagerProps) {
  const [shots, setShots] = useState<Shot[]>(() => {
    // Generate initial shots from scenes
    const initialShots: Shot[] = []
    scenes.forEach((scene, sceneIndex) => {
      // Create 3-5 shots per scene
      const numShots = Math.floor(Math.random() * 3) + 3
      for (let i = 0; i < numShots; i++) {
        initialShots.push({
          id: `shot-${sceneIndex}-${i}`,
          sceneNumber: sceneIndex + 1,
          shotNumber: i + 1,
          description: `Shot ${i + 1} for ${scene.title || `Scene ${sceneIndex + 1}`}`,
          shotType: ['Wide', 'Medium', 'Close-up', 'ECU'][Math.floor(Math.random() * 4)],
          movement: ['Static', 'Pan', 'Tilt', 'Dolly', 'Handheld'][Math.floor(Math.random() * 5)],
          duration: `${Math.floor(Math.random() * 10) + 3}s`,
        })
      }
    })
    return initialShots
  })

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newShots = [...shots]
    const draggedShot = newShots[draggedIndex]
    newShots.splice(draggedIndex, 1)
    newShots.splice(index, 0, draggedShot)

    setShots(newShots)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const deleteShot = (id: string) => {
    setShots(shots.filter(shot => shot.id !== id))
  }

  const addShot = () => {
    const newShot: Shot = {
      id: `shot-${Date.now()}`,
      sceneNumber: 1,
      shotNumber: shots.length + 1,
      description: 'New shot',
      shotType: 'Medium',
      movement: 'Static',
      duration: '5s',
    }
    setShots([...shots, newShot])
  }

  const handleSave = async () => {
    try {
      // Group shots by scene and update scene order
      const sceneMap = new Map<number, Shot[]>()
      
      shots.forEach(shot => {
        if (!sceneMap.has(shot.sceneNumber)) {
          sceneMap.set(shot.sceneNumber, [])
        }
        sceneMap.get(shot.sceneNumber)!.push(shot)
      })

      // Create updated scenes array with new order
      const updatedScenes = Array.from(sceneMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([sceneNum, sceneShots], index) => {
          const originalScene = scenes[sceneNum - 1]
          return {
            ...originalScene,
            order_index: index,
            shots: sceneShots,
          }
        })

      // Call parent's save function
      onSave(updatedScenes)
      onClose()
    } catch (error) {
      console.error('Error saving shotlist:', error)
      alert('Failed to save shotlist. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Shotlist Manager</h2>
              <p className="text-white/60 text-sm">Drag to reorder shots</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={addShot}>
                <Plus className="w-4 h-4 mr-2" />
                Add Shot
              </Button>
              <Button variant="accent" onClick={handleSave}>
                Save & Close
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {shots.map((shot, index) => (
              <div
                key={shot.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white/5 rounded-lg p-4 border border-white/10 transition-all cursor-move ${
                  draggedIndex === index ? 'opacity-50 scale-95' : 'hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5 text-white/40" />
                  </div>

                  <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                    <div className="col-span-2">
                      <div className="text-xs text-white/40 mb-1">
                        Scene {shot.sceneNumber} • Shot {shot.shotNumber}
                      </div>
                      <div className="text-sm font-medium">{shot.description}</div>
                    </div>

                    <div>
                      <div className="text-xs text-white/40 mb-1">Type</div>
                      <div className="text-sm">{shot.shotType}</div>
                    </div>

                    <div>
                      <div className="text-xs text-white/40 mb-1">Movement</div>
                      <div className="text-sm">{shot.movement}</div>
                    </div>

                    <div>
                      <div className="text-xs text-white/40 mb-1">Duration</div>
                      <div className="text-sm">{shot.duration}</div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Edit functionality
                          alert('Edit shot: ' + shot.description)
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteShot(shot.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {shots.length === 0 && (
              <div className="text-center py-12 text-white/40">
                <p>No shots yet. Click "Add Shot" to create one.</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-between text-sm">
            <div className="text-white/60">
              Total shots: <span className="text-white font-medium">{shots.length}</span>
            </div>
            <div className="text-white/60">
              Estimated duration:{' '}
              <span className="text-white font-medium">
                {shots.reduce((acc, shot) => acc + parseInt(shot.duration), 0)}s
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
