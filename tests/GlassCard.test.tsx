import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { GlassCard } from '../components/UI/GlassCard'

describe('GlassCard', () => {
  it('renders children correctly', () => {
    render(
      <GlassCard>
        <div>Test Content</div>
      </GlassCard>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <GlassCard className="custom-class">
        <div>Test</div>
      </GlassCard>
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('applies different elevation variants', () => {
    const { rerender } = render(
      <GlassCard elevation="low">
        <div>Test</div>
      </GlassCard>
    )

    expect(screen.getByText('Test').closest('div')).toHaveClass('shadow-lg')

    rerender(
      <GlassCard elevation="high">
        <div>Test</div>
      </GlassCard>
    )

    expect(screen.getByText('Test').closest('div')).toHaveClass('shadow-glass', 'shadow-2xl')
  })
})

