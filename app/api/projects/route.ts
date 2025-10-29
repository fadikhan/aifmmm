import { NextRequest, NextResponse } from 'next/server'
// Import directly to avoid issues
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    // TODO: Add authentication
    // TODO: Filter by user's teams

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Always return an array, even if empty
    return NextResponse.json(Array.isArray(data) ? data : [])
  } catch (error: any) {
    console.error('Projects fetch error:', error)
    // Return empty array on error to prevent crashes
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { team_id, title, description, settings } = body

    console.log('📝 Creating project:', { team_id, title, description })

    if (!title) {
      console.error('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // If no team_id provided, use default or create one
    let finalTeamId = team_id
    if (!finalTeamId) {
      // Try to get or create default team
      const { data: teams } = await supabase
        .from('teams')
        .select('id')
        .limit(1)
      
      if (teams && teams.length > 0) {
        finalTeamId = teams[0].id
      } else {
        // Create default team
        const { data: newTeam, error: teamError } = await supabase
          .from('teams')
          .insert({ name: 'My Studio', status: 'active' })
          .select()
          .single()
        
        if (teamError) {
          console.error('Failed to create default team:', teamError)
          return NextResponse.json(
            { error: 'No team found. Please create a team first or run the seed data. See README.md' },
            { status: 400 }
          )
        }
        
        finalTeamId = newTeam.id
      }
    }

    // TODO: Add authentication
    // TODO: Verify user has access to team
    // TODO: Set created_by

    console.log('🔗 Connecting to Supabase...')
    
    // Verify team exists
    const { data: teamCheck, error: teamCheckError } = await supabase
      .from('teams')
      .select('id')
      .eq('id', finalTeamId)
      .single()
    
    if (teamCheckError || !teamCheck) {
      console.error('❌ Team not found:', finalTeamId)
      return NextResponse.json(
        { error: 'Team not found. Please run CREATE_DEFAULT_TEAM.sql in Supabase to create a default team.' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        team_id: finalTeamId,
        title,
        description,
        settings: settings || {},
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase error:', error)
      throw error
    }

    console.log('✅ Project created successfully:', data.id)
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('❌ Project creation error:', error)
    
    // Provide more detailed error message
    let errorMessage = 'Failed to create project'
    if (error?.message?.includes('relation') && error?.message?.includes('does not exist')) {
      errorMessage = 'Database not set up. Please run the migration SQL in Supabase. See SUPABASE_SETUP.md'
    } else if (error?.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

