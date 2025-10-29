import { supabase } from './supabaseClient'
import { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  name?: string
  avatar_url?: string
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  return user as AuthUser
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) throw error
  return data
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) throw error
  return data
}

/**
 * Sign out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get user profile from public.users table
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

/**
 * Check if user has access to a team
 */
export async function hasTeamAccess(teamId: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('team_members')
    .select('id')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  return !error && !!data
}

/**
 * Check if user has project access
 */
export async function hasProjectAccess(projectId: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('projects')
    .select('team_id')
    .eq('id', projectId)
    .single()

  if (error || !data) return false

  return hasTeamAccess(data.team_id)
}

