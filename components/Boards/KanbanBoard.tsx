'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, MoreVertical } from 'lucide-react'
import { GlassCard } from '../UI/GlassCard'
import { Button } from '../UI/Button'

interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority?: 'low' | 'medium' | 'high'
  assignee?: string
  due_date?: string
}

interface KanbanBoardProps {
  tasks: Task[]
  onTaskMove?: (taskId: string, newStatus: string) => void
  onTaskCreate?: () => void
  onTaskClick?: (task: Task) => void
}

const columns = [
  { id: 'todo', label: 'To Do', color: 'bg-white/10' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-blue-500/20' },
  { id: 'review', label: 'Review', color: 'bg-yellow-500/20' },
  { id: 'done', label: 'Done', color: 'bg-green-500/20' },
]

export function KanbanBoard({
  tasks,
  onTaskMove,
  onTaskCreate,
  onTaskClick,
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId)
  }

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    if (draggedTask && onTaskMove) {
      onTaskMove(draggedTask, status)
      setDraggedTask(null)
    }
  }

  const getTasksForColumn = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-blue-500'
      default: return 'border-l-white/20'
    }
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column, index) => (
        <motion.div
          key={column.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex-shrink-0 w-80"
        >
          <GlassCard borderHue="orange" className="h-full flex flex-col">
            {/* Column Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-white">{column.label}</h3>
                  <span className="text-sm text-white/50">
                    ({getTasksForColumn(column.id).length})
                  </span>
                </div>
                {column.id === 'todo' && onTaskCreate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onTaskCreate}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Tasks */}
            <div
              className="flex-1 p-2 space-y-2 min-h-[400px]"
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {getTasksForColumn(column.id).map((task) => (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  onClick={() => onTaskClick?.(task)}
                  className={`border-l-4 ${getPriorityColor(task.priority)} bg-white/5 rounded-lg p-3 cursor-pointer hover:bg-white/10 transition-colors`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white text-sm">
                      {task.title}
                    </h4>
                    <button className="hover:bg-white/10 p-1 rounded">
                      <MoreVertical className="w-4 h-4 text-white/50" />
                    </button>
                  </div>
                  {task.description && (
                    <p className="text-xs text-white/60 mb-2">
                      {task.description.substring(0, 100)}
                      {task.description.length > 100 ? '...' : ''}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>{task.assignee || 'Unassigned'}</span>
                    {task.due_date && (
                      <span>{new Date(task.due_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </motion.div>
              ))}
              {getTasksForColumn(column.id).length === 0 && (
                <div className="text-center py-8 text-white/30">
                  No tasks
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  )
}

