'use client'

import { useState, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

export function Tabs({ children, defaultValue }: { children: React.ReactNode; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ value, onValueChange: setValue }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  )
}

function useTabs() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within Tabs')
  }
  return context
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex gap-2', className)} role="tablist">
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { value: selectedValue, onValueChange } = useTabs()
  const isSelected = selectedValue === value

  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
        isSelected
          ? 'bg-accent text-white'
          : 'bg-white/5 text-white/70 hover:bg-white/10',
        className
      )}
      role="tab"
      aria-selected={isSelected}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  const { value: selectedValue } = useTabs()

  if (selectedValue !== value) return null

  return (
    <div role="tabpanel">
      {children}
    </div>
  )
}

