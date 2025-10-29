'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session after OAuth callback
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
        }

        // Always redirect to dashboard (works with or without session)
        router.push('/dashboard')
      } catch (error) {
        console.error('Error in auth callback:', error)
        router.push('/dashboard')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-white/70">Processing authentication...</div>
    </div>
  )
}

